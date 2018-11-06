pipeline {
  agent {
    node {
      label 'fast'
    }

  }
  environment {
    JUNIT_REPORT_PATH = 'test-results/report.xml'
  }
  stages {
    stage('Install Dependency') {
      steps {
        sh '''yarn
cd app/frontend
yarn
cd ../..'''
      }
    }
    stage('Test') {
      parallel {
        stage('Frontend Test') {
          steps {
            sh '''cd app/frontend
npm run test:ci'''
          }
          post {
            always {
              junit 'app/frontend/karma-results/**/*.xml'
            }
          }
        }
        stage('Backend Test') {
          steps {
            sh 'npm run test:ci'
          }
          post {
            always {
              junit 'test-results/**/*.xml'
            }
          }
        }
      }
    }
  }
}