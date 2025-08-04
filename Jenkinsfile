pipeline {
    agent any
    
    environment {
        // Define environment variables
        IMAGE_NAME = "static-website"
        IMAGE_TAG = "${BUILD_NUMBER}"
        STAGING_PORT = "8081"
        PRODUCTION_PORT = "8080"
        BUILD_DATE = sh(script: "date '+%Y-%m-%d %H:%M:%S'", returnStdout: true).trim()
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }
        
        stage('Validate Files') {
            steps {
                echo 'Validating project files...'
                script {
                    // Check if required files exist
                    if (!fileExists('index.html')) {
                        error 'index.html not found!'
                    }
                    if (!fileExists('styles.css')) {
                        error 'styles.css not found!'
                    }
                    if (!fileExists('script.js')) {
                        error 'script.js not found!'
                    }
                    if (!fileExists('Dockerfile')) {
                        error 'Dockerfile not found!'
                    }
                    echo 'All required files found ✓'
                }
            }
        }
        
        stage('Process Build Info') {
            steps {
                echo 'Injecting build information...'
                script {
                    // Replace build placeholders in JavaScript file
                    sh """
                        sed -i "s/\\\${BUILD_NUMBER}/${BUILD_NUMBER}/g" script.js
                        sed -i "s/\\\${BUILD_DATE}/${BUILD_DATE}/g" script.js
                    """
                }
            }
        }
        
        stage('Test HTML Validation') {
            steps {
                echo 'Running HTML validation tests...'
                script {
                    // Simple HTML validation using curl and basic checks
                    sh '''
                        # Check if HTML file has proper structure
                        if ! grep -q "<!DOCTYPE html>" index.html; then
                            echo "ERROR: HTML5 DOCTYPE missing"
                            exit 1
                        fi
                        
                        if ! grep -q "<title>" index.html; then
                            echo "ERROR: Title tag missing"
                            exit 1
                        fi
                        
                        echo "HTML validation passed ✓"
                    '''
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                script {
                    docker.build("${IMAGE_NAME}:${IMAGE_TAG}")
                    docker.build("${IMAGE_NAME}:latest")
                }
            }
        }
        
        stage('Test Docker Image') {
            steps {
                echo 'Testing Docker image...'
                script {
                    // Test if the image runs correctly
                    sh """
                        # Start container for testing
                        docker run -d --name test-container -p 9999:80 ${IMAGE_NAME}:${IMAGE_TAG}
                        
                        # Wait for container to start
                        sleep 5
                        
                        # Test if website is accessible
                        curl -f http://localhost:9999 > /dev/null
                        
                        if [ \$? -eq 0 ]; then
                            echo "Container test passed ✓"
                        else
                            echo "Container test failed ✗"
                            exit 1
                        fi
                        
                        # Cleanup test container
                        docker stop test-container
                        docker rm test-container
                    """
                }
            }
        }
        
        stage('Deploy to Staging') {
            steps {
                echo 'Deploying to staging environment...'
                script {
                    sh """
                        # Stop and remove existing staging container
                        docker stop staging-website || true
                        docker rm staging-website || true
                        
                        # Run new staging container
                        docker run -d \
                            --name staging-website \
                            --restart unless-stopped \
                            -p ${STAGING_PORT}:80 \
                            ${IMAGE_NAME}:${IMAGE_TAG}
                        
                        echo "Staging deployment completed"
                        echo "Access staging at: http://localhost:${STAGING_PORT}"
                    """
                }
            }
        }
        
        stage('Staging Tests') {
            steps {
                echo 'Running tests against staging environment...'
                script {
                    sh """
                        # Wait for staging to be ready
                        sleep 10
                        
                        # Test staging deployment
                        response=\$(curl -s -o /dev/null -w "%{http_code}" http://localhost:${STAGING_PORT})
                        
                        if [ "\$response" = "200" ]; then
                            echo "Staging test passed ✓"
                        else
                            echo "Staging test failed - HTTP \$response ✗"
                            exit 1
                        fi
                        
                        # Test if CSS and JS files are accessible
                        curl -f http://localhost:${STAGING_PORT}/styles.css > /dev/null
                        curl -f http://localhost:${STAGING_PORT}/script.js > /dev/null
                        
                        echo "All staging tests passed ✓"
                    """
                }
            }
        }
        
        stage('Deploy to Production') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                echo 'Deploying to production environment...'
                script {
                    sh """
                        # Stop and remove existing production container
                        docker stop production-website || true
                        docker rm production-website || true
                        
                        # Run new production container
                        docker run -d \
                            --name production-website \
                            --restart unless-stopped \
                            -p ${PRODUCTION_PORT}:80 \
                            ${IMAGE_NAME}:${IMAGE_TAG}
                        
                        echo "Production deployment completed"
                        echo "Access production at: http://localhost:${PRODUCTION_PORT}"
                    """
                }
            }
        }
        
        stage('Production Health Check') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                echo 'Running production health checks...'
                script {
                    sh """
                        # Wait for production to be ready
                        sleep 10
                        
                        # Health check
                        response=\$(curl -s -o /dev/null -w "%{http_code}" http://localhost:${PRODUCTION_PORT})
                        
                        if [ "\$response" = "200" ]; then
                            echo "Production health check passed ✓"
                        else
                            echo "Production health check failed - HTTP \$response ✗"
                            exit 1
                        fi
                    """
                }
            }
        }
        
        stage('Cleanup Old Images') {
            steps {
                echo 'Cleaning up old Docker images...'
                script {
                    sh """
                        # Keep only the latest 5 builds
                        docker images ${IMAGE_NAME} --format "table {{.Tag}}" | grep -v "latest" | grep -v "TAG" | sort -nr | tail -n +6 | xargs -r docker rmi ${IMAGE_NAME}: || true
                    """
                }
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline completed!'
            // Clean up workspace
            cleanWs()
        }
        
        success {
            echo '✓ Pipeline succeeded!'
            script {
                def message = """
                🎉 Deployment Successful!
                
                Project: Static Website
                Build: #${BUILD_NUMBER}
                Branch: ${env.BRANCH_NAME}
                
                Staging: http://localhost:${STAGING_PORT}
                """ + (env.BRANCH_NAME in ['main', 'master'] ? "Production: http://localhost:${PRODUCTION_PORT}" : "")
                
                echo message
            }
        }
        
        failure {
            echo '✗ Pipeline failed!'
            script {
                // Clean up any test containers that might be running
                sh """
                    docker stop test-container || true
                    docker rm test-container || true
                """
            }
        }
        
        unstable {
            echo '⚠ Pipeline completed with warnings'
        }
    }
}
