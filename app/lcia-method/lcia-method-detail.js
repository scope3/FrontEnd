'use strict';
/* Controller for LCIA Method Detail View */
angular.module('lcaApp.lciaMethod.detail',
    ['ui.router', 'lcaApp.resources.service', 'ui.bootstrap.accordion', 'ngGrid', 'lcaApp.status.service',
     'lcaApp.models.param', 'lcaApp.models.scenario'])
    // Follow new angular naming convention for controllers
    // TODO: refactor other controllers (*Ctrl -> *Controller)
    .controller('LciaMethodDetailController', [
        '$scope', '$stateParams', '$q', '$log',
        'ImpactCategoryService', 'LciaMethodService', 'FlowForFlowTypeService', 'LciaFactorService',
        'ScenarioModelService', 'ParamModelService', 'PARAM_VALUE_STATUS', 'StatusService',
        function ($scope, $stateParams, $q, $log,
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

            StatusService.startWaiting();
            $q.all([LciaMethodService.load(), ImpactCategoryService.load(), ScenarioModelService.load(),
                FlowForFlowTypeService.load({flowTypeID: 2}) ,
                LciaFactorService.load({lciaMethodID: $stateParams.lciaMethodID})]).then(
                handleLciaFactorResults, StatusService.handleFailure);

            function defineParamCol() {
                var paramCol = {field: 'value', displayName: 'Parameter'};
                if ($scope.paramScenario) {
                    paramCol.visible = true;
                    if (ScenarioModelService.canUpdate($scope.paramScenario)) {
                        paramCol.cellTemplate = 'template/grid/edit-param-cell.html';
                        paramCol.enableCellEdit = true;
                    }
                } else {
                    paramCol.visible = false;
                }
                return paramCol;
            }


            function setGridColumns () {
                var paramCol = defineParamCol();
                $scope.gridColumns = [
                    {field: 'category', displayName: 'Flow Category', enableCellEdit: false},
                    {field: 'name', displayName: 'Flow Name', enableCellEdit: false},
                    {field: 'factor', displayName: 'Factor', cellFilter: 'numFormat', enableCellEdit: false},
                    paramCol
                ];
            }

            function displayLciaFactors() {
                var lciaFactors = LciaFactorService.getAll(),
                    gridHeight = lciaFactors.length * 30 + 50;
                $scope.dynamicGridStyle = { height: gridHeight} ;
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
                $scope.lciaFactors.forEach( function(lf) {
                    var param = ParamModelService
                        .getLciaMethodFlowParam($scope.paramScenario.scenarioID, $scope.lciaMethod.lciaMethodID,
                                                lf.flowID);
                    if (param) {
                        lf.paramID = param.paramID;
                        lf.value = param.value;
                    } else {
                        lf.paramID = null;
                        lf.value = null;
                    }
                    lf.editStatus = PARAM_VALUE_STATUS.unchanged;
                });
                setGridColumns();
            }

            function clearParamData() {
                $scope.lciaFactors.forEach( function(lf) {
                    lf.paramID = null;
                    lf.value = null;
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

            function handleCellEdit (evt){
                // Detect changes and set status
                //{flowID: 20, category: "Emissions to air, unspecified", name: "pentachlorophenol", factor: 0.00000872, paramID: null…}
                var rowObj = evt.targetScope.row.entity;
                // parameter value must be a number that differs from factor value
                if ( rowObj.value && (isNaN(rowObj.value) || +rowObj.value === rowObj.factor)) {
                    //StatusService.handleFailure("Parameter value, " + value + ", is not numeric.");
                    rowObj.editStatus = PARAM_VALUE_STATUS.invalid;
                }
                else {
                    if ( rowObj.paramID ) {
                        var origParam = ParamModelService
                            .getLciaMethodFlowParam($scope.paramScenario.scenarioID, $scope.lciaMethod.lciaMethodID,
                                                    rowObj.flowID);
                        if (origParam.value === +rowObj.value) {
                            rowObj.editStatus = PARAM_VALUE_STATUS.unchanged;
                        } else {
                            rowObj.editStatus = PARAM_VALUE_STATUS.changed;
                        }
                    }
                    else if (rowObj.value) {
                        rowObj.editStatus = PARAM_VALUE_STATUS.changed;
                    }
                }
                /*
                if (rowObj.paramID === null ) {
                    if ( validateInput(rowObj.value) ) {
                        var param = {
                            scenarioID: $scope.paramScenario.scenarioID,
                            lciaMethodID: $scope.lciaMethod.lciaMethodID,
                            flowID: rowObj.flowID,
                            value: +rowObj.value
                        };
                        ParamModelService.createParam(param);
                    }
                } else {
                    if (rowObj.value && rowObj.value !== "") {
                        if ( validateInput(rowObj.value)) {
                            ParamModelService.updateParam(rowObj.paramID, +rowObj.value);
                        }
                    } else {
                        ParamModelService.deleteParam(rowObj.paramID);
                    }
                }
                */
            }

        }]);
