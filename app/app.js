'use strict';

// Declare app level module which depends on views, and components
angular.module('lcaApp', [
  'angularSpinner',
  'ngRoute',
  'lcaApp.scenarios',
  'lcaApp.fragment.sankey',
  'lcaApp.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/scenarios'});
}]);
