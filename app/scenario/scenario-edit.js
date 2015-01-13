/**
 * Controller for scenario editor
 */
angular.module('lcaApp.scenario.edit',
    ['ui.router', 'lcaApp.resources.service', 'ui.bootstrap.alert'])
    .controller('ScenarioEditController',
    ['$scope', '$state', '$stateParams', '$q',
     'ScenarioService', 'FragmentService',
        function ($scope, $state, $stateParams, $q,
                  ScenarioService, FragmentService) {

            $scope.saveScenario = function () {
                if ( ! $scope.scenarioID) {
                    ScenarioService.create($scope.scenario, goHome, handleFailure);
                }
            };

            function goHome() {
                $state.go('home');
            }

            function handleFailure(errMsg) {
                $scope.alert = { type: "danger", msg: errMsg };
            }

            function setScope() {
                if ($stateParams.scenarioID) {
                    // Update an existing scenario
                }
                else {
                    // Create scenario
                    $scope.scenario = { name: "", topLevelFragmentID: null};
                    $scope.fragments = FragmentService.getAll();
                }
            }

            $q.all([ScenarioService.load(), FragmentService.load()])
                .then(setScope, handleFailure);

        }
     ]
);