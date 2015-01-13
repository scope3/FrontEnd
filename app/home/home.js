'use strict';

angular.module('lcaApp.home',
    ['lcaApp.resources.service', 'angularSpinner', 'ui.bootstrap.alert'])

.controller('HomeCtrl', ['$scope', '$window', 'usSpinnerService', '$state',
        'ScenarioService', 'FragmentService', 'LciaMethodService', '$q',
    function($scope, $window, usSpinnerService, $state, ScenarioService, FragmentService, LciaMethodService, $q ) {
        var failure = false;

        $scope.fragments = {};

        $scope.createScenario = function() {
            $state.go("new-scenario");
        };

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
            var lciaMethods = LciaMethodService.getAll();
            // Restore isActive setting from local storage
            lciaMethods.forEach(function (method) {
                method.getIsActive();
            });
            $scope.lciaMethods = lciaMethods;
        }

        startWaiting();
        $q.all([ScenarioService.load(), FragmentService.load(), LciaMethodService.load()]).then (
            function() {
                stopWaiting();
                displayScenarios();
                displayLciaMethods();
            }, handleFailure);

}]);