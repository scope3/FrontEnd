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
      },
      fragmentSankey : {
	msg: "Fragments are parts of an inventory model built as a tree. Nodes in the tree are processes, sub-fragments, or inputs or outputs (unterminated flows).  Fragment flows are links between nodes.  Here the edges are shown as a sankey diagram.",
	fragmentFlows: {
	    msg: "Table of flows shown in the above diagram. "
	}
      },
      processInstance : {
	msg: "Detailed information on the flows coming in and out of this process.  Flows that link to other nodes in the fragment are shown in the first table. Below that are the results from each life cycle impact assessment method."
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
