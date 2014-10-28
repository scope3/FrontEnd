/**
 * Service to manage access to resources from web API or local storage
 */
angular.module('lcaApp.resources.service', ['ngResource', 'lcaApp.idmap.service' ])
    .constant('API_ROOT', "http://localhost:60393/api/")
    .factory('ResourceService', ['$resource', 'API_ROOT', 'IdMapService', '$q',
        function($resource, API_ROOT, IdMapService, $q){
            var resourceService = {};
            resourceService.ROUTES = {
                "flowForFragment" : API_ROOT + "fragments/:fragmentID/flows",
                "fragment" : API_ROOT + "fragments/:fragmentID",
                "fragmentFlow" : API_ROOT + "scenarios/:scenarioID/fragments/:fragmentID/fragmentflows",
                "fragmentFlowProperty" : API_ROOT + "fragments/:fragmentID/flowproperties",
                "nodeType" : "components/resources/nodetypes.json",
                "process" : API_ROOT + "processes",
                "scenario" : API_ROOT + "scenarios"
            };

            resourceService.getResource = function( routeKey) {
                if ( routeKey in this.ROUTES) {
                    return $resource( this.ROUTES[routeKey], {}, {
                        get: {method: 'GET', cache: true, isArray: false},
                        query: {method: 'GET', cache: true, isArray: true}
                    });
                }
            };

            resourceService.create = function( routeKey, idName) {
                var svc =
                    { loadFilter: null,
                      resource: resourceService.getResource(routeKey), // Instance of $resource
                      objects: null,    // Query results
                      idName: idName }; // Object ID property name

                /**
                 * Load resources using filter. Cache results using IdMapService
                 * @param {Object} filter   Resource query filter
                 * @returns promise of loaded resources
                 */
                svc.load = function(filter) {
                    var d = $q.defer();
                    if (filter === svc.loadFilter && svc.objects) {
                        d.resolve(svc.objects);
                    } else {
                        svc.loadFilter = filter;
                        svc.objects = svc.resource.query( filter,
                            function(objects) {
                                IdMapService.add(svc.idName, objects);
                                d.resolve(objects);
                            },
                            function(err) {
                                d.reject("Web API query failed. URL: " + err.config.url);
                            })
                    }
                    return d.promise;
                };

                /**
                 * Get loaded resource by object ID
                 * @param id    Object ID value
                 * @returns loaded resource, if found.
                 */
                svc.get = function(id) {
                    return IdMapService.get(svc.idName, id);
                };

                return svc;
            };

            return resourceService;
        }
    ]);
//
// Factories using functional inheritance
//
angular.module('lcaApp.resources.service')
    .factory('ScenarioService', ['ResourceService',
        function(ResourceService){
            return ResourceService.create("scenario", "scenarioID");
        }
    ]);

angular.module('lcaApp.resources.service')
    .factory('FragmentService', ['ResourceService',
        function(ResourceService){
            return ResourceService.create("fragment", "fragmentID");
        }
    ]);

angular.module('lcaApp.resources.service')
    .factory('ProcessService', ['ResourceService',
        function(ResourceService){
            return ResourceService.create("process", "processID");
        }
    ]);


angular.module('lcaApp.resources.service')
    .factory('FlowPropertyForFragmentService', ['ResourceService',
        function(ResourceService){
            return ResourceService.create("fragmentFlowProperty", "flowPropertyID");
        }
    ]);

angular.module('lcaApp.resources.service')
    .factory('FragmentFlowService', ['ResourceService',
        function(ResourceService){
            return ResourceService.create("fragmentFlow", "fragmentFlowID");
        }
    ]);

angular.module('lcaApp.resources.service')
    .factory('FlowForFragmentService', ['ResourceService',
        function(ResourceService){
            return ResourceService.create("flowForFragment", "flowID");
        }
    ]);

angular.module('lcaApp.resources.service')
    .factory('NodeTypeService', ['ResourceService',
        function(ResourceService){
            return ResourceService.create("nodeType", "nodeTypeID");
        }
    ]);