'use strict';

angular.module('lcaApp.scenarios', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/scenarios', {
    templateUrl: 'scenarios/scenarios.html',
    controller: 'ScenarioListCtrl'
  });
}])

.controller('ScenarioListCtrl', ['$scope', 'Scenario', function($scope, Scenario) {
        $scope.scenarios = Scenario.query();
}]);