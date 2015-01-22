'use strict';
/* Controller for LCIA Method Detail View */
angular.module('lcaApp.lciaMethod.detail',
    ['ui.router', 'lcaApp.resources.service', 'ui.bootstrap.accordion', 'ngGrid', 'lcaApp.status.service',
     'lcaApp.models.param'])
    // Follow new angular naming convention for controllers
    // TODO: refactor other controllers (*Ctrl -> *Controller)
    .controller('LciaMethodDetailController', [
        '$scope', '$stateParams', '$q',
        'ImpactCategoryService', 'LciaMethodService', 'FlowForFlowTypeService', 'LciaFactorService',
        'ScenarioService', 'ParamModelService', 'StatusService',
        function ($scope, $stateParams, $q,
                  ImpactCategoryService, LciaMethodService, FlowForFlowTypeService, LciaFactorService,
                  ScenarioService, ParamModelService, StatusService) {
            $scope.lciaFactors = [];
            $scope.gridOptions = { data: 'lciaFactors',
                columnDefs: [
                    {field: 'category', displayName: 'Flow Category'},
                    {field: 'name', displayName: 'Flow Name'},
                    {field: 'factor', displayName: 'Factor', cellFilter: 'numFormat'},
                    {field: 'value', displayName: 'Override' }
                ]
            };
            $scope.accordionStatus = {
                attributesOpen: true,
                factorsOpen: true
            };
            $scope.paramScenario = null;

            $scope.onScenarioChange = getParams;

            StatusService.startWaiting();
            $q.all([LciaMethodService.load(), ImpactCategoryService.load(), ScenarioService.load(),
                FlowForFlowTypeService.load({flowTypeID: 2}) ,
                LciaFactorService.load({lciaMethodID: $stateParams.lciaMethodID})]).then(
                handleLciaFactorResults, StatusService.handleFailure);

            function displayLciaFactors() {
                var lciaFactors = LciaFactorService.getAll();
                $scope.lciaFactors =
                    lciaFactors.map(function (f) {
                        var flow = FlowForFlowTypeService.get(f.flowID),
                            record = {flowID: flow.flowID,
                                category: flow.category,
                                name: flow.name,
                                factor: f.factor,
                                paramID: null,
                                value: null
                            };

                        return record;
                    });

            }

            /**
             * Function called after requests for non-param resources have been fulfilled.
             */
            function handleLciaFactorResults() {
                StatusService.handleSuccess();
                $scope.scenarios = ScenarioService.getAll();
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
            }

            function getParams() {
                if ($scope.paramScenario) {
                    StatusService.startWaiting();
                    ParamModelService.load($scope.paramScenario.scenarioID).then(addParamData,
                        StatusService.handleFailure);
                }
            }

        }]);
