module.exports = function(config){
  config.set({

    basePath : './',

    files : [
        'app/bower_components/jquery/dist/jquery.min.js',
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-local-storage/dist/angular-local-storage.js',
      'app/bower_components/angular-ui-router/release/angular-ui-router.js',
      'app/bower_components/angular-resource/angular-resource.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/lodash/dist/lodash.min.js',
      'app/bower_components/isteven-angular-multiselect/isteven-multi-select.js',
      'app/bower_components/colorbrewer/colorbrewer.js',
      'app/bower_components/d3/d3.js',
      'app/bower_components/d3-tip/index.js',
      'app/bower_components/spin.js/spin.js',
      'app/bower_components/angular-spinner/angular-spinner.js',
      'app/bower_components/angular-bootstrap/ui-bootstrap.js',
      'app/bower_components/ng-grid/build/ng-grid.js',
      'app/bower_components/array.prototype.find/index.js',
      'app/components/**/*.js',
      'app/fragment-flow-param/**/*.js',
      'app/fragment-lcia/**/*.js',
      'app/fragment-sankey/**/*.js',
      'app/lcia-method/**/*.js',
      'app/process-instance/**/*.js',
      'app/process-lcia/**/*.js',
      'app/scenario/**/*.js'
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
