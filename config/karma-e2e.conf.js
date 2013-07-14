basePath = '../';

files = [
  'jquery/jquery-1.9.1.min.js',
  ANGULAR_SCENARIO,
  ANGULAR_SCENARIO_ADAPTER,
  'test/e2e/**/*.js'
];

autoWatch = true;

browsers = ['Firefox'];

singleRun = false;

proxies = {
  '/': 'http://localhost:8383/'
};

junitReporter = {
  outputFile: 'test_out/e2e.xml',
  suite: 'e2e'
};
