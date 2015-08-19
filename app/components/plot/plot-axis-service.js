/**
 * @ngdoc service
 * @module lcaApp.plot.axis.service
 * @name PlotAxisService
 * @description
 * Factory Service. Creates objects that hold axis settings.
 */
angular.module('lcaApp.plot.axis.service', ['d3'])
    .factory('PlotAxisService', [ 'd3Service', function(d3Service) {
        function Instance() {
            var axis = {},
                margin = 21,
                orientation = "bottom";

            axis.margin = function (_) {
                if (!arguments.length) {
                    return margin;
                }
                margin = _;
                return axis;
            };

            axis.orientation = function (_) {
                if (!arguments.length) {
                    return orientation;
                }
                orientation = _;
                return axis;
            };

            return axis;
        }

        return {
            /**
             * @ngdoc
             * @name PlotAxisService#createInstance
             * @methodOf PlotAxisService
             * @description
             * Creates axis object
             * @returns {object}    axis object
             */
            createInstance: function () {
                return new Instance();
            }
        }
    }]);
