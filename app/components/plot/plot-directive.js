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
    .directive('plot', ['d3Service', 'FormatService', 'PlotService',
        function (d3Service, FormatService, PlotService) {

        function link(scope, element) {
            var parentElement = element[0],
                svgElement = parentElement.parentNode,
                svg =  d3Service.select(svgElement),
                plot = svg.select("plot"),
                width = svgElement.clientWidth,
                height = svgElement.clientHeight,
                xScale, yScale,
                xFormat = FormatService.format("^.2g");

            function prepareSvg(config) {
                var margin = config.margin(),
                    cg;

                if (margin) {
                    width = width - margin.left - margin.right;
                    height = height - margin.top - margin.bottom;
                }
                plot.select(".chart-group").remove();
                cg = plot.append("g")
                    .attr("class", "chart-group");
                if (margin) {
                    cg.attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");
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

            function drawAxes() {

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
                    label.x = shape.x + shape.width + 5;
                    label.anchor = "start";
                }
                else {
                    label.x = shape.x + shape.width - 5;
                    label.anchor = "end";
                }
                label.text = xFormat(xVal(d));
                return { s: shape, l: label};
            }

            function drawHorizontalBars(content, data) {
                var shape = content.shape(),
                    xVal = scope.config.x().valueFn(),
                    barHeight = yScale.rangeBand(),
                    barData;

                barData = data.map( createHBarData);

                var bar = svg.select(".chart-group").selectAll("g")
                    .data(barData)
                    .enter().append("g")
                    .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

                bar.append(shape)
                    .style("fill", content.color())
                    .attr("x", function(d) { return d.s.x; })
                    .attr("y", 0)
                    .attr("width", function(d) { return d.s.width; })
                    .attr("height", barHeight);

                bar.append("text")
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
                        }
                    }
                }
                if (dim.scale() === "linear") {
                    scale = d3Service.scale.linear();
                    scale.domain(domain).nice();
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
                    resizeSvg(scope.config, newVal);
                    prepareScales(scope.config, newVal);
                    drawContents(scope.config, newVal);
                }
            },
                true);

        }

        return {
            restrict: 'E',
            scope: { config: '=', data: '=' },
            link: link
        }
    }]);
