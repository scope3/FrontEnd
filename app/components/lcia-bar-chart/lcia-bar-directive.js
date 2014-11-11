/**
 * Directive for reusable LCIA bar chart
 */
angular.module('lcaApp.lciaBar.directive', [])
    .directive('lciaBarChart', [function( ) {

        function link(scope, element, attrs) {

            var margin = {
                    top: 10,
                    right: 200,
                    bottom: 30,
                    left: 20
                },
                parentElement = element[0],
                width = parentElement.clientWidth - margin.left - margin.right,   // diagram width
                svgHeight = parentElement.clientHeight - margin.top - margin.bottom,
                chartHeight = 100,
                barY = 10,      // y position of bar
                barHeight = 30,
                textPadding = 6,
                colorScale = d3.scale.ordinal(),
                xScale = d3.scale.linear().rangeRound([0, width]),
                labelFormat = d3.format("^.2g"),    // Format numbers with precision 2
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
                    .attr("height", svgHeight + margin.top + margin.bottom);
                svg.append("g")
                    .attr("class", "chart-group")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    .append("text").attr("id", "chart-header").style("font-weight", "bold").text("LCIA Details");
                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(" + margin.left + "," + (chartHeight - margin.bottom) + ")");
                svg.append("g")
                    .attr("class", "legend-group")
                    .attr("transform", "translate(" + margin.left + "," + (chartHeight + margin.top) + ")");

            }

            /**
             * Create new array with positive impacts. Roll up small impacts into one element.
             */
            function getPositiveResults() {
                var positiveDetails = [],
                    rolledImpact = {flowID: 0, result: 0},
                    threshold = scope.lcia["cumulativeResult"] * 0.001;

                scope.lcia["lciaDetail"].forEach( function (d) {
                    if (d.result > threshold) {
                        positiveDetails.push(d);
                    } else if (d.result > 0) {
                        rolledImpact.result +=  d.result;
                    }
                });
                if (rolledImpact.result > 0) {
                    positiveDetails.push(rolledImpact);
                }
                return positiveDetails;
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
                    reverseColors, // Clone of color array in reverse order (dark to light)
                    activityLevel = 1;

                svg.select("#chart-header").style("visibility", displayResults.length > 0 ? "visible" : "hidden");
                if ("activity" in scope) {
                    activityLevel = scope.activity;
                }
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
                reverseColors = scope.lcia.colors[colorClassSize].slice();
                reverseColors.reverse();
                colorScale.range(reverseColors);
                /**
                 * Compute impact score.
                 * Add rect start and end points for each flow
                 */
                displayResults.forEach(function (d) {
                    d.x0 = runningTotal;
                    runningTotal += +d.result * activityLevel;
                    d.x1 = runningTotal;
                });

                xScale.domain([0, runningTotal]);
                svg.select(".x.axis")
                    .call(xAxis)
                    .style("visibility", displayResults.length > 0 ? "visible" : "hidden");
                /**
                 * Update/Add/Delete rect data
                 */
                rectSelection = d3.select(".chart-group").selectAll("rect").data(displayResults);
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
            prepareSvg();
            scope.$watch('lcia.lciaDetail', function (newVal){
                if (newVal) {
                    var displayResults = getPositiveResults();
                    if ( displayResults.length > 0 ) {
                        drawBar();
                    }
                }
            });
        }

        return {
                restrict: 'E',
                scope: { lcia : '=', flows: '=', activity: '='},
                link: link
            }
        }]);