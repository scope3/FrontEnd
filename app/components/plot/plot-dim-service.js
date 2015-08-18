/**
 * Dimension service for plot
 */
angular.module('lcaApp.dimension.service', ['d3'])
    .factory('DimensionService', [ 'd3Service', function(d3Service) {
        function Instance() {
            var dimension = {},
                scale,
                axis;

            dimension.scale = function (_) {
                if (!arguments.length) {
                    return scale;
                }
                scale = _;
                return dimension;
            };

            dimension.axis = function (_) {
                if (!arguments.length) {
                    return axis;
                }
                axis = _;
                return dimension;
            };
        }

        return {
            /**
             * @ngdoc
             * @name DimensionService#createInstance
             * @methodOf DimensionService
             * @description
             * Creates dimension object
             * @returns {object}    dimension object
             */
            createInstance: function () {
                return new Instance();
            }
        }
    }]);
