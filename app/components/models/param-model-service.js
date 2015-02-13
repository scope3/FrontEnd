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
angular.module('lcaApp.models.param', ['lcaApp.resources.service', 'lcaApp.status.service'] )
    // Status relevant to editor views.
    .constant('PARAM_VALUE_STATUS',
                { unchanged: 1, // value did not change
                    changed: 2, // value changed and is valid
                    invalid: 3 }) // value changed and is not valid
    .factory('ParamModelService', ['ParamService', 'PARAM_VALUE_STATUS', '$q', 'StatusService', '$log',
        function(ParamService, PARAM_VALUE_STATUS, $q, StatusService, $log) {
            var svc = {},
                model = { scenarios : {} },
                pendingChanges = { };

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

            function insertParam(p) {
                var m = model.scenarios[p.scenarioID];
                if ("processID" in p ) {
                    nest( nest(m, "processes"), p.processID);
                    associateByFlow(m.processes[p.processID], p);
                }
                else if ("lciaMethodID" in p ) {
                    nest( nest(m, "lciaMethods"), p.lciaMethodID);
                    associateByFlow(m.lciaMethods[p.lciaMethodID], p);
                }
            }

            function removeParam(p) {
                if (p.paramTypeID === 10) {
                    var params = svc.getLciaMethodFlowParams(p.scenarioID, p.lciaMethodID);
                    if (params.hasOwnProperty(p.flowID)) {
                        delete params[p.flowID];
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
                var sModel = svc.getModel(scenarioID);
                if ( sModel &&
                    sModel.hasOwnProperty("processes") &&
                    sModel.processes.hasOwnProperty(processID) &&
                    sModel.processes[processID].hasOwnProperty("flows")) {
                    return sModel.processes[processID].flows;
                }
                else {
                    return null;
                }
            };

            svc.getLciaMethodFlowParams = function(scenarioID, lciaMethodID) {
                var sModel = svc.getModel(scenarioID);
                if ( sModel &&
                    sModel.hasOwnProperty("lciaMethods") &&
                    sModel.lciaMethods.hasOwnProperty(lciaMethodID) &&
                    sModel.lciaMethods[lciaMethodID].hasOwnProperty("flows")) {
                        return sModel.lciaMethods[lciaMethodID].flows;
                }
                else {
                    return null;
                }
            };

            svc.getLciaMethodFlowParam = function(scenarioID, lciaMethodID, flowID) {
                var params = svc.getLciaMethodFlowParams(scenarioID, lciaMethodID);
                return ( params && params.hasOwnProperty(flowID)) ? params[flowID] : null;
            };

            svc.getProcessFlowParam = function(scenarioID, processID, flowID, paramTypeID) {
                var params = svc.getProcessFlowParams(scenarioID, processID);
                if (params && params.hasOwnProperty(flowID) &&
                    params[flowID].hasOwnProperty("paramTypes") &&
                    params[flowID].paramTypes.hasOwnProperty(paramTypeID)) {
                    return params[flowID].paramTypes[paramTypeID];
                }
                else {
                    return null;
                }
            };

            function handleCreate(result) {
                insertParam(result);
                $log.info("Parameter created. " + angular.toJson(result, true));
            }

            function handleUpdate(result) {
                $log.info("Parameter updated. " + angular.toJson(result, true));
            }

            function handleDelete(result) {
                if (result.hasOwnProperty("scenarioID") &&
                    result.hasOwnProperty("lciaMethodID") &&
                    result.hasOwnProperty("flowID")) {
                    var param = svc.getLciaMethodFlowParam(result.scenarioID, result.lciaMethodID, result.flowID);
                    if (param) {
                        removeParam(param);
                    }
                }
                $log.info("Parameter deleted. " + angular.toJson(result, true));
            }

            function getPendingChanges(scenarioID) {
                if ( !pendingChanges.hasOwnProperty(scenarioID) ) {
                    pendingChanges.scenarioID = { add: [], remove: [], replace: [] };
                }
                return pendingChanges.scenarioID;
            }

            svc.createParam = function(newParam) {
                if (newParam.hasOwnProperty("lciaMethodID") && newParam.hasOwnProperty("flowID")) {
                    newParam.paramTypeID = 10;
                }
                getPendingChanges(newParam.scenarioID).add.push(newParam);
                ParamService.create(newParam, handleCreate, StatusService.handleFailure, {scenarioID: newParam.scenarioID});
            };

            svc.deleteParam = function(paramID) {
                var param = ParamService.get(paramID);
                if (param) {
                    getPendingChanges(param.scenarioID).remove.push(param);
                    ParamService.delete(param, handleDelete, StatusService.handleFailure, {scenarioID: param.scenarioID});
                }
            };

            svc.updateParam = function(paramID, paramValue) {
                var param = ParamService.get(paramID);
                if (param) {
                    param.value = paramValue;
                    getPendingChanges(param.scenarioID).replace.push(param);
                    ParamService.update(param, handleUpdate, StatusService.handleFailure, {scenarioID: param.scenarioID});
                }
            };

            /**
             * Compare input value with the value of original param resource, if it exists.
             *
             *  Return change status
             *  PARAM_VALUE_STATUS.changed for new, updated, and deleted value.
             *  PARAM_VALUE_STATUS.invalid for invalid value.
             *  PARAM_VALUE_STATUS.unchanged when new value matches original
             *
             *  If input value is invalid, then add error message to returned result.
             *
             * @param {number} baseValue Value of the thing to which the param applies
             * @param {{value: number}} paramResource
             * @param {string} value Edit value, should be numeric
             * @returns {{paramValueStatus:number, msg: string }}
             */
            svc.getParamValueStatus = function(baseValue, paramResource, value) {
                var result = { paramValueStatus: null, msg: null };
                if (value) {
                    // Value was input
                    if (isNaN(value) ) {
                        result.msg = "Parameter value, " + value + ", is not numeric.";
                        result.paramValueStatus = PARAM_VALUE_STATUS.invalid;
                    } else if (+value === baseValue) {
                        result.msg = "Parameter value, " + value + ", is the same as default value.";
                        result.paramValueStatus = PARAM_VALUE_STATUS.invalid;
                    } else if (paramResource) {
                        // Check if param value changed
                        if (paramResource.value === +value) {
                            result.paramValueStatus = PARAM_VALUE_STATUS.unchanged;
                        } else {
                            result.paramValueStatus = PARAM_VALUE_STATUS.changed;
                        }
                    } else {
                        // No paramResource. Interpret this as create
                        result.paramValueStatus = PARAM_VALUE_STATUS.changed;
                    }
                }
                else {
                    // No input value. If paramResource exists, interpret this as delete.
                    if (paramResource) {
                        result.paramValueStatus = PARAM_VALUE_STATUS.changed;
                    } else {
                        result.paramValueStatus = PARAM_VALUE_STATUS.unchanged;
                    }
                }
                return result;
            };

            return svc;
        }
    ]);
