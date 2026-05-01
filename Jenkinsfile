pipeline {
    agent any

    environment {
        NODE_HOME   = tool name: 'NodeJS-20', type: 'NodeJSInstallation'
        PATH        = "${NODE_HOME}/bin:${env.PATH}"
        ENV         = "${params.ENVIRONMENT ?: 'qa'}"
        BASE_URL    = credentials('BASE_URL')
        ADMIN_USER  = credentials('ADMIN_USER')
        ADMIN_PASS  = credentials('ADMIN_PASSWORD')
    }

    parameters {
        choice(name: 'ENVIRONMENT', choices: ['qa', 'dev', 'prod'], description: 'Target Environment')
        string(name: 'BROWSER',    defaultValue: 'chromium',        description: 'Browser project to run')
        booleanParam(name: 'SMOKE_ONLY', defaultValue: false,        description: 'Run smoke tests only?')
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
        timeout(time: 45, unit: 'MINUTES')
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/your-org/playwright-enterprise-framework.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'node --version'
                sh 'npm ci'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                sh 'npx playwright install --with-deps'
            }
        }

        stage('TypeScript Type-Check') {
            steps {
                sh 'npx tsc --noEmit'
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    def grepArg = params.SMOKE_ONLY ? '--grep @smoke' : ''
                    sh """
                        ENV=${env.ENV} \
                        BASE_URL=${env.BASE_URL} \
                        ADMIN_USER=${env.ADMIN_USER} \
                        ADMIN_PASSWORD=${env.ADMIN_PASS} \
                        npx playwright test --project=${params.BROWSER} ${grepArg}
                    """
                }
            }
            post {
                always {
                    // Archive Playwright HTML report
                    publishHTML(target: [
                        allowMissing:         false,
                        alwaysLinkToLastBuild: true,
                        keepAll:              true,
                        reportDir:            'playwright-report',
                        reportFiles:          'index.html',
                        reportName:           'Playwright HTML Report'
                    ])
                }
            }
        }

        stage('Generate Allure Report') {
            steps {
                sh 'npx allure generate allure-results --clean -o allure-report'
            }
            post {
                always {
                    allure([
                        includeProperties: false,
                        jdk:               '',
                        results:           [[path: 'allure-results']]
                    ])
                }
            }
        }

        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: 'playwright-report/**,allure-report/**,reports/logs/**', allowEmptyArchive: true
            }
        }
    }

    post {
        failure {
            echo "Build FAILED — check Playwright and Allure reports."
        }
        always {
            cleanWs()
        }
    }
}
