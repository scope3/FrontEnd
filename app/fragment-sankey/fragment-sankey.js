'use strict';
/* Controller for Fragment Sankey Diagram View */
angular.module('lcaApp.fragment.sankey',
                ['ui.router', 'lcaApp.sankey', 'lcaApp.resources.service', 'angularSpinner',
                 'ui.bootstrap.alert', 'lcaApp.format', 'lcaApp.fragmentNavigation.service'])
    .controller('FragmentSankeyCtrl',
        ['$scope', '$stateParams', '$state', 'usSpinnerService', '$q', '$log',
        'ScenarioService', 'FragmentService', 'FragmentFlowService', 'FlowForFragmentService', 'ProcessService',
        'FlowPropertyForFragmentService', 'NodeTypeService', 'FormatService', 'FragmentNavigationService',
        function ($scope, $stateParams, $state, usSpinnerService, $q, $log, ScenarioService, FragmentService,
                  FragmentFlowService, FlowForFragmentService, ProcessService, FlowPropertyForFragmentService,
                  NodeTypeService, FormatService, FragmentNavigationService) {
            var fragmentID = $stateParams.fragmentID,
                scenarioID = $stateParams.scenarioID,
            //
                graph = {},
                reverseIndex = {},  // map fragmentFlowID to graph.nodes and graph.links
                baseValue = 1E-14,  // sankey link base value (replaces 0).
                magFormat = FormatService.format();


            /**
             * Build sankey graph from loaded data
             * @param {Boolean} makeNew  Indicates if new graph should be created. False means update existing graph.
             */
            function buildGraph(makeNew) {
                var fragmentFlows = FragmentFlowService.getAll();
                graph.isNew = makeNew;
                if (makeNew) {
                    reverseIndex = {};
                    graph.nodes = [];
                    // Add a node for every flow
                    fragmentFlows.forEach(addGraphNode);
                }
                // Add a link for every flow. source and target are indexes into nodes array.
                graph.links = [];
                fragmentFlows.forEach(addGraphLink);
            }

            /**
             * Get magnitude of link with a flow property
             * @param {{fragmentFlowID:Number, parentFragmentFlowID:Number, directionID:Number, flowPropertyMagnitudes:Array}}  link
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

            /**
             * Add graph node for fragment flow element
             * @param {{fragmentFlowID:number}} element
             */
            function addGraphNode(element) {
                var node = {
                        nodeTypeID: element.nodeTypeID,
                        nodeID: element.fragmentFlowID,
                        nodeName: "",
                        toolTip: ""
                    },
                    fragFlow = FragmentFlowService.get(element.fragmentFlowID),
                    nodeType = NodeTypeService.get(element.nodeTypeID),
                    refObj , selectTip
                    ;

                if (fragFlow) {
                    node.nodeName = fragFlow["shortName"];
                }
                if (nodeType) {
                    node.toolTip = "<strong>" + nodeType.name + "</strong>";
                }
                if ("processID" in element) {
                    refObj = ProcessService.get(element.processID);
                    node.selectable = refObj["hasElementaryFlows"];
                    if (node.selectable) {
                        selectTip = "Click to perform LCIA";
                    }
//                    node.toolTip = node.toolTip + "<p>" + refObj.name + "</p>";
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
             * @param {{fragmentFlowID:Number, parentFragmentFlowID:Number, directionID:Number, flowPropertyMagnitudes:Array}} element
             */
            function addGraphLink(element) {
                var link, parentIndex,
                    nodeIndex = reverseIndex[element.fragmentFlowID];

                if ("parentFragmentFlowID" in element) {
                    var magnitude = getMagnitude(element, $scope.selectedFlowProperty["flowPropertyID"]),
                        value = (magnitude === null || magnitude <= 0) ? baseValue : baseValue + magnitude,
                        flow = FlowForFragmentService.get(element.flowID),
                        unit = $scope.selectedFlowProperty["referenceUnit"];

                    parentIndex = reverseIndex[element.parentFragmentFlowID];
                    link = {
                        nodeID: element.fragmentFlowID,
                        flowID: element.flowID,
                        value: value
                    };
                    if (magnitude) {
                        link.magnitude = magnitude;
                        link.toolTip = flow.name + " : " + magFormat(magnitude) + " " + unit;
                    } else {
                        link.toolTip = flow.name + " does not have property : " + $scope.selectedFlowProperty["name"];
                    }
                    if (element.directionID === 1) {
                        link.source = nodeIndex;
                        link.target = parentIndex;
                    } else {
                        link.source = parentIndex;
                        link.target = nodeIndex;
                    }
                    graph.links.push(link);
                }
            }

            function startWaiting() {
                $scope.alert = null;
                usSpinnerService.spin("spinner-lca");
            }

            function stopWaiting() {
                usSpinnerService.stop("spinner-lca");
            }


            function handleFailure(errMsg) {
                stopWaiting();
                $scope.alert = { type: "danger", msg: errMsg };
            }

            /**
             * Prepare fragment data for visualization
             */
            function visualizeFragment() {
                setFlowProperties();
                buildGraph(true);
                stopWaiting();
                $scope.graph = graph;
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
                        handleFailure("Invalid fragment ID : " + fragmentID);
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
                    handleFailure("Invalid sub-fragment ID : " + fragmentFlow.subFragmentID);
                }
            }

            /**
             * Function called after requests for resources have been fulfilled.
             */
            function handleSuccess() {
                $scope.scenario = ScenarioService.get(scenarioID);
                if ($scope.scenario) {
                    initScopeFragment();
                    getDataForFragment();
                } else {
                    handleFailure("Invalid scenarioID: " + scenarioID);
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
                startWaiting();
                $q.all([ScenarioService.load(), FragmentService.load(), ProcessService.load(),
//                    FlowPropertyForFragmentService.load({fragmentID: fragmentID}),
//                    FragmentFlowService.load({scenarioID: scenarioID, fragmentID: fragmentID}),
//                    FlowForFragmentService.load({fragmentID: fragmentID}),
                    NodeTypeService.load()])
                    .then(handleSuccess,
                    handleFailure);
            }

            /**
             * Get data resources that are filtered by fragment.
             * Called after fragment selection changes.
             * If successful, visualize selected fragment.
             */
            function getDataForFragment() {
                startWaiting();
                $q.all([FlowPropertyForFragmentService.load({fragmentID: fragmentID}),
                    FragmentFlowService.load({scenarioID: scenarioID, fragmentID: fragmentID}),
                    FlowForFragmentService.load({fragmentID: fragmentID})])
                    .then(visualizeFragment,
                    handleFailure);
            }

            /**
             * Called when flow property selection changes.
             * Updates existing sankey graph.
             */
            $scope.onFlowPropertyChange = function () {
                buildGraph(false);
                $scope.graph = graph;
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
                    switch (newVal.nodeTypeID) {
                        case 1 :
                            $state.go(".process", { scenarioID : scenarioID,
                                                             processID : fragmentFlow.processID,
                                                             activity : $scope.fragment.activityLevel *
                                                                        fragmentFlow.nodeWeight }
                            );
                            break;
                        case 2 :
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

            $scope.color = { domain: ([2, 3, 4, 1, 0]), range: colorbrewer.Set3[5], property: "nodeTypeID" };
            $scope.selectedFlowProperty = null;
            $scope.selectedNode = null;
            $scope.mouseOverNode = null;
            $scope.fragment = null;
            $scope.scenario = null;
            $scope.$watch("selectedNode", onNodeSelectionChange);
            $scope.$watch("mouseOverNode", onMouseOverNode);

            $scope.navigationService = FragmentNavigationService.setContext(scenarioID, fragmentID);

            getData();
        }]);