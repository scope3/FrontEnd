/**
 * Wrap d3 in an angular service so that dependencies will be more apparent.
 * d3 has some functions that are useful in all kinds of app modules.
 * TODO : change chart directives to use this service instead of accessing d3 directly.
 */
angular.module('d3', [])
    .factory('d3Service', [function(){
        return d3;
    }]);
