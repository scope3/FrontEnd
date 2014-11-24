'use strict';
/* Controller for Fragment LCIA Diagram View */
angular.module('lcaApp.fragment.LCIA',
                ['ui.router', 'lcaApp.resources.service', 'angularSpinner', 'ui.bootstrap.alert',
                 'lcaApp.colorCode.service'])
    .controller('FragmentLciaCtrl',
        ['$scope', '$stateParams', 'usSpinnerService', '$q', 'ScenarioService',
         'FragmentService', 'FragmentStageService',
         'LciaMethodService', 'LciaResultForFragmentService',
         'ColorCodeService',
        function ($scope, $stateParams, usSpinnerService, $q, ScenarioService,
                  FragmentService, FragmentStageService,
                  LciaMethodService, LciaResultForFragmentService,
                  ColorCodeService ) {

            var fragmentID = $stateParams.fragmentID,
                stages = [],
                waterfalls = {},
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
             * Extract LCIA results
             * @param {{ lciaMethodID : Number, lciaScore : Array }} lciaResult
             */
            function extractResult(lciaResult) {
                var lciaMethod = LciaMethodService.get(lciaResult.lciaMethodID),
                    scenario = ScenarioService.get(lciaResult.scenarioID),
                    colors = ColorCodeService.getImpactCategoryColors(lciaMethod["impactCategoryID"]),
                    result = {};
                lciaResult.lciaScore.forEach(
                    /**
                     * @param score {{ fragmentStageID : Number,  cumulativeResult : Number }}
                     */
                    function ( score) {
                    result[score.fragmentStageID] = score.cumulativeResult * scenario.activityLevel;
                });
                if (! (lciaResult.lciaMethodID in results)) {
                    results[lciaResult.lciaMethodID] = {};
                }
                results[lciaResult.lciaMethodID][lciaResult.scenarioID] = result;
            }

            function extractKeys(resources, keyName) {
                return resources.map( function( r) {
                    return r[keyName];
                });
            }

            /**
             * Create data model for waterfall directive using waterfall service.
             * Results are grouped by method. All scenarios for a method must be
             * in the same waterfall instance because the extent of the value axis
             * is determined by the full range of values across all scenarios.
             */
            function buildWaterfalls() {
                var scenarioKeys, stageKeys;

                stopWaiting();
                scenarioKeys = extractKeys($scope.scenarios, "scenarioID");
                stageKeys = extractKeys(stages);
                $scope.methods.forEach( function (m) {
                    var values = [];
                    if (m.lciaMethodID in results) {
                        var methodResults = results[m.lciaMethodID];
                        for (var i = 0; i < scenarioKeys.length; ++i) {
                            var stageValues = [];
                            for (var j = 0; j < stageKeys.length; ++j) {
                                if (i in methodResults && j in methodResults[i]) {
                                    stageValues.push(methodResults[i][j]);
                                } else {
                                    stageValues.push(null);
                                }
                            }
                            values.push(stageValues);
                        }
                    }
                });
            }

            function getResults() {
                var promises = [];

                $scope.methods = LciaMethodService.getAll();
                $scope.scenarios = ScenarioService.getAll();
                stages = FragmentStageService.getAll();

                $scope.methods.forEach(function (method) {
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
            $scope.waterfalls = {};
            startWaiting();
            getData();

        }]);