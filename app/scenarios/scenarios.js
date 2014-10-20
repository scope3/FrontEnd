'use strict';

angular.module('lcaApp.scenarios', ['ngRoute', 'lcaApp.resources.service', 'lcaApp.idmap.service', 'angularSpinner'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/scenarios', {
    templateUrl: 'scenarios/scenarios.html',
    controller: 'ScenarioListCtrl'
  });
}])

.controller('ScenarioListCtrl', ['$scope', 'ResourceService', 'IdMapService', 'usSpinnerService',
    function($scope, ResourceService, IdMapService, usSpinnerService ) {
        var scenarioResource = ResourceService.getResource("scenario"),
            fragmentResource = ResourceService.getResource("fragment"),
            failure = false;


        function resume() {
            usSpinnerService.stop("spinner-lca");
        }

        function fail() {
            failure = true;
            resume();
        }

        function waitForOthers(processed, total) {
            if ( failure || (processed === total)) {
                resume();
            }
        }

        usSpinnerService.spin("spinner-lca");
        var scenarios = scenarioResource.query( {},
            function() {
                var total = scenarios.length,
                    processed = 0;
                if ( total > 0) {
                    scenarios.forEach(function (scenario) {
                        var fragment = fragmentResource.get({fragmentID: scenario.topLevelFragmentID}, function () {
                            scenario.fragment = fragment;
                            ++processed;
                            waitForOthers(processed, total);
                        }, fail);
                    });
                }
                IdMapService.add("scenarioID", scenarios);
                resume();
                $scope.scenarios = scenarios;
            }, fail);

}]);