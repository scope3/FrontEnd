'use strict';
/* Controller for Fragment LCIA Diagram View */
angular.module('lcaApp.fragment.LCIA',
                ['ui.router', 'lcaApp.resources.service', 'lcaApp.status.service',
                 'lcaApp.colorCode.service', 'lcaApp.waterfall',
                    'isteven-multi-select', 'lcaApp.selection.service',
                    'lcaApp.fragmentNavigation.service', 'lcaApp.models.scenario'])
    .constant('SELECTION_KEYS', {
        topLevelFragmentID : "TLF",
        fragmentScenarios : "FS"
    })
    .controller('FragmentLciaCtrl',
        ['$scope', '$stateParams', '$state', 'StatusService', '$q', 'ScenarioModelService', 'MODEL_BASE_CASE_SCENARIO_ID',
         'FragmentService', 'FragmentStageService', 'FragmentFlowService',
         'LciaMethodService', 'LciaResultForFragmentService',
         'ColorCodeService', 'WaterfallService', 'SelectionService', 'SELECTION_KEYS',
            'FragmentNavigationService',
        function ($scope, $stateParams, $state, StatusService, $q, ScenarioModelService, MODEL_BASE_CASE_SCENARIO_ID,
                  FragmentService, FragmentStageService, FragmentFlowService,
                  LciaMethodService, LciaResultForFragmentService,
                  ColorCodeService, WaterfallService, SelectionService, SELECTION_KEYS,
                  FragmentNavigationService ) {

            var fragmentID,     // ID of current fragment
                stages = [],    // Current fragment stages
                results = {};   // Fragment LCIA results

            /**
             * Top-level fragment selection change handler
             */
            $scope.onFragmentChange = function () {
                var selectedFragment = $scope.fragmentSelection.model[0];
                if (selectedFragment.fragmentID !== fragmentID) {
                    clearWaterfalls();
                    $scope.fragment = selectedFragment;
                    fragmentID = selectedFragment.fragmentID;
                    getFragmentScenarios();
                    getSelectionResults();
                }
            };

            /**
             * Sub-fragment selection handler
             */
            $scope.onFragmentNavigation = function () {
                var fragmentFlow = $scope.navigationSelection.model[0];
                if (fragmentFlow) {
                    clearWaterfalls();
                    navigateSubFragment(fragmentFlow);
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

            $scope.scenarios = [];  // Selected scenarios
            $scope.methods = [];    // Active LCIA methods
            $scope.waterfalls = {}; // Waterfall service instances, indexed by lciaMethodID
            /**
             * Navigation service set if current view supports fragment navigation.
             * If null, then current view supports selection of top-level fragment and associated scenarios.
             */
            $scope.navigationService = null;


            /**
             * Called when a parent fragment is selected from fragment breadcrumbs.
             * Updates fragment breadcrumbs and gets new fragment data.
             * @param fragment  Fragment selected
             * @param index     Breadcrumb index
             */
            $scope.onParentFragmentSelected = function (fragment, index) {
                fragmentID = fragment.fragmentID;
                $scope.fragment = fragment;
                FragmentNavigationService.setLast(index);
                clearWaterfalls();
                loadSubFragments();
            };

            /**
             * Watch for changes to scenario selections
             */
            $scope.$watch('scenarioSelection.model', function() {
                // TODO : Only clear waterfalls for scenarios that are no longer selected,
                // and do not recreate waterfalls for previously selected scenarios
                clearWaterfalls();
                if ($scope.hasOwnProperty("scenarioSelection") && $scope.scenarioSelection.hasOwnProperty("model")) {
                    $scope.scenarios = $scope.scenarioSelection.model;
                    getSelectionResults();
                }
            });

            function getSelectionResults() {
                if ($scope.scenarios.length > 0) {
                    getLciaResults();
                    // Save selections for return to view in same session. Also used for default selections in
                    // Fragment Sankey view.
                    SelectionService.set(SELECTION_KEYS.topLevelFragmentID, $scope.fragment.fragmentID);
                    SelectionService.set(SELECTION_KEYS.fragmentScenarios, $scope.scenarioSelection.model);
                }
            }

            /**
             * Prepare to display sub-fragment
             * Calculate sub-fragment activity level, push current fragment on breadcrumb stack
             * @param {{subFragmentID: Number, nodeWeight: Number}} fragmentFlow  containing selected sub-fragment
             */
            function navigateSubFragment( fragmentFlow) {
                var subFragment = FragmentService.get(fragmentFlow.subFragmentID);
                if (subFragment) {
                    subFragment.activityLevel = $scope.fragment.activityLevel * fragmentFlow.nodeWeight;
                    fragmentID = fragmentFlow.subFragmentID;
                    $scope.fragment = subFragment;
                    FragmentNavigationService.add($scope.fragment);
                    clearWaterfalls();
                    loadSubFragments();
                } else {
                    StatusService.handleFailure("Invalid sub-fragment ID : " + fragmentFlow.subFragmentID);
                }
            }

            /**
             * Get LCIA results for a scenario and method.
             * Multiply cumulativeResult by scenario's activity level.
             * Store in local cache indexed by (methodID, scenarioID, fragmentStageID).
             * @param {{ lciaMethodID : Number, lciaScore : Array }} lciaResult
             */
            function extractResult(lciaResult) {
                var scenario = ScenarioModelService.get(lciaResult.scenarioID),
                    result = {},
                    activityLevel = scenario.activityLevel;

                if ($scope.navigationService && $scope.fragment.hasOwnProperty("activityLevel")) {
                    activityLevel = $scope.fragment.activityLevel;
                }
                lciaResult.lciaScore.forEach(
                    /* @param score {{ fragmentStageID : Number,  cumulativeResult : Number }} */
                    function ( score) {
                        result[score["fragmentStageID"]] = score.cumulativeResult * activityLevel;
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
                var scenarios = ScenarioModelService.getAll(),
                    fragmentScenarios;

                fragmentScenarios = scenarios.filter(function (s) {
                    return (s.topLevelFragmentID === $scope.fragment.fragmentID);
                });
                //
                // Change default selection to first scenario instead of all
                //
                //fragmentScenarios.forEach(function(fs) {
                //    fs.selected = true;
                //});
                if (fragmentScenarios.length > 0 ) {
                    var defaultSelection = fragmentScenarios[0];
                    defaultSelection.selected = true;
                    $scope.scenarios = [ defaultSelection ];
                }
                $scope.scenarioSelection.options = fragmentScenarios;
            }

            function getTopLevelFragments() {
                var fragments = FragmentService.getAll(),
                    scenarios = ScenarioModelService.getAll();
                $scope.fragmentSelection.options = fragments.filter(function (f) {
                    return scenarios.some(function (s) {
                        return s.topLevelFragmentID === f.fragmentID;
                    });
                });
            }

            function getSubFragments(fragmentFlows) {
                $scope.navigationSelection.options = fragmentFlows.filter(function (ff) {
                    return ff.nodeType === "Fragment";
                });
                getLciaResults();
            }

            function loadSubFragments() {
                FragmentFlowService.load({scenarioID: $scope.navigationScenario.scenarioID, fragmentID: fragmentID})
                    .then(getSubFragments, StatusService.handleFailure);
            }

            function getBaseCase() {
                var baseScenario = ScenarioModelService.get(MODEL_BASE_CASE_SCENARIO_ID);
                if (baseScenario) {
                    $scope.scenarios.push(baseScenario);
                }
            }

            function displayFragmentNavigation() {
                var context = FragmentNavigationService.getContext(),
                    scenario = ScenarioModelService.get(context.scenarioID),
                    done = false;

                if (scenario) {
                    var fragState = FragmentNavigationService.getLast();
                    $scope.navigationScenario = scenario;
                    if (scenario.scenarioID !== MODEL_BASE_CASE_SCENARIO_ID) {
                        $scope.scenarios.push(scenario);
                    }
                    if (fragState) {
                        $scope.fragment = fragState;
                        fragmentID = $scope.fragment.fragmentID;
                        done = true;
                    } else {
                        $scope.fragment = FragmentService.get(context.fragmentID);
                        if ($scope.fragment) {
                            $scope.fragment.activityLevel = scenario["activityLevel"];
                            FragmentNavigationService.add($scope.fragment);
                            done = true;
                        } else {
                            StatusService.handleFailure("Invalid fragment ID : " + fragmentID);
                        }
                    }
                } else {
                    StatusService.handleFailure("Invalid scenario ID : ", context.scenarioID);
                }
                return done;
            }

            function displayTopLevelFragmentScenarios () {
                var scenarios = ScenarioModelService.getAll(),
                    selectedScenarios = null;

                $scope.scenarios = [];
                getTopLevelFragments();

                if (scenarios.length > 0) {
                    //
                    // If some scenario was selected in another view, select its top-level fragment.
                    //
                    var activeID = ScenarioModelService.getActiveID();
                    fragmentID = 0;
                    if (activeID) {
                        var activeScenario = ScenarioModelService.get(activeID);
                        if (activeScenario) {
                            fragmentID = activeScenario.topLevelFragmentID;
                        }
                    }
                    if (fragmentID === 0) {
                        //
                        // If no one scenario is active, but fragment and scenarios were previously selected in this view,
                        // apply the same selections.
                        // Otherwise, select first fragment.
                        //
                        if (SelectionService.contains(SELECTION_KEYS.topLevelFragmentID)) {
                            fragmentID = SelectionService.get(SELECTION_KEYS.topLevelFragmentID);
                            if (SelectionService.contains(SELECTION_KEYS.fragmentScenarios)) {
                                selectedScenarios = SelectionService.get(SELECTION_KEYS.fragmentScenarios)
                            }
                        }
                        else {
                            if ($scope.fragmentSelection.options.length > 1) {
                                var firstFragment = $scope.fragmentSelection.options[0];
                                fragmentID = firstFragment.fragmentID;
                                firstFragment.selected = true;
                            }
                        }
                    }
                    $scope.fragmentSelection.options.forEach(function (fs) {
                        fs.selected = (fs.fragmentID === fragmentID);
                    });
                    $scope.fragment = FragmentService.get(fragmentID);
                    getFragmentScenarios();
                    if (selectedScenarios) {
                        $scope.scenarioSelection.options.forEach(function (fs) {
                            fs.selected = selectedScenarios.some(function (s) {
                                return fs.scenarioID === s.scenarioID;
                            });
                        });
                        $scope.scenarios = selectedScenarios;
                    }
                }
            }

            /**
             * Collect methods and scenarios, then get LCIA results.
             */
            function displayLoadedData() {
                var methods = LciaMethodService.getAll();
                StatusService.stopWaiting();
                $scope.methods = methods.filter( function (m) {
                   return m.getIsActive();
                });
                if ( $scope.navigationService) {
                    getBaseCase();
                    if ( displayFragmentNavigation()) {
                        loadSubFragments();
                    }
                }
                else {
                    displayTopLevelFragmentScenarios();
                    if ($scope.scenarios.length >  0) {
                        getLciaResults();
                    }
                }
            }

            function getStateParams() {
                if ( $stateParams.hasOwnProperty("scenarioID") && $stateParams.scenarioID !== undefined &&
                    $stateParams.hasOwnProperty("fragmentID") && $stateParams.fragmentID !== undefined) {
                    $scope.navigationService = FragmentNavigationService.setContext(+$stateParams.scenarioID,
                        +$stateParams.fragmentID);
                    fragmentID = +$stateParams.fragmentID;
                }
            }

            function init() {
                getStateParams();
                if ( $scope.navigationService) {
                    $scope.navigationSelection = {
                        options: [],
                        model: []
                    };
                }
                else {
                    $scope.scenarioSelection = {
                        options: [],
                        model: []
                    };
                    //$scope.selectionConfirmed = getSelectionResults;
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
                $q.all([FragmentService.load(), ScenarioModelService.load(),
                    LciaMethodService.load()
                    ])
                    .then(displayLoadedData,
                    StatusService.handleFailure);
            }

            init();
            StatusService.startWaiting();
            getData();

        }]);