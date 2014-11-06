'use strict';
/* Controller for Process LCIA Diagram View */
angular.module('lcaApp.process.LCIA',
                ['ui.router', 'lcaApp.resources.service', 'angularSpinner'])
    .controller('ProcessLciaCtrl',
        ['$scope', '$stateParams', 'usSpinnerService', '$q', '$window',
         'ScenarioService', 'ProcessService',
        'ProcessForFlowTypeService', 'ProcessFlowService',
        'LciaMethodService', 'FlowPropertyForProcessService', 'LciaResultForProcessService',
        function ($scope, $stateParams, usSpinnerService, $q, $window,
                  ScenarioService,
                  ProcessForFlowTypeService, ProcessFlowService,
                  LciaMethodService, FlowPropertyForProcessService, LciaResultForProcessService) {
            var processID = $stateParams.processID,
                scenarioID = $stateParams.scenarioID;


            function startWaiting() {
                usSpinnerService.spin("spinner-lca");
            }

            function stopWaiting() {
                usSpinnerService.stop("spinner-lca");
            }

            function handleFailure(errMsg) {
                stopWaiting();
                $window.alert(errMsg);
            }

            function getLciaResults() {
                stopWaiting();
            }

            function getResults() {
                getFlowRows();
                getLciaResults();
            }

            /**
             * Function called after requests for resources have been fulfilled.
             */
            function handleSuccess() {
                $scope.selectedScenario = ScenarioService.get(scenarioID);
                $scope.scenarios = ScenarioService.getSortedObjects();
                $scope.selectedProcess = ProcessForFlowTypeService.get(processID);
                $scope.processes = ProcessForFlowTypeService.getSortedObjects();
                if ($scope.selectedScenario && $scope.selectedProcess) {
                    getResults();
                } else {
                    handleFailure("Invalid route parameters.");
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
             * Get data resources that are filtered by process.
             * Called after process selection changes.
             * If successful, compute process LCIA.
             */
            function getDataForProcess() {
                $q.all([ProcessFlowService.load({processID:processID}),
                    FlowPropertyForProcessService.load({processID: processID})])
                    .then(getResults,
                    handleFailure);
            }

            /**
             * Called when process selection changes.
             */
            $scope.onProcessChange = function () {
                processID = $scope.selectedProcess["processID"];
                startWaiting();
                getDataForProcess();
            };

            /**
             * Called when scenario selection changes.
             */
            $scope.onScenarioChange = function () {
                scenarioID = $scope.selectedScenario["scenarioID"];
                startWaiting();
                getLciaResults();
            };


            /**
             * Get flow table content
             * For each intermediate process flow, get
             * flow name, magnitude and unit associated with reference flow property.
             */
            function getFlowRows() {

                ProcessFlowService.objects.forEach( function (pf) {
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

            $scope.selectedProcess = null;
            $scope.selectedScenario = null;
            $scope.elementaryFlows = {};
            $scope.inputFlows = [];
            $scope.outputFlows = [];
            startWaiting();
            getData();

        }]);