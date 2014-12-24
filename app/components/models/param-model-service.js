/**
 * Service providing data model for LCA parameters.
 * This model facilitates parameter lookup with a nested associative array.
 * Parameters are first indexed by scenarioID. Subsequent nesting depends on parameter type.
 * Currently, only parameter types affecting LCIA results are handled
 * (Characterization Factor, Emission Factor, Dissipation Factor?).
 * Other parameter types are ignored until front end usage has been determined.
 * Characterization Factor parameters are indexed by scenarioID, lciaMethodID, flowID.
 * Dissipation and Emission Factor parameters are indexed by scenarioID, processID, flowID.
 *
 * Example :
 *
    { scenarios: { 2: {
        lciaMethods: {
            17: {
                flows: {
                    1121: {
                        "paramID": 9,
                        "paramTypeID": 10,
                        "scenarioID": 2,
                        "name": "Acidification: ILCD2011 ReCiPe2008  || sulfur dioxide [Emissions to air, unspecified]",
                        "flowID": 1121,
                        "lciaMethodID": 17,
                        "value": 1.16E-08
                    }
                }
            }
        },
        processes: {
            43: {
                flows: {
                    154: {
                        "paramID": 12,
                        "paramTypeID": 8,
                        "scenarioID": 2,
                        "name": "Truck Class 6 MHD Diesel || methane [Emissions to air, unspecified]",
                        "flowID": 154,
                        "processID": 43,
                        "value": 0.0006285
                    }
                }
            }
        }
    }}}
 */
angular.module('lcaApp.models.param', ['lcaApp.resources.service'] )
    .factory('ParamModelService', ['ParamService', '$q',
        function(ParamService, $q) {
            var svc = {},
                model = { scenarios : {} };

            function associateByFlow(parent, param) {
                if ("flowID" in param) {
                    if (! "flows" in parent) {
                        parent.flows = {};
                    }
                    parent.flows[param.flowID] = param;
                }
            }

            function updateModel(scenarioID, params) {
                if ( params && params.length > 0) {
                    var m = {};
                    params.forEach( function (p) {
                        if ("processID" in p ) {
                            if (! "processes" in m) {
                                m.processes = {};
                            }
                            associateByFlow(m.processes[p.processID], p);
                        }
                        else if ("lciaMethods" in p ) {
                            if (! "lciaMethods" in m) {
                                m.lciaMethods = {};
                            }
                            associateByFlow(m.lciaMethods[p.lciaMethodID], p);
                        }
                    });
                    model.scenarios[scenarioID] = m;
                }
                else {
                    model.scenarios[scenarioID] = null;
                }
            }

            svc.load = function(scenarioID) {
                var deferred = $q.defer();
                if ( scenarioID in model.scenarios ) {
                    deferred.resolve(model.scenarios[scenarioID]);
                }
                else {
                    ParamService.load({scenarioID: scenarioID})
                        .then(
                        function (params) {
                            updateModel(scenarioID, params);
                            deferred.resolve(model.scenarios[scenarioID]);
                        },
                        function (err) {
                            deferred.reject(err);
                        }
                    );
                }
                return deferred.promise;
            };

            return svc;

        }
    ]);
