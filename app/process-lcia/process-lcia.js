'use strict';
/* Controller for Process LCIA Diagram View */
angular.module('lcaApp.process.LCIA',
                ['ui.router', 'lcaApp.resources.service', 'lcaApp.status.service',
                 'lcaApp.lciaBar.directive', 'lcaApp.colorCode.service', 'lcaApp.format',
                 'lcaApp.fragmentNavigation.service',
                 'lcaApp.lciaDetail.service', 'lcaApp.models.param', 'lcaApp.models.scenario'])
    .controller('ProcessLciaCtrl',
        ['$scope', '$stateParams', '$state', 'StatusService', '$q', '$log', 'ScenarioModelService',
         'ProcessForFlowTypeService', 'ProcessFlowService',
         'LciaMethodService', 'FlowPropertyForProcessService', 'LciaResultForProcessService',
         'ColorCodeService', 'FragmentNavigationService', 'MODEL_BASE_CASE_SCENARIO_ID',
         'LciaDetailService', 'ParamModelService',
        function ($scope, $stateParams, $state, StatusService, $q, $log, ScenarioModelService,
                  ProcessForFlowTypeService, ProcessFlowService,
                  LciaMethodService, FlowPropertyForProcessService, LciaResultForProcessService,
                  ColorCodeService, FragmentNavigationService, MODEL_BASE_CASE_SCENARIO_ID,
                  LciaDetailService, ParamModelService) {
            var processID = 1,
                scenarioID = MODEL_BASE_CASE_SCENARIO_ID;

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

            /**
             * Get results from scenario filtered queries
             */
            function getScenarioResults() {
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
                $scope.scenario = ScenarioModelService.get(scenarioID);
                if ($scope.scenario) {
                    $scope.navigationStates = FragmentNavigationService.setContext(scenarioID,
                        $scope.scenario.topLevelFragmentID).getAll();
                } else {
                    StatusService.handleFailure("Invalid scenario ID : ", scenarioID);
                }
                $scope.process = ProcessForFlowTypeService.get(processID);
                if (!$scope.process) StatusService.handleFailure("Invalid process ID : ", processID);
            }

            /**
             * Prepare view for ui-router state, process-lcia
             * Populate selection controls with scenarios and processes.
             */
            function prepareViewWithSelection() {
                $scope.scenarios = ScenarioModelService.getAll();
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
                    StatusService.handleFailure);
            }

            /**
             * Get data filtered by scenarioID
             */
            function getDataFilteredByScenario() {
                    ParamModelService.load(scenarioID)
                    .then(getScenarioResults,
                    StatusService.handleFailure);
            }

            /**
             * Get all data, except for LCIA results
             */
            function getData() {
                $q.all([ScenarioModelService.load(),
                    ProcessForFlowTypeService.load({flowTypeID:2}),
                    LciaMethodService.load(),
                    ProcessFlowService.load({processID:processID}),
                    FlowPropertyForProcessService.load({processID: processID}),
                    ParamModelService.load(scenarioID)])
                    .then(handleSuccess,
                    StatusService.handleFailure);
            }

            /**
             * Get flow table content
             * For each intermediate process flow, get
             * flow name, magnitude and unit associated with reference flow property.
             */
            function getFlowRows() {
                var processFlows = ProcessFlowService.getAll(),
                    activityLevel = "activityLevel" in $scope ? $scope.activityLevel : 1;

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
                                magnitude: pf.result * activityLevel,
                                unit: fp["referenceUnit"]
                            };
                            if (pf.direction === "Input") {
                                $scope.inputFlows.push(rowObj);
                            } else if (pf.direction === "Output" ) {
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
                ScenarioModelService.setActiveID(scenarioID);
                getDataFilteredByScenario();
            };

            $scope.onProcessChange = function() {
                $scope.process = $scope.selection.process;
                processID = $scope.process.processID;
                getDataFilteredByProcess();
            };

            function getActiveScenarioID() {
                var activeID = ScenarioModelService.getActiveID();
                if (activeID) {
                   scenarioID = activeID;
                }
            }

            $scope.process = null;
            $scope.scenario = null;
            $scope.selection = {};
            $scope.elementaryFlows = {};
            $scope.inputFlows = [];
            $scope.outputFlows = [];
            $scope.lciaResults = {};
            $scope.panelHeadingStyle = {};
            getActiveScenarioID();
            getStateParams();
            StatusService.startWaiting();
            getData();

        }]);