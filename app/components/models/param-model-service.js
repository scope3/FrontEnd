/**
 * Service providing data model for LCA parameters.
 * This model facilitates parameter lookup with a nested associative array.
 * Parameters are first indexed by scenarioID. Subsequent nesting depends on parameter type.
 * Currently, only parameter types affecting LCIA results and fragment flows are handled
 * (Characterization Factor, Emission Factor, Dissipation Factor, Dependency ).
 * Other parameter types are ignored until front end usage has been determined.
 * Characterization Factor parameters are indexed by scenarioID, lciaMethodID, flowID.
 * Dissipation and Emission Factor parameters are indexed by scenarioID, processID, flowID, paramTypeID.
 * Dependency parameters are indexed by fragmentFlowID.
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
    .factory('ParamModelService', ['ParamService', 'PARAM_VALUE_STATUS', '$q',
        function(ParamService, PARAM_VALUE_STATUS, $q) {
            var svc = {},
                model = { scenarios : {} },
                origResources = { scenarios : {} };

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
                        else if (p.hasOwnProperty("fragmentFlowID")) {
                            nest(m, "fragmentFlows");
                            m.fragmentFlows[p.fragmentFlowID] = p;
                        }
                    });
                    model.scenarios[scenarioID] = m;
                }
                else {
                    model.scenarios[scenarioID] = null;
                }
                origResources.scenarios[scenarioID] = params;
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

            /**
             * Look up params by scenario and process
             * @param scenarioID
             * @param processID
             * @returns {*} If found, associative array of params, keyed by flowID. Otherwise null.
             */
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

            /**
             * Look up params by scenario and LCIA method
             * @param scenarioID
             * @param lciaMethodID
             * @returns {*} If found, associative array of params, keyed by flowID. Otherwise null.
             */
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

            /**
             * Look up param by scenario, LCIA method, and flow
             * @param scenarioID
             * @param lciaMethodID
             * @param flowID
             * @returns {*}
             */
            svc.getLciaMethodFlowParam = function(scenarioID, lciaMethodID, flowID) {
                var params = svc.getLciaMethodFlowParams(scenarioID, lciaMethodID);
                return ( params && params.hasOwnProperty(flowID)) ? params[flowID] : null;
            };

            /**
             * Look up param by scenario, process, flow, and type
             * @param scenarioID
             * @param processID
             * @param flowID
             * @param paramTypeID
             * @returns {*}
             */
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

            /**
             * Look up param by scenario and fragment flow
             * @param { Number } scenarioID
             * @param { Number } fragmentFlowID
             * @returns {*}
             */
            svc.getFragmentFlowParam = function(scenarioID, fragmentFlowID) {
                var sModel = svc.getModel(scenarioID),
                    param = null;
                if ( sModel &&
                     sModel.hasOwnProperty("fragmentFlows") ) {
                    var params = sModel.fragmentFlows;
                    if (params.hasOwnProperty(fragmentFlowID)) {
                        param = params[fragmentFlowID];
                    }
                }
                return param;
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
             * @param {Number} baseValue Value of the thing to which the param applies
             * @param {{value: number}} paramResource
             * @param {String} value Edit value, should be numeric
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

            /**
             * Compare input value with the value of original param resource, if it exists.
             *
             *  Set change status
             *  PARAM_VALUE_STATUS.changed for new, updated, and deleted value.
             *  PARAM_VALUE_STATUS.invalid for invalid value.
             *  PARAM_VALUE_STATUS.unchanged when new value matches original
             *
             *  If input value is invalid, then return error message.
             *
             * @param {number} baseValue Value of the thing to which the param applies
             * @param {{paramResource: {}, value: String, editStatus: Number }} paramWrapper
             * @returns {string}    Error message, if status is invalid
             */
            svc.setParamWrapperStatus = function(baseValue, paramWrapper) {
                var msg = null;
                if (paramWrapper.value) {
                    // Value was input
                    if (isNaN(paramWrapper.value) ) {
                        msg = "Parameter value, " + paramWrapper.value + ", is not numeric.";
                        paramWrapper.editStatus = PARAM_VALUE_STATUS.invalid;
                    } else if (+paramWrapper.value === baseValue) {
                        msg = "Parameter value, " + paramWrapper.value + ", is the same as default value.";
                        paramWrapper.editStatus = PARAM_VALUE_STATUS.invalid;
                    } else if (paramWrapper.paramResource) {
                        // Check if param value changed
                        if (paramWrapper.paramResource.value === +paramWrapper.value) {
                            paramWrapper.editStatus = PARAM_VALUE_STATUS.unchanged;
                        } else {
                            paramWrapper.editStatus = PARAM_VALUE_STATUS.changed;
                        }
                    } else {
                        // No paramResource. Interpret this as create
                        paramWrapper.editStatus = PARAM_VALUE_STATUS.changed;
                    }
                }
                else {
                    // No input value. If paramResource exists, interpret this as delete.
                    if (paramWrapper.paramResource) {
                        paramWrapper.editStatus = PARAM_VALUE_STATUS.changed;
                    } else {
                        paramWrapper.editStatus = PARAM_VALUE_STATUS.unchanged;
                    }
                }
                return msg;
            };

            /**
             * Create an object with embedded param resource to be used in editor
             * @param {{}} paramResource   May be null, when target has no param
             * @returns {{paramResource: *, value: *, editStatus: number}} the object created
             */
            svc.wrapParam = function (paramResource) {
                return {
                    paramResource : paramResource,
                    value : paramResource ? paramResource.value : "",
                    editStatus : PARAM_VALUE_STATUS.unchanged
                };
            };

            /**
             * Inspect data array for wrapped param changes
             * @param {[]} data
             * @returns {*|boolean} true iff there is at least one valid change and no
             * invalid change
             */
            svc.hasValidChanges = function (data) {
                return (
                    data.some(function (d) {
                        return d.paramWrapper.editStatus === PARAM_VALUE_STATUS.changed;
                    }) &&
                    !data.some(function (d) {
                        return d.paramWrapper.editStatus === PARAM_VALUE_STATUS.invalid;
                    })
                );
            };

            /**
             * Send PUT request containing current changes.
             * @param {Number} scenarioID
             * @param {[]} changes   Array of changed param resources
             * @param {Function} successCB  Function to call on success response
             * @param {Function} errorCB    Function to call on error response
             */
            svc.updateResources = function (scenarioID, changes, successCB, errorCB) {
                var params = origResources.scenarios[scenarioID].slice(0);
                changes.forEach(function (changedParam) {
                    if (changedParam.hasOwnProperty("paramID")) {
                        var origParam = params.find(function (p) {
                            return p.paramID === changedParam.paramID;
                        });
                        if (changedParam.value === null) {
                            params.splice(params.indexOf(origParam), 1);
                        } else {
                            origParam.value = changedParam.value;
                        }
                    }
                    else {
                        params.push(changedParam);
                    }
                });
                ParamService.replace({scenarioID: scenarioID}, params, successCB, errorCB);
            };

            return svc;
        }
    ]);
