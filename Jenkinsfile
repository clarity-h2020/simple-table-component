pipeline {
    agent {
        docker {
            image 'node:latest'
            args '-p 3001:3000'
        }
    }
    
    stages {
        stage('Install') {
            steps {
                sh 'yarn install --network-concurrency 1'
            }
        }
        stage('Test') { 

            steps {
                sh 'yarn test'
                def result = sh returnStatus: true
                echo result
            }
        }
        stage('Build') { 
            steps {
                sh 'yarn build'
            }
        }
    }
}
