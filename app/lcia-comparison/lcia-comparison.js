'use strict';
/**
 * @ngdoc controller
 * @name lcaApp.LCIA.comparison:LciaComparisonController
 * @description
 * Controller for LCIA comparison view
 */
angular.module("lcaApp.LCIA.comparison",
    ["ui.router", "lcaApp.resources.service", "lcaApp.status.service", "ngGrid", "lcaApp.plot", "lcaApp.format",
        "lcaApp.models.lcia", "lcaApp.models.scenario", "lcaApp.selection.service", "ngCsv"])
    .controller("LciaComparisonController",
    ["$scope", "$stateParams", "$state", "StatusService", "$q", "PlotService", "FormatService",
        "FragmentService", "LciaMethodService", "ProcessForFlowTypeService",
        "ScenarioModelService", "LciaModelService", "SelectionService",
        function ($scope, $stateParams, $state, StatusService, $q, PlotService, FormatService,
                  FragmentService, LciaMethodService, ProcessForFlowTypeService,
                  ScenarioModelService, LciaModelService, SelectionService) {

            $scope.selection = createSelectionComponent();
            $scope.gridData = [];
            $scope.gridOpts = createGrid();
            $scope.lciaMethods = [];    // Active LCIA methods
            $scope.maxLabelLen = 7;
            $scope.plot = createPlot();
            $scope.$on("$destroy", $scope.selection.savePrevious);
            $scope.csv = createCsvComponent();
            $scope.canAdd = false;      // use to disable Add button until after initial data load
            //
            // Workaround - directive unable to read nested properties
            $scope.csvHeader = $scope.csv.header;
            $scope.csvFileName = $scope.csv.fileName;

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

            /**
             * Remove row from plot data and grid data.
             * @param { object } r  Grid data record
             */
            $scope.removeGridRow = function(r) {
                var rows = $scope.gridData,
                    index = r.index;
                $scope.plot.removeRow(index);
                rows.splice(index, 1);
                for (var i=index; i < rows.length; ++i) {
                    --(rows[i].index);
                }
            };

            getData();

            function getData() {
                StatusService.startWaiting();
                $q.all([ScenarioModelService.load(), FragmentService.load(), ProcessForFlowTypeService.load({flowTypeID:2}),
                    LciaMethodService.load()]).then(
                    displayData, StatusService.handleFailure);
            }

            function displayData() {
                StatusService.stopWaiting();
                $scope.selection.displayData();
                $scope.lciaMethods = LciaMethodService.getAll().filter( function (m) {
                    return m.getIsActive();
                });
                $scope.plot.addConfig();
                addGridData();
                $scope.canAdd = true;
            }

            function addGridData() {
                $scope.selection.restorePrevious();
                if ($scope.gridData.length) {
                    $scope.gridData.forEach($scope.plot.getResult);
                } else {
                    addGridRow();
                }
            }

            /**
             * Add grid data record with current selections and request LCIA results.
             */
            function addGridRow() {
                var row = {
                        componentType : $scope.selection.type,
                        index : $scope.gridData.length,
                        scenario: $scope.selection.scenario,
                        activityLevel : $scope.selection.activityLevel,
                        chartLabel : $scope.selection.chartLabel
                    };
                row.scenarioRef = "home.scenario({scenarioID: " + row.scenario.scenarioID + "})";
                if ( $scope.selection.isFragment() ) {
                    row.fragmentID = $scope.selection.fragment.fragmentID;
                    row.componentName = $scope.selection.fragment.name;
                    row.componentRef = "home.fragment-lcia({fragmentID: row.entity.fragmentID, scenarioID: row.entity.scenario.scenarioID})";

                } else {
                    row.processID = $scope.selection.process.processID;
                    row.componentName = $scope.selection.process.getLongName();
                    row.componentRef = "home.process-lcia({processID: row.entity.processID, scenarioID: row.entity.scenario.scenarioID, activity: row.entity.activityLevel})";
                }
                $scope.gridData.push(row);
                $scope.plot.getResult(row);
                resetInput();
            }

            function resetInput() {
                $scope.selection.chartLabel = null;
            }

            /**
             * Create module for handling selections
             * @returns { object }
             */
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
                        restorePrevious : restorePrevious,
                        savePrevious : savePrevious,
                        activityLevel : 1,
                        chartLabel: null,
                        key : "LciaComparisonGrid"
                };

                return selection;

                /**
                 * Populate select controls
                 */
                function displayData() {
                    selection.fragmentOptions = FragmentService.getAll();
                    selection.processOptions = ProcessForFlowTypeService.getAll();
                    selection.scenarioOptions = ScenarioModelService.getAll();
                    if (selection.scenarioOptions.length) {
                        selection.scenario = ScenarioModelService.getActiveScenario();
                        if (selection.fragmentOptions.length) {
                            selection.fragment = FragmentService.get(selection.scenario.topLevelFragmentID);
                        }
                        if (selection.processOptions.length) {
                            selection.processOptions.sort(ProcessForFlowTypeService.compareByName);
                            selection.process = selection.processOptions[0];
                        }
                    }
                }

                function isFragment() {
                    return selection.type === "Fragment";
                }

                /**
                 * If returning to this view, restore grid contents from prior visit
                 */
                function restorePrevious() {
                    if ( SelectionService.contains(selection.key)) {
                        $scope.gridData = SelectionService.get(selection.key);
                    }
                }

                /**
                 * Save grid contents before leaving view
                 */
                function savePrevious() {
                    SelectionService.set(selection.key, $scope.gridData);
                }
            }

            /**
             * Create ng-grid configuration object
             * @returns {{columnDefs: [], data: string, enableRowSelection: boolean, enableCellEditOnFocus: boolean, enableHighlighting: boolean, enableColumnResize: boolean, plugins: []}}
             */
            function createGrid() {
                // Cell templates
                var removeTemplate =
'<button type="button" class="ngCell btn btn-default btn-sm" ng-click="removeGridRow(row.entity)" aria-label="Remove"><span class="glyphicon glyphicon-remove"></span></button>',
                    numTemplate = '<input type="number" step="any" ng-input="COL_FIELD" ng-model="COL_FIELD" />',
                    labelTemplate = '<input type="text" maxlength={{maxLabelLen}} ng-input="COL_FIELD" ng-model="COL_FIELD" />',
                    compTemplate =
'<div class="ngCellText" ng-class="col.colIndex()"><a title="Navigate to LCIA detail view" ui-sref={{row.entity.componentRef}}>{{COL_FIELD}}</a></div>',
                    scenarioTemplate =
'<div class="ngCellText" ng-class="col.colIndex()"><a title="Navigate to scenario detail view" ui-sref="home.scenario({scenarioID: row.entity.scenario.scenarioID})">{{COL_FIELD}}</a></div>',
                    columnDefs = [
                        { field: "componentType", displayName: "Type", width: 100, enableCellEdit: false },
                        { field: "componentName",  cellTemplate: compTemplate, displayName: "Name", enableCellEdit: false },
                        { field: "scenario.name", cellTemplate: scenarioTemplate, displayName: "Scenario", enableCellEdit: false },
                        { field: "activityLevel", cellTemplate: numTemplate, displayName: "Activity Level", enableCellEdit: true },
                        { field: "chartLabel", cellTemplate: labelTemplate, displayName: "Chart Label", enableCellEdit: true },
                        { field: "", cellTemplate: removeTemplate, width: 35, enableCellEdit: false }
                    ],
                    // Plugin for changing grid height to fit all rows
                    //noinspection JSPotentiallyInvalidConstructorUsage
                    resizeGridPlugin = new ngGridFlexibleHeightPlugin();

                return {
                    columnDefs : columnDefs,
                    data: "gridData",   // scope property containing data to be displayed in grid
                    enableRowSelection: false,
                    enableCellEditOnFocus: true,
                    enableHighlighting: true,
                    enableColumnResize: true,
                    plugins: [resizeGridPlugin]
                };
            }

            /**
             * Create module that prepares input to plots
             * @returns {{data: {}, config: null}}
             */
            function createPlot() {
                // Both data and config are associative arrays indexed by lciaMethodID.
                var plot = { data: {}, config: null};

                // Creates plot.config object. Execute after methods have been loaded.
                plot.addConfig = addConfig;

                /**
                 * Request LCIA results for selections in a grid row
                 * @param { object } gridRow
                 */
                plot.getResult = function (gridRow) {
                    StatusService.startWaiting();
                    getLciaResults(gridRow)
                        .then(function (results) {
                            plotRow(gridRow, results)
                        }, StatusService.handleFailure);
                };

                /**
                 * For all active methods, remove plot data record corresponding to a removed grid row
                 * @param { number } index  Grid row index
                 */
                plot.removeRow = function(index) {
                    var data = plot.data;
                    $scope.lciaMethods.forEach( function (m) {
                        if (data.hasOwnProperty(m.lciaMethodID)) {
                            data[m.lciaMethodID].splice(index, 1);
                        }
                    });
                };

                /**
                 * Configure plot for every LCIA method.
                 * Plots have a common configuration except for bar color and unit.
                 */
                function addConfig() {
                    var config = {};

                    $scope.lciaMethods.forEach( function (m) {
                        var mc = createCommonConfig(),
                            barColorScales = m.getColorScales(),
                            barColor = barColorScales.hasOwnProperty("9") ? barColorScales[9][2] : m.getDefaultColor();
                        mc.content().color(barColor);
                        mc.x().unit(m.getReferenceUnit());
                        config[m.lciaMethodID] = mc;
                    });
                    plot.config = config;
                }

                /**
                 * Get x domain value from a plot data record
                 * @param { object } d  Plot data record
                 * @returns {number}    LCIA result * activity level
                 */
                function getX(d) {
                    return d.value * +d.row.activityLevel;
                }

                /**
                 * Get y domain value from a plot data record
                 * @param { object } d  Plot data record
                 * @returns {number}    Grid row index
                 */
                function getY(d) {
                    return d.row.index;
                }

                /**
                 * Get chart label.
                 * @param { number } index  Grid row index
                 * @returns { string }  Grid row chart label, if it exists. Otherwise, index as string.
                 */
                function getLabel(index) {
                    var label = $scope.gridData[index].chartLabel;
                    if (!label) {
                        label = (index + 1).toString();
                    }
                    return label;
                }

                /**
                 * Create a plot configuration that is common to all LCIA methods.
                 * Configured to contain horizontal bars, margins, x axis with linear scale, y axis with ordinal scale.
                 * @returns { PlotService.Config }
                 */
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

                    return PlotService.createConfig()
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

                /**
                 * Put results for added grid row in plot data for each active method.
                 * @param { object } gridRow    Row added to grid
                 * @param { [] } results        Response to request for LCIA results
                 */
                function plotRow(gridRow, results) {
                    StatusService.stopWaiting();
                    var index = gridRow.index;
                    if (results.length) {
                        var data = plot.data,
                            aaResults = {};
                        results.forEach(
                            /**
                             * Put results in associative array to facilitate lookup.
                             * Not every method will have a result.
                             * @param {{ lciaMethodID : number, scenarioID: number, total : number }} r
                             */
                            function(r) {
                                aaResults[r.lciaMethodID] = r.total;
                            }
                        );
                        $scope.lciaMethods.forEach(function (m) {
                            var plotRow = { row : gridRow, value: 0 };
                            if (aaResults.hasOwnProperty(m.lciaMethodID)) {
                                plotRow.value = aaResults[m.lciaMethodID];
                            }
                            if (!data.hasOwnProperty(m.lciaMethodID.toString())) data[m.lciaMethodID] =
                                newArray($scope.gridData.length);
                            data[m.lciaMethodID][index] = plotRow;
                        });
                    } else {
                        StatusService.displayInfo("The fragment is outside the scope of this scenario.");
                        $scope.removeGridRow(gridRow);
                    }
                }


                return plot;
            }

            function createCsvComponent() {
                var allData = [];

                function getHeader() {
                    return ["LCIA Method", "Type", "Name", "Scenario", "Unit Score", "Activity Level", "Total",
                           "Reference Unit", "ILCD Reference"];
                }

                function getData() {
                    allData = [];
                    $scope.lciaMethods.forEach( getMethodData);
                    return allData;

                }

                function getMethodData(m) {
                    var data = $scope.plot.data[m.lciaMethodID];

                    data.forEach(function (d) {
                        var gridRow = d.row,
                            score = d.value;

                        allData.push([m.name, gridRow.componentType, gridRow.componentName, gridRow.scenario.name, score,
                                    gridRow.activityLevel, score * +gridRow.activityLevel,
                                    m.getReferenceUnit(), m.getReferenceLink() ] );
                    });
                }

                return {
                    header : getHeader(),
                    fileName : "LCIA_Comparison.csv",
                    getData : getData
                };
            }

        }]);