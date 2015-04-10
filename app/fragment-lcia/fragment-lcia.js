'use strict';
/* Controller for Fragment LCIA Diagram View */
angular.module('lcaApp.fragment.LCIA',
                ['ui.router', 'lcaApp.resources.service', 'lcaApp.status.service',
                 'lcaApp.colorCode.service', 'lcaApp.waterfall',
                    'isteven-multi-select'])
    .controller('FragmentLciaCtrl',
        ['$scope', '$stateParams', 'StatusService', '$q', 'ScenarioService',
         'FragmentService', 'FragmentStageService',
         'LciaMethodService', 'LciaResultForFragmentService',
         'ColorCodeService', 'WaterfallService',
        function ($scope, $stateParams, StatusService, $q, ScenarioService,
                  FragmentService, FragmentStageService,
                  LciaMethodService, LciaResultForFragmentService,
                  ColorCodeService, WaterfallService ) {

            var fragmentID,
                stages = [],
                results = {};

            $scope.onFragmentChange = function () {
                fragmentID = $scope.fragment.fragmentID;
                getFragmentScenarios();
                //getLciaResults();
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

            $scope.scenarioSelectionConfirmed = getSelectionResults;

            $scope.scenarios = [];
            $scope.fragments = [];
            $scope.methods = [];
            $scope.colors = {};
            $scope.waterfalls = {};
            /**
             * Flag to indicate if current view supports fragment navigation.
             * If false, then current view supports selection of top-level fragment and associated scenarios.
             */
            $scope.navigationMode = false;

            function getSelectionResults() {
                $scope.scenarios = $scope.scenarioSelection.model;
                getLciaResults();
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
                $scope.fragments = fragments.filter(function (f) {
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
                getTopLevelFragments();
                if (scenarios.length > 0 ) {
                    fragmentID = scenarios[0].topLevelFragmentID;
                    $scope.fragment = FragmentService.get(fragmentID);
                    getFragmentScenarios();
                    //getLciaResults();
                }
            }

            function init() {
                if (! $scope.navigationMode) {
                    $scope.scenarioSelection = {
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