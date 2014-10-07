'use strict';

angular.module('lcaApp.scenarios', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/scenarios', {
    templateUrl: 'scenarios/scenarios.html',
    controller: 'ScenarioListCtrl'
  });
}])

.controller('ScenarioListCtrl', ['$scope', 'ResourceService', function($scope, ResourceService) {
    var scenarioResource = ResourceService.getScenarioResource(),
        fragmentResource = ResourceService.getFragmentResource();

        $scope.scenarios = scenarioResource.query( {}, function() {
            $scope.scenarios.forEach( function(scenario) {
                scenario.fragment = fragmentResource.get({fragmentId: scenario.topLevelFragmentID});
            });
        });

}]);