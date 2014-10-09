/**
 * Directive for reusable d3 sankey diagram
 */
angular.module('lcaApp.sankey.directive', ['d3.sankey'])
.directive('sankeyDiagram', ['SankeyService', function(SankeyService) {

    function link(scope, element, attrs) {

        // TODO : make the following settings configurable
        var margin = {
                top: 10,
                right: 20,
                bottom: 30,
                left: 20
            },
            width = 800 - margin.left - margin.right,   // diagram width
            height = 650 - margin.top - margin.bottom,  // diagram height
            sankeyWidth = width - 150, // leave room for labels on right
            svg,
            color = d3.scale.ordinal(),
            formatNumber = d3.format(",.0f"),
            /**
             * sankey variables
             */
            sankey = SankeyService
                .nodeWidth(20)
                .nodePadding(20)
                .size([sankeyWidth, height]),
            graph = {},
            baseValue = 1E-14,  // sankey link base value (replaces 0).
            minNodeHeight = 3,  // Minimum height of sankey node/link
            opacity = { node: 1, link: 0.2 }, // default opacity settings
            unit = "kg";

        /**
         * Initial preparation of svg element.
         */
        function prepareSvg(parentElement) {

            svg = d3.select(parentElement)
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .on("mouseleave", restoreView)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        }

        /**
         * Stand-in for accessor expression provided by scope
         * @param n     A graph node
         * @return string for node label
         */
        function getNodeLabel(n) {
            return n.nodeName;
        }

        /**
         * Stand-in for accessor expression provided by scope
         * @param l     A graph link
         * @return string for link tool tip
         */
        function getLinkTip(l) {
            return "Flow " + l.flowID + " : " + formatNumber(l.magnitude) + " " + unit;
        }

        /**
         * Get graph data from scope
         * TODO:
         * Data to be provided in scope. For now, hard-code.
         * @param scope
         */
        function getData(scope) {

            graph = {"nodes": [
                {"nodeTypeID": 3, "fragmentFlowID": 151, "nodeName": ""},
                {"nodeTypeID": 1, "fragmentFlowID": 152, "nodeName": "Scenario", "processID": 72},
                {"nodeTypeID": 2, "fragmentFlowID": 153, "nodeName": "Local Collection Mixer", "subFragmentID": 3},
                {"nodeTypeID": 3, "fragmentFlowID": 154, "nodeName": ""},
                {"nodeTypeID": 2, "fragmentFlowID": 155, "nodeName": "Inter-Facility Mixer", "subFragmentID": 7},
                {"nodeTypeID": 3, "fragmentFlowID": 156, "nodeName": ""},
                {"nodeTypeID": 3, "fragmentFlowID": 157, "nodeName": ""},
                {"nodeTypeID": 3, "fragmentFlowID": 158, "nodeName": ""},
                {"nodeTypeID": 3, "fragmentFlowID": 159, "nodeName": ""},
                {"nodeTypeID": 2, "fragmentFlowID": 160, "nodeName": "Waste Oil Preprocessing", "subFragmentID": 6},
                {"nodeTypeID": 3, "fragmentFlowID": 161, "nodeName": ""},
                {"nodeTypeID": 1, "fragmentFlowID": 162, "nodeName": "Transfer Losses", "processID": 9},
                {"nodeTypeID": 3, "fragmentFlowID": 163, "nodeName": ""},
                {"nodeTypeID": 3, "fragmentFlowID": 164, "nodeName": ""},
                {"nodeTypeID": 2, "fragmentFlowID": 165, "nodeName": "Haz Waste Landfill Output", "subFragmentID": 4},
                {"nodeTypeID": 3, "fragmentFlowID": 166, "nodeName": ""},
                {"nodeTypeID": 2, "fragmentFlowID": 167, "nodeName": "Haz Waste Incineration Output", "subFragmentID": 5},
                {"nodeTypeID": 3, "fragmentFlowID": 168, "nodeName": ""},
                {"nodeTypeID": 1, "fragmentFlowID": 169, "nodeName": "Wastewater to Treatment", "processID": 63},
                {"nodeTypeID": 3, "fragmentFlowID": 170, "nodeName": ""},
                {"nodeTypeID": 1, "fragmentFlowID": 171, "nodeName": "Waste water treatment (contains organic load)", "processID": 187},
                {"nodeTypeID": 4, "fragmentFlowID": 172, "nodeName": ""},
                {"nodeTypeID": 4, "fragmentFlowID": 173, "nodeName": ""},
                {"nodeTypeID": 1, "fragmentFlowID": 174, "nodeName": "Used Oil Rejuvenation/Other", "processID": 32},
                {"nodeTypeID": 3, "fragmentFlowID": 175, "nodeName": ""},
                {"nodeTypeID": 3, "fragmentFlowID": 176, "nodeName": ""},
                {"nodeTypeID": 1, "fragmentFlowID": 177, "nodeName": "UO water fraction", "processID": 38},
                {"nodeTypeID": 3, "fragmentFlowID": 178, "nodeName": ""},
                {"nodeTypeID": 3, "fragmentFlowID": 179, "nodeName": ""}
            ], "links": [
                {"flowID": 16, "fragmentFlowID": 151, "magnitude": 0.547163, "value": 0.54716300000001, "source": 1, "target": 0},
                {"flowID": 373, "fragmentFlowID": 152, "magnitude": 1, "value": 1.00000000000001, "source": 2, "target": 1},
                {"flowID": 860, "fragmentFlowID": 154, "magnitude": null, "value": 1e-14, "source": 2, "target": 3},
                {"flowID": 820, "fragmentFlowID": 155, "magnitude": null, "value": 1e-14, "source": 4, "target": 1},
                {"flowID": 346, "fragmentFlowID": 156, "magnitude": null, "value": 1e-14, "source": 1, "target": 5},
                {"flowID": 699, "fragmentFlowID": 157, "magnitude": null, "value": 1e-14, "source": 1, "target": 6},
                {"flowID": 475, "fragmentFlowID": 158, "magnitude": null, "value": 1e-14, "source": 1, "target": 7},
                {"flowID": 690, "fragmentFlowID": 159, "magnitude": 0.101098, "value": 0.10109800000001, "source": 1, "target": 8},
                {"flowID": 675, "fragmentFlowID": 160, "magnitude": null, "value": 1e-14, "source": 1, "target": 9},
                {"flowID": 351, "fragmentFlowID": 161, "magnitude": null, "value": 1e-14, "source": 9, "target": 10},
                {"flowID": 766, "fragmentFlowID": 162, "magnitude": 0.013594, "value": 0.01359400000001, "source": 1, "target": 11},
                {"flowID": 346, "fragmentFlowID": 163, "magnitude": null, "value": 1e-14, "source": 11, "target": 12},
                {"flowID": 617, "fragmentFlowID": 164, "magnitude": 0.186743, "value": 0.18674300000000998, "source": 1, "target": 13},
                {"flowID": 649, "fragmentFlowID": 165, "magnitude": 0.005305, "value": 0.00530500000001, "source": 1, "target": 14},
                {"flowID": 351, "fragmentFlowID": 166, "magnitude": null, "value": 1e-14, "source": 14, "target": 15},
                {"flowID": 622, "fragmentFlowID": 167, "magnitude": 0.001872, "value": 0.00187200000001, "source": 1, "target": 16},
                {"flowID": 351, "fragmentFlowID": 168, "magnitude": null, "value": 1e-14, "source": 16, "target": 17},
                {"flowID": 672, "fragmentFlowID": 169, "magnitude": 0.055951, "value": 0.05595100000001, "source": 1, "target": 18},
                {"flowID": 351, "fragmentFlowID": 170, "magnitude": null, "value": 1e-14, "source": 18, "target": 19},
                {"flowID": 602, "fragmentFlowID": 171, "magnitude": 0.055951, "value": 0.05595100000001, "source": 18, "target": 20},
                {"flowID": 421, "fragmentFlowID": 172, "magnitude": null, "value": 1e-14, "source": 21, "target": 20},
                {"flowID": 683, "fragmentFlowID": 173, "magnitude": null, "value": 1e-14, "source": 22, "target": 20},
                {"flowID": 619, "fragmentFlowID": 174, "magnitude": 0.009339, "value": 0.00933900000001, "source": 1, "target": 23},
                {"flowID": 651, "fragmentFlowID": 175, "magnitude": null, "value": 1e-14, "source": 23, "target": 24},
                {"flowID": 808, "fragmentFlowID": 176, "magnitude": 0.071822, "value": 0.07182200000001, "source": 1, "target": 25},
                {"flowID": 782, "fragmentFlowID": 177, "magnitude": null, "value": 1e-14, "source": 1, "target": 26},
                {"flowID": 655, "fragmentFlowID": 178, "magnitude": null, "value": 1e-14, "source": 26, "target": 27},
                {"flowID": 446, "fragmentFlowID": 179, "magnitude": 0.175463, "value": 0.17546300000001, "source": 26, "target": 28}
            ]}
        }

        function restoreView() {
            svg.selectAll(".node")
                .transition()
                .style("opacity", opacity.node);
            svg.selectAll(".link")
                .transition()
                .style("stroke-opacity", opacity.link);
        }

        /**
         * Respond to mouse over Sankey node
         * Fade other nodes and unconnected links
         *
         * @param {Object}  node    Reference to graph node data
         * @param {Number}  index   D3 data index
         */
        function onMouseOverNode(node, index) {
            d3.event.stopPropagation();
            svg.selectAll(".node")
                .transition()
                .style("opacity", function (d, i) {
                    return i === index ? opacity.node : 0.5;
                });

            svg.selectAll(".link")
                .transition()
                .style("stroke-opacity", function (l) {
                    return (
                        (l.source.fragmentFlowID === node.fragmentFlowID || l.target.fragmentFlowID === node.fragmentFlowID) ?
                            0.5 : opacity.link);
                });

            scope.$apply(function(){
                scope.selectedNode = node
            });
        }


        /**
         * Draw the sankey graph
         * @param {Boolean}  rebuild    Flag to indicate if this is a full redraw or an update
         */
        function drawSankey(rebuild) {

            var link, node,
                path = sankey.link(),
                transitionTime = 250;

            if (rebuild) {
                svg.selectAll("g").remove();
                svg.append("g").attr("id", "linkGroup");
                transitionTime = 0;
            }

            sankey.nodes(graph.nodes)
                .links(graph.links)
                .layout(10);

            link = svg.select("#linkGroup").selectAll(".link")
                .data(graph.links);
            if (rebuild) {
                link.enter().append("path")
                    .attr("class", "link")
                    .append("title");
            }
            link.transition().duration(transitionTime)
                .attr("d", path)
                .style("stroke-width", function (d) {
                    return Math.max(minNodeHeight, d.dy);
                })
                .style("stroke-dasharray", function (d) {
                    return (d.value === baseValue) ? "5,5" : null;
                })
                .style("stroke-opacity", 0.2)
                .sort(function (a, b) {
                    return b.dy - a.dy;
                });
            link.select("title")
                .text(function (d) {
                    return getLinkTip(d);
                });

            if (rebuild) {
                svg.append("g").attr("id", "nodeGroup");
            }
            node = svg.select("#nodeGroup").selectAll(".node")
                .data(graph.nodes);
            if (rebuild) {
                node.enter().append("g")
                    .attr("class", "node");
                node.append("rect");
                node.append("text");
            }
            node.transition().duration(transitionTime)
                .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                })
                .style("opacity", 1);
            node.selectAll("rect")
                .transition().duration(transitionTime)
                .attr("height", function (d) {
                    return Math.max(minNodeHeight, d.dy);
                })
                .attr({
                    width: sankey.nodeWidth()
                })
                .style("fill", function (d) {
                    d.color = color(d.nodeTypeID);
                    return d.color;
                });

            node.on('mouseover', onMouseOverNode);

            //
            // Position fragment flow name to the right or left of node.
            //
            node.selectAll("text")
                .transition().duration(transitionTime)
                .attr("y", function (d) {
                    return Math.max(minNodeHeight, d.dy) / 2;
                })
                .attr("dy", ".35em")
                .attr("text-anchor", "end")
                .attr("transform", null)
                .text(function (d) {
                    return getNodeLabel(d);
                })
                .attr("x", 6 + sankey.nodeWidth())
                .attr("text-anchor", "start");
            //
            // Nodes with click behavior
            //
            // TODO: make this controllable
//            node.filter(function (d) {
//                return (d.nodeTypeID === 2);
//            })
//                .style("cursor", "pointer")
//                .on("click", onNodeClick);

        }

        prepareSvg(element[0]);
        getData(scope);
        drawSankey(true);
    }

    return {
        restrict: 'E',
        scope: { getNodeLabel: '&', getLinkTip: '&', selectedNode: '=', selectedLink: '=', data: '=' },
        link: link
    }
}]);