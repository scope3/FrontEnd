'use strict';
/* Controller for Process LCIA Diagram View */
angular.module('lcaApp.process.LCIA',
                ['ui.router', 'lcaApp.resources.service', 'angularSpinner', 'ui.bootstrap.alert',
                 'lcaApp.lciaBar.directive', 'lcaApp.colorCode.service', 'lcaApp.format',
                 'lcaApp.fragmentNavigation.service',
                 'lcaApp.lciaDetail.service', 'lcaApp.models.param'])
    .controller('ProcessLciaCtrl',
        ['$scope', '$stateParams', '$state', 'usSpinnerService', '$q', '$log', 'ScenarioService',
         'ProcessForFlowTypeService', 'ProcessFlowService',
         'LciaMethodService', 'FlowPropertyForProcessService', 'LciaResultForProcessService',
         'ColorCodeService', 'FragmentNavigationService', 'MODEL_BASE_CASE_SCENARIO_ID',
         'LciaDetailService', 'ParamService', 'ParamModelService',
        function ($scope, $stateParams, $state, usSpinnerService, $q, $log, ScenarioService,
                  ProcessForFlowTypeService, ProcessFlowService,
                  LciaMethodService, FlowPropertyForProcessService, LciaResultForProcessService,
                  ColorCodeService, FragmentNavigationService, MODEL_BASE_CASE_SCENARIO_ID,
                  LciaDetailService, ParamService, ParamModelService) {
            var processID = 1,
                scenarioID = MODEL_BASE_CASE_SCENARIO_ID;

            function startWaiting() {
                $scope.alert = null;
                usSpinnerService.spin("spinner-lca");
            }

            function stopWaiting() {
                $scope.alert = null;
                usSpinnerService.stop("spinner-lca");
            }

            function handleFailure(errMsg) {
                stopWaiting();
                $scope.alert = { type: "danger", msg: errMsg };
            }

            /**
             * Extract LCIA results
             * @param {{ lciaMethodID : Number, lciaScore : Array }} result
             */
            function extractResult(result) {
                var lciaDetail = null,
                    lciaMethod = LciaMethodService.get(result.lciaMethodID),
                    colors = ColorCodeService.getImpactCategoryColors(lciaMethod["impactCategoryID"]),
                    activityLevel = "activityLevel" in $scope ? $scope.activityLevel : 1;

                if (result.lciaScore[0].lciaDetail.length > 0) {
                    lciaDetail = LciaDetailService.createInstance();
                    lciaDetail.colors(colors)
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
                stopWaiting();  // Results will appear as they are processed
                $scope.lciaMethods.forEach(getLciaResult);

            }

            /**
             * Get results from process filtered queries
             */
            function getProcessResults() {
                getFlowRows();
                getLciaResults();
            }

            /**
             * Get results from scenario filtered queries
             */
            function getScenarioResults() {
                ParamModelService.createModel(scenarioID, ParamService.getAll());
                getLciaResults();
            }

            function getStateParams() {
                if ("activity" in $stateParams) {
                    $scope.activityLevel = +$stateParams.activity;
                }
                if ("scenarioID" in $stateParams) {
                    scenarioID = +$stateParams.scenarioID;
                }
                if ("processID"in $stateParams) {
                    processID = +$stateParams.processID;
                }
            }

            /**
             * Prepare view for ui-router state, fragment-sankey.process
             * Display scenario, fragment navigation state, and process from selected fragment node.
             */
            function prepareViewWithFragmentNavigation() {
                $scope.scenario = ScenarioService.get(scenarioID);
                if ($scope.scenario) {
                    $scope.navigationStates = FragmentNavigationService.setContext(scenarioID,
                        $scope.scenario.topLevelFragmentID).getAll();
                } else {
                    handleFailure("Invalid scenario ID : ", scenarioID);
                }
                $scope.process = ProcessForFlowTypeService.get(processID);
                if (!$scope.process) handleFailure("Invalid process ID : ", processID);
            }

            /**
             * Prepare view for ui-router state, process-lcia
             * Populate selection controls with scenarios and processes.
             */
            function prepareViewWithSelection() {
                $scope.scenarios = ScenarioService.getAll();
                // HTML has multiple scopes
                $scope.selection.scenario = $scope.scenario = $scope.scenarios.find(function (element) {
                    return (element["scenarioID"] === scenarioID);
                });

                var processes = ProcessForFlowTypeService.getAll();
                processes.sort(ProcessForFlowTypeService.compareByName);
                $scope.processes = processes;
                $scope.selection.process = $scope.process = $scope.processes.find(function (element) {
                    return (element["processID"] === processID);
                });

            }

            /**
             * Function called after requests for resources have been fulfilled.
             */
            function handleSuccess() {
                if ($scope.activityLevel) {
                    prepareViewWithFragmentNavigation();
                }
                else {
                    prepareViewWithSelection();
                }
                if ($scope.scenario) {
                    if ($scope.process) {
                        $scope.lciaMethods = LciaMethodService.getAll().filter( function (m) {
                            return m.getIsActive();
                        });
                        getFlowRows();
                        ParamModelService.createModel(scenarioID, ParamService.getAll());
                        getLciaResults();
                    }
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
                    handleFailure);
            }

            /**
             * Get data filtered by scenarioID
             */
            function getDataFilteredByScenario() {
                    ParamService.load({scenarioID:scenarioID})
                    .then(getScenarioResults,
                    handleFailure);
            }

            /**
             * Get all data, except for LCIA results
             */
            function getData() {
                $q.all([ScenarioService.load(),
                    ProcessForFlowTypeService.load({flowTypeID:2}),
                    LciaMethodService.load(),
                    ProcessFlowService.load({processID:processID}),
                    FlowPropertyForProcessService.load({processID: processID}),
                    ParamService.load({scenarioID:scenarioID})])
                    .then(handleSuccess,
                    handleFailure);
            }

            /**
             * Get flow table content
             * For each intermediate process flow, get
             * flow name, magnitude and unit associated with reference flow property.
             */
            function getFlowRows() {
                var processFlows = ProcessFlowService.getAll();
                $scope.elementaryFlows = {};
                $scope.flowsVisible = processFlows.length > 0;
                $scope.inputFlows = [];
                $scope.outputFlows = [];
                processFlows.forEach( function (pf) {
                    var rowObj, fp;
                    switch (pf.flow.flowTypeID) {
                        case 1:
                            fp = FlowPropertyForProcessService.get(pf.flow["referenceFlowPropertyID"]);
                            rowObj = {
                                name: pf.flow.name,
                                magnitude: pf.result,
                                unit: fp["referenceUnit"]
                            };
                            if (pf.directionID === 1) {
                                $scope.inputFlows.push(rowObj);
                            } else if (pf.directionID === 2 ) {
                                $scope.outputFlows.push(rowObj);
                            }
                            break;
                        case 2:
                            $scope.elementaryFlows[pf.flow.flowID] = pf.flow;
                            break;
                    }
                });
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

            $scope.onScenarioChange = function() {
                $scope.scenario = $scope.selection.scenario;
                scenarioID = $scope.scenario.scenarioID;
                getDataFilteredByScenario();
            };

            $scope.onProcessChange = function() {
                $scope.process = $scope.selection.process;
                processID = $scope.process.processID;
                getDataFilteredByProcess();
            };

            $scope.process = null;
            $scope.scenario = null;
            $scope.selection = {};
            $scope.elementaryFlows = {};
            $scope.inputFlows = [];
            $scope.outputFlows = [];
            $scope.lciaResults = {};
            $scope.panelHeadingStyle = {};
            getStateParams();
            startWaiting();
            getData();

        }]);