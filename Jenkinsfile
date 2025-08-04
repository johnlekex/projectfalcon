pipeline {
    agent {
        docker {
            image 'docker:24.0.5' // Docker CLI image
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    environment {
        DOCKER_IMAGE = "static-website:${BUILD_NUMBER}"
    }

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
                sh 'docker build -t $DOCKER_IMAGE .'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying application...'
                sh '''
                    # Stop and remove existing container if it exists
                    if [ "$(docker ps -aq -f name=webapp)" ]; then
                        docker stop webapp || true
                        docker rm webapp || true
                    fi

                    # Run the container
                    docker run -d --name webapp -p 8083:80 $DOCKER_IMAGE
                '''
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
