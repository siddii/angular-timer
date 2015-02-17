module.exports = function(config){
  config.set({


    basePath : '../',

    files : [
      'bower_components/humanize-duration/humanize-duration.js',
      'bower_components/momentjs/min/moment-with-locales.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'app/js/*.js',
      'test/unit/**/*.js'
    ],

    exclude : [
      'bower_components/angular-scenario/angular-scenario.js'
    ],

    autoWatch : false,

    browsers : ['Chrome'],

    frameworks: ['jasmine'],

    singleRun : true,

    proxies : {
      '/': 'http://localhost:3030/'
    },

    plugins : [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-phantomjs-launcher',
      'karma-ng-scenario'
    ],

    junitReporter : {
      outputFile: 'test_out/e2e.xml',
      suite: 'e2e'
    }

  })
};
