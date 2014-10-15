'use strict';

angular.module('lcaApp.fragment.sankey', ['ngRoute', 'lcaApp.sankey', 'lcaApp.resources.service', 'lcaApp.idmap.service'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/fragment-sankey/:scenarioID/:fragmentID', {
    templateUrl: 'fragment-sankey/fragment-sankey.html',
    controller: 'FragmentSankeyCtrl'
  });
}])

.controller('FragmentSankeyCtrl', ['$scope', '$routeParams', 'ResourceService', 'IdMapService',

    function($scope, $routeParams, ResourceService, IdMapService) {
        var fragmentID = $routeParams.fragmentID,
            scenarioID = $routeParams.scenarioID,
            fragmentResource = ResourceService.getResource("fragment"),
            processResource = ResourceService.getResource("process"),
            ffpResource = ResourceService.getResource("fragmentFlowProperty"),
            ffResource = ResourceService.getResource("fragmentFlow"),
            fragments = fragmentResource.query(setFragments, handleFailure),
            processes = processResource.query(setProcesses, handleFailure),
            flowProperties = ffpResource.query({fragmentID: fragmentID}, setFlowProperties, handleFailure),
            fragmentFlows = ffResource.query({scenarioID: scenarioID, fragmentID: fragmentID}, setFragmentFlows, handleFailure),
            graph = {},
            reverseIndex = {},  // map fragmentFlowID to graph.nodes and graph.links
            defaultFlowPropertyID = 23,
            selectedFlowPropertyID = defaultFlowPropertyID,
            baseValue = 1E-14;  // sankey link base value (replaces 0).

        /**
         * Build sankey graph from loaded data
         */
        function buildGraph() {
            reverseIndex = {};
            graph.nodes = [];

            // Add a node for every flow
            fragmentFlows.forEach(function (element) {
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

            setGraphLinks();
        }

        /**
         * Get magnitude of link with a flow property
         * @param {Object}  link              Fragment link
         * @param {Number}  flowPropertyID    flow property key
         * @return {Number} The magnitude, if link has the flow property. Otherwise, null.
         */
        function getMagnitude(link, flowPropertyID) {
            var magnitude = null, flowPropertyMagnitudes = [];
            if ("flowPropertyMagnitudes" in link) {
                flowPropertyMagnitudes = link.flowPropertyMagnitudes.filter(function (lm) {
                    return +lm.flowPropertyID === flowPropertyID;
                });
            }
            if (flowPropertyMagnitudes && flowPropertyMagnitudes.length > 0) {
                magnitude = flowPropertyMagnitudes[0].magnitude;
            }
            return magnitude;
        }

        function setGraphLinks() {
            var nodeIndex = 0;

            graph.links = [];
            // Add a link for every flow. source and target are indexes into nodes array.
            fragmentFlows.forEach(function (element) {
                var link, parentIndex;
                nodeIndex = reverseIndex[element.fragmentFlowID];
                if ("parentFragmentFlowID" in element) {
                    var magnitude = getMagnitude(element, selectedFlowPropertyID),
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
            });
        }

        function resume() {
            // In the future, this will be used to reset progress indicator
        }

        function handleFailure() {
            resume();
        }

        function waitForOthers() {
            if ( "fragments" in $scope && "fragmentFlows" in $scope &&
                "flowProperties" in $scope && "processes" in $scope) {
                buildGraph();
                $scope.graph = graph;
                //$scope.$apply();
                resume();
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

        function setFlowProperties() {
            $scope.flowProperties = IdMapService.add("flowPropertyID", flowProperties);
            waitForOthers();
        }

        function setProcesses() {
            $scope.processes = IdMapService.add("processID", processes);
            waitForOthers();
        }
}]);