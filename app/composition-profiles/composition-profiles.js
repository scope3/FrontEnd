'use strict';
/**
 * @ngdoc controller
 * @name lcaApp.compositionProfiles:CompositionProfilesController
 * @description
 * Controller for Composition Profiles view
 */
angular.module('lcaApp.compositionProfiles',
    ['ui.router', 'lcaApp.resources.service', 'lcaApp.paramGrid.directive', 'lcaApp.status.service', 'lcaApp.format',
        'lcaApp.models.param', 'lcaApp.models.scenario'])
    .controller('CompositionProfilesController', [
        '$scope', '$stateParams', '$q', '$log', '$window',
        'ScenarioModelService', 'ParamModelService', 'StatusService',
        'CompositionFlowService', 'FlowPropertyMagnitudeService',
        function ($scope, $stateParams, $q, $log, $window,
                  ScenarioModelService, ParamModelService, StatusService,
                  CompositionFlowService, FlowPropertyMagnitudeService) {

            $scope.flows = [];
            $scope.scenarios = [];
            $scope.flow = null;
            $scope.paramGrid = null;
            $scope.onFlowChange = getDataFilteredByFlow;
            $scope.onScenarioChange = getDataFilteredByScenario;
            $scope.referenceFlowProperty = null;

            getData();


            function getData() {
                StatusService.startWaiting();
                $q.all([ScenarioModelService.load(), CompositionFlowService.load()]).then(
                    displayData, StatusService.handleFailure);
            }

            function displayData() {
                StatusService.stopWaiting();
                $scope.scenarios = ScenarioModelService.getAll();
                $scope.flows = CompositionFlowService.getAll();
                if ($scope.flows.length) {
                    $scope.scenario = ScenarioModelService.getActiveScenario();
                    $scope.paramGrid = createParamGrid();
                    selectFlow();
                    getDataFilteredByFlow();
                }
            }

            function selectFlow() {
                $scope.flow = $scope.flows[0];
            }

            function getDataFilteredByFlow() {
                if ( $scope.flow) {
                    StatusService.startWaiting();
                    FlowPropertyMagnitudeService.load({flowID:$scope.flow.flowID}).then(
                        displayFlowProperties, StatusService.handleFailure);
                } else {
                    $scope.referenceFlowProperty = null;
                }
            }

            function getDataFilteredByScenario() {
                if ($scope.scenario) {
                    StatusService.startWaiting();
                    ParamModelService.load($scope.scenario.scenarioID).then(displayParams,
                        StatusService.handleFailure);
                }
            }

            /**
             *
             * @param {[{flowProperty: {flowPropertyID: number, referenceUnit: string, name: string}, magnitude: number}]} resources
             */
            function displayFlowProperties(resources) {
                StatusService.stopWaiting();
                if (resources.length) {
                    $scope.referenceFlowProperty = resources[0].flowProperty;
                }
                $scope.paramGrid.extractData();
            }

            function displayParams() {
                StatusService.stopWaiting();
                $scope.paramGrid.extractParams();
            }

            /**
             * Function module that defines and controls Param Grid
             * @returns {{data: Array, columns: *[], params: {targetIndex: number, canUpdate: (*|boolean)}}}
             */
            function createParamGrid() {
                var grid = {
                        data: [],
                        columns: [
                            {field: 'flowPropertyName', displayName: 'Flow Property', enableCellEdit: false},
                            {field: 'magnitude', displayName: 'Magnitude', cellFilter: 'numFormat', enableCellEdit: false}
                        ],
                        params: {targetIndex: 1, canUpdate: false}
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

                grid.canChangeScenario = function () {
                    return ParamModelService.canAbandonChanges(grid.data);
                };

                grid.extractData = function () {
                    var magnitudes = FlowPropertyMagnitudeService.getAll(),
                        gridData = [];
                    magnitudes.forEach(
                        /**
                         * @param {{ flowProperty : { flowPropertyID: number, name : string }, magnitude : number}} fpm
                         */
                        function (fpm) {
                        var row = {
                            flowPropertyID : fpm.flowProperty.flowPropertyID,
                            flowPropertyName : fpm.flowProperty.name,
                            magnitude : fpm.magnitude
                        };
                        gridData.push(row);
                    });
                    extractParams(gridData);
                };

                grid.extractParams = function () {
                    var gridData = grid.data;
                    extractParams(gridData);
                };

                function handleAppliedChanges() {
                    ParamModelService.load(scenarioID)
                        .then(grid.extractParams,
                        StatusService.handleFailure);
                }

                function extractParams(gridData) {
                    var params = ParamModelService.getFlowPropertyParams($scope.scenario.scenarioID, $scope.flow.flowID);
                    gridData.forEach(function (row) {
                        var param = params && params.hasOwnProperty(row.flowPropertyID) ? params[row.flowPropertyID] : null;
                        row.paramWrapper = ParamModelService.wrapParam(param);
                    });
                    grid.data = gridData;
                    grid.params.canUpdate = ScenarioModelService.canUpdate($scope.scenario);
                }

                /**
                 * Apply param change to resource
                 * @param {{ flowPropertyID: number, paramWrapper : object }} row Record containing change
                 * @returns {*} New or updated param resource
                 */
                function changeParam(row) {
                    var paramResource = ParamModelService.changeExistingParam(row.paramWrapper);
                    if (!paramResource) {
                        paramResource = {
                            scenarioID : $scope.scenario.scenarioID,
                            flowPropertyID : row.flowPropertyID,
                            flowID : $scope.flow.flowID,
                            value: +row.paramWrapper.value,
                            paramTypeID: 4
                        };
                    }
                    return paramResource;
                }

                return grid;
            }

        }
    ]);
