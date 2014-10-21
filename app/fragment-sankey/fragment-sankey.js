'use strict';

angular.module('lcaApp.fragment.sankey', ['ngRoute', 'lcaApp.sankey', 'lcaApp.resources.service',
               'lcaApp.idmap.service', 'angularSpinner'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/fragment-sankey/:scenarioID/:fragmentID', {
    templateUrl: 'fragment-sankey/fragment-sankey.html',
    controller: 'FragmentSankeyCtrl'
  });
}])


.controller('FragmentSankeyCtrl', ['$scope', '$routeParams', 'ResourceService', 'IdMapService', 'usSpinnerService',

    function($scope, $routeParams, ResourceService, IdMapService, usSpinnerService) {
        var fragmentID = $routeParams.fragmentID,
            scenarioID = $routeParams.scenarioID,
            fragmentResource = ResourceService.getResource("fragment"),
            processResource = ResourceService.getResource("process"),
            ffpResource = ResourceService.getResource("fragmentFlowProperty"),
            ffResource = ResourceService.getResource("fragmentFlow"),
            // Resource query results
            fragments,
            processes,
            flowProperties,
            fragmentFlows,
            //
            graph = {},
            reverseIndex = {},  // map fragmentFlowID to graph.nodes and graph.links
            baseValue = 1E-14;  // sankey link base value (replaces 0).

        /**
         * Build sankey graph from loaded data
         * @param {Boolean} makeNew  Indicates if new graph should be created. False means update existing graph.
         */
        function buildGraph(makeNew) {

            graph.isNew = makeNew;
            if (makeNew) {
                reverseIndex = {};
                graph.nodes = [];

                // Add a node for every flow
                fragmentFlows.forEach(
                    /**
                     * @param {{fragmentFlowID:number}} element
                     */
                        function (element) {
                        var node = {
                            nodeTypeID: element.nodeTypeID,
                            nodeID: element.fragmentFlowID,
                            nodeName: "" // Name of referenced object, if any
                        };
                        if ("processID" in element) {
                            node.processID = element.processID;
                            if (node.processID in $scope.processes) {
                                node.nodeName = $scope.processes[node.processID].name;
                            }
                        }
                        if ("subFragmentID" in element) {
                            node.subFragmentID = element.subFragmentID;
                            if (node.subFragmentID in $scope.fragments) {
                                node.nodeName = $scope.fragments[node.subFragmentID].name;
                            }
                        }
                        reverseIndex[element.fragmentFlowID] = graph.nodes.push(node) - 1;
                 });
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
                magnitude = flowPropertyMagnitudes[0].magnitude;
            }
            return magnitude;
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
                    value = (magnitude === null || magnitude <= 0) ? baseValue : baseValue + magnitude;
                parentIndex = reverseIndex[element.parentFragmentFlowID];
                link = {
                    flowID: element.flowID,
                    nodeID: element.fragmentFlowID,
                    magnitude: magnitude,
                    value: value
                };
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

        function resume() {
            usSpinnerService.stop("spinner-lca");
        }

        function handleFailure() {
            resume();
        }

        function waitForOthers() {
            if ( "fragments" in $scope && "fragmentFlows" in $scope &&
                "flowProperties" in $scope && "processes" in $scope) {
                buildGraph(true);
                resume();
                $scope.graph = graph;
            }
        }

        function setFragments() {
            $scope.fragments = IdMapService.add("fragmentID", fragments);
            waitForOthers();
        }

        function setFragmentFlows() {
            $scope.fragmentFlows = IdMapService.add("fragmentFlowID", fragmentFlows);
            waitForOthers();
        }

        function compareNames (a, b) {
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
         * Callback for successful flow properties query
         */
        function setFlowProperties() {
            //
            //  If the last flow property selection is not in the current list, reset to the default flow property,
            //  if that is in the list. Otherwise, set to first element in resource payload.
            //
            var selectedFlowProperty = $scope.selectedFlowProperty;
            flowProperties.sort( compareNames );
            if ( flowProperties) {
                if (selectedFlowProperty) {
                    selectedFlowProperty = flowProperties.find( function(element) {
                        return (element["flowPropertyID"] === selectedFlowProperty["flowPropertyID"]);
                    });
                }
                if ( !selectedFlowProperty ) {
                    selectedFlowProperty = flowProperties.find( function(element) {
                        return (element.name === "Mass");
                    });
                    if ( !selectedFlowProperty ) {
                        selectedFlowProperty = flowProperties[0];
                    }
                }
            } else {
                selectedFlowProperty = null;
            }
            $scope.flowProperties = flowProperties;
            $scope.selectedFlowProperty = selectedFlowProperty;
            waitForOthers();
        }

        function setProcesses() {
            $scope.processes = IdMapService.add("processID", processes);
            waitForOthers();
        }


        $scope.onFlowPropertyChange = function () {
            //console.log("Flow property changed. Current: " + $scope.selectedFlowProperty.name);
            buildGraph(false);
            $scope.graph = graph;
        };

        usSpinnerService.spin("spinner-lca");
        $scope.color = { domain: ([2, 3, 4, 1, 0]), range : colorbrewer.Set3[5], property: "nodeTypeID" };
        $scope.selectedFlowProperty = null;
        fragments = fragmentResource.query(setFragments, handleFailure);
        processes = processResource.query(setProcesses, handleFailure);
        flowProperties = ffpResource.query({fragmentID: fragmentID}, setFlowProperties, handleFailure);
        fragmentFlows = ffResource.query({scenarioID: scenarioID, fragmentID: fragmentID}, setFragmentFlows, handleFailure);

}]);