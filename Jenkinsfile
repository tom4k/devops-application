pipeline {
    agent any
    
    // Environment variables
    environment {
        // Change these to match your Docker Hub repository details
        DOCKER_IMAGE = 'devops-frontend'
        DOCKER_CREDS_ID = 'dockerhub-credentials' // ID of credentials in Jenkins
        DOCKER_HUB_USER = 'tomkurian' // Replace with your Docker Hub username
        TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout the SCM automatically
                checkout scm
            }
        }
        
        stage('Lint & Build Check') {
            steps {
                script {
                    echo "Skipping local npm build check as Jenkins runs in a container without npm..."
                    echo "The build check will naturally happen inside the multi-stage Dockerfile during the Docker Build stage."
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker Image: ${DOCKER_HUB_USER}/${DOCKER_IMAGE}:${TAG}..."
                    sh "docker build -t ${DOCKER_HUB_USER}/${DOCKER_IMAGE}:${TAG} -t ${DOCKER_HUB_USER}/${DOCKER_IMAGE}:latest ."
                }
            }
        }

        stage('Test Docker Image') {
            steps {
                script {
                    echo "Testing if the container runs..."
                    // Start the container, wait a moment, and ensure it is up
                    sh """
                        docker run -d --name temp-test-${TAG} -p 8081:80 ${DOCKER_HUB_USER}/${DOCKER_IMAGE}:${TAG}
                        sleep 5
                        docker ps | grep temp-test-${TAG}
                        docker rm -f temp-test-${TAG}
                    """
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                script {
                    echo "Pushing Docker Image..."
                    withCredentials([usernamePassword(credentialsId: env.DOCKER_CREDS_ID, passwordVariable: 'DOCKERHUB_PASS', usernameVariable: 'DOCKERHUB_USER')]) {
                        sh "echo \$DOCKERHUB_PASS | docker login -u \$DOCKERHUB_USER --password-stdin"
                        sh "docker push ${DOCKER_HUB_USER}/${DOCKER_IMAGE}:${TAG}"
                        sh "docker push ${DOCKER_HUB_USER}/${DOCKER_IMAGE}:latest"
                    }
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline finished."
            // Clean up workspace
            cleanWs()
            // Clean up local images
            sh "docker rmi ${DOCKER_HUB_USER}/${DOCKER_IMAGE}:${TAG} || true"
            sh "docker rmi ${DOCKER_HUB_USER}/${DOCKER_IMAGE}:latest || true"
        }
        success {
            echo "Build and Push was successful!"
        }
        failure {
            echo "Build or Push failed."
        }
    }
}
