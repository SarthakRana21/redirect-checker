pipeline {
    environment {
        NAME = 'redirect-checker'
    }
    agent any

    stages {
        stage('Cloning our Git') {
            steps {
                git branch: 'master', url: 'https://github.com/SarthakRana21/redirect-checker.git'
            }
        }

        stage('Cleaning Containers and Images') {
            steps {
                echo("Stopping the containers")
                sh "docker stop ${NAME}_server || true"
                sh "docker stop ${NAME}_client || true"

                echo("Removing containers")
                sh "docker rm ${NAME}_server || true"
                sh "docker rm ${NAME}_client || true"

                echo("Cleaning images")
                sh "docker rmi ${NAME}_server || true"
                sh "docker rmi ${NAME}_client || true"
            }
        }

        stage('Building Docker Images') {
            steps {
                sh "docker build -t ${NAME}_server -f ./server/Dockerfile ./server"
                sh "docker build -t ${NAME}_client -f ./client/Dockerfile ./client"
            }
        }

        stage('Deploying Containers') {
            steps {
                sh """
                    set -a
                    . ./server/.env
                    set +a
                    docker run -dit -p 5300:5000 --name ${NAME}_server ${NAME}_server
                """
                sh """
                    set -a
                    . ./client/.env
                    set +a
                    docker run -dit -p 5200:5173 --name ${NAME}_client ${NAME}_client
                """
            }
        }
    }
}
