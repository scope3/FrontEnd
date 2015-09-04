'use strict';
/**
 * @ngdoc controller
 * @name lcaApp.LCIA.comparison:LciaComparisonController
 * @description
 * Controller for LCIA comparison view
 */
angular.module("lcaApp.LCIA.comparison",
    ["ui.router", "lcaApp.resources.service", "lcaApp.status.service", "ngGrid", "lcaApp.plot", "lcaApp.format",
        "lcaApp.models.lcia", "lcaApp.models.scenario", "d3", "lcaApp.selection.service"])
    .controller("LciaComparisonController",
    ["$scope", "$stateParams", "$state", "StatusService", "$q", "PlotService", "FormatService",
        "FragmentService", "LciaMethodService", "ProcessForFlowTypeService",
        "ScenarioModelService", "LciaModelService", "d3Service", "SelectionService",
        function ($scope, $stateParams, $state, StatusService, $q, PlotService, FormatService,
                  FragmentService, LciaMethodService, ProcessForFlowTypeService,
                  ScenarioModelService, LciaModelService, d3Service, SelectionService) {

            var resizeGridPlugin = new ngGridFlexibleHeightPlugin();

            $scope.selection = createSelectionComponent();
            $scope.gridData = [];
            $scope.gridOpts = createGrid();
            $scope.lciaMethods = [];
            $scope.maxLabelLen = 7;
            $scope.plot = createPlot();
            $scope.$on("$destroy", $scope.selection.savePrevious);
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
                $scope.lciaMethods = LciaMethodService.getAll();
                $scope.plot.addConfig();
                addGridData();
            }

            function addGridData() {
                $scope.selection.restorePrevious();
                if ($scope.gridData.length) {
                    $scope.gridData.forEach($scope.plot.getResult);
                } else {
                    addGridRow();
                }
            }

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
                    row.componentRef = "home.fragment-lcia({fragmentID: " + row.fragmentID + ", scenarioID: "
                                    + row.scenario.scenarioID + "})";

                } else {
                    row.processID = $scope.selection.process.processID;
                    row.componentName = $scope.selection.process.getLongName();
                    row.componentRef = "home.process-lcia({processID: " + row.processID + ", scenarioID: "
                                    + row.scenario.scenarioID + ", activity: " + row.activityLevel + " })";
                }
                $scope.gridData.push(row);
                $scope.plot.getResult(row);
                resetInput();
            }

            function resetInput() {
                $scope.selection.chartLabel = null;
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
                        restorePrevious : restorePrevious,
                        savePrevious : savePrevious,
                        activityLevel : 1,
                        chartLabel: null,
                        key : "LciaComparisonGrid"
                };

                return selection;

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

                function restorePrevious() {
                    if ( SelectionService.contains(selection.key)) {
                        $scope.gridData = SelectionService.get(selection.key);
                    }
                }

                function savePrevious() {
                    SelectionService.set(selection.key, $scope.gridData);
                }
            }

            function createGrid() {
                var removeTemplate =
'<button type="button" class="ngCell btn btn-default btn-sm" ng-click="removeGridRow(row.entity)" aria-label="Remove"><span class="glyphicon glyphicon-remove"></span></button>',
                    numTemplate = '<input type="number" step="any" ng-input="COL_FIELD" ng-model="COL_FIELD" />',
                    labelTemplate = '<input type="text" maxlength={{maxLabelLen}} ng-input="COL_FIELD" ng-model="COL_FIELD" />',
                    compTemplate =
'<div class="ngCellText" ng-class="col.colIndex()"><a title="Navigate to LCIA detail view" ui-sref={{row.entity.componentRef}}>{{COL_FIELD}}</a></div>',
                    scenarioTemplate =
'<div class="ngCellText" ng-class="col.colIndex()"><a title="Navigate to scenario detail view" ui-sref={{row.entity.scenarioRef}}>{{COL_FIELD}}</a></div>',
                    columnDefs = [
                        { field: "componentType", displayName: "Type", width: 100, enableCellEdit: false },
                        { field: "componentName",  cellTemplate: compTemplate, displayName: "Name", enableCellEdit: false },
                        { field: "scenario.name", cellTemplate: scenarioTemplate, displayName: "Scenario", enableCellEdit: false },
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