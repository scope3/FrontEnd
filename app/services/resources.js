/**
 * Service to manage access to resources from web API or local storage
 */
angular.module('lcaApp.resourceServices', ['ngResource'])
    .factory('ResourceService', ['$resource',
        function($resource){
            var resourceService = {},
                apiRoot = "http://localhost:60393/api/";    // Ideally, this would be in a config file.
                                                            // No support for that built in to angular
            resourceService.getScenarioResource = function () {
                return $resource('data/scenarios.json', {}, {
                    query: {method: 'GET', isArray: true}
                });
            };

            resourceService.getFragmentResource = function () {
                var fragmentURL = apiRoot + "fragments/:fragmentId";
                return $resource( fragmentURL, {}, {
                    query: {method: 'GET', isArray: true}
                });
            };

            return resourceService;
   }]);
