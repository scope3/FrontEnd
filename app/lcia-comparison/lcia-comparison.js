'use strict';
/**
 * @ngdoc controller
 * @name lcaApp.LCIA.comparison:LciaComparisonController
 * @description
 * Controller for LCIA comparison view
 */
angular.module("lcaApp.LCIA.comparison",
    ["ui.router", "lcaApp.resources.service", "lcaApp.status.service",
        "lcaApp.models.lcia", "lcaApp.models.scenario"])
    .controller("LciaComparisonController",
    ["$scope", "$stateParams", "$state", "StatusService", "$q",
        "FragmentService", "LciaMethodService", "ProcessService",
        "ScenarioModelService", "LciaModelService",
        function ($scope, $stateParams, $state, StatusService, $q,
                  FragmentService, LciaMethodService, ProcessService,
                  ScenarioModelService, LciaModelService) {

            $scope.selection = createSelectionComponent();
            $scope.gridOpts = createGrid();
            $scope.lciaMethods = [];
            /**
             * Remove LCIA method. Used to close panel.
             * @param m Method displayed by panel to be closed
             */
            $scope.removeMethod = function(m) {
                var index = $scope.lciaMethods.indexOf(m);
                if (index > -1) {
                    $scope.lciaMethods.splice(index, 1);
                }
            };

            getData();

            function getData() {
                StatusService.startWaiting();
                $q.all([ScenarioModelService.load(), FragmentService.load(), ProcessService.load(),
                    LciaMethodService.load()]).then(
                    displayData, StatusService.handleFailure);
            }

            function displayData() {
                StatusService.stopWaiting();
                $scope.selection.displayData();
                $scope.lciaMethods = LciaMethodService.getAll();
            }

            function createSelectionComponent() {
                var selection = {
                    type: "Fragment",
                    fragment: null,
                    fragmentOptions: [],
                    process: null,
                    processOptions: [],
                    scenario: null,
                    scenarioOptions: [],
                    displayData : displayData,
                    isFragment : isFragment
                };

                return selection;

                function displayData() {
                    selection.fragmentOptions = FragmentService.getAll();
                    selection.processOptions = ProcessService.getAll();
                    selection.scenarioOptions = ScenarioModelService.getAll();
                    if (selection.scenarioOptions.length) {
                        selection.scenario = ScenarioModelService.getActiveScenario();
                        if (selection.fragmentOptions.length) {
                            selection.fragment = FragmentService.get(selection.scenario.topLevelFragmentID);
                        }
                    }
                }

                function isFragment() {
                    return selection.type === "Fragment";
                }
            }

            function createGrid() {
                var grid = {
                    data: []
                };
                return grid;
            }
        }]);