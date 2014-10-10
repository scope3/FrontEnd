module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/angular-resource/angular-resource.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/d3/d3.js',
      'app/components/**/*.js',
      'app/fragment-sankey/**/*.js',
      'app/scenarios/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    plugins : [
          'karma-chrome-launcher',
          'karma-firefox-launcher',
          'karma-ie-launcher',
          'karma-jasmine',
          'karma-junit-reporter'
      ],

    browsers : ['Chrome', 'Firefox', 'IE'],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
