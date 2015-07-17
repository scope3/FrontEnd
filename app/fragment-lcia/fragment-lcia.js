'use strict';
/**
 * @ngdoc controller
 * @name lcaApp.fragment.LCIA:FragmentLciaController
 * @description
 * Controller for Fragment LCIA view
 */
angular.module('lcaApp.fragment.LCIA',
                ['ui.router', 'lcaApp.resources.service', 'lcaApp.status.service',
                 'lcaApp.colorCode.service', 'lcaApp.waterfall',
                    'isteven-multi-select', 'lcaApp.selection.service',
                    'lcaApp.fragmentNavigation.service', 'lcaApp.models.scenario','ngSanitize', 'ngCsv'])
    .controller('FragmentLciaController',
        ['$scope', '$stateParams', '$state', 'StatusService', '$q', 'ScenarioModelService',
         'FragmentService', 'FragmentStageService', 'FragmentFlowService',
         'LciaMethodService', 'LciaResultForFragmentService',
         'ColorCodeService', 'WaterfallService',
            'FragmentNavigationService',
        function ($scope, $stateParams, $state, StatusService, $q, ScenarioModelService,
                  FragmentService, FragmentStageService, FragmentFlowService,
                  LciaMethodService, LciaResultForFragmentService,
                  ColorCodeService, WaterfallService,
                  FragmentNavigationService ) {

            var stages = [],    // Current fragment stages
                results = {};   // Fragment LCIA results

            /**
             * Top-level fragment selection change handler
             */
            $scope.onFragmentChange = function () {
                var selectedFragment = $scope.fragmentSelection.model[0];
                if (!$scope.fragment || selectedFragment.fragmentID !== $scope.fragment.fragmentID) {
                    clearWaterfalls();
                    $scope.fragment = selectedFragment;
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
                $scope.fragment = fragment;
                FragmentNavigationService.setLast(index);
                clearWaterfalls();
                loadSubFragments();
            };

            /**
             * Watch for changes to scenario selections
             */
            $scope.$watch('scenarioSelection.model', function() {
                clearWaterfalls();
                if ($scope.hasOwnProperty("scenarioSelection") && $scope.scenarioSelection.hasOwnProperty("model")) {
                    $scope.scenarios = $scope.scenarioSelection.model;
                    getSelectionResults();
                }
            });

            /**
             * Get array of LCIA results to download
             * @returns {*}
             */
            $scope.getCsvData = function () {
                if ($scope.disableExport()) {
                    return null;
                } else {
                    exportWaterfalls();
                    return $scope.csvData;
                }

            };

            /**
             * Disable Export button when no resources have been selected.
             * @returns {boolean}
             */
            $scope.disableExport = function () {
                return !$scope.fragment || !$scope.scenarios.length || !$scope.methods.length;
            };

            /**
             * ng-csv attributes
             */
            $scope.csvData =  null;
            $scope.csvHeader = null;
            $scope.csvFileName = null;

            function getSelectionResults() {
                if ($scope.scenarios.length > 0) {
                    getLciaResults();
                    // Save selections for return to view in same session. Also used for default selections in
                    // Fragment Sankey view.
                    ScenarioModelService.selectFragmentScenarioIDs($scope.fragment.fragmentID,
                                                                    $scope.scenarioSelection.model);
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

            function exportMethodResults(m, rows) {
                var refLink = m.getReferenceLink(),
                    refUnit = m.getReferenceUnit(),
                    wf = $scope.waterfalls[m.lciaMethodID];

                if (wf) {
                    var stages = wf.stages(),
                        values = wf.values(),
                        i, j;

                    for (j = 0; j < stages.length; j++) {
                        var row = [m.name];
                        row.push(stages[j]);
                        for (i = 0; i < $scope.scenarios.length; i++) {
                            row.push(values[i][j]);
                        }
                        row.push([refUnit, refLink]);
                        rows.push(row);
                    }
                }
            }

            function exportWaterfalls() {
                var rows = [],
                    scenarioNames = $scope.scenarios.map(getName);

                if ($scope.fragment) {
                    $scope.methods.forEach( function (m) {
                        exportMethodResults(m, rows);
                    });

                    $scope.csvFileName = "Fragment_LCIA_" + $scope.fragment.name.split(" ").join("_") + ".csv";

                    $scope.csvHeader = ["LCIA Method", "Fragment Stage"]
                        .concat(scenarioNames, "Unit", "ILCD Reference");
                }
                $scope.csvData = rows;
            }

            /**
             * Request fragment stages, then
             * for each scenario and method combination, request LCIA results.
             * When all results are in, build waterfalls.
             */
            function getLciaResults() {
                var promises = [],
                    result;
                if ($scope.fragment) {
                    StatusService.startWaiting();
                    result = FragmentStageService.load({fragmentID: $scope.fragment.fragmentID});
                    promises.push(result.$promise);
                    $scope.methods.forEach(function (method) {
                        $scope.scenarios.forEach( function (scenario){
                            result = LciaResultForFragmentService
                                .get({ scenarioID: scenario.scenarioID,
                                    lciaMethodID: method.lciaMethodID,
                                    fragmentID: $scope.fragment.fragmentID },
                                extractResult);
                            promises.push(result.$promise);
                        });
                    });
                    $q.all(promises).then(buildWaterfalls, StatusService.handleFailure);
                }
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

            function getTopLevelFragments(scenarios) {
                var fragments = FragmentService.getAll();

                return fragments.filter(function (f) {
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
                if ($scope.fragment) {
                    FragmentFlowService.load({scenarioID: $scope.navigationScenario.scenarioID, fragmentID: $scope.fragment.fragmentID})
                        .then(getSubFragments, StatusService.handleFailure);
                }
            }

            function getBaseCase() {
                var baseScenario = ScenarioModelService.getBaseCase();
                if (baseScenario) {
                    $scope.scenarios.push(baseScenario);
                }
            }

            /**
             * In fragment navigation mode, scenario is pre-selected and cannot change.
             * Display current fragment navigation state for the scenario.
             * @returns {boolean}   Indicates if this operation was successful.
             *                      Failure occurs when resource IDs are not valid.
             */
            function displayFragmentNavigation() {
                var scenarioID = +$stateParams.scenarioID,
                    scenario = ScenarioModelService.get(scenarioID),
                    done = false;

                if (scenario) {
                    var fragState;

                    FragmentNavigationService.setContext(scenario.scenarioID, scenario.topLevelFragmentID);
                    fragState = FragmentNavigationService.getLast();
                    $scope.navigationScenario = scenario;
                    if (! ScenarioModelService.isBaseCase(scenario)) {
                        $scope.scenarios.push(scenario);
                    }
                    if (fragState) {
                        $scope.fragment = fragState;
                        done = true;
                    } else {
                        $scope.fragment = FragmentService.get(scenario.topLevelFragmentID);
                        if ($scope.fragment) {
                            $scope.fragment.activityLevel = scenario["activityLevel"];
                            FragmentNavigationService.add($scope.fragment);
                            done = true;
                        } else {
                            StatusService.handleFailure("Scenario, " + scenario.name + ", has invalid fragment ID : "
                                                        + scenario.topLevelFragmentID);
                        }
                    }
                } else {
                    StatusService.handleFailure("Invalid scenario ID : " + scenarioID);
                }
                return done;
            }

            /**
             * Apply previous fragment and scenario selections.
             * May not be possible in case a scenario was deleted or its top-level fragment changed.
             * @param {[]} topLevelFragments
             * @param {[]} scenarios
             * @param {number} selectFragmentID
             * @param {[]} selectScenarioIDs
             */
            function applySelections( topLevelFragments, scenarios, selectFragmentID, selectScenarioIDs) {
                topLevelFragments.forEach(function (fs) {
                    if (fs.fragmentID === selectFragmentID) {
                        fs.selected = true;
                        $scope.fragment = fs;
                    }
                    else {
                        fs.selected = false;
                    }
                });
                topLevelFragments.sort(FragmentService.compareByName);
                $scope.fragmentSelection.options = topLevelFragments;
                if ($scope.fragment) {
                    var fragmentScenarios = scenarios.filter(function (s) {
                        return (s.topLevelFragmentID === $scope.fragment.fragmentID);
                    });
                    if (selectScenarioIDs.length > 0) {
                        fragmentScenarios.forEach(function (fs) {
                            if ( selectScenarioIDs.some(function (s) {
                                    return fs.scenarioID === s;
                                })) {
                                fs.selected = true;
                                $scope.scenarios.push(fs);
                            }
                            else {
                                fs.selected = false;
                            }
                        });

                    }
                    $scope.scenarioSelection.options = fragmentScenarios;
                }
            }

            /**
             * Load selection controls and try to apply previous selections.
             */
            function displayTopLevelFragmentScenarios () {
                var scenarios = ScenarioModelService.getAll(),
                    topLevelFragments = getTopLevelFragments(scenarios),  // Top-level fragments from all scenarios
                    selectFragmentID = 0,
                    selectScenarioIDs = [];

                $scope.fragment = null;
                $scope.scenarios = [];

                if (scenarios.length > 0 && topLevelFragments.length > 0) {
                    //
                    // If some scenario was selected in another view, select its top-level fragment.
                    //
                    var activeID = ScenarioModelService.getActiveID();
                    if (activeID) {
                        var activeScenario = ScenarioModelService.get(activeID);
                        if (activeScenario) {
                            selectFragmentID = activeScenario.topLevelFragmentID;
                            // Select active scenario
                            selectScenarioIDs.push(activeID);
                            //
                            // If top-level fragment has not changed, reselect scenarios
                            //
                            if (selectFragmentID === ScenarioModelService.getSelectedTopLevelFragmentID()) {
                                ScenarioModelService.getSelectedScenarioIDs().forEach(function (s) {
                                    if (s !== activeID) {
                                        selectScenarioIDs.push(s);
                                    }
                                });
                            }
                        }
                    }
                    if (selectFragmentID === 0) {
                        //
                        // If no one scenario is active, but fragment and scenarios were previously selected in this view,
                        // apply the same selections.
                        //
                        selectFragmentID = ScenarioModelService.getSelectedTopLevelFragmentID();
                        selectScenarioIDs = ScenarioModelService.getSelectedScenarioIDs();
                    }
                    applySelections( topLevelFragments, scenarios, selectFragmentID, selectScenarioIDs);
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

            function navigationMode() {
                return ( $stateParams.hasOwnProperty("scenarioID") && $stateParams.scenarioID !== undefined &&
                    $stateParams.hasOwnProperty("fragmentID") && $stateParams.fragmentID !== undefined) ;
            }

            function init() {
                if ( navigationMode()) {
                    $scope.navigationService = FragmentNavigationService;
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