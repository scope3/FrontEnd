'use strict';
/* Controller for Scenario Detail View */
angular.module('lcaApp.scenario.detail',
               ['lcaApp.resources.service', 'lcaApp.status.service', 'lcaApp.models.scenario', 'lcaApp.models.param'])
.controller('ScenarioDetailController', ['$scope', '$window', 'StatusService', '$state', '$stateParams',
            'ScenarioModelService', 'FragmentService', 'ParamModelService', 'PARAM_TYPE_NAME',
            'PARAM_VALUE_STATUS', '$q',
    function($scope, $window, StatusService, $state, $stateParams,
             ScenarioModelService, FragmentService, ParamModelService, PARAM_TYPE_NAME,
             PARAM_VALUE_STATUS, $q) {

        $scope.scenario = null;
        $scope.fragment = null;

        $scope.editScenario = function() {
            $state.go(".edit");
        };

        $scope.hideEdit = function(scenario) {
            return ! (scenario && ScenarioModelService.canUpdate(scenario));
        };

        $scope.gridData = [];    // Data source for ngGrid
        $scope.gridColumns = [];    // ngGrid column definitions

        /**
         * Function to check if Apply Changes button should be disabled.
         * @returns {boolean}
         */
        $scope.canApply = function () {
            return ($scope.scenario &&
            ScenarioModelService.canUpdate($scope.scenario) &&
            ( ParamModelService.canApplyChanges( $scope.gridData) ||
                paramNameChanged($scope.gridData))
            );
        };
        /**
         * Function to determine if Revert Changes button should be enabled.
         * @returns {boolean}
         */
        $scope.canRevert = function () {
            return ($scope.scenario &&
            ScenarioModelService.canUpdate($scope.scenario) &&
            ( ParamModelService.canRevertChanges( $scope.gridData) ||
              paramNameChanged($scope.gridData))
            );
        };

        /**
         * Gather changes and apply
         */
        $scope.applyChanges = function () {
            var changedParams = $scope.gridData.filter(function (d) {
                return d.paramWrapper.editStatus === PARAM_VALUE_STATUS.changed ||
                    !angular.equals( d.paramWrapper.paramResource.name, d.name);
            });
            StatusService.startWaiting();
            ParamModelService.updateResources($scope.scenario.scenarioID, changedParams.map(changeParam),
                refreshParameters, StatusService.handleFailure);
        };

        $scope.revertChanges = function () {
            $scope.gridData.forEach(function (e) {
                var origParam = e.paramWrapper.paramResource;
                if ( origParam && e.hasOwnProperty("name")) {
                    e.name = origParam.name;
                } else {
                    e.name = null;
                }
            });
            ParamModelService.revertChanges( $scope.gridData);
        };

        function refreshParameters() {
            ParamModelService.getResources($scope.scenario.scenarioID).then(displayParameters,
                StatusService.handleFailure);
        }


        function paramNameChanged(data) {
            return data.some(function (d) {
                    return !angular.equals( d.paramWrapper.paramResource.name, d.name);
                });
        }

        function changeParam(p) {
            var paramResource = ParamModelService.changeExistingParam(p.paramWrapper);

            if (p.name) {
                paramResource.name = p.name;
            }
            return paramResource;
        }

        function setGridColumns() {
            var canUpdate = $scope.scenario && ScenarioModelService.canUpdate($scope.scenario);

            $scope.gridColumns = [
                {field: 'type', displayName: 'Parameter Type', enableCellEdit: false, width: 125},
                {field: 'name', displayName: 'Parameter Name', enableCellEdit: canUpdate, width: 400},
                {field: 'defaultValue', displayName: 'Default Value', enableCellEdit: false}
            ];
            $scope.params = { targetIndex : 2,
                canUpdate : canUpdate };
        }

        function displayParameters(params) {
            var gridData = [];
            StatusService.stopWaiting();

            params.forEach(function (p) {
                var rowObj = { name: null, type: null, defaultValue: p.defaultValue, paramWrapper: ParamModelService.wrapParam(p)};
                if (p.hasOwnProperty("name")) {
                    rowObj.name = p.name;
                }
                if (p.hasOwnProperty("paramTypeID")) {
                    rowObj.type = PARAM_TYPE_NAME[p.paramTypeID];
                }
                gridData.push(rowObj);
            });
            setGridColumns();
            $scope.gridData = gridData;
        }

        function displayScenario() {
            var scenario;

            StatusService.stopWaiting();
            scenario = ScenarioModelService.get($stateParams.scenarioID);
            if (scenario) {
                $scope.scenario = scenario;
                $scope.fragment = FragmentService.get(scenario.topLevelFragmentID);
                StatusService.startWaiting();
                ParamModelService.getResources(scenario.scenarioID).then(displayParameters,
                    StatusService.handleFailure);
            } else {
                StatusService.handleFailure("Invalid Scenario ID parameter.");
            }
        }

        StatusService.startWaiting();
        $q.all([ScenarioModelService.load(), FragmentService.load()]).then (
                displayScenario, StatusService.handleFailure);

}]);