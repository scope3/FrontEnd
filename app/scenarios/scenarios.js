'use strict';

angular.module('lcaApp.scenarios', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/scenarios', {
    templateUrl: '/scenarios.html',
    controller: 'scenariosCtrl'
  });
}])

.controller('scenariosCtrl', [function() {

}]);