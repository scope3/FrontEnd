'use strict';
/* Controller for Process Instance View */
angular.module('lcaApp.process.instance',
                ['ui.router', 'lcaApp.resources.service', 'lcaApp.status.service',
                 'lcaApp.lciaBar.directive', 'lcaApp.colorCode.service', 'lcaApp.format',
                 'lcaApp.fragmentNavigation.service',
                 'lcaApp.lciaDetail.service', 'lcaApp.models.param', 'lcaApp.models.scenario',
                    'lcaApp.paramGrid.directive'])
    .controller('ProcessInstanceController',
        ['$scope', '$stateParams', '$state', 'StatusService', '$q', '$log', 'ScenarioModelService',
         'ProcessService', 'ProcessFlowService',
         'LciaMethodService', 'FlowPropertyForProcessService', 'LciaResultForProcessService', 'FragmentFlowService',
         'ColorCodeService', 'FragmentNavigationService', 'MODEL_BASE_CASE_SCENARIO_ID',
         'LciaDetailService', 'ParamModelService',
        function ($scope, $stateParams, $state, StatusService, $q, $log, ScenarioModelService,
                  ProcessService, ProcessFlowService,
                  LciaMethodService, FlowPropertyForProcessService, LciaResultForProcessService, FragmentFlowService,
                  ColorCodeService, FragmentNavigationService, MODEL_BASE_CASE_SCENARIO_ID,
                  LciaDetailService, ParamModelService) {
            var processID = 0,
                fragmentFlowID = 0,
                fragmentID = 0,
                scenarioID = MODEL_BASE_CASE_SCENARIO_ID,
                processFragmentFlow = null,
                inputFlows = [], outputFlows = [],
                intermediateFlows = {},
                fragmentActivityLevel = 1;

            /**
             * Function to determine if Apply Changes button should be enabled.
             * @returns {boolean}
             */
            $scope.canApply = function () {
                return ($scope.scenario &&
                ScenarioModelService.canUpdate($scope.scenario) &&
                ParamModelService.canApplyChanges( $scope.gridFlows));
            };
            /**
             * Function to determine if Revert Changes button should be enabled.
             * @returns {boolean}
             */
            $scope.canRevert = function () {
                return ($scope.scenario &&
                ScenarioModelService.canUpdate($scope.scenario) &&
                ParamModelService.canRevertChanges( $scope.gridFlows));
            };
            $scope.canReturn = function () {
                return ParamModelService.canAbandonChanges($scope.gridFlows);
            };

            /**
             * Gather changes and apply
             */
            $scope.applyChanges = function () {
                StatusService.startWaiting();
                ParamModelService.applyFragmentFlowParamChanges($scope.scenario.scenarioID, $scope.gridFlows,
                    refreshFragmentFlowParams, StatusService.handleFailure);
            };

            $scope.revertChanges = function () {
                ParamModelService.revertChanges($scope.gridFlows);
            };

            /**
             * Extract LCIA results
             * @param {{ lciaMethodID : Number, lciaScore : Array }} result
             */
            function extractResult(result) {
                var lciaDetail = null,
                    lciaMethod = LciaMethodService.get(result.lciaMethodID),
                    colors = ColorCodeService.getImpactCategoryColors(lciaMethod["impactCategoryID"]),
                    activityLevel = $scope.activityLevel;

                if (result.lciaScore[0].lciaDetail.length > 0) {
                    lciaDetail = LciaDetailService.createInstance();
                    lciaDetail.colors(colors)
                        .activityLevel(activityLevel)
                        .scenarioID(scenarioID)
                        .processID(processID)
                        .lciaMethodID(result.lciaMethodID)
                        .resultDetails(result.lciaScore[0].lciaDetail)
                        .prepareBarChartData();
                    // Default color for method looks bad with colors in bar chart. Keep default heading color.
                    $scope.panelHeadingStyle[lciaMethod.lciaMethodID] = {};
                }
                else {
                    $scope.panelHeadingStyle[lciaMethod.lciaMethodID] = {'background-color' : lciaMethod.getDefaultColor()};
                }

                $scope.lciaResults[lciaMethod.lciaMethodID] =
                {   cumulativeResult : (result.lciaScore[0].cumulativeResult * activityLevel).toPrecision(4),
                    detail : lciaDetail
                };
            }

            function getLciaResult(lciaMethod) {
                LciaResultForProcessService
                    .get({scenarioID: scenarioID, lciaMethodID: lciaMethod.lciaMethodID, processID:processID},
                    extractResult);
            }

            function getLciaResults() {
                StatusService.stopWaiting();  // Results will appear as they are processed
                if ($scope.process["hasElementaryFlows"]) {
                    $scope.lciaMethods = LciaMethodService.getAll().filter(function (m) {
                        return m.getIsActive();
                    });
                    $scope.lciaMethods.forEach(getLciaResult);
                } else {
                    $scope.lciaMsg = "The current process has no elementary flows.";
                }
            }

            /**
             * Get results from process filtered queries
             */
            function getProcessResults() {
                getFlowRows();
                getLciaResults();
            }

            function getStateParams() {
                if ("activity" in $stateParams) {
                    $scope.activityLevel = +$stateParams.activity;
                }
                if ("scenarioID" in $stateParams) {
                    scenarioID = +$stateParams.scenarioID;
                }
                if ("fragmentID" in $stateParams) {
                    fragmentID = +$stateParams.fragmentID;
                }
                if ("fragmentFlowID"in $stateParams) {
                    fragmentFlowID = +$stateParams.fragmentFlowID;
                }
            }

            /**
             * Prepare view for ui-router state, fragment-sankey.process
             * Display scenario, fragment navigation state, and process from selected fragment node.
             */
            function prepareViewWithFragmentNavigation() {
                var navState;

                $scope.scenario = ScenarioModelService.get(scenarioID);
                if ($scope.scenario) {
                    $scope.navigationStates = FragmentNavigationService.setContext(scenarioID,
                        $scope.scenario.topLevelFragmentID).getAll();
                    navState = FragmentNavigationService.getLast();
                    if (navState && navState.hasOwnProperty("activityLevel")) {
                        fragmentActivityLevel = navState.activityLevel;
                    }
                    processFragmentFlow = FragmentFlowService.get(fragmentFlowID);
                    if ( processFragmentFlow) {
                        processID = processFragmentFlow.processID;
                        $scope.process = ProcessService.get(processID);
                    }
                    else {
                        StatusService.handleFailure("Invalid fragmentFlowID : ", fragmentFlowID);
                    }
                } else {
                    StatusService.handleFailure("Invalid scenario ID : ", scenarioID);
                }
            }

            /**
             * Function called after requests for resources have been fulfilled.
             */
            function handleSuccess() {
                prepareViewWithFragmentNavigation();
                if (processID) {
                    getDataFilteredByProcess();
                }
            }

            function updateParamGrid() {
                StatusService.stopWaiting();
                processFragmentFlow = FragmentFlowService.get(fragmentFlowID);
                extractFragmentFlowData();
            }

            /**
             * Get data filtered by processID
             */
            function getDataFilteredByProcess() {
                $q.all([
                    ProcessFlowService.load({processID:processID}),
                    FlowPropertyForProcessService.load({processID: processID})])
                    .then(getProcessResults,
                    StatusService.handleFailure);
            }

            /**
             * Get all data, except for LCIA results
             */
            function getData() {
                $q.all([ScenarioModelService.load(),
                    ProcessService.load(),
                    LciaMethodService.load(),
                    FragmentFlowService.load({scenarioID: scenarioID, fragmentID: fragmentID}),
                    ParamModelService.load(scenarioID)])
                    .then(handleSuccess,
                    StatusService.handleFailure);
            }

            function defineGridColumns() {
                $scope.columns = [
                    {field: 'flowName', displayName: 'Flow Name', enableCellEdit: false},
                    {field: 'direction', displayName: 'Direction', enableCellEdit: false, width: 70},
                    {field: 'quantity', displayName: 'Quantity', enableCellEdit: false},
                    {field: 'magnitude', displayName: 'Magnitude', cellFilter: 'numFormat', enableCellEdit: false},
                    {field: 'unit', displayName: 'Unit', enableCellEdit: false, width: 70}
                ];
            }

            function defineGrids() {
                var canUpdate = ScenarioModelService.canUpdate($scope.scenario);

                defineGridColumns();
                $scope.params = { targetIndex : 2, canUpdate : canUpdate };
            }


            function isProcessFragmentFlow(ff) {
                return ff.fragmentFlowID === processFragmentFlow.fragmentFlowID ||
                    (ff.hasOwnProperty("parentFragmentFlowID") &&
                    ff.parentFragmentFlowID === processFragmentFlow.fragmentFlowID);
            }

            /**
             * Create object for grid row
             * @param {{ fragmentFlowID: Number, shortName: String, nodeType: String, flowID: Number,
             *          direction: String, parentFragmentFlowID : * , flowPropertyMagnitudes: []
             *      } } ff   Fragment flow resource
             */
            function addGridFlow(ff) {
                var paramResource = ParamModelService.getFragmentFlowParam(scenarioID, ff.fragmentFlowID),
                    gridFlow = { fragmentFlowID : ff.fragmentFlowID, direction : ff.direction};

                if (ff.hasOwnProperty("flowID") ) {
                    var intermediateFlow = intermediateFlows[ff.flowID];
                    gridFlow.flowName = intermediateFlow.name;
                    gridFlow.quantity = intermediateFlow.quantity;
                }
                if (ff.hasOwnProperty("flowPropertyMagnitudes") && ff.flowPropertyMagnitudes.length > 0  ) {
                    gridFlow.magnitude = ff.flowPropertyMagnitudes[0].magnitude * fragmentActivityLevel;
                    gridFlow.unit = ff.flowPropertyMagnitudes[0].unit;
                }
                if (ff.fragmentFlowID === processFragmentFlow.fragmentFlowID ) {
                    gridFlow.direction = (ff.direction === "Input") ? "Output" : "Input";
                    gridFlow.paramWrapper = ParamModelService.naParam();
                } else {
                    gridFlow.paramWrapper = ParamModelService.wrapParam(paramResource);
                }
                if (gridFlow.direction === "Input") {
                    inputFlows.push(gridFlow);
                } else {
                    outputFlows.push(gridFlow);
                }
            }

            function extractFragmentFlowData( ) {
                var fragmentFlows = FragmentFlowService.getAll(),
                    processFlows = fragmentFlows.filter(isProcessFragmentFlow);

                inputFlows = [];
                outputFlows = [];
                processFlows.forEach( addGridFlow);
                $scope.gridFlows = inputFlows.concat(outputFlows);
            }

            function refreshFragmentFlowParams() {
                $q.all([
                    FragmentFlowService.reload({scenarioID: scenarioID, fragmentID: fragmentID}),
                    ParamModelService.load(scenarioID)])
                    .then(updateParamGrid,
                    StatusService.handleFailure);
            }
            /**
             * Get flow table content
             * For each intermediate process flow, get
             * flow name, magnitude and unit associated with reference flow property.
             */
            function getFlowRows() {
                var processFlows = ProcessFlowService.getAll();

                $scope.elementaryFlows = {};
                intermediateFlows = {};
                $scope.flowsVisible = processFlows.length > 0;
                if ($scope.flowsVisible) {
                    processFlows.forEach( function (pf) {
                        var rowObj, fp;
                        switch (pf.flow.flowTypeID) {
                            case 1:
                                fp = FlowPropertyForProcessService.get(pf.flow["referenceFlowPropertyID"]);
                                rowObj = {
                                    name: pf.flow.name,
                                    quantity: pf.quantity,
                                    unit: fp["referenceUnit"]
                                };
                                intermediateFlows[pf.flow.flowID] = rowObj;
                                break;
                            case 2:
                                $scope.elementaryFlows[pf.flow.flowID] = pf.flow;
                                break;
                        }
                    });
                    defineGrids();
                    extractFragmentFlowData();
                }
            }

            /**
             * Set fragment navigation state, and
             * go back to fragment sankey view
             * @param navIndex  Index to fragment navigation state selected by user
             */
            $scope.goBackToFragment = function(navIndex) {
                FragmentNavigationService.setLast(navIndex);
                $state.go('^');
            };


            $scope.viewProcessFlowParam = function (lciaMethodID) {
                $state.go(".flow-param",
                    {scenarioID: scenarioID, processID: processID, lciaMethodID: lciaMethodID});
            };


            $scope.process = null;
            $scope.scenario = null;
            $scope.selection = {};
            $scope.elementaryFlows = {};
            $scope.options = { sortInfo: {fields:['direction'], directions:['asc']} };
            $scope.gridFlows = [];
            $scope.lciaResults = {};
            $scope.panelHeadingStyle = {};
            $scope.activityLevel = 1;
            $scope.lciaMsg = "";
            $scope.flowsVisible = true;
            getStateParams();
            StatusService.startWaiting();
            getData();

        }]);