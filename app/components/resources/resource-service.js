/**
 * Service to manage access to resources from web API
 */
angular.module('lcaApp.resources.service', ['ngResource', 'lcaApp.idmap.service' ])
    .constant('API_ROOT', "http://localhost:60393/api/")
    .factory('ResourceService', ['$resource', 'API_ROOT', 'IdMapService', '$q',
        function($resource, API_ROOT, IdMapService, $q){
            var resourceService = {},   // Singleton creates specific service type objects
                services = {};          // Services created for, and shared by controllers

            resourceService.ROUTES = {
                "flowForFragment" : API_ROOT + "fragments/:fragmentID/flows",
                "fragment" : API_ROOT + "fragments/:fragmentID",
                "fragmentFlow" : API_ROOT + "scenarios/:scenarioID/fragments/:fragmentID/fragmentflows",
                "flowPropertyForFragment" : API_ROOT + "fragments/:fragmentID/flowproperties",
                "flowPropertyForProcess" : API_ROOT + "processes/:processID/flowproperties",
                "impactCategory" : API_ROOT + "impactcategories",
                "nodeType" : "components/resources/nodetypes.json",
                "lciaMethod" : API_ROOT + "lciamethods",
                "lciaMethodForImpactCategory" : API_ROOT + "impactcategories/:impactCategoryID/lciamethods",
                "lciaResultForProcess" : API_ROOT + "scenarios/:scenarioID/processes/:processID/lciamethods/:lciaMethodID/lciaresults",
                "process" : API_ROOT + "processes",
                "processForFlowType" : API_ROOT + "api/flowtypes/:flowTypeID/processes",
                "processFlow" : API_ROOT + "api/processes/:processID/processflows",
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

            /**
             * Create service object for a particular route
             * @param {String} routeKey   Key to ROUTES
             * @param {String} idName     Name of ID property in query result objects
             * @returns the object
             */
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
                                if (svc.idName) {
                                    IdMapService.add(svc.idName, objects);
                                }
                                d.resolve(objects);

                            },
                            function(err) {
                                d.reject("Web API query failed. URL: " + err.config.url);
                            })
                    }
                    return d.promise;
                };

                /**
                 * Default comparison function for sorting query result objects
                 * Used to sort objects by name.
                 */
                svc.compare = function (a, b) {
                    if (a.name > b.name) {
                        return 1;
                    }
                    if (a.name < b.name) {
                        return -1;
                    }
                    // a must be equal to b
                    return 0;
                };

                /**
                 * Sort query results
                 * @return {Array} sorted query results
                 */
                svc.getSortedObjects = function () {
                    svc.objects.sort(svc.compare);
                    return svc.objects;
                };

                /**
                 * Get loaded resource by object ID
                 * @param id    Object ID value
                 * @returns loaded resource, if found.
                 */
                svc.get = function(id) {
                    if (svc.idName) {
                        return IdMapService.get(svc.idName, id);
                    } else {
                        return null;
                    }
                };


                if (idName) {
                    /**
                     * Get loaded resource by object ID
                     * @param id    Object ID value
                     * @returns loaded resource, if found.
                     */
                    svc.get = function(id) {
                       return IdMapService.get(svc.idName, id);
                    };
                }

                return svc;
            };

            /**
             * Create service if not already created.
             * @param {String} serviceName    Key to service object
             * @param {String} routeKey   Key to ROUTES
             * @param {String} idName     Name of ID property in query result objects
             * @returns loaded resource, if found.
             */
            resourceService.getService = function (serviceName, routeKey, idName) {
                if (! (serviceName in services)) {
                    services[serviceName] = resourceService.create(routeKey, idName);
                }
                return services[serviceName];
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
            return ResourceService.getService('ScenarioService', "scenario", "scenarioID");
        }
    ]);

angular.module('lcaApp.resources.service')
    .factory('FragmentService', ['ResourceService',
        function(ResourceService){
            return ResourceService.getService('FragmentService', "fragment", "fragmentID");
        }
    ]);

angular.module('lcaApp.resources.service')
    .factory('ProcessService', ['ResourceService',
        function(ResourceService){
            return ResourceService.getService('ProcessService', "process", "processID");
        }
    ]);

angular.module('lcaApp.resources.service')
    .factory('ProcessForFlowTypeService', ['ResourceService',
        function(ResourceService){
            return ResourceService.getService('ProcessForFlowTypeService', "processForFlowType", "processID");
        }
    ]);

angular.module('lcaApp.resources.service')
    .factory('FlowPropertyForFragmentService', ['ResourceService',
        function(ResourceService){
            return ResourceService.getService('FlowPropertyForFragmentService', "flowPropertyForFragment", "flowPropertyID");
        }
    ]);

angular.module('lcaApp.resources.service')
    .factory('FlowPropertyForProcessService', ['ResourceService',
        function(ResourceService){
            return ResourceService.getService('FlowPropertyForProcessService', "flowPropertyForProcess", "flowPropertyID");
        }
    ]);

angular.module('lcaApp.resources.service')
    .factory('FragmentFlowService', ['ResourceService',
        function(ResourceService){
            return ResourceService.getService('FragmentFlowService', "fragmentFlow", "fragmentFlowID");
        }
    ]);

angular.module('lcaApp.resources.service')
    .factory('FlowForFragmentService', ['ResourceService',
        function(ResourceService){
            return ResourceService.getService('FlowForFragmentService', "flowForFragment", "flowID");
        }
    ]);

angular.module('lcaApp.resources.service')
    .factory('ImpactCategoryService', ['ResourceService',
        function(ResourceService){
            return ResourceService.getService('ImpactCategoryService', "impactCategory", "impactCategoryID");
        }
    ]);

angular.module('lcaApp.resources.service')
    .factory('LciaMethodService', ['ResourceService',
        function(ResourceService){
            return ResourceService.getService('LciaMethodService', "lciaMethod", "lciaMethodID");
        }
    ]);

angular.module('lcaApp.resources.service')
    .factory('LciaMethodForImpactCategoryService', ['ResourceService',
        function(ResourceService){
            return ResourceService.getService('LciaMethodForImpactCategoryService', "lciaMethodForImpactCategory",
                "lciaMethodID");
        }
    ]);

angular.module('lcaApp.resources.service')
    .factory('NodeTypeService', ['ResourceService',
        function(ResourceService){
            return ResourceService.getService('NodeTypeService', "nodeType", "nodeTypeID");
        }
    ]);

angular.module('lcaApp.resources.service')
    .factory('ProcessFlowService', ['ResourceService',
        function(ResourceService){
            return ResourceService.getService('ProcessFlowService', "processFlow", null);
        }
    ]);

angular.module('lcaApp.resources.service')
    .factory('LciaResultForProcessService', ['ResourceService',
        function(ResourceService){
            return ResourceService.getService('LciaResultForProcessService', "lciaResultForProcess", null);
        }
    ]);