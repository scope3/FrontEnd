/* global d3 */
/**
 * @ngdoc service
 * @module d3.sankey.service
 * @name SankeyService
 * @memberOf d3.sankey
 * @description
 * Factory service. Wraps d3-plugin, sankey.
 */
angular.module('d3.sankey.service', ['d3'])

    .factory('SankeyService', ['d3Service', function(d3Service){
        return d3Service.sankey();
    }]);
/**
 * @ngdoc service
 * @module lcaApp.sankey.service
 * @name SankeyColorService
 * @description
 * Factory service for mapping node and link properties to colors
 */
angular.module('lcaApp.sankey.service', ['d3'])
    .factory('SankeyColorService', ['d3Service', function(d3Service){
        var sankeyColors = {
            node : null,
            link : null
        };

        /**
         * @ngdoc
         * @name SankeyColorService#createColorSpec
         * @methodOf SankeyColorService
         * @description
         * Create spec for service's node or link property
         * @param { string } p Property name ("node" or "link")
         * @param { object } c ColorCode constant
         * @param { function } a Function that returns domain value from the data object for a node or link.
         * @returns { object } the service singleton, enables method chaining
         */
        sankeyColors.createColorSpec = function (p, c, a) {
            sankeyColors[p] = {
                colorScale : d3Service.scale.ordinal(),
                getColor : function (d) {
                    var val = a.call(sankeyColors[p], d);
                    return sankeyColors[p].colorScale(val);
                }
            };
            sankeyColors[p].colorScale.domain(d3Service.keys(c));
            sankeyColors[p].colorScale.range(d3Service.values(c));

            return sankeyColors;
        };

        return sankeyColors;
    }]);
