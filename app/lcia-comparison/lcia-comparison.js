'use strict';
/**
 * @ngdoc controller
 * @name lcaApp.LCIA.comparison:LciaComparisonController
 * @description
 * Controller for LCIA comparison view
 */
angular.module("lcaApp.LCIA.comparison",
    ["ui.router", "lcaApp.resources.service", "lcaApp.status.service", "ngGrid", "lcaApp.plot",
        "lcaApp.models.lcia", "lcaApp.models.scenario"])
    .controller("LciaComparisonController",
    ["$scope", "$stateParams", "$state", "StatusService", "$q", "PlotService",
        "FragmentService", "LciaMethodService", "ProcessService",
        "ScenarioModelService", "LciaModelService",
        function ($scope, $stateParams, $state, StatusService, $q, PlotService,
                  FragmentService, LciaMethodService, ProcessService,
                  ScenarioModelService, LciaModelService) {

            $scope.selection = createSelectionComponent();
            $scope.gridData = [];
            $scope.gridOpts = createGrid();
            $scope.lciaMethods = [];
            $scope.plot = createPlot();
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

            function addGridRow() {
                var row = {
                        componentType : $scope.selection.type,
                        componentName : $scope.selection.isFragment() ?
                            $scope.selection.fragment.name :
                            $scope.selection.process.getLongName(),
                        scenario: $scope.selection.scenario.name,
                        activityLevel : 1,
                        chartLabel : ($scope.gridData.length + 1).toString()
                    };
                $scope.gridData.push(row);
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
                    add : addGridRow,
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
                        if (selection.processOptions.length) {
                            selection.processOptions.sort(ProcessService.compareByName);
                            selection.process = selection.processOptions[0];
                        }
                    }
                }

                function isFragment() {
                    return selection.type === "Fragment";
                }
            }

            function createGrid() {
                var columnDefs = [
                        { field: "componentType", displayName: "Component Type", enableCellEdit: false},
                        { field: "componentName", displayName: "Component Name", enableCellEdit: false},
                        { field: "scenario", displayName: "Scenario", enableCellEdit: false},
                        { field: "activityLevel", displayName: "Activity Level", enableCellEdit: true},
                        { field: "chartLabel", displayName: "Chart Label", enableCellEdit: true}
                ],
                    grid = {
                        columnDefs : columnDefs,
                        data: "gridData",
                        enableRowSelection: false,
                        enableCellEditOnFocus: true,
                        enableHighlighting: true,
                        enableColumnResize: true,
                        plugins: [new ngGridFlexibleHeightPlugin()]
                };
                return grid;
            }

            function createPlot() {
                var commonConfig = PlotService.createInstance(),
                    content = PlotService.createBar(),
                    margin = PlotService.createMargin(),
                    xDim = PlotService.createDimension(),
                    yDim = PlotService.createDimension(),
                    yAxis = PlotService.createAxis();

            }
        }]);