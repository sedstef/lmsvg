const scanner = require("sonarqube-scanner");

scanner(
  {
    serverUrl: (process.env.SONAR_HOST_URL),
    token: (process.env.SONAR_AUTH_TOKEN),
    options: {
      "sonar.projectVersion": "1.1.0",
      "sonar.sources": "src",
      "sonar.tests": "test",
      "sonar.javascript.lcov.reportPaths": "build/coverage/lcov.info",
      "sonar.testExecutionReportPaths": "build/ut_report.xml"
    },
  },
  () => {
    // callback is required
  }
);
