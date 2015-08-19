/**
 * Margin service for plot
 */
angular.module('lcaApp.plot.margin.service', ['d3'])
    .factory('PlotMarginService', [ 'd3Service', function(d3Service) {
        function Instance() {
            return {
                top: 5,
                right: 5,
                bottom: 5,
                left: 5
            };
        }

        return {
            /**
             * @ngdoc
             * @name PlotMarginService#createInstance
             * @methodOf PlotMarginService
             * @description
             * Creates margin object
             * @returns {object}    margin object
             */
            createInstance: function () {
                return new Instance();
            }
        }
    }]);
