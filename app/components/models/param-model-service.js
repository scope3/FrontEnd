/**
 * Service providing data model for LCA parameters.
 * This model facilitates parameter lookup with a nested associative array.
 * Parameters are first indexed by scenarioID. Subsequent nesting depends on parameter type.
 * Currently, only parameter types affecting LCIA results are handled
 * (Characterization Factor, Emission Factor, Dissipation Factor?).
 * Other parameter types are ignored until front end usage has been determined.
 * Characterization Factor parameters are indexed by scenarioID, lciaMethodID, flowID.
 * Dissipation and Emission Factor parameters are indexed by scenarioID, processID, flowID, paramTypeID.
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
                        paramTypes: {
                            8 : {
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
            }
        }
    }}}
 */
angular.module('lcaApp.models.param', ['lcaApp.resources.service'] )
    .factory('ParamModelService', ['ParamService', '$q',
        function(ParamService, $q) {
            var svc = {},
                model = { scenarios : {} };

            function nest(parent, property) {
                if (! (property in parent)) {
                    parent[property] = {};
                }
                return parent[property];
            }

            function associateByFlow(parent, param) {
                if ("flowID" in param) {
                    nest(parent, "flows");
                    if (param.paramTypeID === 10) {
                        parent.flows[param.flowID] = param;
                    } else {
                        nest( nest(parent.flows, param.flowID), "paramTypes");
                        parent.flows[param.flowID]["paramTypes"][param.paramTypeID] = param;
                    }
                }
            }

            function updateModel(scenarioID, params) {
                if ( params && params.length > 0) {
                    var m = {};
                    params.forEach( function (p) {
                        if ("processID" in p ) {
                            nest( nest(m, "processes"), p.processID);
                            associateByFlow(m.processes[p.processID], p);
                        }
                        else if ("lciaMethodID" in p ) {
                            nest( nest(m, "lciaMethods"), p.lciaMethodID);
                            associateByFlow(m.lciaMethods[p.lciaMethodID], p);
                        }
                    });
                    model.scenarios[scenarioID] = m;
                }
                else {
                    model.scenarios[scenarioID] = null;
                }
            }

            /**
             * Create model for scenario parameters. If scenario parameters were already modeled, that part of private
             * model will be recreated.
             * @param scenarioID
             * @param params    Loaded param resources
             * @returns {{scenarios: {}}}
             */
            svc.createModel = function (scenarioID, params) {
                updateModel(scenarioID, params);
                return model.scenarios[scenarioID];
            };

            /**
             * Getter function for scenario parameter model.
             * @param scenarioID
             * @returns {*}
             */
            svc.getModel = function(scenarioID) {
                if (scenarioID in model.scenarios) {
                    return model.scenarios[scenarioID];
                }
                else {
                    return null;
                }
            };

            /**
             * Load param resources
             * @param {Number} scenarioID   ScenarioID filter
             * @returns {*} promise, model branch for the scenario
             */
            svc.load = function( scenarioID) {
                var deferred = $q.defer();
                ParamService.load({scenarioID: scenarioID})
                    .then(function(response) {
                        deferred.resolve(svc.createModel(scenarioID, response));
                    },
                    function(err) {
                        deferred.reject("Param Model load failed. " + err);
                    });
                return deferred.promise;
            };

            svc.getProcessFlowParams = function(scenarioID, processID) {
                if (scenarioID in model.scenarios && model.scenarios[scenarioID] &&
                    "processes" in model.scenarios[scenarioID] &&
                    processID in model.scenarios[scenarioID].processes &&
                    "flows" in model.scenarios[scenarioID].processes[processID]) {
                    return model.scenarios[scenarioID].processes[processID].flows;
                }
                else {
                    return null;
                }
            };

            svc.getLciaMethodFlowParams = function(scenarioID, lciaMethodID) {
                if (scenarioID in model.scenarios && model.scenarios[scenarioID] &&
                    "lciaMethods" in model.scenarios[scenarioID] &&
                    lciaMethodID in model.scenarios[scenarioID].lciaMethods &&
                    "flows" in model.scenarios[scenarioID].lciaMethods[lciaMethodID]) {
                    return model.scenarios[scenarioID].lciaMethods[lciaMethodID].flows;
                }
                else {
                    return null;
                }
            };

            return svc;
        }
    ]);
