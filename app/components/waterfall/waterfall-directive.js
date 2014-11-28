/**
 * Directive for reusable waterfall chart
 */
angular.module('lcaApp.waterfall.directive', ['lcaApp.waterfall', 'lcaApp.format'])
    .directive('waterfallChart', ['WaterfallService', 'FormatService', function( WaterfallService, FormatService) {

        function link(scope, element, attrs) {
            var margin = {
                    top: 10,
                    right: 50,
                    bottom: 20,
                    left: 10
                },
                parentElement = element[0],
                yAxisWidth = 250,
                labelFormat = FormatService.format("^.2r"),// Format numbers with precision 2, centered
                svg = null,
                waterfall = null,   // Current waterfall instance
                segments,           // Waterfall segments for current scenario
                chartHeight = 0;    // Height of chart without margins and axis

            /**
             * Initial preparation of svg element.
             */
            function createSvg() {
                svg = d3.select(parentElement).append("svg");

                svg.append("g")
                    .attr("class", "chart-group")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + chartHeight + ")");
            }

            function setSvgSize() {
                svg.attr("width", waterfall.width() + margin.left + margin.right);
                svg.attr("height", chartHeight + margin.top + margin.bottom);
            }

            function drawXAxis() {
                svg.select(".x.axis").remove();
                if ( chartHeight > 0 ) {
                    var xAxis = d3.svg.axis()
                            .scale(waterfall.xScale)
                            .orient("bottom")
                            .ticks(4)
                            .tickFormat(labelFormat),
                        minVal = d3.min(segments, function (d) {
                            return d.endVal;
                        }),
                        maxVal = d3.max(segments, function (d) {
                            return d.endVal;
                        });

                    if (minVal > 0) {
                        minVal = 0;
                    }
                    xAxis.tickValues([minVal, maxVal]);
                    svg.select(".chart-group")
                        .append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + chartHeight + ")")
                        .call(xAxis);
                }
            }

            function drawWaterfall() {
                var chartGroup, barGroup,
                    minVal = 0.0, maxVal = 0.0,
                    lineColor = d3.rgb(scope.color).darker(2);

                chartGroup = svg.select(".chart-group");
                if (segments.length > 0) {
                    // Draw bars
                    barGroup = chartGroup.selectAll(".bar.g")
                        .data(segments);
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
                }
            }

            createSvg();
            scope.$watch('service', function (newVal){
                if (newVal) {
                    waterfall = newVal;
                    segments = waterfall.segments[scope.index];
                    chartHeight = segments[segments.length - 1].y
                        + waterfall.segmentHeight() + waterfall.segmentPadding();
                    setSvgSize();
                    drawWaterfall();
                    drawXAxis();
                }
            });
        }

        return {
            restrict: 'E',
            scope: { service: '=', index: '=', color: '='},
            link: link
        }
    }]);
