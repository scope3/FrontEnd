'use strict';
/* Controller for LCIA Method Detail View */
angular.module('lcaApp.lciaMethod.detail',
    ['ui.router', 'lcaApp.resources.service', 'ui.bootstrap.alert'])
    // Follow new angular naming convention for controllers
    // TODO: refactor other controllers (*Ctrl -> *Controller)
    .controller('LciaMethodDetailController', [
        '$scope', '$stateParams', '$q',
        'ImpactCategoryService', 'LciaMethodService', 'FlowForFlowTypeService', 'LciaFactorService',
        function ($scope, $stateParams, $q, ImpactCategoryService, LciaMethodService, FlowForFlowTypeService, LciaFactorService) {

            $q.all([LciaMethodService.load(), ImpactCategoryService.load(),
                FlowForFlowTypeService.load({flowTypeID: 2}) ,
                LciaFactorService.load({lciaMethodID: $stateParams.lciaMethodID})]).then(
                handleSuccess, handleFailure);

            function handleFailure(errMsg) {
                $scope.alert = { type: "danger", msg: errMsg };
            }

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
                $scope.lciaMethod = LciaMethodService.get($stateParams.lciaMethodID);
                if (!$scope.lciaMethod) {
                    handleFailure("Invalid LCIA method ID parameter");
                } else {
                    $scope.impactCategory = ImpactCategoryService.get($scope.lciaMethod["impactCategoryID"]);
                    displayLciaFactors();
                }
            }


        }]);
