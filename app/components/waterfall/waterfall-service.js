/**
 * @ngdoc service
 * @name lcaApp.waterfall.service.WaterfallService
 * @description
 * Factory Service. Creates objects that calculate size and position of waterfall chart components.
 */
angular.module('lcaApp.waterfall.service', ['d3'])
    .factory('WaterfallService', [ 'd3Service', function(d3Service) {

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
                xScale = d3Service.scale.linear(),             // d3 scale maps aggregate value to chart's x axis
                yScale = d3Service.scale.ordinal(); // d3 scale maps stages to chart's y axis

            /** @namespace waterfall
              * @instance
              **/

            /**
             * @function waterfall#show0Result
             * @description
             * Getter/setter for show0Result, option to show stage with no result.
             * @param {boolean} _ Setter argument
             * @returns {object}    waterfall object
             */
            waterfall.show0Result = function (_) {
                if (!arguments.length) {
                    return show0Result
                }
                show0Result = _;
                return waterfall;
            };

            /**
             * @function waterfall#colors
             * @description
             * Getter/setter for color array (one for every stage)
             * @param {array} _ Setter argument
             * @returns {object}    waterfall object
             */
            waterfall.colors = function (_) {
                if (!arguments.length) {
                    return colors;
                }
                colors = _;
                return waterfall;
            };

            /**
             * @function waterfall#width
             * @description
             * Getter/setter for chart width, in pixels
             * @param {number} _ Setter argument
             * @returns {object}    waterfall object
             */
            waterfall.width = function (_) {
                if (!arguments.length) {
                    return width;
                }
                width = _;
                return waterfall;
            };

            /**
             * @function waterfall#segmentHeight
             * @description
             * Getter/setter for segmentHeight, in pixels
             * @param {number} _ Setter argument
             * @returns {object}    waterfall object
             */
            waterfall.segmentHeight = function (_) {
                if (!arguments.length) {
                    return segmentHeight;
                }
                segmentHeight = _;
                return waterfall;
            };

            /**
             * @function waterfall#segmentHeight
             * @description
             * Getter/setter for segmentHeight, in pixels
             * @param {number} _ Setter argument
             * @returns {object}    waterfall object
             */
            waterfall.segmentPadding = function (_) {
                if (!arguments.length) {
                    return segmentPadding;
                }
                segmentPadding = _;
                return waterfall;
            };

            /**
             * @function waterfall#labelWidth
             * @description
             * Getter/setter for labelWidth, in pixels
             * @param {number} _ Setter argument
             * @returns {object}    waterfall object
             */
            waterfall.labelWidth = function (_) {
                if (!arguments.length) {
                    return labelWidth;
                }
                labelWidth = _;
                return waterfall;
            };

            /**
             * @function waterfall#scenarios
             * @description
             * Getter/setter for scenarios, first dimension
             * @param {array} _ scenarios
             * @returns {object}    waterfall object
             */
            waterfall.scenarios = function (_) {
                if (!arguments.length) {
                    return scenarios;
                }
                scenarios = _;
                return waterfall;
            };

            /**
             * @function waterfall#stages
             * @description
             * Getter/setter for stages, second dimension
             * @param {array} _ stages
             * @returns {object}    waterfall object
             */
            waterfall.stages = function (_) {
                if (!arguments.length) {
                    return stages;
                }
                stages = _;
                return waterfall;
            };

            /**
             * @function waterfall#values
             * @description
             * Getter/setter for values, 2-D array, dimensions: (scenarios, stages)
             * @param {array} _ values ([[number]])
             * @returns {object}    waterfall object
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
             * @function waterfall#layout
             * @description
             * Function to calculate positions and sizes.
             * Call after property setters.
             * @returns {object}    waterfall object
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
            /**
             * @ngdoc
             * @name lcaApp.waterfall.service.WaterfallService#createInstance
             * @methodOf lcaApp.waterfall.service.WaterfallService
             * @description
             * Creates waterfall object
             * @returns {object}    waterfall object
             */
            createInstance: function () {
                return new Instance();
            }
        }
    }]);
