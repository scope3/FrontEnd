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

            $scope.removeRow = function(r) {
                var index = $scope.gridData.indexOf(r.entity);
                $scope.plot.removeRow(index);
                $scope.gridData.splice(index, 1);
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
                        activityLevel : $scope.selection.activityLevel,
                        chartLabel : $scope.selection.chartLabel
                    };
                if ( $scope.selection.isFragment() ) {
                    row.fragmentID = $scope.selection.fragment.fragmentID;
                    row.componentName = $scope.selection.fragment.name;
                } else {
                    row.processID = $scope.selection.process.processID;
                    row.componentName = $scope.selection.process.getLongName();
                }
                $scope.gridData.push(row);
                $scope.plot.getResult(row);
                resetInput();
            }

            function resetInput() {
                $scope.selection.chartLabel = null;
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
                        isFragment : isFragment,
                        activityLevel : 1,
                        chartLabel: null
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
                var cellTemplate =
'<button type="button" class="close" ng-click="removeRow(row)" aria-label="Close"><span class="glyphicon glyphicon-remove"></span></button>',
                    columnDefs = [
                        { field: "componentType", displayName: "Component Type"},
                        { field: "componentName", displayName: "Component Name"},
                        { field: "scenario.name", displayName: "Scenario"},
                        { field: "activityLevel", displayName: "Activity Level"},
                        { field: "chartLabel", displayName: "Chart Label"},
                        { field: '', cellTemplate: cellTemplate, width: 20 }
                ];

                return {
                    columnDefs : columnDefs,
                    data: "gridData",
                    enableRowSelection: false,
                    enableCellEditOnFocus: false,
                    enableHighlighting: true,
                    enableColumnResize: true,
                    plugins: [new ngGridFlexibleHeightPlugin()]
                };
            }

            function createPlot() {
                var plot = { data: {}, config: null};

                plot.addConfig = addConfig;

                plot.getResult = function (gridRow) {
                    StatusService.startWaiting();
                    getLciaResults(gridRow)
                        .then(function (results) {
                            plotRow(gridRow, results)
                        }, StatusService.handleFailure);
                };

                plot.removeRow = function(index) {
                    var data = plot.data;
                    $scope.lciaMethods.forEach( function (m) {
                        if (data.hasOwnProperty(m.lciaMethodID)) {
                            data[m.lciaMethodID].splice(index, 1);
                        }
                    });
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

                function getX(d) {
                    return d.value * +d.row.activityLevel;
                }

                function getY(d) {
                    return d.row;
                }

                function getLabel(r) {
                    return r.chartLabel;
                }

                function createCommonConfig() {
                    var xAxis = PlotService.createAxis(),
                        xDim = PlotService.createDimension()
                            .scale("linear")
                            .valueFn(getX)
                            .axis(xAxis.orientation("bottom").offset(20)),
                        yAxis = PlotService.createAxis(),
                        yDim = PlotService.createDimension()
                            .scale("ordinal")
                            .valueFn(getY)
                            .labelFn(getLabel)
                            .axis(yAxis.offset(20)),
                        margin = PlotService.createMargin(0, 15);

                    return PlotService.createInstance()
                        .content(PlotService.createBar())
                        .margin(margin)
                            .x(xDim)
                            .y(yDim);
                }

                function getLciaResults(gridRow) {
                    return gridRow.hasOwnProperty("fragmentID") ?
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
                }

                function newArray(length) {
                    var a = [];
                    while (length-- > 0) {
                        a.push(null);
                    }
                    return a;
                }

                function plotRow(gridRow, results) {
                    StatusService.stopWaiting();
                    var index = $scope.gridData.indexOf(gridRow);
                    if (results.length) {
                        var data = plot.data;

                        /**
                         * @param {{ lciaMethodID : number, scenarioID: number, total : number }} result
                         */
                        results.forEach(function (result) {
                            var plotRow = { row : gridRow, value: result.total };
                            if (!data.hasOwnProperty(result.lciaMethodID.toString())) data[result.lciaMethodID] =
                                newArray($scope.gridData.length);
                            data[result.lciaMethodID][index] = plotRow;
                        });
                    } else {
                        StatusService.displayInfo("The fragment is outside the scope of this scenario.");
                        $scope.gridData.splice(index, 1);
                    }
                }


                return plot;
            }
        }]);