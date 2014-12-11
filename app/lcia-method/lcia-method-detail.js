'use strict';
/* Controller for LCIA Method Detail View */
angular.module('lcaApp.lciaMethod.detail', ['ui.router', 'lcaApp.resources.service', 'ui.bootstrap.alert'])
    // Follow new angular naming convention for controllers
    // TODO: refactor other controllers (*Ctrl -> *Controller)
    .controller('LciaMethodDetailController', ['$scope', '$stateParams', '$q',
        'ImpactCategoryService', 'LciaMethodService',
        function ($scope, $stateParams, $q, ImpactCategoryService, LciaMethodService) {

            function handleFailure(errMsg) {
                $scope.alert = { type: "danger", msg: errMsg };
            }

            $q.all([LciaMethodService.load(), ImpactCategoryService.load()]).then (
                function() {
                    if ($stateParams.lciaMethodID) {
                        $scope.lciaMethod = LciaMethodService.get($stateParams.lciaMethodID);
                        $scope.impactCategory = ImpactCategoryService.get($scope.lciaMethod["impactCategoryID"]);
                    }
                }, handleFailure);
        }]);
