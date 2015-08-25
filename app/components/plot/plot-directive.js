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
                height = svgElement.clientHeight;

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
                if (config.resizeSvg && data) {
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


            function drawContents() {
            }

            function initConfig(config) {

            }

            scope.$watch('config', function (newVal) {
                if (newVal) {
                    if ( svg ) {
                        prepareSvg(newVal);
                    }
                }
            });

            scope.$watch('data', function (newVal, oldVal) {
                if (svg && scope.config) {
                    resizeSvg(scope.config, newVal);
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
