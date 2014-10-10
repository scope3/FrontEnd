'use strict';

angular.module('lcaApp.scenarios', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/scenarios', {
    templateUrl: 'scenarios/scenarios.html',
    controller: 'ScenarioListCtrl'
  });
}])

.controller('ScenarioListCtrl', ['$scope', 'ResourceService', function($scope, ResourceService) {
    var scenarioResource = ResourceService.getResource("scenario"),
        fragmentResource = ResourceService.getResource("fragment");

        $scope.scenarios = scenarioResource.query( {}, function() {
            $scope.scenarios.forEach( function(scenario) {
                scenario.fragment = fragmentResource.get({fragmentID: scenario.topLevelFragmentID});
            });
        });

}]);