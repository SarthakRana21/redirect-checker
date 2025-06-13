pipeline {
    environment {
        NAME = 'redirect-checker'
    }
    agent any

    stages {
        
        stage('Cloning our Git') {
            steps{
                git branch: master, url: 'https://github.com/SarthakRana21/redirect-checker.git'
            }
        }

        stage('Cleaning Containers and Images') {
            steps {
                echo("stopping the containers")
                sh "docker stop ${NAME}_server || true"
                sh "docker stop ${NAME}_client || true"
            }
            steps {
                echo("Removing Containers")
                sh "docker rm ${NAME}_client || true"
                sh "docker rm ${NAME}_server || true"

                echo("Cleaning images")
                sh "docker image prune ${NAME}_server || true"
                sh "docker image prune ${NAME}_client || true"
            }
        }
 
        stage('Building Docker Image') {
            steps{
                sh "docker build -t ${NAME}_server -f ./server/dockerfile.server"
                sh "docker build -t ${NAME}_client -f ./client/Dockerfile.client"
            }
        }
        stage('Deploying containers') {
            sh """
            set -a
            . /var/lib/jenkins/workspace/${NAME}/server/.env
            docker run -dit -p 5200:5173 --name ${NAME}_server ${NAME}_server
            set +a
            """
            sh """
            set -a
            . /var/lib/jenkins/workspace/${NAME}/client/.env
            docker run -dit -p 5300:5000 --name ${NAME}_client ${NAME}_client
            set +a
            """
        }

    }

}