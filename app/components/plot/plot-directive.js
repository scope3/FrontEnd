angular.module('lcaApp.plot', [
    'lcaApp.plot.directive',
    'lcaApp.plot.service'
]);

/**
 * @ngdoc directive
 * @name lcaApp.plot.directive:plot
 * @restrict E
 * @function
 * @scope
 *
 * @description
 * Plot directive.
 *
 * @param {object} config Object created by PlotService.createInstance
 * @param {[]} data Array of objects providing data
 */
angular.module('lcaApp.plot.directive', ['lcaApp.plot.service', 'd3', 'lcaApp.format'])
    .directive('plot', ['d3Service', 'FormatService',
        function (d3Service, FormatService) {

        function link(scope, element) {
            var parentElement = element[0],
                svgElement = parentElement.parentNode,
                svg =  d3Service.select(svgElement),
                plot = svg.select("g.lcia-bar-container"),
                chart,
                width = svgElement.clientWidth,
                height = svgElement.clientHeight,
                xScale, yScale,
                xFormat = FormatService.format("^.2g");

            function prepareSvg(config) {
                var margin = config.margin();

                chart = plot.select(".chart-group");
                if (chart.empty()) {
                    chart = plot.append("g")
                        .attr("class", "chart-group");
                }
                if (margin) {
                    chart.attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");
                }
            }

            function updateSize( config) {
                var margin = config.margin();

                width = svgElement.clientWidth;
                height = svgElement.clientHeight;
                if (margin) {
                    width = width - margin.left - margin.right;
                    height = height - margin.top - margin.bottom;
                }
            }

            function resizeSvg(config, data) {
                if (config.resizeSvg) {
                    var content = config.content(),
                        margin = config.margin(),
                        svgSize;

                    if ( content.width()) {
                        width = content.width() * data.length;
                        svgSize = margin ? width + margin.left + margin.right : width;
                        svg.attr("width", svgSize);
                    }
                    if ( content.height()) {
                        height = content.height() * data.length;
                        svgSize = margin ? height + margin.top + margin.bottom : height;
                        svg.attr("height", svgSize);
                    }
                }
            }

            function drawAxes(config) {
                drawAxisY(config.y().axis());
            }

            function drawAxisY(axisConfig) {
                if (axisConfig) {
                    var g = chart.select(".y.axis"),
                        orientation = axisConfig.orientation(),
                        axis = d3Service.svg.axis()
                                .scale(yScale)
                                .orient(orientation);

                    if (g.empty()) {
                        g = chart.append("g").attr("class", "y axis");
                    }
                    if (orientation === "right") {
                        g.attr("transform", "translate(" + width + ", 0)");
                    }
                    if (scope.config.y().scale() === "ordinal") {
                        axis.tickSize(0);
                    }
                    g.call(axis);
                }
            }

            function createHBarData(d) {
                var xVal = scope.config.x().valueFn(),
                    labelWidth = 55,
                    shape = {
                        x : xScale(Math.min(0, xVal(d))),
                        width : Math.abs(xScale(xVal(d)) - xScale(0))
                    },
                    label = { x : 0, y : 0, anchor : 0 };
                if (shape.width < labelWidth) {
                    if (width - shape.width - shape.x < labelWidth) {
                        label.x = shape.x - 5;
                        label.anchor = "end";
                    } else {
                        label.x = shape.x + shape.width + 5;
                        label.anchor = "start";
                    }
                }
                else {
                    label.x = shape.x + shape.width /2 ;
                    label.anchor = "middle";
                }
                label.text = xFormat(xVal(d));
                return { d: d, s: shape, l: label};
            }

            function drawHorizontalBars(content, data) {
                var shape = content.shape(),
                    barHeight = yScale.rangeBand(),
                    barData, barGroups, newGroups;

                barData = data.map( createHBarData);

                barGroups = chart.selectAll(".bar.g").data(barData);
                newGroups = barGroups.enter().append("g").attr("class", "bar g");
                barGroups.exit().remove();
                barGroups.attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

                newGroups.append(shape);
                barGroups.select(shape)
                    .style("fill", content.color())
                    .attr("x", function(d) { return d.s.x; })
                    .attr("y", 0)
                    .attr("width", function(d) { return d.s.width; })
                    .attr("height", barHeight-1);

                newGroups.append("text");
                barGroups.select("text")
                    .attr("x", function(d) { return d.l.x; })
                    .attr("y", barHeight / 2)
                    .attr("dy", ".35em")
                    .style("text-anchor", function (d) { return d.l.anchor; })
                    .text(function(d) { return d.l.text });
            }

            function drawContents(config, data) {
                var content = config.content();
                if (!content) throw Error("Plot content must be defined.");
                if (content.orientation() === "horizontal") {
                    drawHorizontalBars(content, data);
                }
                //Future enhancement - vertical bars and other content types
            }

            function createScale(dim, plotData, range) {
                if (!dim.valueFn()) throw Error("Plot dimension must provide valueFn");
                if (!dim.scale()) throw Error("Plot dimension must provide scale type");
                var domain = dim.domain(),
                    valueFn = dim.valueFn(),
                    scale;

                if (!domain) {
                    domain = plotData.map(valueFn);
                    if (dim.scale() === "linear") {
                        if (domain.length === 1 && domain[0]) {
                            domain = domain[0] > 0 ? [0, domain[0]] : [domain[0], 0];
                        } else {
                            domain = d3Service.extent(domain);
                            if (domain[0] > 0) domain[0] = 0;
                            else if (domain[1] < 0) domain[1] = 0;
                        }
                    }
                }
                if (dim.scale() === "linear") {
                    scale = d3Service.scale.linear();
                    scale.domain(domain);
                    scale.range(range);
                } else if (dim.scale() === "ordinal") {
                    scale = d3Service.scale.ordinal();
                    scale.domain(domain).rangeRoundBands(range, .1);
                } else {
                    throw Error("Plot does not support scale type : " + dim.scale());
                }
                return scale;
            }


            function prepareScales(config, data) {
                xScale = createScale(config.x(), data, [0, width]);
                yScale = createScale(config.y(), data, [0, height]);
            }

            scope.$watch('config', function (newVal) {
                if (newVal) {
                    if ( svg ) {
                        prepareSvg(newVal);
                    }
                }
            });

            scope.$watch('data', function (newVal, oldVal) {
                if (svg && scope.config && newVal) {
                    var config = scope.config;

                    updateSize(config);
                    resizeSvg(config, newVal);
                    prepareScales(config, newVal);
                    drawAxes(config);
                    drawContents(config, newVal);
                }
            },
                true);

        }

        return {
            restrict: 'E',
            scope: { config: "=", data: "=", transform: "@" },
            link: link,
            templateNamespace: "svg",
            replace: true,
            template: "<g class='lcia-bar-container' ng-attr-transform='{{transform}}'></g>"
        }
    }]);
