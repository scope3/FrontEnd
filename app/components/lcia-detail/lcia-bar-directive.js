/**
 * @ngdoc directive
 * @name lcaApp.lciaBar.directive:lciaBarChart
 * @restrict E
 * @function
 * @scope
 *
 * @description
 * LCIA bar chart directive.
 *
 * @param {object} lcia Initialized instance of LciaDetailService.
 * @param {object} flows   Associative array of objects, indexed by flowID, providing flow name and category. { number : { name : string, category : string } }
 *
 */
angular.module('lcaApp.lciaBar.directive', ['lcaApp.format', 'lcaApp.name'])
    .directive('lciaBarChart', ['FormatService', 'NameService', function( FormatService, NameService ) {

        function link(scope, element) {

            var margin = {
                    top: 30,
                    right: 30,
                    bottom: 30,
                    left: 30
                },
                parentElement = element[0],
                width = parentElement.clientWidth - margin.left - margin.right,   // diagram width
                svgHeight = parentElement.clientHeight - margin.top - margin.bottom,
                chartHeight = 90,
                barY = 10,      // y position of bar
                barHeight = 30,
                textPadding = 6,
                legendRowHeight = 20,
                colorScale = d3.scale.ordinal(),
                xScale = d3.scale.linear().rangeRound([0, width]),
                labelFormat = FormatService.format("^.2g"),// Format numbers with precision 2, centered
                legendFormat = FormatService.format(),    // Format numbers with precision 4
                xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .ticks(4)
                    .tickFormat(labelFormat),
                svg = null,
                threshold = 0;

            /**
             * Initial preparation of svg element.
             */
            function prepareSvg() {
                svg = d3.select(parentElement).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", svgHeight + margin.top + margin.bottom);
                svg.append("g")
                    .attr("class", "chart-group")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    .append("text").attr("id", "chart-header").style("font-weight", "bold").text("LCIA Details (positive scores)");
                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(" + margin.left + "," + (chartHeight + margin.top - margin.bottom) + ")");
                svg.append("g")
                    .attr("class", "legend-group")
                    .attr("transform", "translate(" + margin.left + "," + (chartHeight + margin.top) + ")");

            }

            /**
             * Roll up results below threshold
             */
            function rollUpResults() {
                var details = [],
                    rolledImpact = {flowID: 0, result: 0};

                scope.lcia["positiveResults"].forEach( function (d) {
                    if (d.result >= threshold) {
                        details.push(d);
                    } else {
                        rolledImpact.result += d.result;
                        rolledImpact.hasParam = rolledImpact.hasParam || d.hasParam;
                    }
                });
                if (rolledImpact.result > 0) {
                    details.push(rolledImpact);
                }
                return details;
            }
            /**
             * Compare function used to sort LCIA results in descending order
             */
            function compareLciaResults(a, b) {
                return d3.descending(a.result, b.result);
            }

            /**
             * Display LCIA results in segmented bar
             */
            function drawBar(displayResults) {
                var flowList,
                    runningTotal = 0,
                    rectSelection,
                    colorClassSize = 9, // Maximum number of color classes, ranges from 3 to 9
                    reverseColors; // Clone of color array in reverse order (dark to light)

                displayResults.sort(compareLciaResults);
                flowList = displayResults.map(function (d) {
                    return d.flowID;
                });
                colorScale.domain(flowList);
                if (flowList.length < 3) {
                    colorClassSize = 3;
                } else if (flowList.length < 9) {
                    colorClassSize = flowList.length;
                }
                reverseColors = scope.lcia.colors()[colorClassSize].slice();
                reverseColors.reverse();
                colorScale.range(reverseColors);
                /**
                 * Compute impact score.
                 * Add rect start and end points for each flow
                 */
                displayResults.forEach(function (d) {
                    d.x0 = runningTotal;
                    runningTotal += d.result;
                    d.x1 = runningTotal;
                });


                svg.select(".x.axis")
                    .call(xAxis);
                /**
                 * Update/Add/Delete rect data
                 */
                rectSelection = svg.select(".chart-group").selectAll("rect").data(displayResults);
                rectSelection.enter().append("rect");
                rectSelection.exit().remove();
                rectSelection.attr("width", function (d) {
                    return xScale(d.x1) - xScale(d.x0);
                })
                    .attr("x", function (d) {
                        return xScale(d.x0);
                    })
                    .attr("y", barY)
                    .attr("height", barHeight)
                    .style("fill", function (d) {
                        return colorScale(d.flowID);
                    });
            }

            /**
             * Create header for legend.
             *
             * @param {number} catX          X coordinate for flow category
             * @param {number} flowX          X coordinate for flow name
             * @param {number} resultX        X coordinate for result header
             * @param {number} headerY        Y coordinate for headers
             */
            function makeLegendHeader(catX, flowX, resultX, headerY) {
                var legendGroup = svg.select(".legend-group");

                legendGroup.append("text").attr({
                    class: "legend-header",
                    x: catX,
                    y: headerY
                })
                    .text("Flow Category");
                legendGroup.append("text").attr({
                    class: "legend-header",
                    x: flowX,
                    y: headerY
                })
                    .text("Name");
                legendGroup.append("text").attr({
                    class: "legend-header",
                    x: resultX,
                    y: headerY
                })
                    .text("LCIA Result");
            }

            /**
             * Make legend for chart, listing all flows with LCIA result.
             *
             * Flows that cannot be charted because the result is very small or negative are listed
             * below the legend colors.
             *
             * @param {[]} flowData          Flows sorted by LCIA result in descending order.
             */
            function makeLegend(flowData) {
                var rowHeight = legendRowHeight,
                    boxSize = 18,
                    colPadding = textPadding,
                    textY = 9,
                    colXs = [0, boxSize + colPadding, width - 350, width - 95],
                    legend,
                    newRows;

                makeLegendHeader(colXs[1], colXs[2], colXs[3], textY);
                // Update legend data
                legend = svg.select(".legend-group").selectAll(".legend").data(flowData);
                newRows = legend.enter().append("g").attr("class", "legend");
                newRows.filter(function (d) {
                    return d.result > 0 && (xScale(d.x1) - xScale(d.x0) > 1);
                })
                    .append("rect")
                    .attr("x", colXs[0])
                    .attr("width", boxSize)
                    .attr("height", boxSize);
                newRows.append("text")
                    .attr("x", colXs[1])
                    .attr("y", textY)
                    .attr("dy", ".35em")
                    .attr("class", "category");
                newRows.append("text")
                    .attr("x", colXs[2])
                    .attr("y", textY)
                    .attr("dy", ".35em")
                    .attr("class", "flow-name");
                newRows.append("text")
                    .attr("x", colXs[3])
                    .attr("y", textY)
                    .attr("dy", ".35em")
                    .attr("class", "lcia-result");

                legend.attr("transform", function (d, i) {
                    var rowY = (i + 1) * rowHeight;
                    return "translate(0," + rowY + ")";
                });
                legend.selectAll("rect")
                    .style("fill", function (d) {
                        return colorScale(d.flowID);
                    });
                legend.selectAll(".category")
                    .text(function (d) {
                        if (d.flowID === 0) {
                            return "Aggregate";
                        } else if (d.flowID in scope.flows){
                            var catName = scope.flows[d.flowID].category;
                            return NameService.shorten(catName, 30);
                        }
                    });
                legend.selectAll(".flow-name")
                    .text(function (d) {
                        if (d.flowID === 0) {
                            return "flows having score < " + threshold;
                        } else if (d.flowID in scope.flows){
                            return scope.flows[d.flowID].name;
                        }
                    });
                legend.selectAll(".lcia-result")
                    .style( "font-weight", function(d) {
                        return d.hasParam ? "bold" : "normal";
                    })
                    .text(function (d) {
                        //return d.result.toPrecision(4);
                        return legendFormat(d.result);
                    });
            }

            scope.$watch('lcia', function (newVal){
                // Only create svg when positive results are available
                if (svg) {
                    svg.remove();
                    svg = null;
                }
                if ((typeof newVal != 'undefined') && newVal && ("positiveResults" in scope.lcia)) {
                    if ( scope.lcia.positiveResults.length > 0 ) {
                        xScale.domain([0, +scope.lcia.positiveSum]);
                        threshold = (+scope.lcia.positiveSum / width).toPrecision(4);
                        var displayResults = rollUpResults();
                        if (displayResults.length > 0) {
                            svgHeight = chartHeight + (legendRowHeight * (displayResults.length + 1));
                            prepareSvg();
                            drawBar(displayResults);
                            if ("flows" in scope) {
                                makeLegend(displayResults);
                            }
                        }
                    }
                }
            });
        }

        return {
                restrict: 'E',
                scope: { lcia : '=', flows: '='},
                link: link
            }
        }]);