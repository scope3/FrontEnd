'use strict';
/**
 * @ngdoc controller
 * @name lcaApp.LCIA.comparison:LciaComparisonController
 * @description
 * Controller for LCIA comparison view
 */
angular.module("lcaApp.LCIA.comparison",
    ["ui.router", "lcaApp.resources.service", "lcaApp.status.service", "ngGrid", "lcaApp.plot", "lcaApp.format",
        "lcaApp.models.lcia", "lcaApp.models.scenario", "d3"])
    .controller("LciaComparisonController",
    ["$scope", "$stateParams", "$state", "StatusService", "$q", "PlotService", "FormatService",
        "FragmentService", "LciaMethodService", "ProcessService",
        "ScenarioModelService", "LciaModelService", "d3Service",
        function ($scope, $stateParams, $state, StatusService, $q, PlotService, FormatService,
                  FragmentService, LciaMethodService, ProcessService,
                  ScenarioModelService, LciaModelService, d3Service) {

            var resizeGridPlugin = new ngGridFlexibleHeightPlugin();

            $scope.selection = createSelectionComponent();
            $scope.gridData = [];
            $scope.gridOpts = createGrid();
            $scope.invalidSelection = invalidSelection();
            $scope.lciaMethods = [];
            $scope.maxLabelLen = 7;
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

            $scope.removeGridRow = function(r) {
                var rows = $scope.gridData,
                    index = r.index;
                $scope.plot.removeRow(index);
                rows.splice(index, 1);
                for (var i=index; i < rows.length; ++i) {
                    --(rows[i].index);
                }
                //resetGridHeight();
            };

            //resetGridHeight();
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
                        index : $scope.gridData.length,
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
                resetGridHeight();
                resetInput();
            }

            function resetInput() {
                $scope.selection.chartLabel = null;
            }

            function resetGridHeight() {
                // Fruitless attempts to work around Chrome resize problem
                //var height = $scope.gridData.length*30 + 32;
                //
                //d3Service.select("#selection-grid")
                //    .attr("height", height);
                //resizeGridPlugin.rHD();
                //$scope.gridData = $scope.gridData.slice();
                //$scope.$apply($scope.gridData.length);
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
                var removeTemplate =
'<button type="button" class="btn btn-sm" ng-click="removeGridRow(row.entity)" aria-label="Remove"><span class="glyphicon glyphicon-remove"></span></button>',
                    numTemplate = '<input type="number" step="any" ng-input="COL_FIELD" ng-model="COL_FIELD" />',
                    labelTemplate = '<input type="text" maxlength={{maxLabelLen}} ng-input="COL_FIELD" ng-model="COL_FIELD" />',
                    columnDefs = [
                        { field: "componentType", displayName: "Type", width: 100, enableCellEdit: false },
                        { field: "componentName", displayName: "Name", enableCellEdit: false },
                        { field: "scenario.name", displayName: "Scenario", enableCellEdit: false },
                        { field: "activityLevel", cellTemplate: numTemplate, displayName: "Activity Level", enableCellEdit: true },
                        { field: "chartLabel", cellTemplate: labelTemplate, displayName: "Chart Label", enableCellEdit: true },
                        { field: "", cellTemplate: removeTemplate, width: 30, enableCellEdit: false }
                    ];

                return {
                    columnDefs : columnDefs,
                    data: "gridData",
                    enableRowSelection: false,
                    enableCellEditOnFocus: true,
                    enableHighlighting: true,
                    enableColumnResize: true,
                    jqueryUITheme: true,
                    plugins: [resizeGridPlugin]
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
                        mc.x().unit(m.getReferenceUnit());
                        config[m.lciaMethodID] = mc;
                    });
                    plot.config = config;
                }

                function getX(d) {
                    return d.value * +d.row.activityLevel;
                }

                function getY(d) {
                    return d.row.index;
                }

                function getLabel(index) {
                    var label = $scope.gridData[index].chartLabel;
                    if (!label) {
                        label = (index + 1).toString();
                    }
                    return label;
                }

                function createCommonConfig() {
                    var xAxis = PlotService.createAxis(),
                        xDim = PlotService.createDimension()
                            .scale("linear")
                            .valueFn(getX)
                            .labelFn(FormatService.format("^.2g"))
                            .axis(xAxis.orientation("bottom").offset(30).tickFormat(FormatService.format("^.1g"))),
                        yAxis = PlotService.createAxis(),
                        yDim = PlotService.createDimension()
                            .scale("ordinal")
                            .valueFn(getY)
                            .axis(yAxis.offset($scope.maxLabelLen*7.5).tickFormat(getLabel)),
                        margin = PlotService.createMargin(0, 15, 5),
                        bar = PlotService.createBar();

                    return PlotService.createInstance()
                        .content(bar.padding(2))
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
                    var index = gridRow.index;
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
                        $scope.removeGridRow(gridRow);
                    }
                }


                return plot;
            }
        }]);