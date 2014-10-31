'use strict';
/* Controller for Fragment Sankey Diagram View */
angular.module('lcaApp.fragment.sankey',
                ['ui.router', 'lcaApp.sankey', 'lcaApp.resources.service', 'lcaApp.idmap.service', 'angularSpinner'])
    .controller('FragmentSankeyCtrl',
        ['$scope', '$stateParams', 'usSpinnerService', '$q', '$window',
        'ScenarioService', 'FragmentService', 'FragmentFlowService', 'FlowForFragmentService', 'ProcessService',
        'FlowPropertyForFragmentService', 'NodeTypeService',
        function ($scope, $stateParams, usSpinnerService, $q, $window, ScenarioService, FragmentService,
                  FragmentFlowService, FlowForFragmentService, ProcessService, FlowPropertyForFragmentService,
                  NodeTypeService) {
            var fragmentID = $stateParams.fragmentID,
                scenarioID = $stateParams.scenarioID,
            //
                graph = {},
                reverseIndex = {},  // map fragmentFlowID to graph.nodes and graph.links
                baseValue = 1E-14;  // sankey link base value (replaces 0).


            /**
             * Build sankey graph from loaded data
             * @param {Boolean} makeNew  Indicates if new graph should be created. False means update existing graph.
             */
            function buildGraph(makeNew) {
                var fragmentFlows = FragmentFlowService.objects;
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
             * @param {Number}  activityLevel    current scenario's activity level
             * @return {Number} The magnitude, if link has the flow property. Otherwise, null.
             */
            function getMagnitude(link, flowPropertyID, activityLevel) {
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
                    magnitude = flowPropertyMagnitudes[0].magnitude * activityLevel;
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
                    refObj //, navState
                    ;

                if (fragFlow) {
                    node.nodeName = fragFlow["shortName"];
                }
                if (nodeType) {
                    node.toolTip = "<strong>" + nodeType.name + "</strong>";
                }
                if ("processID" in element) {
                    refObj = ProcessService.get(element.processID);
//                    node.toolTip = node.toolTip + "<p>" + refObj.name + "</p>";
                } else if ("subFragmentID" in element) {
                    refObj = FragmentService.get(element.subFragmentID);
//                    navState = "scenarios.fragment({fragmentID: " + fragmentID +
//                        ", scenarioID: " + scenarioID + "})";
//                    node.toolTip = node.toolTip + "<p><a ui-sref='" + navState +  "'>" + refObj.name + "</a></p>";
//                    navState = "#/scenarios/" + scenarioID + "/fragment-sankey/" + fragmentID;
//                    node.toolTip = node.toolTip + "<p><a href='" + navState +  "'>" + refObj.name + "</a></p>";
                }
                if (refObj) {
                    node.selectable = true;
                    node.toolTip = node.toolTip + "<p>" + refObj.name +
                        "</p><i><small>Click to navigate</small></i>";
                }

                reverseIndex[element.fragmentFlowID] = graph.nodes.push(node) - 1;
            }

            /**
             * Add graph link for fragmentflow element
             * @param {{fragmentFlowID:Number, parentFragmentFlowID:Number, directionID:Number, flowPropertyMagnitudes:Array}} element
             */
            function addGraphLink(element) {
                var link, parentIndex,
                    nodeIndex = reverseIndex[element.fragmentFlowID],
                    activityLevel = $scope.scenario["activityLevel"];

                if ("parentFragmentFlowID" in element) {
                    var magnitude = getMagnitude(element, $scope.selectedFlowProperty["flowPropertyID"], activityLevel),
                        value = (magnitude === null || magnitude <= 0) ? baseValue : baseValue + magnitude,
                        flow = FlowForFragmentService.get(element.flowID),
                        unit = $scope.selectedFlowProperty["referenceUnit"];

                    parentIndex = reverseIndex[element.parentFragmentFlowID];
                    link = {
                        nodeID: element.fragmentFlowID,
                        value: value
                    };
                    if (magnitude) {
                        link.magnitude = magnitude;
                        link.toolTip = flow.name + " : " + magnitude.toPrecision(3) + " " + unit;
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

            function stopWaiting() {
                usSpinnerService.stop("spinner-lca");
            }

            function handleFailure(errMsg) {
                stopWaiting();
                $window.alert(errMsg);
            }

            /**
             * Prepare fragment data for visualization
             */
            function visualizeFragment() {
                $scope.fragment = FragmentService.get(fragmentID);
                if ($scope.fragment) {
                    setFlowProperties();
                    buildGraph(true);
                    stopWaiting();
                    $scope.graph = graph;
                } else {
                    handleFailure("Invalid fragmentID: " + fragmentID);
                }
            }

            /**
             * Function called after requests for resources have been fulfilled.
             */
            function handleSuccess() {
                $scope.scenario = ScenarioService.get(scenarioID);
                if ($scope.scenario) {
                    visualizeFragment();
                } else {
                    handleFailure("Invalid scenarioID: " + scenarioID);
                }
            }

            /**
             * Compare function used to sort array of objects by name
             */
            function compareNames(a, b) {
                if (a.name > b.name) {
                    return 1;
                }
                if (a.name < b.name) {
                    return -1;
                }
                // a must be equal to b
                return 0;
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
                    flowProperties = FlowPropertyForFragmentService.objects;
                flowProperties.sort(compareNames);
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
                $q.all([ScenarioService.load(), FragmentService.load(), ProcessService.load(),
                    FlowPropertyForFragmentService.load({fragmentID: fragmentID}),
                    FragmentFlowService.load({scenarioID: scenarioID, fragmentID: fragmentID}),
                    FlowForFragmentService.load({fragmentID: fragmentID}),
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
                //console.log("Flow property changed. Current: " + $scope.selectedFlowProperty.name);
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
                $scope.parentFragments.splice(index);
                fragmentID = fragment.fragmentID;
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
                    if (newVal.nodeTypeID === 2) {
                        $scope.parentFragments.push($scope.fragment);
                        $scope.fragment = null;
                        fragmentID = fragmentFlow.subFragmentID;
                        getDataForFragment();
                    }
                }
            }

            usSpinnerService.spin("spinner-lca");
            $scope.color = { domain: ([2, 3, 4, 1, 0]), range: colorbrewer.Set3[5], property: "nodeTypeID" };
            $scope.selectedFlowProperty = null;
            $scope.selectedNode = null;
            $scope.parentFragments = [];
            $scope.fragment = null;
            $scope.scenario = null;
            $scope.$watch("selectedNode", onNodeSelectionChange);
            getData();

        }]);