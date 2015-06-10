/**
 * @ngdoc service
 * @module d3
 * @name d3Service
 * @memberOf d3
 * @description
 * Factory service. Wraps bower component, d3, in an angular service so that dependencies will be more apparent.
 * d3 has functions that are useful in all kinds of app modules, not just graphic directives.
 */
angular.module('d3', [])
    .factory('d3Service', [function(){
        return d3;
    }]);
