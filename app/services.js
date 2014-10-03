/**
 * Service to manage access to resources from web API or local storage
 */
var resourceServices = angular.module('resourceServices', ['ngResource']);

resourceServices.factory('scenarios', ['$resource',
    function($resource){
        return $resource('data/scenarios.json', {}, {
            query: {method:'GET', isArray:true}
        });
    }]);