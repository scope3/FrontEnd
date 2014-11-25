/**
 * Directive for reusable waterfall chart
 */
angular.module('lcaApp.waterfall.directive', ['lcaApp.waterfall', 'lcaApp.format'])
    .directive('waterfallChart', ['WaterfallService', 'FormatService', function( WaterfallService, FormatService) {

        function link(scope, element, attrs) {
            var margin = {
                    top: 10,
                    right: 10,
                    bottom: 10,
                    left: 10
                },
                parentElement = element[0],
                yAxisWidth = 250,
                width = parentElement.clientWidth - margin.left - margin.right,   // diagram width
                height = parentElement.clientHeight - margin.top - margin.bottom,
                barY = 10,      // y position of bar
                barHeight = 30,
                textPadding = 6,
                legendRowHeight = 20,
                xScale = d3.scale.linear().rangeRound([0, width]),
                labelFormat = FormatService.format("^.2g"),// Format numbers with precision 2, centered
                xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .ticks(4)
                    .tickFormat(labelFormat),
                svg = null;


            /**
             * Initial preparation of svg element.
             */
            function prepareSvg() {
                svg = d3.select(parentElement).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom);

                svg.append("g")
                    .attr("class", "chart-group")
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            }

            scope.$watch('service', function (newVal){
                if (newVal) {
                    prepareSvg();
                }
            });
        }

        return {
            restrict: 'E',
            scope: { service: '=', index: '=', color: '='},
            link: link
        }
    }]);
