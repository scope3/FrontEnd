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

        function handleFailure(errMsg) {
            if (!failure) {
                failure = true;
                stopWaiting();
                $window.alert(errMsg);
            }
        }

        usSpinnerService.spin("spinner-lca");
        $q.all([ScenarioService.load(), FragmentService.load()]).then (
            function() {
                var scenarios = ScenarioService.objects,
                    total = scenarios.length;

                stopWaiting();
                if ( total > 0) {
                    $scope.scenarios = scenarios;
                    $scope.scenarios.forEach(function (scenario) {
                        scenario.fragment = FragmentService.get(scenario.topLevelFragmentID);
                    });
                }
            }, handleFailure);

}]);