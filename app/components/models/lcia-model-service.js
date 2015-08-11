//noinspection JSValidateJSDoc
/**
 * @ngdoc service
 * @module lcaApp.models.lcia
 * @name LciaModelService
 * @memberOf lcaApp.models.lcia
 * @description
 * Factory service providing data model for Process/Fragment LCIA cumulative results.
 */
angular.module("lcaApp.models.lcia", ["lcaApp.resources.service", "lcaApp.status.service"] )
    .factory("LciaModelService", ["LciaTotalForProcessService", "LciaTotalForFragmentService", "$q",
        function(LciaTotalForProcessService, LciaTotalForFragmentService, $q) {
            var svc = {},
                scenarios = { };    // Associative array of cached LCIA results

            /**
             * @ngdoc
             * @name LciaModelService#load
             * @methodOf LciaModelService
             * @description
             * Load lcia totals
             * @param {object} filter   Web API request filter
             * @returns {Deferred} promise. Resolves to model for scenario containing loaded results.
             */
            svc.load = function( filter) {
                var deferred = $q.defer(),
                    resourceSvc = null;

                if (filter.hasOwnProperty("processID")) {
                    resourceSvc = LciaTotalForProcessService;
                } else if (filter.hasOwnProperty("fragmentID")) {
                    resourceSvc = LciaTotalForFragmentService;
                } else {
                    deferred.reject("Invalid filter : " + filter);
                }
                if (resourceSvc ) {
                    var loaded = svc.get(filter);
                    if (loaded) {
                        deferred.resolve(loaded);
                    }
                    else {
                        resourceSvc.reload(filter)
                            .then(function(response) {
                                updateModel(filter, response);
                                deferred.resolve(response);
                            },
                            function(err) {
                                deferred.reject("LCIA Model load failed. " + err);
                            });
                    }

                }
                return deferred.promise;
            };

            /**
             * @ngdoc
             * @name LciaModelService#get
             * @methodOf LciaModelService
             * @description
             * Get cached LCIA results
             * @param {object} filter   Web API request filter
             * @returns {[] | null} cached results, if they exist
             */
            svc.get = function(filter) {
                var results = null;
                if (filter && filter.hasOwnProperty("scenarioID") && scenarios.hasOwnProperty(filter["scenarioID"])) {
                    var sr = scenarios[filter["scenarioID"]];
                    if (filter.hasOwnProperty("processID")) {
                        results = getNestedResults( sr, filter["processID"], "processes");
                    } else if (filter.hasOwnProperty("fragmentID")) {
                        results = getNestedResults( sr, filter["fragmentID"], "fragments");
                    }
                }
                return results;
            };

            /**
             * @ngdoc
             * @name LciaModelService#clearCache
             * @methodOf LciaModelService
             * @description
             * Clear scenario cache
             * @param { number } scenarioID
             */
            svc.clearCache = function (scenarioID) {
                if (scenarios.hasOwnProperty(scenarioID)) {
                    scenarios[scenarioID] = {};
                }
            };

            /**
             * Internal functions
             */
            function getNestedResults(parent, filter, type) {
                if (parent.hasOwnProperty(type) && parent[type].hasOwnProperty(filter)) {
                    return parent[type][filter];
                } else {
                    return null;
                }
            }

            function setNestedResults(parent, filter, type, results) {
                var p = nest(parent, type);
                p[filter] = results;
            }

            function nest(parent, property) {
                if (! (property in parent)) {
                    parent[property] = {};
                }
                return parent[property];
            }

            function updateModel(filter, response) {
                if (filter && filter.hasOwnProperty("scenarioID")) {
                    var m = nest( scenarios, filter.scenarioID);
                    if (filter.hasOwnProperty("processID")) {
                        setNestedResults(m, filter["processID"], "processes", response);
                    } else {
                        if (filter.hasOwnProperty("fragmentID")) {
                            setNestedResults(m, filter["fragmentID"], "fragments", response);
                        }
                    }
                }
            }

            return svc;
        }
    ]);
