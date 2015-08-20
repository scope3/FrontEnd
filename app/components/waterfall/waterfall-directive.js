/**
 * @ngdoc directive
 * @name lcaApp.waterfall.directive:waterfallChart
 * @restrict E
 * @function
 * @scope
 *
 * @description
 * Waterfall chart directive.
 *
 * @param {object} wf    Initialized instance of WaterfallService.
 * @param {number} index Index to chart in series of charts.
 * @param {number} yAxisWidth    Width of vertical axis.
 * @param {string} chartTitle    Displayed above chart.
 * @param {string} unit  Unit of measure to be displayed on horizontal axis.
 *
 */
angular.module('lcaApp.waterfall.directive', ['d3', 'lcaApp.waterfall', 'lcaApp.format'])
    .directive('waterfallChart', ['d3Service', 'WaterfallService', 'FormatService',
        function (d3Service, WaterfallService, FormatService) {

        function link(scope, element) {
            var margin = {
                    top: 5,
                    right: 50,
                    bottom: 20,
                    left: 10
                },
                parentElement = element[0],
                xAxisHeight = 21,
                yAxisWidth = 110,
                labelFormat = FormatService.format("^.2g"),// Format numbers with precision 2, centered
                svg = null,
                waterfall = null,   // Current waterfall instance
                segments,           // Waterfall segments for current scenario
                titleHeight = 0,    // Space for optional title
                unitHeight = 0;     // Space for optional unit

            /**
             * Initial preparation of svg element.
             */
            function createSvg() {
                svg = d3Service.select(parentElement).append("svg");
            }

            function prepareSvg() {
                svg.attr("width", waterfall.width() + yAxisWidth + margin.left + margin.right);
                svg.attr("height", waterfall.chartHeight + titleHeight + margin.top + margin.bottom + unitHeight
                                   + xAxisHeight);
                // Display does not refresh cleanly after d3 update, so delete and recreate the chart group
                svg.select(".chart-group").remove();
                svg.append("g")
                    .attr("class", "chart-group")
                    .attr("transform",
                    "translate(" + (margin.left + yAxisWidth) + "," + (titleHeight + margin.top + xAxisHeight) + ")");
            }

            function defineEndMarker() {
                // Define marker as red triangle
                svg.append("defs").append("marker")
                    .attr("id", "arrowhead")
                    .attr("viewBox", "0 0 10 10")
                    .attr("refX", 10)
                    .attr("refY", 5)
                    .attr("markerWidth", 6)
                    .attr("markerHeight", 6)
                    .attr("orient", "auto")
                    .append("path")
                    .attr("d", "M 0 0 L 10 5 L 0 10 z")
                    .style("fill", "#FF0000");
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

            function addTick( val, tickValues) {
                if ( tickValues.every( function (tv) {
                    return (Math.abs(waterfall.xScale(tv) - waterfall.xScale(val)) > 50 );
                }) ) {
                    tickValues.push(val);
                }
            }

            function drawStartingLine() {
                svg.select(".top.axis").remove();
                svg.select(".starting-line").remove();
                if (waterfall.chartHeight > 0) {
                    var xAxis = d3Service.svg.axis()
                        .scale(waterfall.xScale)
                        .orient("top")
                        .tickValues([0])
                        .tickFormat(d3Service.format("d")),
                        x0 = waterfall.xScale(0),
                        chartGroup = svg.select(".chart-group");

                    chartGroup.append("g")
                        .attr("class", "top axis")
                        .call(xAxis);

                    chartGroup.append("line")
                        .attr("class", "starting-line")
                        .attr("x1", x0)
                        .attr("y1", 0)
                        .attr("x2", x0)
                        .attr("y2", waterfall.chartHeight);
                }

            }

            function drawXAxis() {
                var tickValues = [], maxTickVal;
                svg.select(".x.axis").remove();
                if (waterfall.chartHeight > 0 && segments && segments.length > 0) {
                    var xAxis = d3Service.svg.axis()
                            .scale(waterfall.xScale)
                            .orient("bottom"),
                        minVal = d3Service.min(segments, function (d) {
                            return d.endVal;
                        }),
                        maxVal = d3Service.max(segments, function (d) {
                            return d.endVal;
                        });
                    var lastVal = segments[segments.length-1].endVal;

                    if (minVal > 0) {
                        minVal = 0;
                    }
                    else if (maxVal < 0) {
                        maxVal = 0;
                    }
                    tickValues = [lastVal];
                    if (lastVal !== 0 ) {
                        addTick(0, tickValues);
                    }
                    if (maxVal !== 0) {
                        addTick(maxVal, tickValues);
                    }
                    if (minVal !== 0) {
                        addTick(minVal, tickValues);
                    }
                    maxTickVal = d3Service.max(tickValues);

                    xAxis.tickValues(tickValues)
                        .tickFormat(function (d) {
                            var formatted;
                            switch(d) {
                                case maxTickVal :
                                    formatted =  labelFormat(d) + " " + scope.unit;
                                    break;
                                case 0 :
                                    formatted = "0";
                                    break;
                                default :
                                    formatted = labelFormat(d);
                            }
                            return formatted;
                        });
                    svg.select(".chart-group")
                        .append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + waterfall.chartHeight + ")")
                        .call(xAxis);

                }
            }

            function drawYAxis() {
                svg.select(".y.axis").remove();
                if (waterfall.chartHeight > 0) {
                    var yAxis = d3Service.svg.axis()
                        .scale(waterfall.yScale)
                        .orient("left")
                        .tickSize(0);

                    svg.select(".chart-group")
                        .append("g")
                        .attr("class", "y axis")
                        .call(yAxis)
                        .selectAll(".tick text")
                        .call(d3Service.textWrap, yAxisWidth - 10);
                }
            }

            function drawWaterfall() {
                var chartGroup, barGroup,
                    lineColor = d3Service.rgb(scope.color).darker(2);

                chartGroup = svg.select(".chart-group");
                if (segments && segments.length > 0) {

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

            function drawEndMarker() {
                var connectors = svg.selectAll(".bar.line");
                if (connectors.size() > 0) {
                    var lastIndex = connectors.size() - 1;
                    connectors.filter(function(d, i) { return i === lastIndex; })
                                .attr("marker-end", "url(#arrowhead)");
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
                    defineEndMarker();
                    addTitle();
                    drawStartingLine();
                    if (yAxisWidth > 0) {
                        drawYAxis();
                    }
                    drawWaterfall();
                    drawXAxis();
                    drawEndMarker();
                } else {
                    if (svg) {
                        svg.remove();
                    }
                    createSvg();
                }
            });
        }

        return {
            restrict: 'E',
            scope: { service: '=', index: '=', color: '=', yAxisWidth: '=', chartTitle: '=', unit: '='},
            link: link
        }
    }]);
