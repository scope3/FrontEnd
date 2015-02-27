'use strict';
/* Controller for Fragment Flow Param view */
angular.module('lcaApp.fragment.flowParam',
    ['ui.router', 'lcaApp.resources.service', 'lcaApp.status.service',
        'lcaApp.format', 'lcaApp.paramGrid.directive',
        'lcaApp.lciaDetail.service', 'lcaApp.models.param', 'lcaApp.models.scenario'])
    .controller('FragmentFlowParamCtrl',
    ['$scope', '$stateParams', '$state', 'StatusService', '$q', '$log', 'ScenarioModelService',
        'FragmentService', 'FragmentFlowService', 'FlowForFragmentService',
        'ParamModelService', 'PARAM_VALUE_STATUS', 'DIRECTION_CELL_TEMPLATE',
        function ($scope, $stateParams, $state, StatusService, $q, $log, ScenarioModelService,
                  FragmentService, FragmentFlowService, FlowForFragmentService,
                  ParamModelService, PARAM_VALUE_STATUS, DIRECTION_CELL_TEMPLATE) {
            var fragmentID = 0,
                scenarioID = 0,
                gridFlows = [];

            $scope.fragment = null;
            $scope.scenario = null;
            $scope.gridFlows = [];

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
                var changedParams = $scope.gridFlows.filter(function (f) {
                    return f.paramWrapper.editStatus === PARAM_VALUE_STATUS.changed;
                });
                StatusService.startWaiting();
                ParamModelService.updateResources($scope.scenario.scenarioID, changedParams.map(changeParam),
                    goBack, StatusService.handleFailure);
            };

            $scope.revertChanges = function () {
                $scope.gridFlows.forEach(function (e) {
                    e.paramWrapper = ParamModelService.wrapParam(e.paramWrapper.paramResource);
                });
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
                        fragmentFlowID : f.fragmentFlowID,
                        value: +f.paramWrapper.value,
                        paramTypeID: 1
                    };
                }
                return paramResource;
            }

            function getStateParams() {
                if ("scenarioID" in $stateParams) {
                    scenarioID = +$stateParams.scenarioID;
                }
                if ("fragmentID"in $stateParams) {
                    fragmentID = +$stateParams.fragmentID;
                }
            }

            function reportInvalidID(resourceName, id) {
                StatusService.handleFailure(resourceName + " ID, " + id + ", is invalid.");
            }

            /**
             * Function called after requests for resources have been fulfilled.
             */
            function handleSuccess() {
                StatusService.stopWaiting();
                $scope.scenario = ScenarioModelService.get(scenarioID);
                if ($scope.scenario) {
                    $scope.fragment = FragmentService.get(fragmentID);
                    if ($scope.fragment) {
                        defineGrids();
                        extractFragmentFlowData();
                    }
                    else {
                        reportInvalidID("Fragment", fragmentID);
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
                if ( fragmentID > 0 &&  scenarioID > 0) {
                    StatusService.startWaiting();
                    $q.all([ScenarioModelService.load(),
                        FragmentService.load(),
                        FragmentFlowService.load({scenarioID: scenarioID, fragmentID: fragmentID}),
                        FlowForFragmentService.load({fragmentID: fragmentID}),
                        ParamModelService.load(scenarioID)])
                        .then(handleSuccess,
                        StatusService.handleFailure);
                } else {
                    StatusService.handleFailure("URL must contain scenarioID and fragmentID.");
                }
            }

            /**
             * Create object for grid row
             * @param {{ fragmentFlowID: Number, shortName: String, nodeType: String, flowID: Number,
             *          direction: String, parentFragmentFlowID : * , flowPropertyMagnitudes: []
             *      } } ff   Fragment flow resource
             */
            function addGridFlow(ff) {
                var paramResource = null,
                    flow = null,
                    parent = null,
                    gridFlow = { fragmentFlowID : ff.fragmentFlowID, name : ff.shortName, nodeType : ff.nodeType,
                                 direction : ff.direction, parentName : "", flowName : "" };
                if (ff.hasOwnProperty("flowID") ) {
                    flow = FlowForFragmentService.get(ff.flowID);
                    gridFlow.flowName = flow.name;
                }
                if (ff.hasOwnProperty("parentFragmentFlowID")) {
                    parent = FragmentFlowService.get(ff.parentFragmentFlowID);
                    if (parent) {
                        gridFlow.parentName = parent["shortName"];
                    }
                }
                if (ff.hasOwnProperty("flowPropertyMagnitudes") && ff.flowPropertyMagnitudes.length > 0  ) {
                    gridFlow.magnitude = ff.flowPropertyMagnitudes[0].magnitude;
                    if (parent && parent.nodeWeight) {
                        gridFlow.magnitude = gridFlow.magnitude/parent.nodeWeight;
                    }
                    gridFlow.unit = ff.flowPropertyMagnitudes[0].unit;
                }
                paramResource = ParamModelService.getFragmentFlowParam(scenarioID, ff.fragmentFlowID);
                gridFlow.paramWrapper = ParamModelService.wrapParam(paramResource);
                gridFlows.push(gridFlow);
            }

            function extractFragmentFlowData( ) {
                var fragmentFlows = FragmentFlowService.getAll();
                fragmentFlows.forEach( addGridFlow);
                $scope.gridFlows = gridFlows;
            }

            function defineGridColumns() {
                $scope.columns = [
                    {field: 'parentName', displayName: 'Parent Node', enableCellEdit: false},
                    {field: 'flowName', displayName: 'Flow Name', enableCellEdit: false},
                    {field: 'direction', displayName: 'Direction', cellTemplate: DIRECTION_CELL_TEMPLATE,
                        enableCellEdit: false, width: 65},
                    {field: 'magnitude', displayName: 'Magnitude', enableCellEdit: false},
                    {field: 'unit', displayName: 'Unit', enableCellEdit: false, width: 70},
                    {field: 'name', displayName: 'Node Name', enableCellEdit: false},
                    {field: 'nodeType', displayName: 'Node Type', enableCellEdit: false, width: 80}
                ];
            }

            function defineGrids() {
                var canUpdate = ScenarioModelService.canUpdate($scope.scenario);
                defineGridColumns();
                $scope.params = { targetIndex : 3, canUpdate : canUpdate };
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
