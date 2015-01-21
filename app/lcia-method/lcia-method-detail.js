'use strict';
/* Controller for LCIA Method Detail View */
angular.module('lcaApp.lciaMethod.detail',
    ['ui.router', 'lcaApp.resources.service', 'ui.bootstrap.accordion', 'ngGrid', 'lcaApp.status.service'])
    // Follow new angular naming convention for controllers
    // TODO: refactor other controllers (*Ctrl -> *Controller)
    .controller('LciaMethodDetailController', [
        '$scope', '$stateParams', '$q',
        'ImpactCategoryService', 'LciaMethodService', 'FlowForFlowTypeService', 'LciaFactorService',
        'ScenarioService', 'StatusService',
        function ($scope, $stateParams, $q,
                  ImpactCategoryService, LciaMethodService, FlowForFlowTypeService, LciaFactorService,
                  ScenarioService, StatusService) {
            $scope.lciaFactors = [];
            $scope.gridOptions = { data: 'lciaFactors',
                columnDefs: [
                    {field: 'category', displayName: 'Flow Category'},
                    {field: 'name', displayName: 'Flow Name'},
                    {field: 'factor', displayName: 'Factor', cellFilter: 'numFormat'}
                ]
            };
            $scope.accordionStatus = {
                attributesOpen: true,
                factorsOpen: true
            };
            $scope.paramScenario = null;

            StatusService.startWaiting();
            $q.all([LciaMethodService.load(), ImpactCategoryService.load(), ScenarioService.load(),
                FlowForFlowTypeService.load({flowTypeID: 2}) ,
                LciaFactorService.load({lciaMethodID: $stateParams.lciaMethodID})]).then(
                handleSuccess, StatusService.handleFailure);

            function displayLciaFactors() {
                var lciaFactors = LciaFactorService.getAll();
                $scope.lciaFactors =
                    lciaFactors.map(function (f) {
                        var flow = FlowForFlowTypeService.get(f.flowID);
                        return {flowID: flow.flowID,
                            category: flow.category,
                            name: flow.name,
                            factor: f.factor };
                    });

            }

            /**
             * Function called after requests for resources have been fulfilled.
             */
            function handleSuccess() {
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


        }]);
