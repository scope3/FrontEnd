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
                svg;

            function getSvg() {
                svg = d3Service.select(parentElement);
            }

            function prepareSvg() {

            }



            function drawAxes() {

            }


            function drawContents() {
            }

            getSvg();

            scope.$watch('config', function (newVal, oldVal) {
                if (svg && (newVal || oldVal)) {
                    svg.select("g").remove();
                }
                if (newVal) {
                    prepareSvg();
                    drawContents();
                    drawAxes();
                }
            });

        }

        return {
            restrict: 'E',
            scope: { config: '=', data: '=' },
            link: link
        }
    }]);
