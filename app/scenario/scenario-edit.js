/**
 * Controller for scenario editor
 */
angular.module('lcaApp.scenario.edit',
    ['ui.router', 'lcaApp.resources.service', 'lcaApp.status.service'])
    .controller('ScenarioEditController',
    ['$scope', '$state', '$stateParams', '$q', 'StatusService',
     'ScenarioService', 'FragmentService',
        function ($scope, $state, $stateParams, $q, StatusService,
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
                        StatusService.startWaiting();
                        ScenarioService.create(null, $scope.scenario, handleSuccess, StatusService.handleFailure);
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

            function goHome() {
                $state.go('home');
            }

            function handleSuccess() {
                StatusService.stopWaiting();
                goHome();
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
                .then(setScope, StatusService.handleFailure);

        }
     ]
);