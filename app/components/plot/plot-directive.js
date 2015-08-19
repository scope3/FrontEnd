angular.module('lcaApp.plot', [
    'lcaApp.plot.directive',
    'lcaApp.plot.axis.service',
    'lcaApp.plot.service',
    'lcaApp.plot.dimension.service',
    'lcaApp.plot.margin.service'
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
 * @param {object} content Instance of PlotService
 * @param {[]} data Array of objects providing data
 * @param {object} x Instance of PlotDimensionService.
 * @param {object} y Instance of PlotDimensionService.
 * @param {object?} margin Instance of PlotMarginService. If not provided, there will be no margins.
 */
angular.module('lcaApp.plot.directive', ['d3', 'lcaApp.format'])
    .directive('plot', ['d3Service', 'FormatService',
        function (d3Service, FormatService) {

        function link(scope, element) {
            var parentElement = element[0],
                svg;

            /**
             * Initial preparation of svg element.
             */
            function createSvg() {
                svg = d3Service.select(parentElement).append("svg");
            }

            function prepareSvg() {
            }



            function drawXAxis() {

            }

            function wrap(text, width) {
                text.each(function () {
                    var text = d3Service.select(this),
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
            }

            function drawContents() {
            }

            createSvg();

        }

        return {
            restrict: 'E',
            scope: { content: '=', data: '=', x: '=', y: '='},
            link: link
        }
    }]);
