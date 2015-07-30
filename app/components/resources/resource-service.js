/**
 * @ngdoc service
 * @module lcaApp.resources.service
 * @name ResourceService
 * @memberOf lcaApp.resources.service
 * @description
 * Factory service that creates other services based on $resource.
 */
angular.module('lcaApp.resources.service', ['ngResource', 'lcaApp.idmap.service', 'lcaApp.resources.lciaMethod'
    , 'lcaApp.config' , 'lcaApp.resources.flowPropertyMagnitude'])
    .constant('MODEL_BASE_CASE_SCENARIO_ID', 1)
    .constant('BASE_SCENARIO_GROUP_ID', 1)
    .factory('ResourceService', ['$resource', 'API_ROOT', 'IdMapService', '$q', '$location',
        function($resource, API_ROOT, IdMapService, $q, $location){
            var resourceService = {},   // Singleton creates specific service type objects
                services = {},          // Services created for, and shared by controllers
                authParamObject = null, // '2514bc8' - Authentication token is now extracted from URL
                actions = {
                // Custom actions
                    update: { method: 'PUT' },
                    replace: { method: 'PUT', isArray:true }
                };

            resourceService.ROUTES = {
                "compositionFlow" : API_ROOT + "compositionflows",
                "flow" : API_ROOT + "flows/:flowID",
                "flowForFragment" : API_ROOT + "fragments/:fragmentID/flows",
                "flowForLciaMethod" : API_ROOT + "lciamethods/:lciaMethodID/flows",
                "fragment" : API_ROOT + "fragments/:fragmentID",
                "fragmentFlow" : API_ROOT + "scenarios/:scenarioID/fragments/:fragmentID/fragmentflows",
                "fragmentStage" : API_ROOT + "fragments/:fragmentID/fragmentstages",
                "flowPropertyForFragment" : API_ROOT + "fragments/:fragmentID/flowproperties",
                "flowPropertyForProcess" : API_ROOT + "processes/:processID/flowproperties",
                "flowPropertyMagnitude" : API_ROOT + "flows/:flowID/flowpropertymagnitudes",
                "impactCategory" : API_ROOT + "impactcategories",
                "lciaFactor" : API_ROOT + "lciamethods/:lciaMethodID/lciafactors",
                "lciaMethod" : API_ROOT + "lciamethods",
                "lciaMethodForImpactCategory" : API_ROOT + "impactcategories/:impactCategoryID/lciamethods",
                "lciaResultForFragment" : API_ROOT + "scenarios/:scenarioID/fragments/:fragmentID/lciamethods/:lciaMethodID/lciaresults",
                "lciaResultForProcess" : API_ROOT + "scenarios/:scenarioID/processes/:processID/lciamethods/:lciaMethodID/lciaresults",
                "lciaTotalForFragment" : API_ROOT + "scenarios/:scenarioID/fragments/:fragmentID/lciaresults",
                "lciaTotalForProcess" : API_ROOT + "scenarios/:scenarioID/processes/:processID/lciaresults",
                "param" : API_ROOT + "scenarios/:scenarioID/params/:paramID",
                "process" : API_ROOT + "processes",
                "processDissipation" : API_ROOT + "processes/:processID/dissipation",
                "processForFlowType" : API_ROOT + "flowtypes/:flowTypeID/processes",
                "processFlow" : API_ROOT + "processes/:processID/processflows",
                "scenario" : API_ROOT + "scenarios/:scenarioID",
                "scenarioGroup" : API_ROOT + "scenariogroups/:scenarioGroupID"
            };

            /**
             * @ngdoc
             * @name ResourceService#getResource
             * @methodOf ResourceService
             * @description
             * Create an instance of $resource
             * @param { string } routeKey Key in associative array, ResourceService.ROUTES
             * @returns {object} the resource object
             */
            resourceService.getResource = function( routeKey) {
                if ( resourceService.ROUTES.hasOwnProperty(routeKey)) {
                    return $resource(resourceService.ROUTES[routeKey], {}, actions);
                }
            };

            /**
             * @ngdoc
             * @name ResourceService#getAuthParam
             * @methodOf ResourceService
             * @description
             * Extract auth token from current URL. Only do this once per app session.
             * @returns { ?string } the auth token if found, otherwise, null
             */
            resourceService.getAuthParam = function() {
                if (authParamObject === null) {
                    authParamObject = $location.search();
                }
                return authParamObject.hasOwnProperty("auth") ? authParamObject.auth : null;
            };

            /**
             * @ngdoc
             * @name ResourceService#getAuthParam
             * @methodOf ResourceService
             * @description
             * Add auth token to web API request parameters
             * @param {?object} filter Existing request parameters
             * @returns {object} request parameters with auth property set to auth token, if it exists
             */
            resourceService.addAuthParam = function( filter) {
                var paramFilter = filter || {},
                    authParam = resourceService.getAuthParam();

                if (authParam) {
                    paramFilter.auth = authParam;
                }
                return paramFilter;
            };

            /**
             * Create service object for a particular route
             * @param {String} routeKey   Key to ROUTES
             * @param {String} idName     Name of ID property in query result objects
             * @returns {{loadFilter: null, resource: *, objects: null, extensionFactory: null}} object
             */
            resourceService.createService = function( routeKey, idName) {
                var svc =
                    { loadFilter: null,
                      resource: resourceService.getResource(routeKey), // Instance of $resource
                      objects: null,    // Loaded objects
                      extensionFactory: null, // Factory for extending loaded objects
                      authenticated : false   // Web API requests are unauthenticated unless this
                                              // application's URL contains auth parameter
                    };

                svc.authenticated = resourceService.getAuthParam() != null;

                svc.handleNewObjects = function(objects) {
                    if (svc.extensionFactory) {
                        objects.forEach( function (o) {
                            angular.extend(o, svc.extensionFactory.createInstance(o))
                        });
                    }
                    if (svc.idName) {
                        IdMapService.clear(routeKey);
                        IdMapService.add(routeKey, svc.idName, objects);
                    }
                };

                /**
                 * Load resources using filter. Cache results using IdMapService
                 * If extension objects exists, extend the resource objects.
                 * @param {Object} filter   Resource query filter
                 * @returns promise of loaded resources
                 */
                svc.load = function(filter) {
                    var d = $q.defer(),
                        authFilter = resourceService.addAuthParam(filter);
                    if (angular.equals(authFilter, svc.loadFilter) && svc.objects) {
                        d.resolve(svc.objects);
                    } else {
                        svc.loadFilter = authFilter;
                        svc.objects = svc.resource.query( authFilter,
                            function(objects) {
                                svc.handleNewObjects(objects);
                                d.resolve(objects);
                            },
                            function(err) {
                                d.reject("Web API query failed. URL: " + err.config.url);
                            })
                    }
                    return d.promise;
                };

                /**
                 * Clear internal cache before load
                 * @param filter
                 */
                svc.reload = function(filter) {
                    svc.objects = null;
                    return svc.load(filter);
                };

                /**
                 * comparison function for sorting query result objects
                 * by name.
                 */
                svc.compareByName = function (a, b) {
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
                 * Get query results
                 * @return {[]} the results
                 */
                svc.getAll = function () {
                    return svc.objects;
                };

                if (idName) {
                    svc.idName = idName;
                    /**
                     * Get loaded resource by object ID
                     * @param { number } id     Object ID value
                     * @returns { null | {} }   Loaded resource, if found.
                     */
                    svc.get = function(id) {
                       return IdMapService.get(routeKey, id);
                    };
                }

                /**
                 * Set optional extension object.
                 * @param obj   The extension object
                 * @returns {{loadFilter: null, resource: *, objects: null, extensionFactory: null}} service
                 */
                svc.setExtensionFactory = function (obj) {
                    svc.extensionFactory = obj;
                    return svc;
                };

                return svc;
            };

            resourceService.addChangeMethods = function(svc) {
                svc.create = function (urlParameters, obj, successCB, errorCB) {
                    var p = resourceService.addAuthParam(urlParameters);
                    svc.objects = null;
                    return svc.resource.save( p, obj, successCB, errorCB);
                };
                // avoid using reserved word, delete
                svc.remove = function(urlParameters, obj, successCB, errorCB) {
                    var p = resourceService.addAuthParam(urlParameters);
                    p[svc.idName] = obj[svc.idName];
                    svc.objects = null;
                    return svc.resource.delete( p, obj, successCB, errorCB);
                };

                svc.update = function(urlParameters, obj, successCB, errorCB) {
                    var p = resourceService.addAuthParam(urlParameters);
                    p[svc.idName] = obj[svc.idName];
                    return svc.resource.update( p, obj, successCB, errorCB);
                };

                svc.replace = function(urlParameters, objArray, successCB, errorCB) {
                    var p = resourceService.addAuthParam(urlParameters);

                    svc.objects = svc.resource.replace( p, objArray,
                        function(objects) {
                            svc.handleNewObjects(objects);
                            successCB.call(objects);
                        },
                        errorCB);
                    return svc.objects;
                };
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
                    var svc = resourceService.createService(routeKey, idName);
                    if (routeKey === "scenario" || routeKey === "param") {
                        resourceService.addChangeMethods(svc);
                    }
                    services[serviceName] = svc;
                }
                return services[serviceName];
            };

            /**
             * Create a service to get single resource without caching.
             * @param serviceName
             * @returns {{}}
             */
            resourceService.createSimpleGetService = function (serviceName) {
                var resource = resourceService.getResource(serviceName),
                    svc = {};

                svc.get = function(filter, callback) {
                    return resource.get(resourceService.addAuthParam(filter), callback);
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
    .factory('ScenarioService', ['ResourceService', 'BASE_SCENARIO_GROUP_ID',
        function(ResourceService, BASE_SCENARIO_GROUP_ID){
            var svc = ResourceService.getService('ScenarioService', "scenario", "scenarioID");
            /**
             * Does user have delete access to scenario?
             * @param { {scenarioID, scenarioGroupID } } scenario
             * @returns {boolean}
             */
            svc.canDelete = function (scenario) {
                return scenario.scenarioGroupID !== BASE_SCENARIO_GROUP_ID;
            };

            /**
             * Does user have update access to scenario?
             * @param { {scenarioID, scenarioGroupID } } scenario
             * @returns {boolean}
             */
            svc.canUpdate = function (scenario) {
                return scenario.scenarioGroupID !== BASE_SCENARIO_GROUP_ID;
            };

            /**
             * Can user create scenario? Any authenticated user should be able to create scenario.
             * If URL does not contain auth param, then user cannot be authenticated.
             * @returns {boolean}
             */
            svc.canCreate = function () {
                return ResourceService.getAuthParam() !== null;
            };

            return svc;
        }
    ])
    .factory('ScenarioGroupService', ['ResourceService',
        function(ResourceService){
            return ResourceService.getService('ScenarioGroupService', "scenarioGroup", "scenarioGroupID");
        }
    ])
    .factory('FragmentService', ['ResourceService',
        function(ResourceService){
            return ResourceService.getService('FragmentService', "fragment", "fragmentID");
        }
    ])
    .factory('ProcessService', ['ResourceService',
        function(ResourceService){
            return ResourceService.getService('ProcessService', "process", "processID");
        }
    ])
    .factory('ProcessForFlowTypeService', ['ResourceService',
        function(ResourceService){
            return ResourceService.getService('ProcessForFlowTypeService', "processForFlowType", "processID");
        }
    ])
    .factory('CompositionFlowService', ['ResourceService',
        function(ResourceService){
            return ResourceService.getService('CompositionFlowService', "compositionFlow", "flowID");
        }
    ])
    .factory('FlowService', ['ResourceService',
        function(ResourceService){
            return ResourceService.getService('FlowService', "flow", "flowID");
        }
    ])
    .factory('FlowPropertyForFragmentService', ['ResourceService',
        function(ResourceService){
            return ResourceService.getService('FlowPropertyForFragmentService', "flowPropertyForFragment", "flowPropertyID");
        }
    ])
    .factory('FlowPropertyForProcessService', ['ResourceService',
        function(ResourceService){
            return ResourceService.getService('FlowPropertyForProcessService', "flowPropertyForProcess", "flowPropertyID");
        }
    ])
    .factory('FlowPropertyMagnitudeService', ['ResourceService', 'FlowPropertyMagnitudeExtension',
        function(ResourceService, FlowPropertyMagnitudeExtension){
            return ResourceService.getService('FlowPropertyMagnitudeService', "flowPropertyMagnitude", "flowPropertyID")
                .setExtensionFactory(FlowPropertyMagnitudeExtension);
        }
    ])
    .factory('FragmentFlowService', ['ResourceService',
        function(ResourceService){
            return ResourceService.getService('FragmentFlowService', "fragmentFlow", "fragmentFlowID");
        }
    ])
    .factory('FragmentStageService', ['ResourceService',
        function(ResourceService){
            return ResourceService.getService('FragmentStageService', "fragmentStage", "fragmentStageID");
        }
    ])
    .factory('FlowForLciaMethodService', ['ResourceService',
        function(ResourceService){
            return ResourceService.getService('FlowForLciaMethodService', "flowForLciaMethod", "flowID");
        }
    ])
    .factory('FlowForFragmentService', ['ResourceService',
        function(ResourceService){
            return ResourceService.getService('FlowForFragmentService', "flowForFragment", "flowID");
        }
    ])
    .factory('ImpactCategoryService', ['ResourceService',
        function(ResourceService){
            return ResourceService.getService('ImpactCategoryService', "impactCategory", "impactCategoryID");
        }
    ])
    .factory('LciaFactorService', ['ResourceService',
        function(ResourceService){
            return ResourceService.getService('LciaFactorService', "lciaFactor", null);
        }
    ])
    .factory('LciaMethodService', ['ResourceService', 'LciaMethodExtension',
        function(ResourceService, LciaMethodExtension){
            return ResourceService.getService('LciaMethodService', "lciaMethod", "lciaMethodID")
                .setExtensionFactory(LciaMethodExtension);
        }
    ])
    .factory('LciaMethodForImpactCategoryService', ['ResourceService',
        function(ResourceService){
            return ResourceService.getService('LciaMethodForImpactCategoryService', "lciaMethodForImpactCategory",
                "lciaMethodID");
        }
    ])
    .factory('ParamService', ['ResourceService',
        function(ResourceService){
            return ResourceService.getService('ParamService', "param", "paramID");
        }
    ])
    .factory('ProcessDissipationService', ['ResourceService',
        function(ResourceService){
            return ResourceService.getService('ProcessDissipationService', "processDissipation", null);
        }
    ])
    .factory('ProcessFlowService', ['ResourceService',
        function(ResourceService){
            return ResourceService.getService('ProcessFlowService', "processFlow", null);
        }
    ]);

/**
 * Simple GET services. Not cached nor extended in this module
 */
angular.module('lcaApp.resources.service')
/**
 * Detailed LCIA results for multiple methods are queried simultaneously.
 * The query returns only one object, so no need to use IdMapService
 */
    .factory('LciaResultForProcessService', ['ResourceService',
        function(ResourceService){
            return ResourceService.createSimpleGetService("lciaResultForProcess");
        }
    ])
    .factory('LciaResultForFragmentService', ['ResourceService',
        function(ResourceService){
            return ResourceService.createSimpleGetService("lciaResultForFragment");
        }
    ])
/**
 * Cumulative LCIA results for all methods.
 * Caching is handled by model service
 */
    .factory('LciaTotalForProcessService', ['ResourceService',
        function(ResourceService){
            return ResourceService.createSimpleGetService("lciaTotalForProcess");
        }
    ])
    .factory('LciaTotalForFragmentService', ['ResourceService',
        function(ResourceService){
            return ResourceService.createSimpleGetService("lciaTotalForFragment");
        }
    ]);