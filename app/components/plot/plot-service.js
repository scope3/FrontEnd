/**
 * Plot service defines plot contents
 */
angular.module('lcaApp.plot.service', ['d3'])
    .factory('PlotService', [ 'd3Service', function(d3Service) {
        function Instance() {
            var elt = {},
                shape = "rect",
                color = "green",
                width = null,
                height = 10;

            elt.shape = function (_) {
                if (!arguments.length) return shape;
                shape = _;
                return elt;
            };

            elt.width = function (_) {
                if (!arguments.length) return width;
                width = _;
                return elt;
            };

            elt.height = function (_) {
                if (!arguments.length) return height;
                height = _;
                return elt;
            };
            return elt;
        }

        return {
            /**
             * @ngdoc
             * @name PlotService#createInstance
             * @methodOf PlotService
             * @description
             * Creates object
             * @returns {object}    object created
             */
            createInstance: function () {
                return new Instance();
            }
        }
    }]);
