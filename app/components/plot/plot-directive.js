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
                svg,
                width = 0,
                height = 0;

            function getSvg() {
                svg = d3Service.select(parentElement);
            }

            function prepareSvg(config) {
                var margin = config.margin();
                width = parentElement.clientWidth - margin.left - margin.right;
                height = parentElement.clientHeight - margin.top - margin.bottom;
                svg.select(".chart-group").remove();
                svg.append("g")
                    .attr("class", "chart-group")
                    .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");
            }

            function drawAxes() {

            }


            function drawContents() {
            }

            function initConfig(config) {
                if (!config.margin()) {
                    var margin = PlotService.createMargin();
                    margin.top = margin.bottom = margin.left = margin.right = 0;
                    config.margin(margin);
                }
            }

            getSvg();

            scope.$watch('config', function (newVal) {
                if (newVal) {
                    initConfig(newVal);
                    prepareSvg(newVal);
                }
            });

        }

        return {
            restrict: 'E',
            scope: { config: '=', data: '=' },
            link: link
        }
    }]);
