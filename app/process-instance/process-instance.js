'use strict';
/* Controller for Process LCIA Diagram View */
angular.module('lcaApp.process.instance',
                ['ui.router', 'lcaApp.resources.service', 'lcaApp.status.service',
                 'lcaApp.lciaBar.directive', 'lcaApp.colorCode.service', 'lcaApp.format',
                 'lcaApp.fragmentNavigation.service',
                 'lcaApp.lciaDetail.service', 'lcaApp.models.param', 'lcaApp.models.scenario',
                    'lcaApp.paramGrid.directive'])
    .controller('ProcessInstanceController',
        ['$scope', '$stateParams', '$state', 'StatusService', '$q', '$log', 'ScenarioModelService',
         'ProcessForFlowTypeService', 'ProcessFlowService',
         'LciaMethodService', 'FlowPropertyForProcessService', 'LciaResultForProcessService', 'FragmentFlowService',
         'ColorCodeService', 'FragmentNavigationService', 'MODEL_BASE_CASE_SCENARIO_ID',
         'LciaDetailService', 'ParamModelService', 'PARAM_VALUE_STATUS', 'DIRECTION_CELL_TEMPLATE',
        function ($scope, $stateParams, $state, StatusService, $q, $log, ScenarioModelService,
                  ProcessForFlowTypeService, ProcessFlowService,
                  LciaMethodService, FlowPropertyForProcessService, LciaResultForProcessService, FragmentFlowService,
                  ColorCodeService, FragmentNavigationService, MODEL_BASE_CASE_SCENARIO_ID,
                  LciaDetailService, ParamModelService, PARAM_VALUE_STATUS, DIRECTION_CELL_TEMPLATE) {
            var processID = 0,
                fragmentFlowID = 0,
                fragmentID = 0,
                scenarioID = MODEL_BASE_CASE_SCENARIO_ID,
                processFragmentFlow = null,
                gridFlows = [],
                intermediateFlows = {};

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
                $scope.lciaMethods.forEach(getLciaResult);

            }

            /**
             * Get results from process filtered queries
             */
            function getProcessResults() {
                getFlowRows();
                getLciaResults();
            }

            function getStateParams() {
                var navState = FragmentNavigationService.getLast();
                if (navState) {
                    fragmentID = navState.fragmentID;
                }
                if ("activity" in $stateParams) {
                    $scope.activityLevel = +$stateParams.activity;
                }
                if ("scenarioID" in $stateParams) {
                    scenarioID = +$stateParams.scenarioID;
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
                $scope.scenario = ScenarioModelService.get(scenarioID);
                if ($scope.scenario) {
                    $scope.navigationStates = FragmentNavigationService.setContext(scenarioID,
                        $scope.scenario.topLevelFragmentID).getAll();
                    processFragmentFlow = FragmentFlowService.get(fragmentFlowID);
                    if ( processFragmentFlow) {
                        processID = processFragmentFlow.processID;
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
                $scope.lciaMethods = LciaMethodService.getAll().filter( function (m) {
                    return m.getIsActive();
                });
                if (processID) {
                    getDataFilteredByProcess();
                }
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
                    ProcessForFlowTypeService.load({flowTypeID:2}),
                    LciaMethodService.load(),
                    FragmentFlowService.load({scenarioID: scenarioID, fragmentID: fragmentID}),
                    ParamModelService.load(scenarioID)])
                    .then(handleSuccess,
                    StatusService.handleFailure);
            }

            function defineGridColumns() {
                $scope.columns = [
                    {field: 'flowName', displayName: 'Flow Name', enableCellEdit: false},
                    {field: 'direction', displayName: 'Direction', cellTemplate: DIRECTION_CELL_TEMPLATE,
                        enableCellEdit: false, width: 65},
                    {field: 'quantity', displayName: 'Quantity', enableCellEdit: false},
                    {field: 'magnitude', displayName: 'Magnitude', enableCellEdit: false},
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
                    gridFlow.magnitude = intermediateFlow.quantity * $scope.activityLevel;
                    gridFlow.unit = intermediateFlow.unit;
                }
                gridFlow.paramWrapper = ParamModelService.wrapParam(paramResource);
                gridFlows.push(gridFlow);
            }

            function extractFragmentFlowData( ) {
                var fragmentFlows = FragmentFlowService.getAll(),
                    processFlows = fragmentFlows.filter(isProcessFragmentFlow);

                gridFlows = [];
                processFlows.forEach( addGridFlow);
                $scope.gridFlows = gridFlows;
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

            $scope.lciaResults = {};
            $scope.panelHeadingStyle = {};
            $scope.activityLevel = 1;
            getStateParams();
            StatusService.startWaiting();
            getData();

        }]);