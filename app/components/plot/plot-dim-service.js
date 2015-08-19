/**
 * Dimension service for plot
 */
angular.module('lcaApp.plot.dimension.service', ['d3'])
    .factory('PlotDimensionService', [ 'd3Service', function(d3Service) {
        function Instance() {
            var dimension = {},
                scale = null,
                axis = null,
                data = null,
                unit = null,
                labelFn = null,
                valueFn = null;

            dimension.scale = function (_) {
                if (!arguments.length) return scale;
                scale = _;
                return dimension;
            };

            dimension.axis = function (_) {
                if (!arguments.length) return axis;
                axis = _;
                return dimension;
            };

            dimension.data = function (_) {
                if (!arguments.length) return data;
                data = _;
                return dimension;
            };

            dimension.unit = function (_) {
                if (!arguments.length) return unit;
                unit = _;
                return dimension;
            };

            dimension.labelFn = function (_) {
                if (!arguments.length) return labelFn;
                labelFn = _;
                return dimension;
            };

            dimension.valueFn = function (_) {
                if (!arguments.length) return valueFn;
                valueFn = _;
                return dimension;
            };

            return dimension;
        }

        return {
            /**
             * @ngdoc
             * @name PlotDimensionService#createInstance
             * @methodOf PlotDimensionService
             * @description
             * Creates dimension object
             * @returns {object}    dimension object
             */
            createInstance: function () {
                return new Instance();
            }
        }
    }]);
