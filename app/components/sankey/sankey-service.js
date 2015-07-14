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
 *
 * @description
 * Factory service for mapping node and link properties to colors
 */
angular.module('lcaApp.sankey.service', ['d3'])
    .factory('SankeyColorService', ['d3Service', function(d3Service){
        /**
         * @namespace
         *  @property {object} node  - color spec for node objects
         *  @property {object} link  - color spec for link objects
         */
        var sankeyColors = {
            node : null,
            link : null
        };

        /**
         * @ngdoc method
         * @module lcaApp.sankey.service
         * @name SankeyColorService#createColorSpec
         * @methodOf SankeyColorService
         * @description
         * Create spec object for service's node or link property.
         * @param { string } p Property name ("node" or "link")
         * @param { object } c associative array providing color map
         * @param { function= } a Function that returns domain value from the data object for a node or link.
         * @param { object= } l Associative array mapping domain value to label
         * @returns { object } the service singleton, SankeyColorService, where SankeyColorService[p] is set to the object
         * created by this method.
         */
        sankeyColors.createColorSpec = function (p, c, a, l) {
            /**
             * @namespace
             *  @property colorScale  - Instance of d3.scale.ordinal
             *  @property {function} getDomainVal  - Maps object to colorScale domain value
             *  @property {function} getColor  -  Maps object to colorScale range value
             *  @property {function} getLabel  -  Maps colorScale domain value to label
             */
            var thisSpec = {
                colorScale : d3Service.scale.ordinal()
            };
            thisSpec.colorScale.domain(d3Service.keys(c));
            thisSpec.colorScale.range(d3Service.values(c));
            thisSpec.getDomainVal = function(d) {
                return a ? a.call(thisSpec, d) : d;
            };
            thisSpec.getColor = function(d) {
                return thisSpec.colorScale(thisSpec.getDomainVal(d));
            };
            thisSpec.getLabel = function(d) {
                return (l && l.hasOwnProperty(d)) ? l[d] : d;
            };
            sankeyColors[p] = thisSpec;
            return sankeyColors;
        };

        return sankeyColors;
    }]);
