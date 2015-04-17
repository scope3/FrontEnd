'use strict';
/* Controller for Fragment Sankey Diagram View */
angular.module('lcaApp.fragment.sankey',
                ['ui.router', 'lcaApp.sankey', 'lcaApp.resources.service', 'lcaApp.status.service',
                 'lcaApp.format', 'lcaApp.fragmentNavigation.service', 'lcaApp.models.scenario'])
    .controller('FragmentSankeyCtrl',
        ['$scope', '$stateParams', '$state', 'StatusService', '$q', '$log',
        'ScenarioModelService', 'FragmentService', 'FragmentFlowService', 'FlowForFragmentService', 'ProcessService',
        'FlowPropertyForFragmentService', 'FormatService', 'FragmentNavigationService', 'MODEL_BASE_CASE_SCENARIO_ID',
        function ($scope, $stateParams, $state, StatusService, $q, $log, ScenarioModelService, FragmentService,
                  FragmentFlowService, FlowForFragmentService, ProcessService, FlowPropertyForFragmentService,
                  FormatService, FragmentNavigationService, MODEL_BASE_CASE_SCENARIO_ID) {
            var fragmentID,
                scenarioID = MODEL_BASE_CASE_SCENARIO_ID,
            //
                graph = {},
                reverseIndex = {},  // map fragmentFlowID to graph.nodes and graph.links
                baseValue = 1E-14,  // sankey link base value (replaces 0).
                magFormat = FormatService.format();


            $scope.color = { domain: (["Fragment", "InputOutput", "Cutoff", "Process", "Background"]), range: colorbrewer.Set3[5], property: "nodeType" };
            $scope.selectedFlowProperty = null;
            $scope.selectedNode = null;
            $scope.mouseOverNode = null;
            $scope.fragment = null;
            $scope.scenario = null;
            $scope.$watch("selectedNode", onNodeSelectionChange);
            $scope.$watch("mouseOverNode", onMouseOverNode);

            $scope.onScenarioChange = function() {
                scenarioID = $scope.scenario.scenarioID;
                ScenarioModelService.setActiveID(scenarioID);
                getData();
            };

            $scope.viewFragmentFlowParam = function () {
                $state.go(".fragment-flow-param",
                    {scenarioID: scenarioID, fragmentID: fragmentID});
            };

            /**
             * Temporary workaround for flows with problem properties. Hide them
             * @param fpID
             * @returns {boolean}
             */
            function showFlowProperty(fpID) {
                var fp = FlowPropertyForFragmentService.get(fpID);
                return fp &&
                    !(fp["referenceUnit"] === "kgP" || fp["referenceUnit"] === "kg-Av" || fp["referenceUnit"] === "MJ-Av");
            }


            function filterFragmentFlow(ff) {
                return ff.nodeType !== "Cutoff" && ff.flowPropertyMagnitudes &&
                    showFlowProperty(ff.flowPropertyMagnitudes[0]["flowPropertyID"]);
            }

            /**
             * Build sankey graph from loaded data
             * @param {Boolean} makeNew  Indicates if new graph should be created. False means update existing graph.
             */
            function buildGraph(makeNew) {
                try {
                    var ff = FragmentFlowService.getAll(),
                        fragmentFlows = ff.filter (filterFragmentFlow);
                    graph.isNew = makeNew;
                    if (makeNew) {
                        reverseIndex = {};
                        graph.nodes = [];
                        graph.nodes.push(createRootNode());
                        // Add a node for every flow
                        fragmentFlows.forEach(addGraphNode);
                    }
                    // Add a link for every flow. source and target are indexes into nodes array.
                    graph.links = [];
                    fragmentFlows.forEach(addGraphLink);
                    $scope.graph = graph;
                }
                catch (err) {
                    StatusService.handleFailure(err);
                }
            }

            /**
             * Get magnitude of link with a flow property
             * @param {{fragmentFlowID:Number, parentFragmentFlowID:Number, direction: String, flowPropertyMagnitudes:Array}}  link
             * @param {Number}  flowPropertyID    flow property key
             * @return {Number} The magnitude, if link has the flow property. Otherwise, null.
             */
            function getMagnitude(link, flowPropertyID) {
                var magnitude = null, flowPropertyMagnitudes = [];
                if ("flowPropertyMagnitudes" in link) {
                    flowPropertyMagnitudes = link.flowPropertyMagnitudes.filter(
                        /**
                         * @param {{flowPropertyID:number}}  lm
                         */
                            function (lm) {
                            return +lm.flowPropertyID === flowPropertyID;
                        });
                }
                if (flowPropertyMagnitudes && flowPropertyMagnitudes.length > 0) {
                    magnitude = flowPropertyMagnitudes[0].magnitude *  $scope.fragment.activityLevel;
                }
                return magnitude;
            }

            function createRootNode() {
                return {
                    nodeType: "InputOutput",
                    nodeID: 0,
                    nodeName: "Reference Flow",
                    toolTip: "<strong>InputOutput</strong>"
                }
            }

            /**
             * Add graph node for fragment flow element
             * @param {{fragmentFlowID:number}} element
             */
            function addGraphNode(element) {
                var node = {
                        nodeType: element.nodeType,
                        nodeID: element.fragmentFlowID,
                        nodeName: "",
                        toolTip: ""
                    },
                    fragFlow = FragmentFlowService.get(element.fragmentFlowID),
                    refObj , selectTip
                    ;

                if (fragFlow) {
                    node.nodeName = fragFlow["shortName"];
                }
                if (node.nodeType) {
                    node.toolTip = "<strong>" + node.nodeType + "</strong>";
                }
                if ("processID" in element) {
                    refObj = ProcessService.get(element.processID);
                    node.selectable = true;
                    selectTip = "Click to view process instance";
                } else if ("subFragmentID" in element) {
                    refObj = FragmentService.get(element.subFragmentID);
                    node.selectable = true;
                    selectTip = "Click to descend";
                }
                if (refObj) {
                    node.toolTip = node.toolTip + "<p>" + refObj.name + "</p>";
                }
                if (selectTip) {
                    node.toolTip = node.toolTip + "<i><small>" + selectTip + "</small></i>";
                }

                reverseIndex[element.fragmentFlowID] = graph.nodes.push(node) - 1;
            }

            /**
             * Add graph link for fragmentflow element
             * @param {{fragmentFlowID:Number, parentFragmentFlowID:Number, direction:String, flowPropertyMagnitudes:Array}} element
             * @exception Error thrown if referenced flow not found
             */
            function addGraphLink(element) {
                var link, parentIndex,
                    nodeIndex = reverseIndex[element.fragmentFlowID],
                    magnitude = getMagnitude(element, $scope.selectedFlowProperty["flowPropertyID"]),
                    value = (magnitude === null || magnitude <= 0) ? baseValue : baseValue + magnitude,
                    flow = FlowForFragmentService.get(element.flowID),
                    unit = $scope.selectedFlowProperty["referenceUnit"];

                if ("parentFragmentFlowID" in element) {
                    if (element.parentFragmentFlowID in reverseIndex) {
                        parentIndex = reverseIndex[element.parentFragmentFlowID];
                    }
                    else {
                        return;
                    }
                } else {
                    parentIndex = 0;
                }
                link = {
                    nodeID: element.fragmentFlowID,
                    flowID: element.flowID,
                    value: value
                };
                if (flow) {
                    if (magnitude) {
                        link.magnitude = magnitude;
                        link.toolTip = flow.name + " : " + magFormat(magnitude) + " " + unit;
                    } else {
                        link.toolTip = flow.name + " does not have property : " + $scope.selectedFlowProperty["name"];
                    }
                } else {
                    throw new Error ("Flow with ID, " + flowID + ", was not found.");
                }
                if (element.direction === "Input") {
                    link.source = nodeIndex;
                    link.target = parentIndex;
                } else {
                    link.source = parentIndex;
                    link.target = nodeIndex;
                }
                graph.links.push(link);
            }

            /**
             * Prepare fragment data for visualization
             */
            function visualizeFragment() {
                setFlowProperties();
                buildGraph(true);
                StatusService.stopWaiting();
            }

            /**
             * If returning from another view, restore last fragment in navigation stack.
             * Otherwise, set to top-level fragment, activity level derived from scenario.
             */
            function initScopeFragment() {
                var fragState = FragmentNavigationService.getLast();
                if (fragState) {
                    $scope.fragment = fragState;
                    fragmentID = $scope.fragment.fragmentID;
                } else {
                    $scope.fragment = FragmentService.get(fragmentID);
                    if ($scope.fragment) {
                        $scope.fragment.activityLevel = $scope.scenario["activityLevel"];
                        FragmentNavigationService.add($scope.fragment);
                    } else {
                        StatusService.handleFailure("Invalid fragment ID : " + fragmentID);
                    }
                }
                return $scope.fragment;
            }

            /**
             * Prepare to display sub-fragment
             * Calculate sub-fragment activity level, push current fragment on breadcrumb stack
             * @param {{subFragmentID: Number, nodeWeight: Number}} fragmentFlow  containing selected sub-fragment
             */
            function navigateSubFragment( fragmentFlow) {
                var subFragment = FragmentService.get(fragmentFlow.subFragmentID);
                if (subFragment) {
                    subFragment.activityLevel = $scope.fragment.activityLevel * fragmentFlow.nodeWeight;
                    fragmentID = fragmentFlow.subFragmentID;
                    $scope.fragment = subFragment;
                    FragmentNavigationService.add($scope.fragment);
                    getDataForFragment();
                } else {
                    StatusService.handleFailure("Invalid sub-fragment ID : " + fragmentFlow.subFragmentID);
                }
            }

            /**
             * Function called after requests for resources have been fulfilled.
             */
            function handleSuccess() {
                $scope.scenarios = ScenarioModelService.getAll();
                $scope.scenario = ScenarioModelService.get(scenarioID);
                if ($scope.scenario) {
                    fragmentID = $scope.scenario.topLevelFragmentID;
                    ScenarioModelService.setActiveID(scenarioID);
                    $scope.navigationService = FragmentNavigationService.setContext(scenarioID, fragmentID);
                    initScopeFragment();
                    getDataForFragment();
                } else {
                    StatusService.handleFailure("Invalid scenarioID: " + scenarioID);
                }
            }

            /**
             * Update scope with flow properties and select one
             */
            function setFlowProperties() {
                //
                //  If the last flow property selection is not in the current list, reset to the default flow property,
                //  if that is in the list. Otherwise, set to first element in resource payload.
                //
                var selectedFlowProperty = $scope.selectedFlowProperty,
                    flowProperties = FlowPropertyForFragmentService.getAll();
                flowProperties.sort(FlowPropertyForFragmentService.compareByName);
                if (flowProperties) {
                    if (selectedFlowProperty) {
                        selectedFlowProperty = flowProperties.find(function (element) {
                            return (element["flowPropertyID"] === selectedFlowProperty["flowPropertyID"]);
                        });
                    }
                    if (!selectedFlowProperty) {
                        selectedFlowProperty = flowProperties.find(function (element) {
                            return (element.name === "Mass");
                        });
                        if (!selectedFlowProperty) {
                            selectedFlowProperty = flowProperties[0];
                        }
                    }
                } else {
                    selectedFlowProperty = null;
                }
                $scope.flowProperties = flowProperties;
                $scope.selectedFlowProperty = selectedFlowProperty;
            }

            /**
             * Get all data resources
             */
            function getData() {
                StatusService.startWaiting();
                $q.all([ScenarioModelService.load(), FragmentService.load(), ProcessService.load()])
                    .then(handleSuccess,
                    StatusService.handleFailure);
            }

            /**
             * Get data resources that are filtered by fragment.
             * Called after fragment selection changes.
             * If successful, visualize selected fragment.
             */
            function getDataForFragment() {
                StatusService.startWaiting();
                $q.all([FlowPropertyForFragmentService.load({fragmentID: fragmentID}),
                    FragmentFlowService.load({scenarioID: scenarioID, fragmentID: fragmentID}),
                    FlowForFragmentService.load({fragmentID: fragmentID})])
                    .then(visualizeFragment,
                    StatusService.handleFailure);
            }

            /**
             * Called when flow property selection changes.
             * Updates existing sankey graph.
             */
            $scope.onFlowPropertyChange = function () {
                buildGraph(false);
            };

            /**
             * Called when a parent fragment is selected from fragment breadcrumbs.
             * Updates fragment breadcrumbs and gets new fragment data.
             * @param fragment  Fragment selected
             * @param index     Breadcrumb index
             */
            $scope.onParentFragmentSelected = function (fragment, index) {
                fragmentID = fragment.fragmentID;
                $scope.fragment = fragment;
                FragmentNavigationService.setLast(index);
                getDataForFragment();
            };

            /**
             * Called when a node in sankey directive is selected.
             * The node can represent either a fragment or a process.
             * @param newVal    The selected node
             */
            function onNodeSelectionChange(newVal) {
                if (newVal) {
                    var fragmentFlow = FragmentFlowService.get(newVal.nodeID);
                    $log.info("Clicked on node with weight = " + fragmentFlow.nodeWeight);
                    switch (newVal.nodeType) {
                        case "Process" :
                            $state.go("fragment-sankey.process-instance", {
                                    scenarioID: scenarioID,
                                    fragmentID: fragmentID,
                                    fragmentFlowID: fragmentFlow.fragmentFlowID,
                                    activity: $scope.fragment.activityLevel *
                                    fragmentFlow.nodeWeight
                                }
                            );
                            break;
                        case "Fragment" :
                            navigateSubFragment(fragmentFlow);
                            break;
                    }
                }
            }

            /**
             * Get flow table content
             * For each Sankey link provided, get
             * flow name, magnitude and unit associated with selected flow property.
             * If the link does have the selected flow property, display
             * magnitude and unit for the
             * reference flow property.
             *
             * @param {Array}  nodeLinks     Sankey links
             * @return {Array}  Data for display in table
             */
            function getFlowRows(nodeLinks) {
                var flowData = [];

                nodeLinks.forEach( function (l) {
                    if ("flowID" in l) {
                        var flow = FlowForFragmentService.get(l.flowID),
                            flowPropertyID = $scope.selectedFlowProperty["flowPropertyID"],
                            magnitude = l.magnitude,
                            unit = "";
                        if (magnitude) {
                            unit = $scope.selectedFlowProperty["referenceUnit"];
                        } else  {
                            var fp, ff;
                            ff = FragmentFlowService.get(l.nodeID);
                            flowPropertyID = flow["referenceFlowPropertyID"];
                            magnitude = getMagnitude(ff, flowPropertyID);
                            fp = FlowPropertyForFragmentService.get(flowPropertyID);
                            if (fp) {
                               unit = fp["referenceUnit"];
                            }
                        }
                        flowData.push({ name: flow.name, magnitude: magnitude, unit: unit });
                    }
                });
                return flowData;
            }

            function onMouseOverNode(node) {
                if (node) {
                    $scope.inputFlows = getFlowRows(node.targetLinks);
                    $scope.outputFlows = getFlowRows(node.sourceLinks);
                }
            }

            function getActiveScenarioID() {
                var activeID = ScenarioModelService.getActiveID();
                if (activeID) {
                    scenarioID = activeID;
                }
            }

            function getStateParams() {
                if ( $stateParams.hasOwnProperty("scenarioID") && $stateParams.scenarioID !== undefined) {
                    scenarioID = +$stateParams.scenarioID;
                }
                if ($stateParams.hasOwnProperty("fragmentID") && $stateParams.fragmentID !== undefined) {
                    fragmentID = +$stateParams.fragmentID;
                }
            }

            getActiveScenarioID();
            getStateParams();
            getData();
        }]);