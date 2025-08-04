pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                script {
                    dockerImage = docker.build("static-website:${BUILD_NUMBER}")
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying application...'
                script {
                    // Stop and remove any existing container named 'webapp'
                    sh '''
                        if [ "$(docker ps -aq -f name=webapp)" ]; then
                            docker stop webapp || true
                            docker rm webapp || true
                        fi
                    '''

                    // Run the container
                    sh '''
                        docker run -d --name webapp -p 8083:80 static-website:${BUILD_NUMBER}
                    '''
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up workspace...'
            cleanWs()
        }
    }
}
