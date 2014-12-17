'use strict';
/* Controller for Process LCIA Diagram View */
angular.module('lcaApp.process.LCIA',
                ['ui.router', 'lcaApp.resources.service', 'angularSpinner', 'ui.bootstrap.alert',
                 'lcaApp.lciaBar.directive', 'lcaApp.colorCode.service', 'lcaApp.format',
                 'lcaApp.fragmentNavigation.service'])
    .controller('ProcessLciaCtrl',
        ['$scope', '$stateParams', '$state', 'usSpinnerService', '$q', 'ScenarioService',
         'ProcessForFlowTypeService', 'ProcessFlowService',
         'LciaMethodService', 'FlowPropertyForProcessService', 'LciaResultForProcessService',
         'ColorCodeService', 'FragmentNavigationService',
        function ($scope, $stateParams, $state, usSpinnerService, $q, ScenarioService,
                  ProcessForFlowTypeService, ProcessFlowService,
                  LciaMethodService, FlowPropertyForProcessService, LciaResultForProcessService,
                  ColorCodeService, FragmentNavigationService) {
            var processID = $stateParams.processID,
                scenarioID = $stateParams.scenarioID;

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
                var positiveResults = [],
                    positiveSum = 0,
                    lciaMethod = LciaMethodService.get(result.lciaMethodID),
                    colors = ColorCodeService.getImpactCategoryColors(lciaMethod["impactCategoryID"]);

                if (result.lciaScore[0].lciaDetail.length > 0) {
                    positiveResults = result.lciaScore[0].lciaDetail
                        .filter(function (el) {
                            return el.result > 0;
                        });
                    positiveResults.forEach( function (p) {
                        p.result = p.result * $scope.activityLevel;
                        positiveSum += p.result;
                    });
                    // Default color for method looks bad with colors in bar chart. Keep default heading color.
                    $scope.panelHeadingStyle[lciaMethod.lciaMethodID] = {};
                }
                else {
                    $scope.panelHeadingStyle[lciaMethod.lciaMethodID] = {'background-color' : lciaMethod.getDefaultColor()};
                }

                $scope.lciaResults[lciaMethod.lciaMethodID] =
                {   cumulativeResult : (result.lciaScore[0].cumulativeResult * $scope.activityLevel).toPrecision(4),
                    positiveResults : positiveResults,
                    positiveSum : positiveSum,
                    colors : colors
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

            function getResults() {
                getFlowRows();
                $scope.lciaMethods = LciaMethodService.getAll().filter( function (m) {
                    return m.getIsActive();
                });
                getLciaResults();
            }

            function getActivityLevel() {
                if ("activity" in $stateParams) {
                    $scope.activityLevel = +$stateParams.activity;
                    return true;
                } else {
                    handleFailure("Activity parameter is missing.");
                    return false;
                }
            }

            /**
             * Function called after requests for resources have been fulfilled.
             */
            function handleSuccess() {
                $scope.scenario = ScenarioService.get(scenarioID);
                $scope.navigationService = FragmentNavigationService.setContext(scenarioID,
                                                                                $scope.scenario.topLevelFragmentID);
                $scope.process = ProcessForFlowTypeService.get(processID);
                if ($scope.scenario) {
                    if ($scope.process) {
                        getResults();
                    } else {
                        handleFailure("Invalid process ID : ", processID);
                    }
                } else {
                    handleFailure("Invalid scenario ID : ", scenarioID);
                }
            }

            /**
             * Get all data resources
             */
            function getData() {
                $q.all([ScenarioService.load(),
                    ProcessForFlowTypeService.load({flowTypeID:2}),
                    ProcessFlowService.load({processID:processID}),
                    LciaMethodService.load(),
                    FlowPropertyForProcessService.load({processID: processID})])
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
                $scope.flowsVisible = processFlows.length > 0;
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
                $state.go('fragment-sankey', {scenarioID: scenarioID,
                    fragmentID: $scope.scenario.topLevelFragmentID});
            };

            $scope.process = null;
            $scope.scenario = null;
            $scope.elementaryFlows = {};
            $scope.inputFlows = [];
            $scope.outputFlows = [];
            $scope.lciaResults = {};
            $scope.panelHeadingStyle = {};
            if (getActivityLevel()) {
                startWaiting();
                getData();
            }
        }]);