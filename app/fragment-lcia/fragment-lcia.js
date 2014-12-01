'use strict';
/* Controller for Fragment LCIA Diagram View */
angular.module('lcaApp.fragment.LCIA',
                ['ui.router', 'lcaApp.resources.service', 'angularSpinner', 'ui.bootstrap.alert',
                 'lcaApp.colorCode.service', 'lcaApp.waterfall'])
    .controller('FragmentLciaCtrl',
        ['$scope', '$stateParams', 'usSpinnerService', '$q', 'ScenarioService',
         'FragmentService', 'FragmentStageService',
         'LciaMethodService', 'LciaResultForFragmentService',
         'ColorCodeService', 'WaterfallService',
        function ($scope, $stateParams, usSpinnerService, $q, ScenarioService,
                  FragmentService, FragmentStageService,
                  LciaMethodService, LciaResultForFragmentService,
                  ColorCodeService, WaterfallService ) {

            var fragmentID = $stateParams.fragmentID,
                stages = [],
                results = {};

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
                var stageNames = stages.map(getName);
                stopWaiting();
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
             * Collect methods, scenarios, and stages.
             * For each scenario and method combination, request LCIA results.
             * When all results are in, build waterfalls.
             */
            function getResults() {
                var promises = [];

                $scope.methods = LciaMethodService.getAll();
                $scope.scenarios = ScenarioService.getAll();
                stages = FragmentStageService.getAll();

                $scope.methods.forEach(function (method) {
                    var colors = ColorCodeService.getImpactCategoryColors(method["impactCategoryID"]);
                    $scope.colors[method.lciaMethodID] = colors[3][0];  // One color per method
                    $scope.scenarios.forEach( function (scenario){
                        var result = LciaResultForFragmentService
                            .get({ scenarioID: scenario.scenarioID,
                                lciaMethodID: method.lciaMethodID,
                                fragmentID: scenario.topLevelFragmentID },
                            extractResult);
                        promises.push(result.$promise);
                    });
                });
                $q.all(promises).then(buildWaterfalls, handleFailure);
            }

            /**
             * Get all data resources
             */
            function getData() {
                $q.all([FragmentService.load(), ScenarioService.load(),
                    LciaMethodService.load(),
                    FragmentStageService.load({fragmentID: fragmentID})
                    ])
                    .then(getResults,
                    handleFailure);
            }

            $scope.scenarios = [];
            $scope.methods = [];
            $scope.colors = {};
            $scope.waterfalls = {};
            startWaiting();
            getData();

        }]);