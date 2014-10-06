/**
 * Service to manage access to resources from web API or local storage
 */
var resourceServices = angular.module('lcaApp.resourceServices', ['ngResource']);

resourceServices.factory('Scenario', ['$resource',
    function($resource){
        return $resource('data/scenarios.json', {}, {
            query: {method:'GET', isArray:true}
        });
    }]);