/**
 * JavaScript Set data type.
 * Uses d3.set which converts added values to strings.
 */
angular.module('d3.set', [])
    .factory('SetService', [function(array){
        return d3.set(array);
    }]);
