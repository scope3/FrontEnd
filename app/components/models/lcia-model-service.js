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
                scenarios = { };

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
                    resourceSvc.load(filter)
                        .then(function(response) {
                            deferred.resolve(updateModel(filter, response));
                        },
                        function(err) {
                            deferred.reject("LCIA Model load failed. " + err);
                        });
                }
                return deferred.promise;
            };

            function nest(parent, property) {
                if (! (property in parent)) {
                    parent[property] = {};
                }
                return parent[property];
            }

            /**
             * Internal functions
             */
            function updateModel(filter, response) {

                if (filter && filter.hasOwnProperty("scenarioID")) {
                    var m = nest( scenarios, filter.scenarioID);
                    if (filter.hasOwnProperty("processID")) {
                        m = nest( nest(m, "processes"), filter.processID);
                    } else {
                        if (filter.hasOwnProperty("fragmentID")) {
                           m = nest(nest(m, "fragments"), filter.fragmentID);
                        }
                    }
                }
            }

            return svc;
        }
    ]);
