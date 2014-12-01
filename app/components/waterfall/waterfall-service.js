/**
 * Angular service for waterfall charts.
 * Calculates size and position of chart components.
 */
angular.module('lcaApp.waterfall.service', [])
    .factory('WaterfallService', [ function () {
        /*global d3 */
        function Instance() {
            var waterfall = {},
            // Input
                width = 500,// overall chart width, default to 500 px
                segmentHeight = 24,
                segmentPadding = 8,
                scenarios = [],     // each scenario gets a chart
                stages = [],        // stages within each scenario
                values = [],      // 2 dimensional array of values (first dimension: scenario, second dimension: stage)
                colors = [],        // Array of colors (one for every stage)
                show0Result = true,        // Show stage that has no result
            // Output
                segments = [],    // 2D array of waterfall segments
                xScale = d3.scale.linear(),             // d3 scale maps aggregate value to chart's x axis
                yScale = d3.scale.ordinal(); // d3 scale maps stages to chart's y axis

            waterfall.show0Result = function (_) {
                if (!arguments.length) {
                    return show0Result;
                }
                show0Result = _;
                return waterfall;
            };

            waterfall.colors = function (_) {
                if (!arguments.length) {
                    return colors;
                }
                colors = _;
                return waterfall;
            };

            waterfall.width = function (_) {
                if (!arguments.length) {
                    return width;
                }
                width = _;
                return waterfall;
            };

            waterfall.segmentHeight = function (_) {
                if (!arguments.length) {
                    return segmentHeight;
                }
                segmentHeight = _;
                return waterfall;
            };

            waterfall.segmentPadding = function (_) {
                if (!arguments.length) {
                    return segmentPadding;
                }
                segmentPadding = _;
                return waterfall;
            };

            waterfall.scenarios = function (_) {
                if (!arguments.length) {
                    return scenarios;
                }
                scenarios = _;
                return waterfall;
            };

            waterfall.stages = function (_) {
                if (!arguments.length) {
                    return stages;
                }
                stages = _;
                return waterfall;
            };

            waterfall.values = function (_) {
                if (!arguments.length) {
                    return values;
                }
                values = _;
                return waterfall;
            };

            function hasResult(stage) {
                return waterfall.segments.some(function (scenario) {
                    return scenario.some(function (s) {
                        return s.stage === stage;
                    });
                });
            }

            function setGraphicAttributes(seg, index) {
                seg.x = xScale(Math.min(seg.startVal, seg.endVal));
                seg.y = (segmentPadding + segmentHeight) * index;
                seg.width = Math.abs(xScale(seg.value) - xScale(0));
                seg.endX = xScale(seg.endVal);
            }

            waterfall.layout = function () {
                var i, j = 0, minVal = 0.0, maxVal = 0.0;

                xScale.range([0, width]).nice();
                yScale.domain(stages);
                segments = [];
                for (i = 0; i < scenarios.length; i++) {
                    //first calculate the left edge for each stage
                    var endVal = 0.0,
                        scenarioStages = [];

                    for (j = 0; j < stages.length; j++) {
                        // If waterfall configured to not show 0 result, then
                        // NULL value means this stage is not relevant in this scenario,
                        // no segment created
                        // Also do not add segment for 0 value
                        if (show0Result || ( values[i][j] !== null && values[i][j] !== 0)) {
                            var segment = {};
                            segment.scenario = scenarios[i];
                            segment.stage = stages[j];
                            segment.startVal = endVal;
                            segment.value = values[i][j];
                            segment.endVal = segment.startVal + segment.value;
                            endVal = segment.endVal;
                            scenarioStages.push(segment);
                            if (endVal < minVal) {
                                minVal = endVal;
                            } else if (endVal > maxVal) {
                                maxVal = endVal;
                            }
                        }
                    }
                    segments.push(scenarioStages);
                }
                xScale.domain([minVal, maxVal]);

                for (i = 0; i < scenarios.length; i++) {
                    segments[i].forEach(setGraphicAttributes);
                }

                waterfall.segments = segments;

                waterfall.resultStages = function () {
                    return waterfall.stages().filter(hasResult);
                };

                if (show0Result) {
                    // if 0 results are not shown, then chart height is variable.
                    // These calculations are only relevant when every chart has the same stages.
                    waterfall.chartHeight = stages.length * (waterfall.segmentHeight() + waterfall.segmentPadding());
                    yScale.rangeRoundBands([0, waterfall.chartHeight], 0.1);
                    waterfall.yScale = yScale;
                }


                waterfall.xScale = xScale;

                return waterfall;
            };

            return waterfall;
        }

        return {
            createInstance: function () {
                return new Instance();
            }
        }
    }]);
