'use strict';
/* Controller for Fragment Sankey Diagram View */
angular.module('lcaApp.fragment.sankey',
                ['ui.router', 'lcaApp.sankey.directive', 'lcaApp.resources.service', 'lcaApp.status.service',
                 'lcaApp.format', 'lcaApp.fragmentNavigation.service', 'lcaApp.models.param', 'lcaApp.models.scenario',
                    'lcaApp.selection.service'])
    .controller('FragmentSankeyCtrl',
        ['$scope', '$stateParams', '$state', 'StatusService', '$q', '$log',
        'ScenarioModelService', 'FragmentService', 'FragmentFlowService', 'FlowForFragmentService', 'ProcessService',
        'FlowPropertyForFragmentService', 'FormatService', 'FragmentNavigationService', 'ParamModelService',
        function ($scope, $stateParams, $state, StatusService, $q, $log, ScenarioModelService, FragmentService,
                  FragmentFlowService, FlowForFragmentService, ProcessService, FlowPropertyForFragmentService,
                  FormatService, FragmentNavigationService, ParamModelService) {
            var defaultScenarioID = ScenarioModelService.getBaseCaseID(),
                defaultFragmentID = 0,
            //
                graph = {},
                reverseIndex = {},  // map fragmentFlowID to graph.nodes and graph.links
                baseValue = 1E-14,  // sankey link base value (replaces 0).
                magFormat = FormatService.format();


            $scope.color = { domain: (["Fragment", "InputOutput", "Process", "Cutoff",  "Background"]), range: colorbrewer.Set2[5], property: "nodeType" };
            $scope.selectedFlowProperty = null;
            $scope.selectedNode = null;
            $scope.mouseOverNode = null;
            $scope.fragment = null;
            $scope.scenario = null;
            $scope.$watch("selectedNode", onNodeSelectionChange);
            //$scope.$watch("mouseOverNode", onMouseOverNode);

            $scope.onScenarioChange = activateScenario;
            $scope.gridFlows = [];

            /**
             * Temporary workaround for flows with problem properties. Hide them
             * @param fpID
             * @returns {boolean}
             */
            function showFlowProperty(fpID) {
                var fp = FlowPropertyForFragmentService.get(fpID);
                if (!fp) {
                    StatusService.handleFailure("Unable to get data for flow property with ID: " + fpID);
                }
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
                        isBackground : element.isBackground,
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
                if (node.isBackground) {
                    node.toolTip = "<p>Background</p>"
                }
                if (node.nodeType) {
                    node.toolTip += "<strong>" + node.nodeType + "</strong>";
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
                    value = (magnitude) ? baseValue + Math.abs(magnitude) : baseValue,
                    flow = (element.hasOwnProperty("flowID") ? FlowForFragmentService.get(element.flowID) : null),
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

                if (flow) {
                    link = {
                        nodeID: element.fragmentFlowID,
                        flowID: element.flowID,
                        value: value
                    };
                    if (magnitude === null) {
                        link.unit = "N/A";
                        link.toolTip = flow.name;
                    } else {
                        link.magnitude = magnitude;
                        link.unit = unit;
                        link.toolTip = flow.name + " : " + magFormat(magnitude) + " " + unit;
                    }
                    if (element.direction === "Input") {
                        link.source = nodeIndex;
                        link.target = parentIndex;
                    } else {
                        link.source = parentIndex;
                        link.target = nodeIndex;
                    }
                    graph.links.push(link);
                } else {
                    throw new Error ("Flow with ID, " + flowID + ", was not found.");
                }
            }

            /**
             * Prepare fragment data for visualization
             */
            function visualizeFragment() {
                setFlowProperties();
                buildGraph(true);
                loadGrid();
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
                } else {
                    $scope.fragment = FragmentService.get($scope.scenario.topLevelFragmentID);
                    if ($scope.fragment) {
                        $scope.fragment.activityLevel = $scope.scenario["activityLevel"];
                        FragmentNavigationService.add($scope.fragment);
                    } else {
                        StatusService.handleFailure("Scenario, " + $scope.scenario.name + ", has invalid fragment ID : "
                        + $scope.scenario.topLevelFragmentID);
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
                    $scope.fragment = subFragment;
                    FragmentNavigationService.add($scope.fragment);
                    getDataForFragment();
                } else {
                    StatusService.handleFailure("Invalid sub-fragment ID : " + fragmentFlow.subFragmentID);
                }
            }

            /**
             * Initialize scenario selection
             */
            function initScopeScenario() {
                var scenario;

                $scope.scenarios = ScenarioModelService.getAll();

                scenario = ScenarioModelService.get(defaultScenarioID);
                if (!scenario) {
                    // Active scenario may have been deleted
                    // Grab first one in list
                    if ($scope.scenarios.length > 0) {
                        scenario = $scope.scenarios[0];
                    }
                }
                if (scenario) {
                    if (defaultFragmentID && scenario.topLevelFragmentID !== defaultFragmentID) {
                        //
                        // Previously selected fragmentID  may no longer be the top-level fragment of the
                        // current scenario. In this case, activate first scenario selected in Fragment LCIA,
                        // if one exists.
                        //
                        var selectedScenarios = ScenarioModelService.getSelectedScenarioIDs();
                        if (selectedScenarios.length > 0) {
                            var newScenario = ScenarioModelService.get(selectedScenarios[0]);
                            if (newScenario) {
                                scenario = newScenario;
                            }
                        }
                    }
                    $scope.scenario = scenario;
                }
            }

            /**
             * Activate scenario and get its top-level fragment data.
             */
            function activateScenario() {
                if ($scope.scenario) {
                    ScenarioModelService.setActiveID($scope.scenario.scenarioID);
                    $scope.navigationService =
                        FragmentNavigationService.setContext($scope.scenario.scenarioID, $scope.scenario.topLevelFragmentID);
                    initScopeFragment();
                    getDataForFragment();
                }
            }

            /**
             * Function called after requests for resources have been fulfilled.
             */
            function displayLoadedData() {
                if (!$scope.scenario) {
                    initScopeScenario();
                }
                activateScenario();
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
                    .then(displayLoadedData,
                    StatusService.handleFailure);
            }

            /**
             * Get data resources that are associated with fragment.
             * Called after fragment selection changes.
             * If successful, visualize selected fragment.
             */
            function getDataForFragment() {
                var fragmentID = $scope.fragment.fragmentID;
                StatusService.startWaiting();
                $q.all([FlowPropertyForFragmentService.load({fragmentID: fragmentID}),
                    FragmentFlowService.load({scenarioID: $scope.scenario.scenarioID, fragmentID: fragmentID}),
                    FlowForFragmentService.load({fragmentID: fragmentID}),
                    ParamModelService.load($scope.scenario.scenarioID)])
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
                    switch (newVal.nodeType) {
                        case "Process" :
                            $state.go(".process-instance", {
                                    scenarioID: $scope.scenario.scenarioID,
                                    fragmentID: $scope.fragment.fragmentID,
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

            ///**
            // * Get flow table content
            // * For each Sankey link provided, get
            // * flow name, magnitude and unit associated with selected flow property.
            // * If the link does have the selected flow property, display
            // * magnitude and unit for the
            // * reference flow property.
            // *
            // * @param {Array}  nodeLinks     Sankey links
            // * @return {Array}  Data for display in table
            // */
            //function getFlowRows(nodeLinks) {
            //    var flowData = [];
            //
            //    nodeLinks.forEach( function (l) {
            //        if ("flowID" in l) {
            //            var flow = FlowForFragmentService.get(l.flowID),
            //                flowPropertyID = $scope.selectedFlowProperty["flowPropertyID"],
            //                magnitude = l.magnitude,
            //                unit = "";
            //            if (magnitude) {
            //                unit = $scope.selectedFlowProperty["referenceUnit"];
            //            } else  {
            //                var fp, ff;
            //                ff = FragmentFlowService.get(l.nodeID);
            //                flowPropertyID = flow["referenceFlowPropertyID"];
            //                magnitude = getMagnitude(ff, flowPropertyID);
            //                fp = FlowPropertyForFragmentService.get(flowPropertyID);
            //                if (fp) {
            //                   unit = fp["referenceUnit"];
            //                }
            //            }
            //            flowData.push({ name: flow.name, magnitude: magnitude, unit: unit });
            //        }
            //    });
            //    return flowData;
            //}
            //
            //function onMouseOverNode(node) {
            //    if (node) {
            //        $scope.inputFlows = getFlowRows(node.targetLinks);
            //        $scope.outputFlows = getFlowRows(node.sourceLinks);
            //    }
            //}

            function getSelectedFragmentID() {
                var selectedTopLevelFragmentID = ScenarioModelService.getSelectedTopLevelFragmentID();
                if (selectedTopLevelFragmentID) {
                    defaultFragmentID = selectedTopLevelFragmentID;
                }
            }

            function getActiveScenarioID() {
                var activeID = ScenarioModelService.getActiveID();
                if (activeID) {
                    defaultScenarioID = activeID;
                }
            }

            function getStateParams() {
                if ( $stateParams.hasOwnProperty("scenarioID") && $stateParams.scenarioID !== undefined) {
                    defaultScenarioID = +$stateParams.scenarioID;
                }
                if ($stateParams.hasOwnProperty("fragmentID") && $stateParams.fragmentID !== undefined) {
                    defaultFragmentID = +$stateParams.fragmentID;
                }
            }

            function defineGridColumns() {
                $scope.columns = [
                    {field: 'link.source.nodeName', displayName: 'Source Node', enableCellEdit: false},
                    {field: 'link.target.nodeName', displayName: 'Target Node', enableCellEdit: false, width: 70},
                    {field: 'quantity', displayName: 'Quantity', enableCellEdit: false},
                    {field: 'link.magnitude', displayName: 'Magnitude', cellFilter: 'numFormat', enableCellEdit: false, width: 120},
                    {field: 'link.unit', displayName: 'Unit', enableCellEdit: false, width: 70}
                ];
            }

            function defineGrids() {
                defineGridColumns();
                $scope.params = { targetIndex : 2, canUpdate : false };
            }


            function loadGrid() {
                var gridFlows = [];
                graph.links.forEach( function(l) {
                    var fragmentFlowID = l.nodeID,
                        paramResource = ParamModelService.getFragmentFlowParam($scope.scenario.scenarioID, fragmentFlowID),
                        gridFlow = {link: l},
                        fragmentFlow = FragmentFlowService.get(fragmentFlowID)
                        ;
                    if (paramResource) {
                        gridFlow.paramWrapper = ParamModelService.wrapParam(paramResource);
                        gridFlow.quantity = paramResource.defaultValue;
                    } else if (fragmentFlow) {
                        gridFlow.quantity =  fragmentFlow.magnitude / fragmentFlow.nodeWeight;
                        if (fragmentFlow.nodeType === "Process")
                        {
                            gridFlow.paramWrapper = ParamModelService.naParam("reference");
                        }
                        else if (fragmentFlow["isBalanceFlow"]) {
                            gridFlow.paramWrapper = ParamModelService.naParam("balance");
                        } else {
                            if (fragmentFlow.parentFragmentFlowID) {
                                var parent = FragmentFlowService.get(fragmentFlow.parentFragmentFlowID);
                                if (parent && parent.nodeType === "Process") {
                                    gridFlow.paramWrapper = ParamModelService.wrapParam(null);
                                }
                            }
                            if (!gridFlow.paramWrapper) {
                                gridFlow.paramWrapper = ParamModelService.naParam();
                            }
                        }
                    }
                    gridFlows.push(gridFlow);
                });
                $scope.gridFlows = gridFlows;
            }

            getSelectedFragmentID();
            getActiveScenarioID();
            getStateParams();
            defineGrids();
            getData();
        }]);