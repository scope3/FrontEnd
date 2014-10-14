'use strict';

// Declare app level module which depends on views, and components
angular.module('lcaApp', [
  'ngProgress',
  'ngRoute',
  'lcaApp.scenarios',
  'lcaApp.fragment.sankey',
  'lcaApp.sankey',
  'lcaApp.version',
  'lcaApp.resources.service'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/scenarios'});
}]);
