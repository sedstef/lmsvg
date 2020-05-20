#!groovy

properties([
        buildDiscarder(logRotator(numToKeepStr: '10'))
    ])

node{

    stage('Prepare'){
        checkout scm

        env.JAVA_HOME = "${tool(type: 'jdk', name: 'JDK 1.8')}"
        env.NODEJS_HOME = "${tool(type: 'nodejs', name: 'NodeJS 12.x')}"
        env.PATH="${env.JAVA_HOME}/bin:${env.NODEJS_HOME}/bin:${env.PATH}"
        dir('client'){
            sh 'npm install'
            sh 'npm install nativescript'
        }
    }

    stage('Build'){
      dir('client'){
        sh 'node_modules/.bin/ng build'
        //build apk in platforms/android/app/build/outputs/apk/debug/app-debug.apk
        sh 'node_modules/.bin/tns build android'
        
        //tns build ios only works on macOS
        //sh 'node_modules/.bin/tns build ios'
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
        sh 'npm run-script --silent -- ng lint --format=checkstyle lmsvg > build/checkstyle-result.xml'
        withSonarQubeEnv(credentialsId: '6a31ddf9-f37a-4d5b-9121-836b90abfe76') {
            sh 'node sonarqube.js'
        }
      }
    }

//    stage('Functional Test'){
//      dir('client'){
//        //see https://www.browserstack.com/local-testing/binary-params
//        browserstack(credentialsId: 'bd869689-b150-47e2-a1de-8344509f756d') {
//            sh 'node_modules/.bin/ng e2e --protractorConfig=e2e/browserstack_local.conf.js --port 4502'
//        }
//      }
//    }

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
