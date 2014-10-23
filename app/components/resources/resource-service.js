/**
 * Service to manage access to resources from web API or local storage
 */
angular.module('lcaApp.resources.service', ['ngResource'])
    .constant('API_ROOT', "http://localhost:60393/api/")
    .factory('ResourceService', ['$resource', 'API_ROOT',
        function($resource, API_ROOT){
            var resourceService = {};

            resourceService.ROUTES = {
                "flowForFragment" : API_ROOT + "fragments/:fragmentID/flows",
                "fragment" : API_ROOT + "fragments/:fragmentID",
                "fragmentFlow" : API_ROOT + "scenarios/:scenarioID/fragments/:fragmentID/fragmentflows",
                "fragmentFlowProperty" : API_ROOT + "fragments/:fragmentID/flowproperties",
                "process" : API_ROOT + "processes",
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
        }
    ]);
