// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-junit-reporter'),
      require('karma-sonarqube-unit-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    //report in JUnit format for Jenkins
    junitReporter: {
      outputDir: require('path').join(__dirname, 'build/karma-reports'),
      suite: 'src/app',
      useBrowserName: true, // add browser name outputFile
      xmlVersion: null,//use junit format
      nameFormatter: function (browser, result) {
        return result.fullName;
      },
      classNameFormatter: function (browser, result) {
        return result.suite;
      }
    },
    sonarQubeUnitReporter: {
      outputFile: require('path').join(__dirname, 'build/ut_report.xml'),
      suite: 'src/app',
      useBrowserName: true
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, 'build/coverage'),
      reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'kjhtml', 'junit', 'sonarqubeUnit'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
};
