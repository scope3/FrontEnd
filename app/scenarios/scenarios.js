'use strict';

angular.module('lcaApp.scenarios',
    ['ngRoute', 'lcaApp.resources.service', 'lcaApp.idmap.service', 'angularSpinner'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/scenarios', {
    templateUrl: 'scenarios/scenarios.html',
    controller: 'ScenarioListCtrl'
  });
}])

.controller('ScenarioListCtrl', ['$scope', '$window', 'usSpinnerService',
        'ScenarioService', 'FragmentService', '$q',
    function($scope, $window, usSpinnerService, ScenarioService, FragmentService, $q ) {
        var failure = false;

        function stopWaiting() {
            usSpinnerService.stop("spinner-lca");
        }

        function handleFailure(httpResponse) {
            failure = true;
            stopWaiting();
            $window.alert("Web API query failed. " + httpResponse);
        }

        usSpinnerService.spin("spinner-lca");
        $q.when(ScenarioService.load()).then (
            function(scenarios) {
                var total = scenarios.length,
                    processed = 0;
                if ( total > 0) {
                    $scope.scenarios = scenarios;
                    $scope.scenarios.forEach(function (scenario) {
                        if (!failure) {
                            $q.when(FragmentService.loadOne(scenario.topLevelFragmentID)).then(
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