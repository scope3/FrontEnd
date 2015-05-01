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
            var existingScenario = null;    // Existing scenario resource, updated on save.

            /**
             * Action for Save button. Create new scenario or update existing scenario.
             * Setting up a new scenario takes some time, so display the spinner while
             * waiting for a response.
             */
            $scope.save = function () {
                if ( $scope.form.$valid ) {
                    StatusService.startWaiting();
                    if (existingScenario) {
                        angular.copy($scope.scenario, existingScenario);
                        ScenarioService.update( {scenarioID: existingScenario.scenarioID}, existingScenario,
                                                handleSuccess, StatusService.handleFailure);
                    } else {
                        ScenarioService.create(null, $scope.scenario, handleSuccess, StatusService.handleFailure);
                    }
                }
            };

            /**
             * Action for Cancel button. Go back to previous state
             */
            $scope.revertChanges = function () {
                goBack();
            };

            function goBack() {
                if ( $stateParams.scenarioID) {
                    $state.go('^');
                } else {
                    $state.go('home');
                }
            }

            function handleSuccess() {
                StatusService.stopWaiting();
                goBack();
            }

            function setScope() {
                StatusService.stopWaiting();
                $scope.fragments = FragmentService.getAll();
                if ($stateParams.scenarioID) {
                    existingScenario = ScenarioService.get($stateParams.scenarioID);
                    if (existingScenario) {
                        $scope.scenario = {
                            scenarioID: existingScenario.scenarioID,
                            name: existingScenario.name,
                            activityLevel: existingScenario.activityLevel,
                            topLevelFragmentID: existingScenario.topLevelFragmentID
                        };
                    } else {
                        StatusService.handleFailure("Invalid scenarioID : " + $stateParams.scenarioID);
                    }
                }
                else {
                    // Create scenario
                    $scope.scenario = { name: "", activityLevel: 1, topLevelFragmentID: null};

                }
            }

            StatusService.startWaiting();
            $q.all([ScenarioService.load(), FragmentService.load()])
                .then(setScope, StatusService.handleFailure);

        }
     ]
);