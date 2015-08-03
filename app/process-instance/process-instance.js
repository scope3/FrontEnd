'use strict';
/**
 * @ngdoc controller
 * @name lcaApp.process.instance:ProcessInstanceController
 * @description
 * Controller for Process Instance view
 */
angular.module('lcaApp.process.instance',
                ['ui.router', 'lcaApp.resources.service', 'lcaApp.status.service',
                 'lcaApp.lciaBar.directive', 'lcaApp.colorCode.service', 'lcaApp.format',
                 'lcaApp.fragmentNavigation.service',
                 'lcaApp.lciaDetail.service', 'lcaApp.models.param', 'lcaApp.models.scenario',
                 'lcaApp.referenceLink.directive', 'lcaApp.paramGrid.directive'])
    .controller('ProcessInstanceController',
        ['$scope', '$stateParams', '$state', 'StatusService', '$q', '$log', 'ScenarioModelService',
         'ProcessService', 'ProcessFlowService', 'FlowPropertyMagnitudeService', 'ProcessDissipationService',
         'LciaMethodService', 'FlowPropertyForProcessService', 'LciaResultForProcessService', 'FragmentFlowService',
         'ColorCodeService', 'FragmentNavigationService', 'MODEL_BASE_CASE_SCENARIO_ID',
         'LciaDetailService', 'ParamModelService', 'CompositionFlowService',
        function ($scope, $stateParams, $state, StatusService, $q, $log, ScenarioModelService,
                  ProcessService, ProcessFlowService, FlowPropertyMagnitudeService, ProcessDissipationService,
                  LciaMethodService, FlowPropertyForProcessService, LciaResultForProcessService, FragmentFlowService,
                  ColorCodeService, FragmentNavigationService, MODEL_BASE_CASE_SCENARIO_ID,
                  LciaDetailService, ParamModelService, CompositionFlowService) {
            var processID = 0,
                fragmentFlowID = 0,
                fragmentID = 0,
                scenarioID = MODEL_BASE_CASE_SCENARIO_ID,
                processFragmentFlow = null,
                inputFlows = [], outputFlows = [],
                fragmentActivityLevel = 1;

            /**
             * Function to determine if Apply Changes button should be enabled.
             * @returns {boolean}
             */
            $scope.canApply = function () {
                return ($scope.scenario &&
                ScenarioModelService.canUpdate($scope.scenario) &&
                ParamModelService.canApplyChanges( $scope.fragmentFlows));
            };
            /**
             * Function to determine if Revert Changes button should be enabled.
             * @returns {boolean}
             */
            $scope.canRevert = function () {
                return ($scope.scenario &&
                ScenarioModelService.canUpdate($scope.scenario) &&
                ParamModelService.canRevertChanges( $scope.fragmentFlows));
            };
            $scope.canReturn = function () {
                return ParamModelService.canAbandonChanges($scope.fragmentFlows);
            };

            /**
             * Gather changes and apply
             */
            $scope.applyChanges = function () {
                StatusService.startWaiting();
                ParamModelService.applyFragmentFlowParamChanges($scope.scenario.scenarioID, $scope.fragmentFlows,
                    refreshFragmentFlowParams, StatusService.handleFailure);
            };

            $scope.revertChanges = function () {
                ParamModelService.revertChanges($scope.fragmentFlows);
            };

            /**
             * Set fragment navigation state, and
             * go back to fragment sankey view
             * @param navIndex  Index to fragment navigation state selected by user
             */
            $scope.goBackToFragment = function(navIndex) {
                var context = FragmentNavigationService.getContext();
                FragmentNavigationService.setLast(navIndex);
                $state.go('^', {
                    scenarioID: context.scenarioID,
                    fragmentID: context.fragmentID
                });
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
            $scope.fragmentFlows = [];
            $scope.paramGrid = {};
            $scope.lciaResults = {};
            $scope.panelHeadingStyle = {};
            $scope.activityLevel = 1;
            $scope.lciaMsg = "";
            $scope.flowsVisible = true;
            getStateParams();
            getData();

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
                // Results will appear as they are processed
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
                StatusService.stopWaiting();

                getFlowRows();
                if ( $scope.paramGrid.dissipation) {
                    $scope.compositionFlow = CompositionFlowService.get($scope.process.compositionFlowID);
                    $scope.paramGrid.dissipation.extractData();
                }
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
                        StatusService.handleFailure("Invalid fragmentFlowID : " + fragmentFlowID);
                    }
                } else {
                    StatusService.handleFailure("Invalid scenario ID : " + scenarioID);
                }
            }

            /**
             * Function called after requests for resources have been fulfilled.
             */
            function handleSuccess() {
                StatusService.stopWaiting();
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
                var requests = [
                    ProcessFlowService.load({processID:processID}),
                    FlowPropertyForProcessService.load({processID: processID})
                ];
                if ($scope.process && $scope.process["compositionFlowID"]) {
                    var flowID = $scope.process["compositionFlowID"];
                    requests.push(ProcessDissipationService.load({processID: processID }));
                    requests.push(FlowPropertyMagnitudeService.load({flowID: flowID }));
                    requests.push(CompositionFlowService.load());
                    $scope.paramGrid.dissipation = createProcessDissipationParamGrid();
                }
                StatusService.startWaiting();
                $q.all(requests)
                    .then(getProcessResults,
                    StatusService.handleFailure);
            }

            /**
             * Get all data, except for LCIA results
             */
            function getData() {
                StatusService.startWaiting();
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
                    {field: 'name', displayName: 'Name', enableCellEdit: false},
                    {field: 'direction', displayName: 'Direction', enableCellEdit: false, width: 70},
                    {field: 'quantity', displayName: 'Quantity', cellFilter: 'numFormat', enableCellEdit: false},
                    {field: 'magnitude', displayName: 'Magnitude', cellFilter: 'numFormat', enableCellEdit: false, width: 120},
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

            function getFirstFlowProperty(ff) {
                var fpID = ff.flowPropertyMagnitudes[0]["flowPropertyID"];
                return FlowPropertyForProcessService.get(fpID);
            }

            /**
             * Create object for grid row
             * @param {{ fragmentFlowID: Number, name: String, nodeType: String, flowID: Number,
             *          direction: String, parentFragmentFlowID : * , flowPropertyMagnitudes: []
             *      } } ff   Fragment flow resource
             */
            function addGridFlow(ff) {
                var paramResource = ParamModelService.getFragmentFlowParam(scenarioID, ff.fragmentFlowID),
                    ffName = ff.nodeType == "Cutoff" ? "(cutoff) " + ff.name : ff.name,
                    gridFlow = { fragmentFlowID : ff.fragmentFlowID, direction : ff.direction, name : ffName } ,
                    nodeWeight = processFragmentFlow.hasOwnProperty("nodeWeight") ? processFragmentFlow.nodeWeight : 1;
                
                if (paramResource) {
                    gridFlow.quantity = paramResource.defaultValue;
                }
                if (ff.hasOwnProperty("flowPropertyMagnitudes") && ff.flowPropertyMagnitudes.length > 0  ) {
                    var ffMagnitude = ff.flowPropertyMagnitudes[0].magnitude;
                    gridFlow.quantity =  gridFlow.hasOwnProperty("quantity") ?
                                            gridFlow.quantity : ffMagnitude / nodeWeight;
                    gridFlow.magnitude = ffMagnitude * fragmentActivityLevel;
                    gridFlow.unit = getFirstFlowProperty(ff)["referenceUnit"];
                }
                if (ff.fragmentFlowID === processFragmentFlow.fragmentFlowID ) {
                    gridFlow.direction = (ff.direction === "Input") ? "Output" : "Input";
                    gridFlow.paramWrapper = ParamModelService.naParam("reference");
                } else if (ff["isBalanceFlow"]) {
                    gridFlow.paramWrapper = ParamModelService.naParam("balance");
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
                $scope.fragmentFlows = inputFlows.concat(outputFlows);
            }

            function refreshFragmentFlowParams() {
                $q.all([
                    FragmentFlowService.reload({scenarioID: scenarioID, fragmentID: fragmentID}),
                    ParamModelService.load(scenarioID)])
                    .then(updateParamGrid,
                    StatusService.handleFailure);
            }
            /**
             * Get elementary flows referenced in process LCIA result legends and
             * populate fragment flow grid.
             */
            function getFlowRows() {
                var processFlows = ProcessFlowService.getAll();

                $scope.elementaryFlows = {};
                $scope.flowsVisible = processFlows.length > 0;
                if ($scope.flowsVisible) {
                    processFlows.forEach( function (pf) {
                        if (pf.flow.flowTypeID === 2) {
                            $scope.elementaryFlows[pf.flow.flowID] = pf.flow;
                        }
                    });
                    defineGrids();
                    extractFragmentFlowData();
                }
            }

            /**
             * Function module that defines and controls Process Dissipation Param Grid
             * @returns {{data: Array, columns: *[], params: {targetIndex: number, canUpdate: (*|boolean)}}}
             */
            function createProcessDissipationParamGrid() {
                var canUpdate = ScenarioModelService.canUpdate($scope.scenario),
                    gridData = [], // Private var to hold rows as they added. Prevents directive from seeing data until its all there
                    grid = {
                        data: [],
                        columns: [
                            {field: 'flowPropertyName', displayName: 'Flow Property', enableCellEdit: false},
                            {field: 'dissipationFactor', displayName: 'Dissipation Factor', enableCellEdit: false},
                            {field: 'scale', displayName: 'Scale', cellFilter: 'numFormat', enableCellEdit: false},
                            {field: 'flowName', displayName: 'Emission', enableCellEdit: false}
                        ],
                        params: {targetIndex: 1, canUpdate: canUpdate}
                    };

                grid.canApply = function () {
                    return ParamModelService.canApply( $scope.scenario, grid.data);
                };

                grid.canRevert = function () {
                    return ParamModelService.canRevert(  $scope.scenario, grid.data);
                };
                /**
                 * Gather changes and apply
                 */
                grid.applyChanges = function () {
                    var changedParams = ParamModelService.getChangedData(grid.data);
                    StatusService.startWaiting();
                    return ParamModelService.updateResources($scope.scenario.scenarioID, changedParams.map(changeParam),
                        handleAppliedChanges, StatusService.handleFailure);
                };

                grid.revertChanges = function () {
                    return ParamModelService.revertChanges( grid.data);
                };

                grid.extractData = function () {
                    var dissipationFlows = ProcessDissipationService.getAll();
                    dissipationFlows.forEach(addGridRow);
                    grid.data = gridData;
                };

                function handleAppliedChanges() {
                    ParamModelService.load(scenarioID)
                        .then(updateResults,
                        StatusService.handleFailure);
                }

                function updateResults() {
                    StatusService.stopWaiting();
                    grid.data.forEach(updateGridRow);
                    $scope.lciaResults = {};
                    getLciaResults();
                }

                function updateGridRow(row) {
                    row.paramWrapper = ParamModelService.wrapParam(
                        ParamModelService.getProcessFlowParam(scenarioID, processID, row.emissionFlowID, 6));
                }

                /**
                 * Create row from process dissipation resource and add it to grid.
                 * If a related resource is missing, log error to console and skip record.
                 * @param {{dissipationFactor: number, flowPropertyID: number, scale: number, emissionFlowID: number}} df
                 */
                function addGridRow(df) {
                    var errMsg = null, row = null;
                    if (df.flowPropertyID) {
                        var fp = FlowPropertyMagnitudeService.get(df.flowPropertyID);
                        if (fp && fp["flowProperty"]) {
                            fp = fp["flowProperty"];
                            if (df.emissionFlowID) {
                                var ef = $scope.elementaryFlows[df.emissionFlowID];
                                if (ef) {
                                    var param = ParamModelService.getProcessFlowParam(scenarioID, processID, ef.flowID, 6),
                                        wrappedParam = ParamModelService.wrapParam(param);
                                    row = df;
                                    row.flowPropertyName = fp.name;
                                    row.paramWrapper = wrappedParam;
                                    row.flowName = ef.name;

                                } else {
                                    errMsg = "Emission flow was not found.";
                                }
                            } else {
                                errMsg = "Missing emissionFlowID.";
                            }
                        } else {
                            errMsg = "Flow property was not found.";
                        }
                    } else {
                        errMsg = "Missing flowPropertyID.";
                    }
                    if (row){
                        gridData.push(row);
                    } else {
                        $log.error("Skipping process dissipation resource...");
                        $log.error(JSON.stringify(df));
                        if (errMsg) {
                            $log.error(errMsg);
                        }
                    }
                }

                /**
                 * Apply param change to resource
                 * @param {{ emissionFlowID: number, flowID : number, paramWrapper : object }} row Record containing change
                 * @returns {*} New or updated param resource
                 */
                function changeParam(row) {
                    var paramResource = ParamModelService.changeExistingParam(row.paramWrapper);
                    if (!paramResource) {
                        paramResource = {
                            scenarioID : $scope.scenario.scenarioID,
                            processID : $scope.process.processID,
                            flowID : row.emissionFlowID,
                            value: +row.paramWrapper.value,
                            paramTypeID: 6
                        };
                    }
                    return paramResource;
                }

                return grid;
            }


        }]);