/**
 * Directive for reusable d3 sankey diagram
 */
angular.module('lcaApp.sankey.directive', ['d3.sankey', 'd3.tip'])
.directive('sankeyDiagram', ['SankeyService', 'TipService', function( SankeyService, TipService) {

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
            opacity = { node: 1, link: 0.2 }; // default opacity settings

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
         * Get string for node label
         * @param n     A graph node
         * @return string for node label
         */
        function getNodeLabel(n) {
            return n.nodeName;
        }

        function onGraphChanged(newVal, oldVal) {
            TipService.hide();
            if (newVal) {
                graph = scope.graph;
                drawSankey(graph["isNew"]);
            }
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
                        (l.source.nodeID === node.nodeID || l.target.nodeID === node.nodeID) ?
                            0.5 : opacity.link);
                });
            TipService.show(node, index);
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
                    if ("toolTip" in d)
                        return d["toolTip"];
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
                .attr("height", function (n) {
                    return Math.max(minNodeHeight, n.dy);
                })
                .attr({
                    width: sankey.nodeWidth()
                })
                .style("fill", function (n) {
                    n.color = color(n[scope.color.property]);
                    return n.color;
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

        function prepareToolTip() {
            // Initialize tooltip plugin
            TipService
                .offset([-10, -10])
                .direction('ne')
                .html(function (d) {
                    if ("toolTip" in d) {
                        return d["toolTip"];
                    }
                })
                .style("background", function (d) {
                    if (d && scope.color.property in d) {
                        return color(d[scope.color.property]);
                    }
                });
            svg.call(TipService);
            TipService.hide();
        }

        prepareSvg(element[0]);
        color.domain(scope.color.domain);
        color.range(scope.color.range);
        scope.$watch('graph.links', onGraphChanged);
        prepareToolTip();

    }

    return {
        restrict: 'E',
        scope: { graph: '=', color: '='},
        link: link
    }
}]);