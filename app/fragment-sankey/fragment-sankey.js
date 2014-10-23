'use strict';

angular.module('lcaApp.fragment.sankey', ['ngRoute', 'lcaApp.sankey', 'lcaApp.resources.service',
               'lcaApp.idmap.service', 'angularSpinner'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/fragment-sankey/:scenarioID/:fragmentID', {
    templateUrl: 'fragment-sankey/fragment-sankey.html',
    controller: 'FragmentSankeyCtrl'
  });
}])


.controller('FragmentSankeyCtrl',
    ['$scope', '$routeParams', 'ResourceService', 'IdMapService', 'usSpinnerService','$q', '$window',
    function($scope, $routeParams, ResourceService, IdMapService, usSpinnerService, $q, $window) {
        var fragmentID = $routeParams.fragmentID,
            scenarioID = $routeParams.scenarioID,
            fragmentResource = ResourceService.getResource("fragment"),
            processResource = ResourceService.getResource("process"),
            ffpResource = ResourceService.getResource("fragmentFlowProperty"),
            ffResource = ResourceService.getResource("fragmentFlow"),
            flowResource = ResourceService.getResource("flowForFragment"),
            // Resource query results
            fragments,
            processes,
            flowProperties,
            fragmentFlows,
            flows,
            scenario,
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
                            nodeName: ""
                            },
                            fragFlow = IdMapService.get("fragmentFlowID", element.fragmentFlowID);

                        if (fragFlow) {
                            node.nodeName = fragFlow["shortName"];
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
         * Add graph link for fragmentflow element
         * @param {{fragmentFlowID:Number, parentFragmentFlowID:Number, directionID:Number, flowPropertyMagnitudes:Array}} element
         */
        function addGraphLink(element) {
            var link, parentIndex,
                nodeIndex = reverseIndex[element.fragmentFlowID],
                activityLevel = scenario["activityLevel"];

            if ("parentFragmentFlowID" in element) {
                var magnitude = getMagnitude(element, $scope.selectedFlowProperty["flowPropertyID"], activityLevel),
                    value = (magnitude === null || magnitude <= 0) ? baseValue : baseValue + magnitude,
                    flow = IdMapService.get("flowID", element.flowID),
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

        function handleSuccess() {
            setFlowProperties();
            IdMapService.add("fragmentFlowID", fragmentFlows);
            IdMapService.add("flowID", flows);
            buildGraph(true);
            stopWaiting();
            $scope.graph = graph;
        }

        function setFragments() {
            // TODO: display fragment name in breadcrumb
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
         * Update scope with flow properties and select one
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
        }

        function setProcesses() {
            IdMapService.add("processID", processes);
        }

        function getRelatedObjects() {
            fragments = fragmentResource.query(setFragments);
            processes = processResource.query(setProcesses);
            flowProperties = ffpResource.query({fragmentID: fragmentID});
            fragmentFlows = ffResource.query({scenarioID: scenarioID, fragmentID: fragmentID});
            flows = flowResource.query({fragmentID: fragmentID});
            $q.all([fragments.$promise, processes.$promise, flowProperties.$promise, fragmentFlows.$promise, flows.$promise])
                .then(handleSuccess,
                handleFailure);
        }

        function getSelectedScenario() {
            scenario = IdMapService.get("scenarioID", scenarioID);
            if (scenario) {
                getRelatedObjects();
            }
            else {
                // page was probably refreshed, need to query for resource
                var scenarioResource = ResourceService.getResource("scenario");
                scenarioResource.query( {},
                    function(scenarios) {
                        IdMapService.add("scenarioID", scenarios);
                        scenario = IdMapService.get("scenarioID", scenarioID);
                        if (scenario) {
                            getRelatedObjects();
                        } else {
                            handleFailure("Invalid ScenarioID : " + scenarioID);
                        }
                    }, handleFailure);
            }
        }

        $scope.onFlowPropertyChange = function () {
            //console.log("Flow property changed. Current: " + $scope.selectedFlowProperty.name);
            buildGraph(false);
            $scope.graph = graph;
        };

        usSpinnerService.spin("spinner-lca");
        $scope.color = { domain: ([2, 3, 4, 1, 0]), range : colorbrewer.Set3[5], property: "nodeTypeID" };
        $scope.selectedFlowProperty = null;
        if ( getSelectedScenario()) {

        }
}]);