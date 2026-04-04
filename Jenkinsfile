pipeline {
    agent any

    environment {
        APP_NAME = "url-shortener-app"
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Check Workspace') {
            steps {
                bat 'cd'
                bat 'dir'
                bat 'dir app'
            }
        }

        stage('Verify Docker') {
            steps {
                bat 'docker --version'
                bat 'docker compose version'
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('app') {
                    bat 'npm install'
                }
            }
        }

        stage('Run Tests') {
            steps {
                dir('app') {
                    bat 'npm test'
                }
            }
        }

       stage('Build and Deploy') {
    when {
        branch 'main'
    }
    steps {
        bat 'docker compose up -d --build url-shortener-app'
    }
}

    post {
        success {
            echo 'Pipeline completed successfully.'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}