'use strict';
/**
 * @ngdoc controller
 * @name lcaApp.lciaMethod.detail:LciaMethodDetailController
 * @description
 * Controller for LCIA Method view
 */
angular.module('lcaApp.lciaMethod.detail',
    ['ui.router', 'lcaApp.resources.service', 'ui.bootstrap.accordion', 'lcaApp.paramGrid.directive', 'lcaApp.status.service',
        'lcaApp.models.param', 'lcaApp.models.scenario', 'lcaApp.referenceLink.directive'])
    .controller('LciaMethodDetailController', [
        '$scope', '$stateParams', '$q', '$log', '$window',
        'ImpactCategoryService', 'LciaMethodService', 'FlowForLciaMethodService', 'LciaFactorService',
        'ScenarioModelService', 'ParamModelService', 'PARAM_VALUE_STATUS', 'StatusService',
        function ($scope, $stateParams, $q, $log, $window,
                  ImpactCategoryService, LciaMethodService, FlowForLciaMethodService, LciaFactorService,
                  ScenarioModelService, ParamModelService, PARAM_VALUE_STATUS, StatusService) {

            var gridData = [];

            $scope.gridData = [];    // Data source for ngGrid
            $scope.gridColumns = [];    // ngGrid column definitions

            // Control open/close state of accordion containing LCIA method attributes
            $scope.accordionStatus = {
                attributesOpen: true
            };

            $scope.paramScenario = null;    // Selected scenario for param viewing

            $scope.onScenarioChange = changeScenario;   // Scenario selection change handler

            /**
             * Function to check if Apply Changes button should be disabled.
             * @returns {boolean}
             */
            $scope.canApply = function () {
                return ($scope.paramScenario &&
                    ScenarioModelService.canUpdate($scope.paramScenario) &&
                    ParamModelService.canApplyChanges( $scope.gridData)
                );
            };
            /**
             * Function to determine if Revert Changes button should be enabled.
             * @returns {boolean}
             */
            $scope.canRevert = function () {
                return ($scope.paramScenario &&
                    ScenarioModelService.canUpdate($scope.paramScenario) &&
                    ParamModelService.canRevertChanges( $scope.gridData));
            };

            $scope.canChangeScenario = function () {
                return ParamModelService.canAbandonChanges($scope.gridData);
            };
            /**
             * Gather changes and apply
             */
            $scope.applyChanges = function () {
                var changedParams = $scope.gridData.filter(function (e) {
                    return e.paramWrapper.editStatus === PARAM_VALUE_STATUS.changed;
                });
                StatusService.startWaiting();
                ParamModelService.updateResources($scope.paramScenario.scenarioID, changedParams.map(changeParam),
                    getParams, StatusService.handleFailure);
            };

            $scope.revertChanges = function () {
                ParamModelService.revertChanges( $scope.gridData);
            };

            function setGridColumns() {
                var factorHeader = "Factor";
                if ($scope.lciaMethod["referenceFlowProperty"]["referenceUnit"]) {
                    factorHeader = "Factor [" + $scope.lciaMethod["referenceFlowProperty"]["referenceUnit"] + "]";
                }
                $scope.gridColumns = [
                    {field: "category", displayName: "Flow Category", enableCellEdit: false},
                    {field: "name", displayName: "Flow Name", enableCellEdit: false},
                    {field: "factor", displayName: factorHeader, cellFilter: 'numFormat', enableCellEdit: false}
                ];
                $scope.params = { targetIndex : 2,
                    canUpdate : $scope.paramScenario && ScenarioModelService.canUpdate($scope.paramScenario) };
            }

            function displayLciaFactors() {
                var lciaFactors = LciaFactorService.getAll();
                gridData =
                    lciaFactors.map(function (f) {
                        var flow = FlowForLciaMethodService.get(f.flowID);

                        return {flowID: flow.flowID,
                            category: flow.category,
                            name: flow.name,
                            factor: f.factor
                        };
                    });

                getParams();
            }

            function selectActiveScenario() {
                $scope.paramScenario = ScenarioModelService.getActiveScenario();
            }

            /**
             * Function called after requests for non-param resources have been fulfilled.
             */
            function handleLciaFactorResults() {
                StatusService.handleSuccess();
                $scope.scenarios = ScenarioModelService.getAll();
                selectActiveScenario();
                $scope.lciaMethod = LciaMethodService.get($stateParams.lciaMethodID);
                if (!$scope.lciaMethod) {
                    StatusService.handleFailure("Invalid LCIA method ID parameter.");
                } else {
                    $scope.impactCategory = ImpactCategoryService.get($scope.lciaMethod["impactCategoryID"]);
                    displayLciaFactors();
                }
            }

            function addParamData() {
                StatusService.handleSuccess();
                gridData.forEach(function (lf) {
                    var param = ParamModelService
                        .getLciaMethodFlowParam($scope.paramScenario.scenarioID, $scope.lciaMethod.lciaMethodID,
                        lf.flowID);
                    lf.paramWrapper = ParamModelService.wrapParam(param);
                });
                setGridColumns();
                $scope.gridData = gridData;
            }

            function clearParamData() {
                gridData.forEach(function (lf) {
                    lf.paramWrapper = null;
                });
                setGridColumns();
                $scope.gridData = gridData;
            }

            function getParams() {
                StatusService.stopWaiting();
                if ($scope.paramScenario) {
                    StatusService.startWaiting();
                    ParamModelService.load($scope.paramScenario.scenarioID).then(addParamData,
                        StatusService.handleFailure);
                } else {
                    clearParamData();
                }
            }

            function changeScenario() {
                ScenarioModelService.setActiveID($scope.paramScenario.scenarioID);
                getParams();
            }

            function changeParam(lf) {
                var paramResource = ParamModelService.changeExistingParam(lf.paramWrapper);
                if (!paramResource) {
                    paramResource = {
                        scenarioID : $scope.paramScenario.scenarioID,
                        lciaMethodID : $scope.lciaMethod.lciaMethodID,
                        flowID : lf.flowID,
                        value: +lf.paramWrapper.value
                    }
                }
                return paramResource;
            }


            StatusService.startWaiting();
            $q.all([LciaMethodService.load(), ImpactCategoryService.load(), ScenarioModelService.load(),
                FlowForLciaMethodService.load({lciaMethodID: $stateParams.lciaMethodID}) ,
                LciaFactorService.load({lciaMethodID: $stateParams.lciaMethodID})]).then(
                handleLciaFactorResults, StatusService.handleFailure);


        }]);
