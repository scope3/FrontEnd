/**
 * Axis service for plot
 */
angular.module('lcaApp.axis.service', ['d3'])
    .factory('AxisService', [ 'd3Service', function(d3Service) {
        function Instance() {
            var axis = {},
                width,
                orientation;

            axis.width = function (_) {
                if (!arguments.length) {
                    return width;
                }
                width = _;
                return scale;
            };

            axis.orientation = function (_) {
                if (!arguments.length) {
                    return orientation;
                }
                orientation = _;
                return orientation;
            };

            return axis;
        }

        return {
            /**
             * @ngdoc
             * @name AxisService#createInstance
             * @methodOf DimensionService
             * @description
             * Creates axis object
             * @returns {object}    axis object
             */
            createInstance: function () {
                return new Instance();
            }
        }
    }]);
