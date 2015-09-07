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
angular.module('lcaApp.info.directive', [])
    .constant('INFO_MSG',
    { sort: "Click on the column headers to sort by column.",
      home : {
        msg: "This is the home page of Used Oil LCA, an online tool for assessing the potential environmental impacts of recycling motor oil.  Use the navigation bar (above) to explore the model, view impact assessment results, and see other model information.",
	  msg1: "The model is built from a network of 'proceses' linked by 'flows.'  The network can be broken down into 'fragments' that each describe different parts of the model, such as used oil collection or improper disposal.  Each fragment looks like a tree and can be visualized as a flow diagram.  Fragments can be nested inside other fragments, in which case they are called 'sub-fragments.'",
	msg2: "Every process has input and output flows, such as oil, concrete, or transportation services.  Some processes also have environmental emissions, such as cobalt released into fresh water or carbon dioxide released to air.  These emissions, also called 'elementary flows,' are the source of all environmental impacts.",
	msg3: "The purpose of life cycle assessment is to analyze a process-flow network, compute the environmental emissions that result from the included processes, and then estimate the potential environmental impacts of the resulting emissions. Environmental impacts are estimated using life cycle impact assessment methods, or LCIA methods.  The LCIA methods implemented by this tool are shown in a table at the bottom of this page.",
	help: "Most of the features in this app are documented with information messages. Information messages have a blue icon and grey background.  You can toggle the display of these messages using the 'i' button at the end of the navigation panel on the top of the page.",
        scenarios: {
            msg: "A scenario is a view of a particular 'top-level' fragment at a specific activity level.  The 'model base case' scenario describes the reference version of the models.  Other scenarios can include modifications of the default settings known as 'parameters.'  The following scenarios are available to be viewed. If you have authorized access, you can create a new scenario ('New' button on title bar) or clone an existing scenario ('copy' button on the right).",
	    msg2: "Click on a scenario name to view details about the scenario, or on the top-level fragment to view the process-flow network.",
	    detail: "This panel shows information about the scenario, including the scenario description, top-level fragment, activity level, and any parameters used to define the scenario. You can also edit the scenario if you are authorized to do so.",
	    params: "Scenarios are defined in terms of their deviations from the base case model, called paramters. Each parameter that has been modified from the base case is shown below.  If you are authorized to edit the scenario, you may update parameter names and values here.",
	    paramTypes: "There are five different parameter types:",
	    ffParam: "Dependency parameters modify fragment flows. A dependency parameter affects the degree that one process depends on another node in a fragment.",
	    fpParam: "Flow Property parameters affect physical characteristics of certain flows. Typically these are used to modify flow composition measurements. ",
	    peParam: "Process Emission parameters modify the quantity of a specific emission that results from a unit activity of a certain process.",
	    pdParam: "Process Dissipation parameters modify the degree that a specific composition flow property is dissipated into an environmental emission by a particular process.  They function similarly to process emission parameters.",
	    lcParam: "LCIA Factor parameters modify the characterization factor for a certain emission with respect to a certain LCIA method."
        },
        lciaMethods: {
            msg: "Potential environmental impacts are assessed using the LCIA Methods below.  Methods marked as 'active' will show up in LCIA result screens, while other methods will be hidden.",
	    msg1: "Click on a method name to view details and characterization factors.",
	    detail: "These are the details of the selected LCIA method. Click on the ILCD reference link to view the ILCD data file.",
	    factors: "The flows listed below are the potential environmental stressors for this LCIA method.  Characterization factors are the impact scores that the LCIA method assigns to each stressor.  These can be modified on a scenario-specific basis for scenarios you are authorized to edit."
        }
      },
      fragmentSankey : {
	  msg: "This view allows you to explore and navigate the inventory model.  Click on a process node (blue) to view details about the process. Click on a sub-fragment (green) to descend into the sub-fragment.  ",
	  msg1: "Fragments are parts of an inventory model built as a tree. Nodes in the tree are processes or sub-fragments. Fragment flows are links between nodes.  Flows that don't connect to nodes at one end or the other become inputs or outputs that cross the fragment's system boundary.  Here the flows are shown as a sankey diagram.  You can view detailed environmental impacts for the fragment by clicking 'Show fragment LCIA.'",
	  msg2: "The scenario selector can be used to navigate through any scenario model, starting at its top-level fragment.  Hover the mouse over a node to view the magnitudes of the flows entering and leaving that node.  As you navigate through the model, click on the fragment name in the header block to return to a parent fragment.  You can view flows in different units of measure by using the Flow Property selector.",
	  msg3: "",
	fragmentFlows: {
	    msg: "Table of flows shown in the above diagram.  Flow magnitudes are reported in the units selected by the Flow Property selector."
	}
      },
      processInstance : {
	msg: "Detailed information on the flows coming in and out of this process.  Flows that link to other nodes in the fragment are shown in the first table. Below that are detailed life cycle impact assessment results.  Click on a fragment name to return to the flow diagram. Click on the ILCD reference link to view the ILCD data file that describes the process, which may provide more information.",
	  flows: "This table shows the set of fragment flows that form inputs and outputs of this process.  ",
	  flows1: "Each flow listed here corresponds to a flow on the sankey diagram (though 'cutoff' flows are not displayed on the sankey diagram).  The process 'activity level' is determined by the magnitude of the reference flow.  Other flow magnitudes equal the activity level times the flow 'quantity.'  If you are authorized to edit the scenario, you can modify the quantity values.  ",
	  balance: "If the process is a conservation process, then the inflows to the process will equal the outflows.  The flow marked 'balance' is computed from the other flows to enforce the balance. The balance flow's reference unit is the property that's conserved.",
	  dissipation: "This process includes some emissions derived from the dissipation of flow constituents.",
	  diss1: "Dissipation flows are calculated based on the composition of an inflow.  The composition model referenced by the process is linked in the title above. Here you can view and edit dissipation factors for the process.  ",
	  diss2: "The emission quantity equals the composition content (flow property value), times the dissipation factor, times the scale. 'Scale' is the stoichiometric ratio between the flow property and the emission: e.g. during combustion, carbon (molecular weight 12) becomes carbon dioxide (molecular weight  44; scale = 44/12 = 3.667).",
	  lcia: "Here the environmental impacts that result directly from this process are visualized.  Each active LCIA method is used to estimate the impacts from the process's emissions and the results are shown on a panel below. If the process is not private, the contributions of individual emissions will be shown in a colored horizontal bar.  Clicking on 'Flow Details' will show details of the computation."
      },
      processFlowParam : {
	  msg: "This view reports the details of environmental impacts resulting from the process instance.  Emissions reported here include the process's direct emissions, as well as emissions from any upstream processes that were 'rolled up' into this one. Only emissions that are characterized with respect to the selected LCIA method are shown.",
	  emission: "This panel reports the impacts of emissions modeled as direct emission factors.  The LCIA result equals the emission factor, times the process activity level, times the LCIA factor.  If you are authorized to edit the current scenario, you may modify emission factors here.",
	  dissipation: "This panel reports the impacts of emissions modeled as dissipation flows.  The LCIA result equals the content, times the dissipation factor, times the process activity level, times the LCIA factor.  If you are authorized to edit the current scenario, you may modify dissipation factors here."
      },
      compositionProfile : {
	  msg: "This page reports the composition profiles used to calculate the dissipation of flow constituents from combustion and dumping.  Select a flow from the dropdown list and view the flow's properties in the table below.",
	  content: "This table shows the flow's non-reference properties in terms of quantity per unit of the reference property.  These values can be modified on a scenario-specific basis  for scenarios you are authorized to edit. ",
	  ncv: "Note: Because of the way the current model is designed, flow property parameters that modify heating values will (regrettably) not have the desired effect."
      },
      fragmentLcia : {
	  msgScenario: "This view allows you to compare the LCIA results for different scenarios.  Only scenarios with the same top-level fragment may be compared.  Select a top-level fragment from the drop-down list, and then select one or more scenarios to be compared.",
	  msgFragment: "This view shows the detailed impacts, grouped by life cycle stage, from the currently selected fragment for the current scenario.  You can navigate to a sub-fragment by selecting it from the drop-down list, or to the parent fragment by clicking on the fragment name.  If the currently selected scenario is not the model base case, then the base case is shown at the same activity level for comparison. ",
	  waterfall: "Results are shown as a waterfall chart.  Processes are grouped together by life cycle stage. The chart begins at 0 at the top, and each life cycle stage is added in turn down the waterfall, with one stage beginning where the previous stage left off. Stages with net positive impacts add bars moving to the right, and stages with net negative impacts have bars moving to the left.  The net total is indicated by the red triangle at the bottom of the chart.",
	  xport: "The numerical results reported in the waterfall chart can be exported to a CSV file for external use.",
	  lcia: "You can dismiss individual LCIA method panels using the X at the top right corner. "
      },
      processLcia : {
	  msg: "This view provides detailed access to the environmental impacts of individual unit processes used in the model, outside of the context of the process-flow network.  Select an individual process to view, and a set of scenario parameters to apply, and view the results below for each active LCIA method.",
	  flows: "This table shows the inputs and outputs to the process -- flows that are exchanged with other processes, rather than emissions to the environment. When an instance of this process appears in a fragment, these form the fragment flows."
      }
    })
    .directive('info', ['$compile',
        function($compile) {
            return {
                restrict: 'E',
                template: '<div class="well well-sm" ng-show="displayInfo"><span class="glyphicon glyphicon-info-sign glyphicon-info-color" aria-hidden="true"></span><span class="sr-only">Information:</span><span ng-transclude></span></div>',
                //replace : true,
                transclude : true,
                link : function (scope) {
                    scope.close = function () {
                        scope.msg = null;
                    }
                }
            };

        }]);
