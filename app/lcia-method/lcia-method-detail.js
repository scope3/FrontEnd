'use strict';
/* Controller for LCIA Method Detail View */
angular.module('lcaApp.lciaMethod.detail',
    ['ui.router', 'lcaApp.resources.service', 'ui.bootstrap.accordion', 'ngGrid', 'lcaApp.status.service',
     'lcaApp.models.param', 'lcaApp.models.scenario'])
    // Follow new angular naming convention for controllers
    // TODO: refactor other controllers (*Ctrl -> *Controller)
    .controller('LciaMethodDetailController', [
        '$scope', '$stateParams', '$q',
        'ImpactCategoryService', 'LciaMethodService', 'FlowForFlowTypeService', 'LciaFactorService',
        'ScenarioModelService', 'ParamModelService', 'StatusService',
        function ($scope, $stateParams, $q,
                  ImpactCategoryService, LciaMethodService, FlowForFlowTypeService, LciaFactorService,
                  ScenarioModelService, ParamModelService, StatusService) {

            $scope.lciaFactors = [];
            $scope.gridColumns = [];

            $scope.gridOptions = {
                data: 'lciaFactors',
                columnDefs: 'gridColumns',
                enableRowSelection : false
            };
            $scope.accordionStatus = {
                attributesOpen: true,
                factorsOpen: true
            };
            $scope.paramScenario = null;

            $scope.onScenarioChange = changeScenario;

            $scope.dynamicGridStyle = null;

            $scope.$on('ngGridEventEndCellEdit', handleCellEdit);

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
                        paramCol.enableCellEdit = true;
                        paramCol.cellClass = "gridCellEdit";
                    }
                } else {
                    paramCol.visible = false;
                }
                return paramCol;
            }


            function setGridColumns () {
                var paramCol = defineParamCol();
                $scope.gridColumns = [
                    {field: 'category', displayName: 'Flow Category'},
                    {field: 'name', displayName: 'Flow Name'},
                    {field: 'factor', displayName: 'Factor', cellFilter: 'numFormat'},
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
                });
                setGridColumns();
            }

            function clearParamData() {
                $scope.lciaFactors.forEach( function(lf) {
                    lf.paramID = null;
                    lf.value = null;
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
                console.log(evt.targetScope.row.entity);  // the underlying data bound to the row
                // Detect changes and send entity to server
                //{flowID: 20, category: "Emissions to air, unspecified", name: "pentachlorophenol", factor: 0.00000872, paramID: null…}
                var rowObj = evt.targetScope.row.entity;
                if (rowObj.paramID === null) {
                    var param = {
                        scenarioID: $scope.paramScenario.scenarioID,
                        lciaMethodID: $scope.lciaMethod.lciaMethodID,
                        flowID: rowObj.flowID,
                        value: +rowObj.value };
                    ParamModelService.createParam(param);
                }
            }

        }]);
