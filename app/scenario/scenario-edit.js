/**
 * Controller for scenario editor
 */
angular.module('lcaApp.scenario.edit',
    ['ui.router', 'lcaApp.resources.service', 'lcaApp.status.service'])
    .controller('ScenarioEditController',
    ['$scope', '$state', '$stateParams', '$q', 'StatusService',
     'ScenarioService', 'FragmentService', 'FlowService', 'FlowPropertyMagnitudeService',
        function ($scope, $state, $stateParams, $q, StatusService,
                  ScenarioService, FragmentService, FlowService, FlowPropertyMagnitudeService) {
            var existingScenario = null, // Existing scenario resource, updated on save.
                defaultName = "";       // Default scenario name

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

            $scope.onFragmentChange = changeFragmentFields;

            /**
             * Update fields impacted by fragment change
             */
            function changeFragmentFields() {
                if ($scope.scenario.topLevelFragmentID) {
                    var fragment = FragmentService.get($scope.scenario.topLevelFragmentID);
                    if ($scope.scenario.name === defaultName || !$scope.scenario.name ) {
                        defaultName = fragment.name;
                        $scope.scenario.name = defaultName;
                    }
                    if (fragment["termFlowID"]) {
                        $scope.scenario.referenceFlowID = fragment["termFlowID"];
                        getReferenceFlow(fragment["termFlowID"]);
                    }
                }
            }

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

            function displayReferenceFlow() {
                var flowProps = FlowPropertyMagnitudeService.getAll();
                $scope.referenceFlow = FlowService.get($scope.scenario["referenceFlowID"]);
                if (flowProps.length) {
                    $scope.unit = flowProps[0].unit;
                }
            }

            function getReferenceFlow(flowID) {
                $q.all([FlowService.load({flowID: flowID}), FlowPropertyMagnitudeService.load({flowID: flowID})])
                    .then(displayReferenceFlow);
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
                            description: existingScenario.description,
                            activityLevel: existingScenario.activityLevel,
                            topLevelFragmentID: existingScenario.topLevelFragmentID
                        };
                        if (existingScenario["referenceFlowID"]) {
                            $scope.scenario.referenceFlowID = existingScenario["referenceFlowID"];
                            getReferenceFlow(existingScenario["referenceFlowID"]);
                        }
                    } else {
                        StatusService.handleFailure("Invalid scenarioID : " + $stateParams.scenarioID);
                    }
                }
                else {
                    // Create scenario
                    $scope.scenario = { name: defaultName, activityLevel: 1, topLevelFragmentID: null};

                }
            }

            StatusService.startWaiting();
            $q.all([ScenarioService.load(), FragmentService.load()])
                .then(setScope, StatusService.handleFailure);

        }
     ]
);