'use strict';

angular.module('lcaApp.scenarios',
    ['ngRoute', 'lcaApp.resources.service', 'lcaApp.idmap.service', 'angularSpinner'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/scenarios', {
    templateUrl: 'scenarios/scenarios.html',
    controller: 'ScenarioListCtrl'
  });
}])

.controller('ScenarioListCtrl', ['$scope', '$window', 'ResourceService', 'IdMapService', 'usSpinnerService',
    function($scope, $window, ResourceService, IdMapService, usSpinnerService ) {
        var scenarioResource = ResourceService.getResource("scenario"),
            fragmentResource = ResourceService.getResource("fragment"),
            failure = false;


        function stopWaiting() {
            usSpinnerService.stop("spinner-lca");
        }

        function handleFailure(httpResponse) {
            failure = true;
            stopWaiting();
            $window.alert("Web API query failed. " + httpResponse);
        }

        usSpinnerService.spin("spinner-lca");
        scenarioResource.query( {},
            function(scenarios) {
                var total = scenarios.length,
                    processed = 0;
                if ( total > 0) {
                    $scope.scenarios = scenarios;
                    IdMapService.add("scenarioID", $scope.scenarios);
                    $scope.scenarios.forEach(function (scenario) {
                        if (!failure) {
                            fragmentResource.get({fragmentID: scenario.topLevelFragmentID},
                                function (f) {
                                    scenario.fragment = f;
                                    if (++processed === total) {
                                        stopWaiting();
                                    }
                                },
                                handleFailure);
                        }
                    });
                }
            }, handleFailure);

}]);