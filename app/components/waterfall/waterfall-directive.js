/**
 * Directive for reusable waterfall chart
 */
angular.module('lcaApp.waterfall.directive', ['lcaApp.waterfall', 'lcaApp.format'])
    .directive('waterfallChart', ['WaterfallService', 'FormatService', function( WaterfallService, FormatService) {

        function link(scope, element, attrs) {
            var margin = {
                    top: 10,
                    right: 10,
                    bottom: 10,
                    left: 10
                },
                parentElement = element[0],
                yAxisWidth = 250,
                width = parentElement.clientWidth - margin.left - margin.right,   // diagram width
                height = parentElement.clientHeight - margin.top - margin.bottom,
                xScale = d3.scale.linear().rangeRound([0, width]),
                labelFormat = FormatService.format("^.2g"),// Format numbers with precision 2, centered
                xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .ticks(4)
                    .tickFormat(labelFormat),
                svg = null;

            /**
             * Initial preparation of svg element.
             */
            function prepareSvg() {
                svg = d3.select(parentElement).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom);

                svg.append("g")
                    .attr("class", "chart-group")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            }

            function drawWaterfall() {
                var waterfall = scope.service,  // Waterfall service
                    chartGroup, barGroup,
                    scenarioSegments = waterfall.segments[scope.index],
                    chartHeight = 0,
                    minVal = 0.0, maxVal = 0.0,
                    lineColor = d3.rgb(scope.color).darker(2);

                chartGroup = svg.select(".chart-group");
                if (scenarioSegments.length > 0) {
                    chartHeight = scenarioSegments[scenarioSegments.length - 1].y
                        + waterfall.segmentHeight() + waterfall.segmentPadding();
                    // Draw bars
                    barGroup = chartGroup.selectAll(".bar.g")
                        .data(scenarioSegments);
                    barGroup.enter().append("g")
                        .attr("class", "bar g");
                    barGroup.exit().remove();
                    barGroup.append("rect")
                        .attr("class", "bar rect")
                        .attr("height", waterfall.segmentHeight())
                        .attr("x", function (d) {
                            return d.x;
                        })
                        .attr("y", function (d) {
                            return d.y;
                        })
                        .attr("width", function (d) {
                            return d.width > 0 ? d.width : 0.1;
                        })
                        .style("fill", scope.color)
                        .style("stroke", lineColor);
                    // Label bars
                    barGroup.append("text")
                        .attr("class", "bar text")
                        .attr("x", function (d) {
                            return (d.width < 50) ?
                                d.x + d.width + 5 :
                                d.x + d.width / 2;
                        })
                        .style("text-anchor",  function (d) {
                            return (d.width < 50) ? "start" : "middle";
                        })
                        .attr("y", function (d) {
                            return d.y + (waterfall.segmentHeight() / 2);
                        })
                        .attr("dy", ".5em")
                        .text(function (d) {
                            return labelFormat(d.value);
                        });
                    // Connect bars
                    barGroup.append("line")
                        .attr("class", "bar line")
                        .attr("x1", function (d) {
                            return d.endX;
                        })
                        .attr("y1", function (d) {
                            return d.y + waterfall.segmentHeight();
                        })
                        .attr("x2", function (d) {
                            return d.endX;
                        })
                        .attr("y2", function (d) {
                            return d.y + waterfall.segmentHeight() + waterfall.segmentPadding();
                        })
                        .style("stroke", lineColor);
                    return margin.top + chartHeight + margin.bottom;
                }
                return 0;
            }

            prepareSvg();
            scope.$watch('service', function (newVal){
                if (newVal) {
                    var svgHeight = drawWaterfall();
                    svg.attr("height",svgHeight);
                }
            });
        }

        return {
            restrict: 'E',
            scope: { service: '=', index: '=', color: '='},
            link: link
        }
    }]);
