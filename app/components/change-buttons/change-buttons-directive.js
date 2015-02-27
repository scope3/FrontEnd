angular.module('lcaApp.changeButtons.directive', [])
    .directive('changeButtons', function () {
        return {
            restrict:'E',
            replace:true,
            template:
                '<div class="pull-right">' +
                '  <button type="button" class="btn btn-success btn-sm" ng-disabled="!canApply()" ng-click="applyChanges()">Apply Changes</button>' +
                '  <button type="button" class="btn btn-danger btn-sm" ng-click="revertChanges()" ng-disabled="!canRevert()">Revert Changes</button>'+
                '</div>'
        };
    });