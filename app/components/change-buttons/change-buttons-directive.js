/**
 * @ngdoc directive
 * @name lcaApp.changeButtons.directive:changeButtons
 * @restrict E
 * @function
 *
 * @description
 * Directive implementing buttons to Apply and Revert Changes.
 *
 * Controller must implement the following scope methods.
 *
 *  canApply    : Return boolean indicating if Apply button should be enabled.
 *
 *  canRevert   : Return boolean indicating if Revert button should be enabled.
 *
 *  applyChanges    : Invoked when user clicks Apply button.
 *
 *  revertChanges   : Invoked when user clicks Revert button.
 */
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
    })
    .directive('changeButtons2', function () {
        return {
            restrict:'E',
            scope: {
                canApply: "&",
                applyChanges: "&",
                canRevert: "&",
                revertChanges: "&"
            },
            template:
            '<div class="pull-right">' +
            '  <button type="button" class="btn btn-success btn-sm" ng-disabled="!canApply()" ng-click="applyChanges()">Apply Changes</button>' +
            '  <button type="button" class="btn btn-danger btn-sm" ng-click="revertChanges()" ng-disabled="!canRevert()">Revert Changes</button>'+
            '</div>'
        };
    })
;