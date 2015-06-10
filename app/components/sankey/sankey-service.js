/**
 * @ngdoc service
 * @module d3.sankey.service
 * @name SankeyService
 * @memberOf d3.sankey.service
 * @description
 * Factory service. Wraps d3-plugin, sankey.
 */
angular.module('d3.sankey.service', [])
    .factory('SankeyService', [function(){
        return d3.sankey();
    }]);
