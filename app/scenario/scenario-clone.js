angular.module('lcaApp.scenario.clone', ['ui.bootstrap'])
    .controller('ScenarioCloneController', function ($scope, $modalInstance, scenario) {

    $scope.scenario = scenario;

    $scope.ok = function () {
        $modalInstance.close($scope.scenario);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});