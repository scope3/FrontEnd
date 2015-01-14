/**
 * Controller for scenario editor
 */
angular.module('lcaApp.scenario.edit',
    ['ui.router', 'lcaApp.resources.service', 'ui.bootstrap.alert', 'angularSpinner'])
    .controller('ScenarioEditController',
    ['$scope', '$state', '$stateParams', '$q', 'usSpinnerService',
     'ScenarioService', 'FragmentService',
        function ($scope, $state, $stateParams, $q, usSpinnerService,
                  ScenarioService, FragmentService) {
            var existingScenario = null;

            /**
             * Action for Save button. Currently, only new scenario can be saved.
             * Setting up a new scenario takes some time, so display the spinner while
             * waiting for a response.
             */
            $scope.save = function () {
                if ( $scope.form.$valid ) {
                    if (!existingScenario) {
                        startWaiting();
                        ScenarioService.create($scope.scenario, handleSuccess, handleFailure);
                    }
                }
            };

            /**
             * Action for Cancel button.
             * Currently, an existing scenario cannot be edited, so this action just navigates back home.
             */
            $scope.revertChanges = function () {
                if ( ! existingScenario) {
                    $scope.scenario = null;
                    goHome();
                }
            };

            function stopWaiting() {
                usSpinnerService.stop("spinner-lca");
            }

            function startWaiting() {
                $scope.alert = null;
                usSpinnerService.spin("spinner-lca");
            }

            function goHome() {
                $state.go('home');
            }

            function handleSuccess() {
                stopWaiting();
                goHome();
            }

            function handleFailure(errMsg) {
                stopWaiting();
                $scope.alert = { type: "danger", msg: errMsg };
            }

            function setScope() {
                if ($stateParams.scenarioID) {
                    // Update an existing scenario
                }
                else {
                    // Create scenario
                    $scope.scenario = { name: "", activityLevel: 1, topLevelFragmentID: null};
                    $scope.fragments = FragmentService.getAll();
                }
            }

            $q.all([ScenarioService.load(), FragmentService.load()])
                .then(setScope, handleFailure);

        }
     ]
);