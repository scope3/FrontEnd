
angular.module('lcaApp.changeButtons.directive', [])
/**
 * @ngdoc directive
 * @name lcaApp.changeButtons.directive:changeButtons
 * @restrict E
 * @function
 *
 * @description
 * Directive containing buttons to Apply and Revert Changes.
 * Controller provides functions implementing button behavior.
 * TODO: Replace directive above with this one.
 *
 * @param {function} canApply    Returns boolean indicating if Apply button should be enabled.
 * @param {function} canRevert   Returns boolean indicating if Revert button should be enabled.
 * @param {function} applyChanges   Invoked when user clicks Apply button.
 * @param {function} revertChanges  Invoked when user clicks Revert button.
 */
    .directive("changeButtons", function () {
        return {
            restrict:"E",
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