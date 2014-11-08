'use strict';
/* Controller for Process LCIA Diagram View */
angular.module('lcaApp.process.LCIA',
                ['ui.router', 'lcaApp.resources.service', 'angularSpinner', 'ui.bootstrap.alert'])
    .controller('ProcessLciaCtrl',
        ['$scope', '$stateParams', 'usSpinnerService', '$q', '$window',
         'ScenarioService',
        'ProcessForFlowTypeService', 'ProcessFlowService',
        'LciaMethodService', 'FlowPropertyForProcessService', 'LciaResultForProcessService',
        function ($scope, $stateParams, usSpinnerService, $q, $window,
                  ScenarioService,
                  ProcessForFlowTypeService, ProcessFlowService,
                  LciaMethodService, FlowPropertyForProcessService, LciaResultForProcessService) {
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
             *  Display LCIA results provided by LCIA Result Service
             * @param {{lciaMethodID : Number, lciaScore : Array }} result
             */
            function displayLciaResult(result) {
                $scope.lciaResults[result.lciaMethodID] =
                    { cumulativeResult : result.lciaScore[0].cumulativeResult };
            }

            function getLciaResult(lciaMethod) {
                LciaResultForProcessService
                    .get({scenarioID: scenarioID, lciaMethodID: lciaMethod.lciaMethodID, processID:processID},
                    displayLciaResult);
            }

            function getLciaResults() {
                stopWaiting();  // Results will appear as they are processed
                $scope.lciaMethods.forEach(getLciaResult);

            }

            function getResults() {
                getFlowRows();
                $scope.lciaMethods = LciaMethodService.getAll();
                getLciaResults();
            }

            /**
             * Function called after requests for resources have been fulfilled.
             */
            function handleSuccess() {
                $scope.scenario = ScenarioService.get(scenarioID);
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

            $scope.process = null;
            $scope.scenario = null;
            $scope.activityLevel = $stateParams.activity;
            $scope.elementaryFlows = {};
            $scope.inputFlows = [];
            $scope.outputFlows = [];
            $scope.lciaResults = {};
            startWaiting();
            getData();

        }]);