'use strict';

// Declare app level module which depends on views, and components
angular.module('lcaApp', [
  'ngRoute',
  'lcaApp.scenarios',
  'lcaApp.view2',
  'lcaApp.version',
  'lcaApp.resources.service'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/scenarios'});
}]);
