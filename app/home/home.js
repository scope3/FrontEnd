'use strict';

angular.module('lcaApp.home',
               ['lcaApp.resources.service', 'lcaApp.status.service'])
.controller('HomeCtrl', ['$scope', '$window', 'StatusService', '$state',
            'ScenarioService', 'FragmentService', 'LciaMethodService', '$q',
    function($scope, $window, StatusService, $state,
             ScenarioService, FragmentService, LciaMethodService, $q) {

        $scope.fragments = {};

        $scope.createScenario = function() {
            $state.go("new-scenario");
        };

        $scope.deleteScenario = function(scenario) {
            var msg = "Delete scenario, " + scenario.name + "?";
            if ( $window.confirm(msg)) {
                StatusService.startWaiting();
                ScenarioService.delete(scenario, reloadScenarios, StatusService.handleFailure);
            }
        };

        $scope.hideDelete = function(scenario) {
            return ! ScenarioService.canDelete(scenario);
        };

        function reloadScenarios() {
            ScenarioService.load().then(function() {
                StatusService.handleSuccess();
                displayScenarios();
            }, StatusService.handleFailure);
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

        StatusService.startWaiting();
        $q.all([ScenarioService.load(), FragmentService.load(), LciaMethodService.load()]).then (
            function() {
                StatusService.handleSuccess();
                displayScenarios();
                displayLciaMethods();
            }, StatusService.handleFailure);

}]);