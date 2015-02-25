/**
 * Directive for reusable waterfall chart
 */
angular.module('lcaApp.waterfall.directive', ['lcaApp.waterfall', 'lcaApp.format'])
    .directive('waterfallChart', ['WaterfallService', 'FormatService', function (WaterfallService, FormatService) {

        function link(scope, element, attrs) {
            var margin = {
                    top: 5,
                    right: 50,
                    bottom: 20,
                    left: 10
                },
                parentElement = element[0],
                yAxisWidth = 110,
                labelFormat = FormatService.format("^.2r"),// Format numbers with precision 2, centered
                svg = null,
                waterfall = null,   // Current waterfall instance
                segments,           // Waterfall segments for current scenario
                titleHeight = 0,    // Space for optional title
                unitHeight = 0;     // Space for optional unit

            /**
             * Initial preparation of svg element.
             */
            function createSvg() {
                svg = d3.select(parentElement).append("svg");
            }

            function prepareSvg() {
                svg.attr("width", waterfall.width() + yAxisWidth + margin.left + margin.right);
                svg.attr("height", waterfall.chartHeight + titleHeight + margin.top + margin.bottom + unitHeight);
                // Display does not refresh cleanly after d3 update, so delete and recreate the chart group
                svg.select(".chart-group").remove();
                svg.append("g")
                    .attr("class", "chart-group")
                    .attr("transform", "translate(" + (margin.left + yAxisWidth) + "," + (titleHeight + margin.top) + ")");
            }

            function addTitle() {
                svg.select(".chart-title").remove();
                if (scope.chartTitle) {
                    var width = waterfall.width();
                    svg.append("g")
                        .attr("class", "chart-title")
                        .attr("transform", "translate(" + (margin.left + yAxisWidth) + "," + (titleHeight + margin.top) + ")")
                        .append("text")
                        .attr("x", width / 2)
                        .attr("y", 0)
                        .attr("dy", "-1em")
                        .style("text-anchor", "middle")
                        .text(scope.chartTitle);
                }
            }

            function drawXAxis() {
                svg.select(".x.axis").remove();
                if (waterfall.chartHeight > 0) {
                    var xAxis = d3.svg.axis()
                            .scale(waterfall.xScale)
                            .orient("bottom"),
                        minVal = d3.min(segments, function (d) {
                            return d.endVal;
                        }),
                        maxVal = d3.max(segments, function (d) {
                            return d.endVal;
                        });

                    if (minVal > 0) {
                        minVal = 0;
                    }
                    xAxis.tickValues([minVal, maxVal])
                        .tickFormat(function (d) {
                            if (d === maxVal && scope.unit) {
                                return labelFormat(d) + " " + scope.unit;
                            }
                            else {
                                return labelFormat(d)
                            }
                        });
                    svg.select(".chart-group")
                        .append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + waterfall.chartHeight + ")")
                        .call(xAxis);

                }
            }

            function wrap(text, width) {
                text.each(function () {
                    var text = d3.select(this),
                        words = text.text().split(/\s+/).reverse(),
                        word,
                        line = [],
                        lineNumber = 0,
                        lineHeight = 1.1, // ems
                        x = text.attr("x"),
                        y = text.attr("y"),
                        dy = parseFloat(text.attr("dy")),
                        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", 0);
                    while (word = words.pop()) {
                        line.push(word);
                        tspan.text(line.join(" "));
                        if (tspan.node().getComputedTextLength() > width) {
                            line.pop();
                            tspan.text(line.join(" "));
                            line = [word];
                            tspan = text.append("tspan").attr("x", x).attr("y", y).text(word);
                            ++lineNumber;
                        }
                    }
                    if (lineNumber > 0) {
                        text.selectAll("tspan").attr("dy", function (d, i) {
                            return i * lineHeight - dy + "em";
                        });
                    }
                });
            }

            function drawYAxis() {
                svg.select(".y.axis").remove();
                if (waterfall.chartHeight > 0) {
                    var yAxis = d3.svg.axis()
                        .scale(waterfall.yScale)
                        .orient("left")
                        .tickSize(0);

                    svg.select(".chart-group")
                        .append("g")
                        .attr("class", "y axis")
                        .call(yAxis)
                        .selectAll(".tick text")
                        .call(wrap, yAxisWidth - 10);
                }
            }

            function drawWaterfall() {
                var chartGroup, barGroup,
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
                            return d.labelX;
                        })
                        .style("text-anchor", function (d) {
                            return d.labelAnchor;
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
            scope.$watch("yAxisWidth", function (newVal) {
                if (newVal) {
                    yAxisWidth = +newVal;
                }
            });
            scope.$watch("chartTitle", function (newVal) {
                if (newVal) {
                    titleHeight = 20;
                }
            });
            scope.$watch("unit", function (newVal) {
                if (newVal) {
                    unitHeight = 20;
                }
            });
            scope.$watch('service', function (newVal) {
                if (newVal) {
                    waterfall = newVal;
                    segments = waterfall.segments[scope.index];
                    prepareSvg();
                    addTitle();
                    if (yAxisWidth > 0) {
                        drawYAxis();
                    }
                    drawWaterfall();
                    drawXAxis();
                }
            });
        }

        return {
            restrict: 'E',
            scope: { service: '=', index: '=', color: '=', yAxisWidth: '=', chartTitle: '=', unit: '='},
            link: link
        }
    }]);
