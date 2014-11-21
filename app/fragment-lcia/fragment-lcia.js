'use strict';
/* Controller for Fragment LCIA Diagram View */
angular.module('lcaApp.fragment.LCIA',
                ['ui.router', 'lcaApp.resources.service', 'angularSpinner', 'ui.bootstrap.alert',
                 'lcaApp.colorCode.service'])
    .controller('FragmentLciaCtrl',
        ['$scope', '$stateParams', 'usSpinnerService', '$q', 'ScenarioService',
         'FragmentService', 'FragmentFlowService',
         'LciaMethodService', 'LciaResultForFragmentService',
         'ColorCodeService',
        function ($scope, $stateParams, usSpinnerService, $q, ScenarioService,
                  FragmentService, FragmentFlowService,
                  LciaMethodService, LciaResultForFragmentService,
                  ColorCodeService ) {

            var deferredPromises = [],
                fragmentID = $stateParams.fragmentID,
                scenarioKeys = [],
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

            function extractStages(lciaScores) {
                lciaScores.forEach( function(score) {
                    var ff = FragmentFlowService.get(score.fragmentFlowID);
                    if (ff) {
                        stages[ff.fragmentFlowID]= ff["shortName"];
                    }
                });
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
                lciaResult.lciaScore.forEach( function ( score) {
                    result[score.fragmentFlowID] = score.cumulativeResult * scenario.activityLevel;
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

            function buildWaterfalls() {
                stopWaiting();
            }

            function getResults() {
                $scope.methods = LciaMethodService.getAll();
                $scope.scenarios = ScenarioService.getAll();
                scenarioKeys = extractKeys($scope.scenarios, "scenarioID");
                $scope.methods.forEach(function (method) {
                    $scope.scenarios.forEach( function (scenario){
                        var result = LciaResultForFragmentService
                            .get({ scenarioID: scenario.scenarioID,
                                lciaMethodID: method.lciaMethodID,
                                fragmentID: scenario.topLevelFragmentID },
                            extractResult);
                        deferredPromises.push(result.$promise);
                    });
                });
                $q.all(deferredPromises).then(buildWaterfalls, handleFailure);
            }

            /**
             * Get all data resources
             */
            function getData() {
                $q.all([FragmentService.load(), ScenarioService.load(),
                    LciaMethodService.load(),
                    FragmentFlowService.load({scenarioID: 0, fragmentID: fragmentID}) // Poor substitute for fragment stages
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