'use strict';
/* Controller for LCIA Method Detail View */
angular.module('lcaApp.lciaMethod.detail',
    ['ui.router', 'lcaApp.resources.service', 'ui.bootstrap.accordion', 'ngGrid', 'lcaApp.status.service',
     'lcaApp.models.param', 'lcaApp.models.scenario'])
    .controller('LciaMethodDetailController', [
        '$scope', '$stateParams', '$q', '$log', '$window',
        'ImpactCategoryService', 'LciaMethodService', 'FlowForFlowTypeService', 'LciaFactorService',
        'ScenarioModelService', 'ParamModelService', 'PARAM_VALUE_STATUS', 'StatusService',
        function ($scope, $stateParams, $q, $log, $window,
                  ImpactCategoryService, LciaMethodService, FlowForFlowTypeService, LciaFactorService,
                  ScenarioModelService, ParamModelService, PARAM_VALUE_STATUS, StatusService) {

            $scope.lciaFactors = [];
            $scope.gridColumns = [];

            $scope.gridOptions = {
                data: 'lciaFactors',
                columnDefs: 'gridColumns',
                enableRowSelection : false,
                enableCellEditOnFocus: true
            };
            $scope.accordionStatus = {
                attributesOpen: true,
                factorsOpen: true
            };
            $scope.paramScenario = null;

            $scope.onScenarioChange = changeScenario;

            $scope.dynamicGridStyle = null;

            $scope.$on('ngGridEventEndCellEdit', handleCellEdit);

            $scope.validChange = function (row) {
                return row.entity.editStatus === PARAM_VALUE_STATUS.changed;
            };

            $scope.invalidChange = function (row) {
                return row.entity.editStatus === PARAM_VALUE_STATUS.invalid;
            };

            /**
             * Function to check if Apply Changes button should be disabled.
             * @returns {boolean}
             */
            $scope.noValidChanges = function () {
                return !($scope.paramScenario && $scope.lciaFactors.length > 0 &&
                    ScenarioModelService.canUpdate($scope.paramScenario) &&
                    $scope.lciaFactors.some( function(lf) {
                        return lf.editStatus === PARAM_VALUE_STATUS.changed;
                    }) &&
                    !$scope.lciaFactors.some( function(lf) {
                        return lf.editStatus === PARAM_VALUE_STATUS.invalid;
                    }));
            };

            $scope.applyChanges = function () {
                var changedParams = $scope.lciaFactors.filter( function (lf) {
                    return lf.editStatus === PARAM_VALUE_STATUS.changed;
                });
                return changedParams.map( getParamChange);
            };

            StatusService.startWaiting();
            $q.all([LciaMethodService.load(), ImpactCategoryService.load(), ScenarioModelService.load(),
                FlowForFlowTypeService.load({flowTypeID: 2}) ,
                LciaFactorService.load({lciaMethodID: $stateParams.lciaMethodID})]).then(
                handleLciaFactorResults, StatusService.handleFailure);

            function defineParamCol() {
                var paramCol = [{field: 'value', displayName: 'Parameter', enableCellEdit: false },
                                {field: 'editStatus', displayName: '', enableCellEdit: false, width: 20}] ;
                if ($scope.paramScenario) {
                    paramCol[0].visible = true;

                    if (ScenarioModelService.canUpdate($scope.paramScenario)) {
                        // Unable to load cell template from file without browser error. Appears to be an ng-grid glitch.
                        paramCol[0].enableCellEdit = true;
                        paramCol[1].cellTemplate =
'<span class="glyphicon glyphicon-ok" aria-hidden="true" ng-show="validChange(row)"></span><span class="glyphicon glyphicon-remove" aria-hidden="true" ng-show="invalidChange(row)"></span>';
                        paramCol[1].visible = true;

                    } else {
                        paramCol[1].visible = false;
                    }
                } else {
                    paramCol[0].visible = false;
                    paramCol[1].visible = false;
                }
                return paramCol;
            }


            function setGridColumns() {
                var paramCol = defineParamCol();
                $scope.gridColumns = [
                    {field: 'category', displayName: 'Flow Category', enableCellEdit: false},
                    {field: 'name', displayName: 'Flow Name', enableCellEdit: false},
                    {field: 'factor', displayName: 'Factor', cellFilter: 'numFormat', enableCellEdit: false},
                    paramCol[0],
                    paramCol[1]
                ];
            }

            function displayLciaFactors() {
                var lciaFactors = LciaFactorService.getAll(),
                    gridHeight = lciaFactors.length * 30 + 50;
                $scope.dynamicGridStyle = { height: gridHeight};
                $scope.lciaFactors =
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
                $scope.lciaFactors.forEach(function (lf) {
                    var param = ParamModelService
                        .getLciaMethodFlowParam($scope.paramScenario.scenarioID, $scope.lciaMethod.lciaMethodID,
                        lf.flowID);
                    if (param) {
                        lf.paramID = param.paramID;
                        lf.value = param.value;
                    } else {
                        lf.paramID = null;
                        lf.value = "";
                    }
                    lf.editStatus = PARAM_VALUE_STATUS.unchanged;
                });
                setGridColumns();
            }

            function clearParamData() {
                $scope.lciaFactors.forEach(function (lf) {
                    lf.paramID = null;
                    lf.value = "";
                    lf.editStatus = PARAM_VALUE_STATUS.unchanged;
                });
                setGridColumns();
            }

            function getParams() {
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

            /**
             * Handle changes to editable cell
             * @param evt   Event containing row changed.
             */
            function handleCellEdit(evt) {
                var rowObj = evt.targetScope.row.entity;
                if (rowObj.value) {
                    // Param value entered
                    if (isNaN(rowObj.value) )
                    {
                        $window.alert("Parameter value, " + rowObj.value + ", is not numeric.");
                        rowObj.editStatus = PARAM_VALUE_STATUS.invalid;
                    } else if (+rowObj.value === rowObj.factor) {
                        $window.alert("Parameter value, " + rowObj.value + ", is the same as factor value.");
                        rowObj.editStatus = PARAM_VALUE_STATUS.invalid;
                    } else if (rowObj.paramID) {
                        // Check if param value changed
                        var origParam = ParamModelService
                            .getLciaMethodFlowParam($scope.paramScenario.scenarioID, $scope.lciaMethod.lciaMethodID,
                            rowObj.flowID);
                        if (origParam.value === +rowObj.value) {
                            rowObj.editStatus = PARAM_VALUE_STATUS.unchanged;
                        } else {
                            rowObj.editStatus = PARAM_VALUE_STATUS.changed;
                        }
                    } else {
                        // No paramID. Interpret this as create
                        rowObj.editStatus = PARAM_VALUE_STATUS.changed;
                    }
                }
                else {
                    // No param value. If it has an ID, interpret this as delete.
                    if (rowObj.paramID) {
                        rowObj.editStatus = PARAM_VALUE_STATUS.changed;
                    } else {
                        rowObj.editStatus = PARAM_VALUE_STATUS.unchanged;
                    }
                }
            }

            function getParamChange(lf) {
                var obj = { paramID: lf.paramID, value: lf.value }
                return obj;
            }

            }]);
