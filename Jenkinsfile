pipeline {
    agent any
    
    // Environment variables
    environment {
        // Change these to match your Docker Hub repository details
        DOCKER_IMAGE = 'devops-frontend'
        DOCKER_CREDS_ID = 'dockerhub-creds' // ID of credentials in Jenkins
        DOCKER_HUB_USER = 'tomkurian' // Replace with your Docker Hub username
        TAG = "${env.BUILD_NUMBER}"
        
        // EC2 Deployment variables (update these)
        EC2_IP = '172.31.77.68'
        EC2_USER = 'ubuntu' // Common default for Ubuntu, might be ec2-user for Amazon Linux
        
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout the SCM automatically
                checkout scm
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
                    // Use -P (random port) to avoid 'port already allocated' errors from previous runs
                    sh "docker run -d --name temp-test-${TAG} -P ${DOCKER_HUB_USER}/${DOCKER_IMAGE}:${TAG}"
                    sh "sleep 5"
                    sh "docker stop temp-test-${TAG} || true"
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    echo "Pushing Docker Image..."
                    withCredentials([usernamePassword(credentialsId: env.DOCKER_CREDS_ID, usernameVariable: 'DOCKERHUB_USER_CREDS', passwordVariable: 'DOCKERHUB_PASS')]) {
                        sh "docker login -u ${DOCKERHUB_USER_CREDS} -p ${DOCKERHUB_PASS}"
                        sh "docker push ${DOCKER_HUB_USER}/${DOCKER_IMAGE}:${TAG}"
                        sh "docker push ${DOCKER_HUB_USER}/${DOCKER_IMAGE}:latest"
                    }
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                script {
                    echo "Deploying to EC2 instance at ${EC2_IP}..."
                    withCredentials([file(credentialsId: 'ec2-pem-file', variable: 'PEM_FILE')]) {
                        sh """
                            chmod 400 $PEM_FILE
                            ssh -i $PEM_FILE -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_IP} 'docker pull ${DOCKER_HUB_USER}/${DOCKER_IMAGE}:latest && docker stop ${DOCKER_IMAGE} || true && docker rm ${DOCKER_IMAGE} || true && docker run -d --name ${DOCKER_IMAGE} -p 80:80 ${DOCKER_HUB_USER}/${DOCKER_IMAGE}:latest'
                        """
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
            // Clean up test container
            sh "docker rm -f temp-test-${TAG} || true"
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
