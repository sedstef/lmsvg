#!groovy

properties([
        buildDiscarder(logRotator(numToKeepStr: '10'))
    ])

node{

    stage('Prepare'){
        checkout scm

        env.NODEJS_HOME = "${tool(type: 'nodejs', name: 'NodeJS 12.x')}"
        env.PATH="${env.NODEJS_HOME}/bin:${env.PATH}"
        dir('client'){
            sh 'npm install'
        }
    }

    stage('Build'){
      dir('client'){
        sh 'node_modules/.bin/ng build'
      }
    }

    stage('Test'){
      dir('client'){
        wrap([$class: 'Xvfb', debug: true]) {
            sh 'npm run-script test-ci'
        }
      }
    }

    stage('Static Analysis'){
      dir('client'){
        sh 'npm run-script --silent -- ng lint --format=checkstyle angular-tour-of-heroes > build/checkstyle-result.xml'
        withSonarQubeEnv(credentialsId: '6a31ddf9-f37a-4d5b-9121-836b90abfe76') {
            sh 'node sonar-analyse.js'
        }
      }
    }

    stage('Functional Test'){
      dir('client'){
        //see https://www.browserstack.com/local-testing/binary-params
        browserstack(credentialsId: 'bd869689-b150-47e2-a1de-8344509f756d') {
            sh 'node_modules/.bin/ng e2e --protractorConfig=e2e/browserstack_local.conf.js --port 4502'
        }
      }
    }

    stage('Results'){
        junit ('**/build/karma-reports/*.xml')
        recordIssues(tools: [
                tsLint(pattern: '**/build/checkstyle-result.xml'),
                junitParser(pattern: '**/build/karma-reports/*.xml')
            ],
            enableForFailure: true)

        timeout(time: 5, unit: 'MINUTES') {
            try{
                def qg = waitForQualityGate()
                if (qg.status == 'ERROR') {
                    error "Pipeline aborted due to quality gate failure: ${qg.status}"
                }else if (qg.status == 'WARN') {
                    //Pipeline Graph Publisher (Build on SNAPSHOT dependency) doesn't work on UNSTABLE builds
                    currentBuild.result = 'UNSTABLE'
                }
            }catch(IllegalStateException ex){
                //if build fails before staticAnalysis is ran, waitForQualityGate
                //throws IllegalStateException and original exception is hidden...
                println (ex.getMessage())
            }
        }
    }
}
