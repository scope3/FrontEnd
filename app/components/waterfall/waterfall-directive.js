/**
 * Directive for reusable waterfall chart
 */
angular.module('lcaApp.waterfall.directive', ['lcaApp.waterfall'])
    .directive('waterfallChart', ['WaterfallService', function( WaterfallService) {

        function link(scope, element, attrs) {
            var margin = {
                    top: 10,
                    right: 10,
                    bottom: 10,
                    left: 10
                },
                parentElement = element[0],
                width = parentElement.clientWidth - margin.left - margin.right,   // diagram width
                svgHeight = parentElement.clientHeight - margin.top - margin.bottom,
                barY = 10,      // y position of bar
                barHeight = 30,
                textPadding = 6,
                legendRowHeight = 20,
                xScale = d3.scale.linear().rangeRound([0, width]),
                labelFormat = d3.format("^.2g"),    // Format numbers with precision 2
                xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .ticks(4)
                    .tickFormat(labelFormat),
                svg = null,
                yAxisWidth = 250;
        }

        return {
            restrict: 'E',
            scope: { stages: '=', values: '=', color: '=' },
            link: link
        }
    }]);
