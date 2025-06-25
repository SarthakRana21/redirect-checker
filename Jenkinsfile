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
                sh "docker build -t ${NAME}_server -f ./server/Dockerfile.server ./server"
                sh "docker build -t ${NAME}_client -f ./client/Dockerfile.client ./client"
            }
        }

        stage('Deploying Containers') {
            steps {
                sh """
                    set -a
                    . /var/lib/jenkins/workspace/${NAME}/server/.env
                    set +a
                    docker run -dit -v redirect-db:/drizzle  --restart unless-stopped --network host --name ${NAME}_server ${NAME}_server
                """
                sh """
                    set -a
                    . /var/lib/jenkins/workspace/${NAME}/client/.env
                    set +a
                    docker run -dit -p 5200:4173 --restart unless-stopped --name ${NAME}_client ${NAME}_client
                """
            }
        }
    }
}
