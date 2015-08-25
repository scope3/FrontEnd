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
                svg, plot,
                width = 0,
                height = 0;

            function getSvg() {
                var svgEl = parentElement.parentNode;
                width = svgEl.clientWidth;
                height = svgEl.clientHeight;
                svg = d3Service.select(svgEl);
                plot = svg.select("plot");
                return svg;
            }

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

            function resizeSvg(data) {
                if (data) {
                    var content = scope.config.content();

                    if ( content.width()) width = Math.max(content.width() * data.length, width);
                    if ( content.height()) height = Math.max(content.height() * data.length, height);
                    svg.attr("width", width).attr("height", height);
                }

            }

            function drawAxes() {

            }


            function drawContents() {
            }

            function initConfig(config) {

            }

            scope.$watch('config', function (newVal) {
                if (newVal) {
                    if ( getSvg()) {
                        prepareSvg(newVal);
                        if (scope.data && scope.data.length) {
                            resizeSvg(scope.data);
                        }
                    }
                }
            });

            scope.$watch('data', resizeSvg, true);

        }

        return {
            restrict: 'E',
            scope: { config: '=', data: '=' },
            link: link
        }
    }]);
