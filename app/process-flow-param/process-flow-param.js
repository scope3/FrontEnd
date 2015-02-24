'use strict';
/* Controller for Process Flow Param view */
angular.module('lcaApp.process.flowParam',
    ['ui.router', 'lcaApp.resources.service', 'lcaApp.status.service',
        'lcaApp.format', 'lcaApp.paramGrid.directive',
        'lcaApp.lciaDetail.service', 'lcaApp.models.param', 'lcaApp.models.scenario'])
    .controller('ProcessFlowParamCtrl',
    ['$scope', '$stateParams', '$state', 'StatusService', '$q', '$log', 'ScenarioModelService',
        'ProcessForFlowTypeService', 'ProcessFlowService',
        'LciaMethodService', 'LciaResultForProcessService',
        'ParamModelService', 'PARAM_VALUE_STATUS',
        function ($scope, $stateParams, $state, StatusService, $q, $log, ScenarioModelService,
                  ProcessForFlowTypeService, ProcessFlowService,
                  LciaMethodService, LciaResultForProcessService,
                  ParamModelService, PARAM_VALUE_STATUS) {
            var processID = 0,
                scenarioID = 0,
                lciaMethodID = 0;

            $scope.process = null;
            $scope.scenario = null;
            $scope.dissipation = { options: {}, flows: [], columns: [], params: {}};
            $scope.emission = {options: {}, flows: [], columns: [], params: {}};
            $scope.lciaResults = {};
            $scope.allFlows = [];

            /**
             * Function to determine if Apply Changes button should be disabled.
             * @returns {boolean}
             */
            $scope.noValidChanges = function () {
                return !($scope.scenario &&
                    ScenarioModelService.canUpdate($scope.scenario) &&
                    ParamModelService.hasValidChanges( $scope.allFlows));
            };
            /**
             * Gather changes and apply
             */
            $scope.applyChanges = function () {
                var changedParams = $scope.allFlows.filter(function (f) {
                    return f.paramWrapper.editStatus === PARAM_VALUE_STATUS.changed;
                });
                StatusService.startWaiting();
                ParamModelService.updateResources($scope.scenario.scenarioID, changedParams.map(changeParam),
                    goBack, StatusService.handleFailure);
            };

            function goBack() {
                $state.go('^');
            }

            /**
             * Apply param change to resource
             * @param {{ flowID : Number, paramWrapper : {} }} f Record containing change
             * @returns {*} New or updated param resource
             */
            function changeParam(f) {
                var paramResource = f.paramWrapper.paramResource;
                if (paramResource) {
                    if (f.paramWrapper.value) {
                        paramResource.value = +f.paramWrapper.value;
                    } else {
                        paramResource.value = null;
                    }
                }
                else {
                    paramResource = {
                        scenarioID : $scope.scenario.scenarioID,
                        processID : $scope.process.processID,
                        flowID : f.flowID,
                        value: +f.paramWrapper.value
                    };
                    paramResource.paramTypeID = f.hasOwnProperty("dissipation") ? 6 : 8;
                }
                return paramResource;
            }

            function getStateParams() {
                if ("activity" in $stateParams) {
                    $scope.activityLevel = +$stateParams.activity;
                } else {
                    $scope.activityLevel = 1;
                }
                if ("scenarioID" in $stateParams) {
                    scenarioID = +$stateParams.scenarioID;
                }
                if ("processID"in $stateParams) {
                    processID = +$stateParams.processID;
                }
                if ("lciaMethodID" in $stateParams) {
                    lciaMethodID = +$stateParams.lciaMethodID;
                }
            }

            function reportInvalidID(resourceName, id) {
                StatusService.handleFailure(resourceName + " ID, " + id + ", is invalid.");
            }

            /**
             * Function called after requests for resources have been fulfilled.
             */
            function handleSuccess() {
                $scope.scenario = ScenarioModelService.get(scenarioID);
                if ($scope.scenario) {
                    $scope.process = ProcessForFlowTypeService.get(processID);
                    if ($scope.process) {
                        $scope.lciaMethod = LciaMethodService.get(lciaMethodID);
                        if ($scope.lciaMethod) {
                            defineGrids();
                            extractElementaryFlows();
                            LciaResultForProcessService
                                .get({scenarioID: scenarioID, lciaMethodID: lciaMethodID, processID:processID},
                                extractLciaDetails);
                        }
                        else {
                            reportInvalidID("LCIA Method", lciaMethodID);
                        }
                    }
                    else {
                        reportInvalidID("Process", processID);
                    }
                }
                else {
                    reportInvalidID("Scenario", scenarioID);
                }
            }

            /**
             * Get all data, except for LCIA results
             */
            function getData() {
                if ( processID > 0 && lciaMethodID > 0 && scenarioID > 0) {
                    StatusService.startWaiting();
                    $q.all([ScenarioModelService.load(),
                        ProcessForFlowTypeService.load({flowTypeID: 2}),
                        LciaMethodService.load(),
                        ProcessFlowService.load({processID: processID}),
                        ParamModelService.load(scenarioID)])
                        .then(handleSuccess,
                        StatusService.handleFailure);
                } else {
                    StatusService.handleFailure("URL must contain scenarioID, processID, and lciaMethodID.");
                }
            }

            function extractLciaDetails( lciaResult) {
                var lciaDetail = [];

                StatusService.stopWaiting();
                $scope.dissipation.flows = [];
                $scope.emission.flows = [];
                if (lciaResult && lciaResult.hasOwnProperty("lciaScore") && lciaResult.lciaScore.length > 0) {
                    lciaDetail = lciaResult.lciaScore[0].lciaDetail;
                    /**
                     * @param {{ flowID}}
                     */
                    lciaDetail.forEach( function(ld) {
                        var paramResource = null,
                            flow = null;
                        if (ld.hasOwnProperty("flowID") && ld.flowID in $scope.elementaryFlows) {
                            flow = $scope.elementaryFlows[ld.flowID];
                            if (flow.hasOwnProperty("dissipation")) {
                                paramResource = ParamModelService.getProcessFlowParam(scenarioID, processID, ld.flowID, 6);
                                flow.paramWrapper = ParamModelService.wrapParam(paramResource);
                                $scope.dissipation.flows.push(flow);
                            } else {
                                paramResource = ParamModelService.getProcessFlowParam(scenarioID, processID, ld.flowID, 8);
                                flow.paramWrapper = ParamModelService.wrapParam(paramResource);
                                $scope.emission.flows.push(flow);
                            }
                        }
                    });
                    $scope.allFlows = $scope.emission.flows.concat($scope.dissipation.flows);
                }
            }

            function extractElementaryFlows() {
                var processFlows = ProcessFlowService.getAll();

                $scope.elementaryFlows = {};
                processFlows.forEach( function (pf) {
                    if  (pf.flow.flowTypeID === 2) {
                        $scope.elementaryFlows[pf.flow.flowID] = pf.flow;
                        $scope.elementaryFlows[pf.flow.flowID].quantity = pf.quantity;
                        if (pf.hasOwnProperty("dissipation")) {
                            $scope.elementaryFlows[pf.flow.flowID].dissipation = pf.dissipation;
                        }
                    }
                });
            }

            function defineGridColumns() {
                $scope.dissipation.columns = [
                    {field: 'category', displayName: 'Flow Category', enableCellEdit: false},
                    {field: 'name', displayName: 'Flow Name', enableCellEdit: false},
                    {field: 'content', displayName: 'Content', cellFilter: 'numFormat', enableCellEdit: false},
                    {field: 'dissipation', displayName: 'Dissipation Factor', cellFilter: 'numFormat', enableCellEdit: false}
                ];
                $scope.emission.columns = [
                    {field: 'category', displayName: 'Flow Category', enableCellEdit: false},
                    {field: 'name', displayName: 'Flow Name', enableCellEdit: false},
                    {field: 'quantity', displayName: 'Emission Factor', cellFilter: 'numFormat', enableCellEdit: false}
                ];
            }

            function defineGrids() {
                var canUpdate = ScenarioModelService.canUpdate($scope.scenario);
                defineGridColumns();
                $scope.dissipation.params = { targetIndex : 3, canUpdate : canUpdate };
                $scope.emission.params = { targetIndex : 2, canUpdate : canUpdate };
            }

            function getActiveScenarioID() {
                var activeID = ScenarioModelService.getActiveID();
                if (activeID) {
                    scenarioID = activeID;
                }
            }

            getActiveScenarioID();
            getStateParams();
            getData();

        }]);