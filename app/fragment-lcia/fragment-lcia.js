'use strict';
/* Controller for Fragment LCIA Diagram View */
angular.module('lcaApp.fragment.LCIA',
                ['ui.router', 'lcaApp.resources.service', 'lcaApp.status.service',
                 'lcaApp.colorCode.service', 'lcaApp.waterfall',
                    'isteven-multi-select', 'lcaApp.selection.service',
                    'lcaApp.fragmentNavigation.service'])
    .constant('SELECTION_KEYS', {
        topLevelFragmentID : "TLF",
        fragmentScenarios : "FS"
    })
    .controller('FragmentLciaCtrl',
        ['$scope', '$stateParams', '$state', 'StatusService', '$q', 'ScenarioService',
         'FragmentService', 'FragmentStageService',
         'LciaMethodService', 'LciaResultForFragmentService',
         'ColorCodeService', 'WaterfallService', 'SelectionService', 'SELECTION_KEYS',
            'FragmentNavigationService',
        function ($scope, $stateParams, $state, StatusService, $q, ScenarioService,
                  FragmentService, FragmentStageService,
                  LciaMethodService, LciaResultForFragmentService,
                  ColorCodeService, WaterfallService, SelectionService, SELECTION_KEYS,
                  FragmentNavigationService ) {

            var fragmentID,
                stages = [],
                results = {};

            $scope.onFragmentChange = function () {
                var selectedFragment = $scope.fragmentSelection.model[0];
                if (selectedFragment.fragmentID !== fragmentID) {
                    clearWaterfalls();
                    $scope.fragment = selectedFragment;
                    fragmentID = selectedFragment.fragmentID;
                    getFragmentScenarios();
                }
            };

            /**
             * Remove LCIA method. Used to close panel.
             * @param m Method displayed by panel to be closed
             */
            $scope.removeMethod = function(m) {
                var index = $scope.methods.indexOf(m);
                if (index > -1) {
                    $scope.methods.splice(index, 1);
                }
            };

            $scope.scenarios = [];
            $scope.methods = [];
            $scope.colors = {};
            $scope.waterfalls = {};
            /**
             * Navigation object created if current view supports fragment navigation.
             * If null, then current view supports selection of top-level fragment and associated scenarios.
             */
            $scope.navigation = null;

            /**
             * Set fragment navigation state, and
             * go back to fragment sankey view
             * @param navIndex  Index to fragment navigation state selected by user
             */
            $scope.goBackToFragment = function(navIndex) {
                FragmentNavigationService.setLast(navIndex);
                $state.go('^');
            };

            function getSelectionResults() {
                $scope.scenarios = $scope.scenarioSelection.model;
                getLciaResults();
                // Save selections for return to view in same session
                SelectionService.set(SELECTION_KEYS.topLevelFragmentID, $scope.fragment.fragmentID);
                SelectionService.set(SELECTION_KEYS.fragmentScenarios, $scope.scenarioSelection.model);
            }

            /**
             * Get LCIA results for a scenario and method.
             * Multiply cumulativeResult by scenario's activity level.
             * Store in local cache indexed by (methodID, scenarioID, fragmentStageID).
             * @param {{ lciaMethodID : Number, lciaScore : Array }} lciaResult
             */
            function extractResult(lciaResult) {
                var scenario = ScenarioService.get(lciaResult.scenarioID),
                    result = {};
                lciaResult.lciaScore.forEach(
                    /* @param score {{ fragmentStageID : Number,  cumulativeResult : Number }} */
                    function ( score) {
                        result[score["fragmentStageID"]] = score.cumulativeResult * scenario.activityLevel;
                });
                if (! (lciaResult.lciaMethodID in results)) {
                    results[lciaResult.lciaMethodID] = {};
                }
                results[lciaResult.lciaMethodID][lciaResult.scenarioID] = result;
            }

            function getName(o) {
                return o.name;
            }

            function clearWaterfalls() {
                $scope.waterfalls = {};
            }

            /**
             * Create data model for waterfall directive using waterfall service.
             * Results are grouped by method. All scenarios for a method must be
             * in the same waterfall instance because the extent of the value axis
             * is determined by the full range of values across all scenarios.
             */
            function buildWaterfalls() {
                var stageNames;
                stages = FragmentStageService.getAll();
                stageNames = stages.map(getName);
                StatusService.stopWaiting();
                $scope.methods.forEach( function (m) {
                    var wf;
                    if (m.lciaMethodID in results) {
                        var values = [], methodResults = results[m.lciaMethodID];
                        $scope.scenarios.forEach( function (scenario) {
                            var stageValues = [];
                            stages.forEach(
                                /* @param stage {{ fragmentStageID : Number, name : String }} */
                                function (stage) {
                                    var stageID = stage["fragmentStageID"];
                                    if (scenario.scenarioID in methodResults &&
                                        stageID in methodResults[scenario.scenarioID]) {
                                        stageValues.push(methodResults[scenario.scenarioID][stageID]);
                                    } else {
                                        stageValues.push(null);
                                    }
                            });
                            values.push(stageValues.slice(0));
                        });
                        wf = new WaterfallService.createInstance();
                        wf.scenarios($scope.scenarios)
                            .stages(stageNames)
                            .values(values.slice(0))
                            .width(300);
                        wf.layout();
                        $scope.waterfalls[m.lciaMethodID] = wf;
                    } else {
                        $scope.waterfalls[m.lciaMethodID] = null;
                    }
                });
            }

            /**
             * Request fragment stages, then
             * for each scenario and method combination, request LCIA results.
             * When all results are in, build waterfalls.
             */
            function getLciaResults() {
                var promises = [],
                    result;
                StatusService.startWaiting();
                result = FragmentStageService.load({fragmentID: fragmentID});
                promises.push(result.$promise);
                $scope.methods.forEach(function (method) {
                    $scope.scenarios.forEach( function (scenario){
                        result = LciaResultForFragmentService
                            .get({ scenarioID: scenario.scenarioID,
                                lciaMethodID: method.lciaMethodID,
                                fragmentID: fragmentID },
                            extractResult);
                        promises.push(result.$promise);
                    });
                });
                $q.all(promises).then(buildWaterfalls, StatusService.handleFailure);
            }

            function getFragmentScenarios() {
                var scenarios = ScenarioService.getAll(),
                    fragmentScenarios;

                fragmentScenarios = scenarios.filter(function (s) {
                    return (s.topLevelFragmentID === $scope.fragment.fragmentID);
                });
                fragmentScenarios.forEach(function(fs) {
                    fs.selected = true;
                });
                $scope.scenarioSelection.options = fragmentScenarios;
            }

            function getTopLevelFragments() {
                var fragments = FragmentService.getAll(),
                    scenarios = ScenarioService.getAll();
                $scope.fragmentSelection.options = fragments.filter(function (f) {
                    return scenarios.some(function (s) {
                        return s.topLevelFragmentID === f.fragmentID;
                    });
                });
            }

            /**
             * Collect methods and scenarios, then get LCIA results.
             */
            function displayLoadedData() {
                var methods = LciaMethodService.getAll(),
                    scenarios = ScenarioService.getAll();
                StatusService.stopWaiting();
                $scope.methods = methods.filter( function (m) {
                   return m.getIsActive();
                });
                if ( $scope.navigation) {
                    var scenarioID = $scope.navigation.scenarioID;
                    $scope.scenario = ScenarioService.get(scenarioID);
                    if ($scope.scenario) {
                        $scope.navigationStates = FragmentNavigationService.setContext(scenarioID,
                            $scope.scenario.topLevelFragmentID).getAll();
                    } else {
                        StatusService.handleFailure("Invalid scenario ID : ", scenarioID);
                    }
                }
                else {

                    getTopLevelFragments();
                    if (scenarios.length > 0 ) {
                        //
                        // If fragment and scenarios were previously selected,
                        // apply the same selections and display results.
                        // Otherwise, select first fragment and all its scenarios. Wait for user to click button.
                        //
                        if (SelectionService.contains(SELECTION_KEYS.topLevelFragmentID)) {
                            fragmentID = SelectionService.get(SELECTION_KEYS.topLevelFragmentID);
                            $scope.fragmentSelection.options.forEach(function(fs) {
                                fs.selected = (fs.fragmentID === fragmentID);
                            });
                        }
                        else {
                            if ($scope.fragmentSelection.options.length > 1) {
                                var firstFragment = $scope.fragmentSelection.options[0];
                                fragmentID = firstFragment.fragmentID;
                                firstFragment.selected = true;
                            }
                        }
                        $scope.fragment = FragmentService.get(fragmentID);
                        getFragmentScenarios();
                        if (SelectionService.contains(SELECTION_KEYS.fragmentScenarios) ) {
                            var selectedScenarios = SelectionService.get(SELECTION_KEYS.fragmentScenarios);
                            $scope.scenarioSelection.options.forEach(function(fs) {
                                fs.selected = selectedScenarios.some( function(s) {
                                    return fs.scenarioID === s.scenarioID;
                                });
                            });

                            $scope.scenarios = selectedScenarios;
                            getLciaResults();
                        }
                    }
                }
            }

            function getStateParams() {
                if ( $stateParams.hasOwnProperty("scenarioID")) {
                    $scope.navigation = { scenarioID : +$stateParams.scenarioID };

                }
                if ($stateParams.hasOwnProperty("fragmentID")) {
                    fragmentID = +$stateParams.fragmentID;
                }
            }

            function init() {
                getStateParams();
                if (! $scope.navigation) {
                    $scope.scenarioSelection = {
                        options: [],
                        model: []
                    };
                    $scope.selectionConfirmed = getSelectionResults;
                    $scope.fragmentSelection = {
                        options: [],
                        model: []
                    };
                }
            }

            /**
             * Get all data resources
             */
            function getData() {
                $q.all([FragmentService.load(), ScenarioService.load(),
                    LciaMethodService.load()
                    ])
                    .then(displayLoadedData,
                    StatusService.handleFailure);
            }

            init();
            StatusService.startWaiting();
            getData();

        }]);