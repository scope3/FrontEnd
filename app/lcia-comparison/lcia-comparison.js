'use strict';
/**
 * @ngdoc controller
 * @name lcaApp.LCIA.comparison:LciaComparisonController
 * @description
 * Controller for LCIA comparison view
 */
angular.module("lcaApp.LCIA.comparison",
    ["ui.router", "lcaApp.resources.service", "lcaApp.status.service", "ngGrid", "lcaApp.plot", "lcaApp.format",
        "lcaApp.models.lcia", "lcaApp.models.scenario"])
    .controller("LciaComparisonController",
    ["$scope", "$stateParams", "$state", "StatusService", "$q", "PlotService", "FormatService",
        "FragmentService", "LciaMethodService", "ProcessService",
        "ScenarioModelService", "LciaModelService",
        function ($scope, $stateParams, $state, StatusService, $q, PlotService, FormatService,
                  FragmentService, LciaMethodService, ProcessService,
                  ScenarioModelService, LciaModelService) {

            $scope.selection = createSelectionComponent();
            $scope.gridData = [];
            $scope.gridOpts = createGrid();
            $scope.invalidSelection = invalidSelection();
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
                $scope.plot.addConfig();
            }

            function addGridRow() {
                var row = {
                        componentType : $scope.selection.type,
                        scenario: $scope.selection.scenario,
                        activityLevel : 1,
                        chartLabel : ($scope.gridData.length + 1).toString(),
                        lciaResults : []
                    };
                if ( $scope.selection.isFragment() ) {
                    row.fragmentID = $scope.selection.fragment.fragmentID;
                    row.componentName = $scope.selection.fragment.name;
                } else {
                    row.processID = $scope.selection.process.processID;
                    row.componentName = $scope.selection.process.getLongName();
                }
                $scope.gridData.push(row);
            }

            function invalidSelection() {
                // TODO - implement this validation
                return false;
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
                        { field: "scenario.name", displayName: "Scenario", enableCellEdit: false},
                        { field: "activityLevel", displayName: "Activity Level", enableCellEdit: true},
                        { field: "chartLabel", displayName: "Chart Label", enableCellEdit: true}
                ];

                return {
                    columnDefs : columnDefs,
                    data: "gridData",
                    enableRowSelection: false,
                    enableCellEditOnFocus: true,
                    enableHighlighting: true,
                    enableColumnResize: true,
                    plugins: [new ngGridFlexibleHeightPlugin()]
                };
            }

            function createPlot() {
                var plot = { data: null, config: null};

                plot.addConfig = addConfig;

                plot.getResults = function () {
                    var promises = [];
                    promises.push($scope.gridData.forEach(getLciaResults));
                    $q.all(promises)
                        .then(plotData, StatusService.handleFailure);
                };

                function addConfig() {
                    var config = {};

                    $scope.lciaMethods.forEach( function (m) {
                        var mc = createCommonConfig();
                        mc.content().color(m.getDefaultColor());
                        config[m.lciaMethodID] = mc;
                    });
                    plot.config = config;

                }

                function createCommonConfig() {
                    var xDim = PlotService.createDimension()
                            .scale(PlotService.scale.linear())
                            .valueFn("x"),
                        yDim = PlotService.createDimension()
                            .scale(PlotService.scale.ordinal())
                            .valueFn("y")
                            .axis(PlotService.createAxis());

                    return PlotService.createInstance()
                        .content(PlotService.createBar())
                        .margin(PlotService.createMargin())
                            .x(xDim)
                            .y(yDim);
                }

                function getLciaResults(gridRow) {
                    var promise = gridRow.hasOwnProperty("fragmentID") ?
                            LciaModelService
                                .load({
                                    scenarioID: gridRow.scenario.scenarioID,
                                    fragmentID: gridRow.fragmentID
                                }) :
                            LciaModelService
                                .load({
                                    scenarioID: gridRow.scenario.scenarioID,
                                    processID: gridRow.processID
                                });
                    promise.then( function (results) {
                        gridRow.lciaResults = results;
                    });
                    return promise;
                }

                /**
                 * Populate plot data.
                 * Multiply total by activity level.
                 * Store in associative array indexed by lciaMethodID.
                 */
                function plotData() {
                    var data = {};
                    /**
                     * @param {{ chartLabel : string, activityLevel : string | number, lciaResults : [] }} gridRow
                     */
                    $scope.gridData.forEach(function (gridRow) {
                        /**
                         * @param {{ lciaMethodID : number, scenarioID: number, total : number }} result
                         */
                        gridRow.lciaResults.forEach(function (result) {
                            var plotRow = { y: gridRow.chartLabel };
                            if (!data.hasOwnProperty(result.lciaMethodID.toString())) data[result.lciaMethodID] = [];
                            plotRow.x = result.total * +gridRow.activityLevel;
                            data[result.lciaMethodID].push(plotRow);
                        });

                    });
                    plot.data = data;
                }

                return plot;
            }
        }]);