'use strict';
/* Controller for Scenario Detail View */
angular.module('lcaApp.scenario.detail',
               ['lcaApp.resources.service', 'lcaApp.status.service'])
.controller('ScenarioDetailController', ['$scope', '$window', 'StatusService', '$state', '$stateParams',
            'ScenarioService', 'FragmentService', '$q',
    function($scope, $window, StatusService, $state, $stateParams,
             ScenarioService, FragmentService, $q) {

        $scope.scenario = null;
        $scope.fragment = null;

        $scope.editScenario = function() {
            $state.go(".edit");
        };

        $scope.hideEdit = function(scenario) {
            return ! (scenario && ScenarioService.canUpdate(scenario));
        };

        function displayScenario() {
            var scenario = ScenarioService.get($stateParams.scenarioID);
            if (scenario) {
                $scope.scenario = scenario;
                $scope.fragment = FragmentService.get(scenario.topLevelFragmentID);
            } else {
                StatusService.handleFailure("Invalid Scenario ID parameter.");
            }
        }

        StatusService.startWaiting();
        $q.all([ScenarioService.load(), FragmentService.load()]).then (
            function() {
                StatusService.handleSuccess();
                displayScenario();
            }, StatusService.handleFailure);

}]);