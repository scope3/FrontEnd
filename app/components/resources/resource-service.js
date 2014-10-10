/**
 * Service to manage access to resources from web API or local storage
 */
angular.module('lcaApp.resources.service', ['ngResource'])
    .factory('ResourceService', ['$resource',
        function($resource){
            var resourceService = {},
                apiRoot = "http://localhost:60393/api/",
                apiFragment = apiRoot + "fragments",
                apiProcess = apiRoot + "processes",
                apiScenario = apiRoot + "scenarios";

            resourceService.ROUTES = {
                "fragment" : apiRoot + "fragments/:fragmentID",
                "fragmentFlow" : apiRoot + "scenarios/:scenarioID/fragments/:fragmentID/fragmentflows",
                "fragmentFlowProperty" : apiRoot + "fragments/:fragmentID/flowproperties",
                "process" : apiRoot + "processes",
                "scenario" : "components/resources/scenarios.json"
            };

            resourceService.getResource = function( routeKey) {
                if ( routeKey in this.ROUTES) {
                    return $resource( this.ROUTES[routeKey], {}, {
                        get: {method: 'GET', cache: true, isArray: false},
                        query: {method: 'GET', cache: true, isArray: true}
                    });
                }
            };

            return resourceService;
   }]);
