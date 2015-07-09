/**
 * @ngdoc directive
 * @name lcaApp.info.directive:info
 * @restrict E
 * @function
 * @scope
 *
 * @description
 * Directive for embedding information about a UI component.
 * Wraps ui.bootstrap.alert -  {@link https://github.com/angular-ui/bootstrap/tree/master/src/alert}.
 *
 * Constant, INFO_MSG, is an object containing information about views and panels.
 * @example
 * Information about the scenarios panel in the home view is in INFO_MSG.home.scenarios.msg.
 *
 * @param {string} msg Value of one of the msg properties in INFO_MSG
 */
angular.module('lcaApp.info.directive', ['ui.bootstrap.alert'])
    .constant('INFO_MSG',
    { home : {
        msg: "This is the home page of Used Oil LCA, an online tool for assessing the potential environmental impacts of recycling motor oil.",
        scenarios: {
            msg: "The life-cycle of used oil is modeled with the following scenarios."
        },
        lciaMethods: {
            msg: "Potential environmental impacts are assessed using active LCIA Methods below."
        }
    }})
    .directive('info', ['$compile',
        function($compile) {
            return {
                restrict: 'E',
                template: '<div ng-show="msg"><alert type="info" close="close()">{{msg}}</alert></div>',
                scope : { msg : '@' },
                replace : true,
                transclude : false,
                link : function (scope) {

                    scope.close = function () {
                        scope.msg = null;
                    }
                }
            };

        }]);