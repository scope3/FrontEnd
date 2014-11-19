'use strict';
/* Controller for Fragment LCIA Diagram View */
angular.module('lcaApp.fragment.LCIA',
                ['ui.router', 'lcaApp.resources.service', 'angularSpinner', 'ui.bootstrap.alert',
                 'lcaApp.colorCode.service'])
    .controller('FragmentLciaCtrl',
        ['$scope', '$stateParams', 'usSpinnerService', '$q', 'ScenarioService',
         'LciaMethodService',
         'ColorCodeService',
        function ($scope, $stateParams, usSpinnerService, $q, ScenarioService,
                  LciaMethodService,
                  ColorCodeService) {

            function startWaiting() {
                $scope.alert = null;
                usSpinnerService.spin("spinner-lca");
            }

            function stopWaiting() {
                $scope.alert = null;
                usSpinnerService.stop("spinner-lca");
            }

            function handleFailure(errMsg) {
                stopWaiting();
                $scope.alert = { type: "danger", msg: errMsg };
            }



            function getResults() {
                stopWaiting();
                $scope.methods = LciaMethodService.getAll();
                $scope.scenarios = ScenarioService.getAll();
//                if (methods.length > 0) {
//                    $scope.firstMethod = $scope.methods[0];
//                    $scope.otherMethods = $scope.methods.slice(1);
//                }
            }

            /**
             * Function called after requests for resources have been fulfilled.
             */
            function handleSuccess() {
                getResults();
            }

            /**
             * Get all data resources
             */
            function getData() {
                $q.all([ScenarioService.load(),
                    LciaMethodService.load()])
                    .then(handleSuccess,
                    handleFailure);
            }



            $scope.scenarios = [];
            $scope.firstResult = null;
            $scope.otherResults = [];
            startWaiting();
            getData();

        }]);