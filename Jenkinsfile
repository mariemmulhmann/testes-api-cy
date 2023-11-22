pipeline {
    agent any

    stages {
        stage('Clonar o repositório') {
            steps {
                git branch: 'main', url: 'https://github.com/mariemmulhmann/testes-api-cy'
            }
        }
        stage('Instalar dependencias') {
            steps {
                sh 'npm install'
            }
        }
        stage('Subir o servidor') {
            steps {
                sh 'npm start'
            }
        }
        stage('Para executar via Dashboard') {
            steps {
                sh 'npx cypress open'
            }
        }
    }
}