'use strict';
/* Controller for LCIA Method Detail View */
angular.module('lcaApp.lciaMethod.detail',
    ['ui.router', 'lcaApp.resources.service', 'ui.bootstrap.accordion', 'lcaApp.paramGrid.directive', 'lcaApp.status.service',
        'lcaApp.models.param', 'lcaApp.models.scenario'])
    .controller('LciaMethodDetailController', [
        '$scope', '$stateParams', '$q', '$log', '$window',
        'ImpactCategoryService', 'LciaMethodService', 'FlowForFlowTypeService', 'LciaFactorService',
        'ScenarioModelService', 'ParamModelService', 'PARAM_VALUE_STATUS', 'StatusService',
        function ($scope, $stateParams, $q, $log, $window,
                  ImpactCategoryService, LciaMethodService, FlowForFlowTypeService, LciaFactorService,
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
            $scope.noValidChanges = function () {
                return !($scope.paramScenario && $scope.gridData.length > 0 &&
                    ScenarioModelService.canUpdate($scope.paramScenario) &&
                    ParamModelService.hasValidChanges( $scope.gridData)
                );
            };

            /**
             * Gather changes and apply
             */
            $scope.applyChanges = function () {
                var changedParams = $scope.gridData.filter(function (lf) {
                    return lf.editStatus === PARAM_VALUE_STATUS.changed;
                });
                StatusService.startWaiting();
                ParamModelService.updateResources($scope.paramScenario.scenarioID, changedParams.map(changeParam),
                    getParams, StatusService.handleFailure);
            };

            StatusService.startWaiting();
            $q.all([LciaMethodService.load(), ImpactCategoryService.load(), ScenarioModelService.load(),
                FlowForFlowTypeService.load({flowTypeID: 2}) ,
                LciaFactorService.load({lciaMethodID: $stateParams.lciaMethodID})]).then(
                handleLciaFactorResults, StatusService.handleFailure);

            function setGridColumns() {
                $scope.gridColumns = [
                    {field: 'category', displayName: 'Flow Category', enableCellEdit: false},
                    {field: 'name', displayName: 'Flow Name', enableCellEdit: false},
                    {field: 'factor', displayName: 'Factor', enableCellEdit: false}
                ];
                $scope.params = { targetIndex : 2,
                    canUpdate : $scope.paramScenario && ScenarioModelService.canUpdate($scope.paramScenario) };
            }

            function displayLciaFactors() {
                var lciaFactors = LciaFactorService.getAll();
                gridData =
                    lciaFactors.map(function (f) {
                        var flow = FlowForFlowTypeService.get(f.flowID);

                        return {flowID: flow.flowID,
                            category: flow.category,
                            name: flow.name,
                            factor: f.factor
                        };
                    });

                getParams();
            }

            function selectActiveScenario() {
                var scenarioID = ScenarioModelService.getActiveID();
                if (scenarioID) {
                    var scenario = ScenarioModelService.get(scenarioID);
                    if (scenario) {
                        $scope.paramScenario = scenario;
                    }
                }
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
                var paramResource = lf.paramResource;
                if (paramResource) {
                    if (lf.value) {
                        paramResource.value = +lf.value;
                    } else {
                        paramResource.value = null;
                    }
                }
                else {
                    paramResource = {
                        scenarioID : $scope.paramScenario.scenarioID,
                        lciaMethodID : $scope.lciaMethod.lciaMethodID,
                        flowID : lf.flowID,
                        value: +lf.value
                    }
                }
                return paramResource;
            }

        }]);
