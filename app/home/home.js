'use strict';

angular.module('lcaApp.home',
    ['lcaApp.resources.service', 'lcaApp.idmap.service', 'angularSpinner', 'ui.bootstrap.alert'])

.controller('HomeCtrl', ['$scope', '$window', 'usSpinnerService',
        'ScenarioService', 'FragmentService', '$q',
    function($scope, $window, usSpinnerService, ScenarioService, FragmentService, $q ) {
        var failure = false;

        function stopWaiting() {
            usSpinnerService.stop("spinner-lca");
        }

        function startWaiting() {
            $scope.alert = null;
            usSpinnerService.spin("spinner-lca");
        }

        function handleFailure(errMsg) {
            if (!failure) {
                failure = true;
                stopWaiting();
                //$window.alert(errMsg);
                $scope.alert = { type: "danger", msg: errMsg };
            }
        }

        startWaiting();
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