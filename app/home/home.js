'use strict';
/**
 * Home page view controller
 */
angular.module('lcaApp.home',
               ['lcaApp.resources.service', 'lcaApp.models.scenario', 'lcaApp.status.service', 'ui.bootstrap', 'ui.router',
                   'lcaApp.scenario.clone', 'lcaApp.modal.confirm'])
.controller('HomeCtrl', ['$scope', '$window', 'StatusService', '$state',
            'ScenarioModelService', 'ScenarioGroupService', 'FragmentService', 'LciaMethodService', '$q', '$modal',
    function($scope, $window, StatusService, $state,
             ScenarioModelService, ScenarioGroupService, FragmentService, LciaMethodService, $q, $modal) {

        $scope.fragments = {};  // Fragment resources, indexed by scenarioID

        $scope.canCreate = false;

        /**
         * Click handler for New Scenario button.
         * Route to New Scenario view.
         */
        $scope.createScenario = function() {
            $state.go(".new-scenario");
        };

        /**
         * Click handler for Delete Scenario button.
         * Make web API delete request after user confirms.
         * @param {{ scenarioID: number, name: string }} scenario  Scenario on button row.
         */
        $scope.deleteScenario = function(scenario) {
            var question = "Are you sure you want to permanently delete scenario, " + scenario.name + "?",
                modalParameters = {
                    title : "Confirm Delete",
                    question : question,
                    result : scenario
                },
                modalInstance = $modal.open({
                    templateUrl: 'components/modal/modal-confirm.html',
                    controller: 'ModalConfirmController',
                    size: 'sm',
                    resolve: {
                        parameters: function () {
                            return modalParameters;
                        }
                    }
                });

            modalInstance.result.then(requestDelete);
        };

        /**
         * Click handler for Clone Scenario button.
         * Make web API clone request after user edits copied name.
         * @param {{ scenarioID: number, name: string }} scenario  Scenario on button row.
         */
        $scope.cloneScenario = function(scenario) {
            var copiedScenario = angular.copy(scenario),
                modalInstance = $modal.open({
                templateUrl: 'scenario/scenario-clone.html',
                controller: 'ScenarioCloneController',
                size: 'sm',
                resolve: {
                    scenario: function () {
                        return copiedScenario;
                    }
                }
            });

            modalInstance.result.then(requestClone);
        };

        $scope.canDelete = ScenarioModelService.canDelete;

        function requestClone(scenario) {
            var urlParam = { cloneScenario : scenario.scenarioID};
            StatusService.startWaiting();
            ScenarioModelService.create(urlParam, scenario, reloadScenarios, StatusService.handleFailure);
        }

        function requestDelete(scenario) {
            StatusService.startWaiting();
            if (ScenarioModelService.getActiveID() === scenario.scenarioID) {
                ScenarioModelService.removeActiveID();
            }
            ScenarioModelService.remove(null, scenario, reloadScenarios, StatusService.handleFailure);

        }

        function reloadScenarios() {
            ScenarioModelService.load().then(function() {
                StatusService.handleSuccess();
                displayScenarios();
            }, StatusService.handleFailure);
        }

        function displayScenarios() {
            var scenarios = ScenarioModelService.getAll();

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
        $q.all([ScenarioModelService.load(), ScenarioGroupService.load(), FragmentService.load(),
            LciaMethodService.load()]).then(
                function () {
                    StatusService.handleSuccess();
                    $scope.canCreate = ScenarioModelService.canCreateScenario(ScenarioGroupService.getAll());
                    displayScenarios();
                    displayLciaMethods();
                }, StatusService.handleFailure);

}]);