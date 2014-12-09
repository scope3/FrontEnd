'use strict';

angular.module('lcaApp.home',
    ['lcaApp.resources.service', 'lcaApp.idmap.service', 'angularSpinner', 'ui.bootstrap.alert'])

.controller('HomeCtrl', ['$scope', '$window', 'usSpinnerService',
        'ScenarioService', 'FragmentService', 'LciaMethodService', '$q',
    function($scope, $window, usSpinnerService, ScenarioService, FragmentService, LciaMethodService, $q ) {
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

        function displayScenarios() {
            var scenarios = ScenarioService.getAll();
            scenarios.forEach(function (scenario) {
                $scope.fragments[scenario.topLevelFragmentID] = FragmentService.get(scenario.topLevelFragmentID);
            });
            $scope.scenarios = scenarios;
        }

        function displayLciaMethods() {
            $scope.lciaMethods = LciaMethodService.getAll();
        }

        $scope.fragments = {};

        startWaiting();
        $q.all([ScenarioService.load(), FragmentService.load(), LciaMethodService.load()]).then (
            function() {
                stopWaiting();
                displayScenarios();
                displayLciaMethods();
            }, handleFailure);

}]);