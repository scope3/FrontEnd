'use strict';

angular.module('lcaApp.scenarios',
    ['lcaApp.resources.service', 'lcaApp.idmap.service', 'angularSpinner'])

.controller('ScenarioListCtrl', ['$scope', '$window', 'usSpinnerService',
        'ScenarioService', 'FragmentService', '$q',
    function($scope, $window, usSpinnerService, ScenarioService, FragmentService, $q ) {
        var failure = false;

        function stopWaiting() {
            usSpinnerService.stop("spinner-lca");
        }

        function handleFailure(errMsg) {
            if (!failure) {
                failure = true;
                stopWaiting();
                $window.alert(errMsg);
            }
        }

        usSpinnerService.spin("spinner-lca");
        $q.all([ScenarioService.load(), FragmentService.load()]).then (
            function() {
                var scenarios = ScenarioService.objects,
                    total = scenarios.length;

                stopWaiting();
                if ( total > 0) {
                    $scope.scenarios = scenarios;
                    $scope.scenarios.forEach(function (scenario) {
                        scenario.fragment = FragmentService.get(scenario.topLevelFragmentID);
                    });
                }
            }, handleFailure);

}]);