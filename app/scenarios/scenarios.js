'use strict';

angular.module('lcaApp.scenarios', ['ngRoute', 'lcaApp.resources.service', 'ngProgress.provider'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/scenarios', {
    templateUrl: 'scenarios/scenarios.html',
    controller: 'ScenarioListCtrl'
  });
}])

.controller('ScenarioListCtrl', ['$scope', 'ResourceService', 'ngProgress',
    function($scope, ResourceService, ngProgress ) {
        var scenarioResource = ResourceService.getResource("scenario"),
            fragmentResource = ResourceService.getResource("fragment");

        ngProgress.start();
        //$timeout(ngProgress.complete(), 1000);
        var scenarios = scenarioResource.query( {}, function() {
            var curP = 50;
            ngProgress.set(curP);
            if (scenarios.length > 0) {
                var increment = 50 / (scenarios.length);
                scenarios.forEach(function (scenario) {
                    scenario.fragment = fragmentResource.get({fragmentID: scenario.topLevelFragmentID});
                    curP += increment;
                    ngProgress.set(curP);
                });
            }
            $scope.scenarios = scenarios;
        });
        ngProgress.complete();
}]);