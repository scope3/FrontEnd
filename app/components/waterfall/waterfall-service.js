/**
 * @ngdoc service
 * @name lcaApp.waterfall.service.WaterfallService
 * @description
 * Factory Service. Returns singleton that calculates size and position of waterfall chart components.
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
                labelWidth = 50,
                scenarios = [],     // each scenario gets a chart
                stages = [],        // stages within each scenario
                values = [],      // 2 dimensional array of values (first dimension: scenario, second dimension: stage)
                colors = [],        // Array of colors (one for every stage)
                show0Result = true,        // Show stage that has no result
            // Output
                segments = [],    // 2D array of waterfall segments
                xScale = d3.scale.linear(),             // d3 scale maps aggregate value to chart's x axis
                yScale = d3.scale.ordinal(); // d3 scale maps stages to chart's y axis

            /**
             * @ngdoc
             * @name lcaApp.waterfall.service.WaterfallService#show0Result
             * @methodOf lcaApp.waterfall.service.WaterfallService
             * @description
             * Getter/setter for show0Result, option to show stage with no result.
             * @param {boolean} _ Setter argument
             * @returns {object}    service singleton
             */
            waterfall.show0Result = function (_) {
                if (!arguments.length) {
                    return show0Result
                }
                show0Result = _;
                return waterfall;
            };

            /**
             * @ngdoc
             * @name lcaApp.waterfall.service.WaterfallService#colors
             * @methodOf lcaApp.waterfall.service.WaterfallService
             * @description
             * Getter/setter for color array (one for every stage)
             * @param {array} _ Setter argument
             * @returns {object}    service singleton
             */
            waterfall.colors = function (_) {
                if (!arguments.length) {
                    return colors;
                }
                colors = _;
                return waterfall;
            };

            /**
             * @ngdoc
             * @name lcaApp.waterfall.service.WaterfallService#width
             * @methodOf lcaApp.waterfall.service.WaterfallService
             * @description
             * Getter/setter for chart width, in pixels
             * @param {number} _ Setter argument
             * @returns {object}    service singleton
             */
            waterfall.width = function (_) {
                if (!arguments.length) {
                    return width;
                }
                width = _;
                return waterfall;
            };

            /**
             * @ngdoc
             * @name lcaApp.waterfall.service.WaterfallService#segmentHeight
             * @methodOf lcaApp.waterfall.service.WaterfallService
             * @description
             * Getter/setter for segmentHeight, in pixels
             * @param {number} _ Setter argument
             * @returns {object}    service singleton
             */
            waterfall.segmentHeight = function (_) {
                if (!arguments.length) {
                    return segmentHeight;
                }
                segmentHeight = _;
                return waterfall;
            };

            /**
             * @ngdoc
             * @name lcaApp.waterfall.service.WaterfallService#segmentHeight
             * @methodOf lcaApp.waterfall.service.WaterfallService
             * @description
             * Getter/setter for segmentHeight, in pixels
             * @param {number} _ Setter argument
             * @returns {object}    service singleton
             */
            waterfall.segmentPadding = function (_) {
                if (!arguments.length) {
                    return segmentPadding;
                }
                segmentPadding = _;
                return waterfall;
            };

            /**
             * @ngdoc
             * @name lcaApp.waterfall.service.WaterfallService#labelWidth
             * @methodOf lcaApp.waterfall.service.WaterfallService
             * @description
             * Getter/setter for labelWidth, in pixels
             * @param {number} _ Setter argument
             * @returns {object}    service singleton
             */
            waterfall.labelWidth = function (_) {
                if (!arguments.length) {
                    return labelWidth;
                }
                labelWidth = _;
                return waterfall;
            };

            /**
             * @ngdoc
             * @name lcaApp.waterfall.service.WaterfallService#scenarios
             * @methodOf lcaApp.waterfall.service.WaterfallService
             * @description
             * Getter/setter for scenarios, first dimension
             * @param {array} _ scenarios
             * @returns {object}    service singleton
             */
            waterfall.scenarios = function (_) {
                if (!arguments.length) {
                    return scenarios;
                }
                scenarios = _;
                return waterfall;
            };

            /**
             * @ngdoc
             * @name lcaApp.waterfall.service.WaterfallService#stages
             * @methodOf lcaApp.waterfall.service.WaterfallService
             * @description
             * Getter/setter for stages, second dimension
             * @param {array} _ stages
             * @returns {object}    service singleton
             */
            waterfall.stages = function (_) {
                if (!arguments.length) {
                    return stages;
                }
                stages = _;
                return waterfall;
            };

            /**
             * @ngdoc
             * @name lcaApp.waterfall.service.WaterfallService#values
             * @methodOf lcaApp.waterfall.service.WaterfallService
             * @description
             * Getter/setter for values, 2-D array, dimensions: (scenarios, stages)
             * @param {array} _ values ([[number]])
             * @returns {object}    service singleton
             */
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
                var paddedWidth = labelWidth + 5;

                seg.x = xScale(Math.min(seg.startVal, seg.endVal));
                seg.y = (segmentPadding + segmentHeight) * index;
                seg.width = Math.abs(xScale(seg.value) - xScale(0));
                seg.endX = xScale(seg.endVal);
                if (seg.width < paddedWidth) {
                    if (width - seg.width - seg.x < paddedWidth) {
                        seg.labelX = seg.x - 5;
                        seg.labelAnchor = "end";
                    }
                    else {
                        seg.labelX = seg.x + seg.width + 5;
                        seg.labelAnchor = "start";
                    }
                }
                else {
                    seg.labelX = seg.x + seg.width / 2;
                    seg.labelAnchor = "middle";
                }
            }

            /**
             * @ngdoc
             * @name lcaApp.waterfall.service.WaterfallService#layout
             * @methodOf lcaApp.waterfall.service.WaterfallService
             * @description
             * Function to calculate positions and sizes.
             * Call after property setters.
             * @returns {object}    service singleton
             */
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
