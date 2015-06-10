/**
 * @ngdoc service
 * @module d3.tip
 * @name TipService
 * @memberOf d3.tip
 * @description
 * Factory service. Wraps bower component, d3-tip, tooltip used with d3.
 */
angular.module('d3.tip', [])
    .factory('TipService', [function(){
        return d3.tip().attr('class', 'd3-tip');
    }]);