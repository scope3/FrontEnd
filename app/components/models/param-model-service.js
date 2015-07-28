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
//noinspection JSValidateJSDoc
/**
 * @ngdoc service
 * @module lcaApp.models.param
 * @name ParamModelService
 * @memberOf lcaApp.models.param
 * @description
 * Factory service providing data model for scenario parameters.
 */
angular.module('lcaApp.models.param', ['lcaApp.resources.service', 'lcaApp.status.service', 'lcaApp.models.scenario'] )
    // Status relevant to editor views.
    .constant('PARAM_VALUE_STATUS',
                { unchanged: 1, // value did not change
                    changed: 2, // value changed and is valid
                    invalid: 3 }) // value changed and is not valid
    .constant('PARAM_TYPE_NAME',
    {
        1 : "Dependency",
        2 : "Conservation",
        3 : "Distribution",
        4 : "Flow Property",
        5 : "Composition",
        6 : "Process Dissipation",
        8 : "Process Emission",
        10 : "LCIA Factor"
    })
    .factory('ParamModelService', ['ParamService', 'PARAM_VALUE_STATUS', '$q', 'ScenarioModelService',
        function(ParamService, PARAM_VALUE_STATUS, $q, ScenarioModelService) {
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

            function valueInput(paramWrapper) {
                return paramWrapper.enableEdit && paramWrapper.value !== "";
            }

            /**
             * @ngdoc
             * @name ParamModelService#changeFragmentFlowParam
             * @methodOf ParamModelService
             * @description
             * Apply change in paramWrapper to param resource.
             * @param {object} f Record containing change
             * @param {number} f.flowID ID of related flow
             * @param {object} f.paramWrapper Param resource wrapper
             * @param {number} scenarioID ID of parameter scenario
             * @returns {object} New or updated param resource
             */
            svc.changeFragmentFlowParam = function(f, scenarioID) {
                var paramResource = svc.changeExistingParam(f.paramWrapper);
                if (!paramResource)
                {
                    paramResource = {
                        scenarioID : scenarioID,
                        fragmentFlowID : f.fragmentFlowID,
                        value: +f.paramWrapper.value,
                        paramTypeID: 1
                    };
                }
                return paramResource;
            };

            function hasChangedParam(o) {
                return o.paramWrapper.editStatus === PARAM_VALUE_STATUS.changed;
            }

            /**
             * @ngdoc
             * @name ParamModelService#changeExistingParam
             * @methodOf ParamModelService
             * @description
             * If paramWrapper.paramResource exists, update it with change in paramWrapper.value.
             * @param {object} paramWrapper Param resource wrapper
             * @param {number} paramWrapper.editStatus Member of PARAM_VALUE_STATUS
             * @param {?object} paramWrapper.paramResource ParamService resource
             * @param {number} paramWrapper.value Edited param value
             * @returns {?object} paramWrapper.paramResource
             */
            svc.changeExistingParam = function (paramWrapper) {
                var paramResource = paramWrapper.paramResource;
                if (paramResource) {
                    if (valueInput(paramWrapper)) {
                        paramResource.value = +paramWrapper.value;
                    } else {
                        paramResource.value = null;
                    }
                }
                return paramResource;
            };

            /**
             * @ngdoc
             * @name ParamModelService#createModel
             * @methodOf ParamModelService
             * @description
             * Create model for scenario parameters. If scenario parameters were already modeled, that part of private
             * model will be recreated.
             * @param {number} scenarioID Model scenarioID
             * @param {[]} params Loaded param resources
             * @returns {object} Scenario's parameter model.
             */
            svc.createModel = function (scenarioID, params) {
                updateModel(scenarioID, params);
                return model.scenarios[scenarioID];
            };

            /**
             * @ngdoc
             * @name ParamModelService#getModel
             * @methodOf ParamModelService
             * @description
             * Getter function for scenario parameter model.
             * @param {number} scenarioID Model scenarioID
             * @returns {object} Scenario's parameter model.
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
             * @ngdoc
             * @name ParamModelService#load
             * @methodOf ParamModelService
             * @description
             * Load param resources
             * @param {number} scenarioID   ScenarioID filter
             * @returns {Deferred} promise. Resolves to model for scenario containing loaded resources.
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
             * @ngdoc
             * @name ParamModelService#getProcessFlowParams
             * @methodOf ParamModelService
             * @description
             * Look up params by scenario and process
             * @param {number} scenarioID Scenario key
             * @param {number} processID Process key
             * @returns {?object} If found, associative array of params, keyed by flowID. Otherwise null.
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
             * @ngdoc
             * @name ParamModelService#getLciaMethodFlowParams
             * @methodOf ParamModelService
             * @description
             * Look up params by scenario and LCIA method
             * @param {number} scenarioID Scenario key
             * @param {number} lciaMethodID LCIA method key
             * @returns {?object} If found, associative array of params, keyed by flowID. Otherwise null.
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
             * @ngdoc
             * @name ParamModelService#getLciaMethodFlowParam
             * @methodOf ParamModelService
             * @description
             * Look up param by scenario, LCIA method, and flow
             * @param {number} scenarioID Scenario key
             * @param {number} lciaMethodID LCIA method key
             * @param {number} flowID Flow key
             * @returns {?object} Param resource if found, otherwise, null.
             */
            svc.getLciaMethodFlowParam = function(scenarioID, lciaMethodID, flowID) {
                var params = svc.getLciaMethodFlowParams(scenarioID, lciaMethodID);
                return ( params && params.hasOwnProperty(flowID)) ? params[flowID] : null;
            };

            /**
             * @ngdoc
             * @name ParamModelService#getProcessFlowParam
             * @methodOf ParamModelService
             * @description
             * Look up param by scenario, process, flow, and type
             * @param {number} scenarioID Scenario key
             * @param {number} processID Process key
             * @param {number} flowID Flow key
             * @param {number} paramTypeID Param type key
             * @returns {?object} Param resource if found, otherwise, null.
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
             * @ngdoc
             * @name ParamModelService#getFragmentFlowParam
             * @methodOf ParamModelService
             * @description
             * Look up param by scenario and fragment flow
             * @param {number} scenarioID Scenario key
             * @param { number } fragmentFlowID Fragment flow key
             * @returns {?object} Param resource if found, otherwise, null.
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
             * @ngdoc
             * @name ParamModelService#setParamWrapperStatus
             * @methodOf ParamModelService
             * @description
             * Compare input value with the value of original param resource, if it exists.
             *
             *  Update paramWrapper.editStatus to PARAM_VALUE_STATUS property,
             *
             *  ```changed``` for new, updated, and deleted value
             *
             *  ```invalid``` for invalid value
             *
             *  ```unchanged``` when new value matches original
             *
             *  If input value is invalid, then return error message.
             *
             * @param {number} baseValue Value of the thing to which the param applies
             * @param {object} paramWrapper Param resource wrapper
             * @param {number} paramWrapper.editStatus Status property to be updated.
             * @param {?object} paramWrapper.paramResource ParamService resource
             * @param {string} paramWrapper.value Edited param value
             * @returns {string}    Error message, if status is invalid.
             */
            svc.setParamWrapperStatus = function(baseValue, paramWrapper) {
                var msg = null;
                if (valueInput(paramWrapper)) {
                    // Value was input
                    if (isNaN(paramWrapper.value)) {
                        msg = "Parameter value, " + paramWrapper.value + ", is not numeric.";
                        paramWrapper.editStatus = PARAM_VALUE_STATUS.invalid;
                    }
                    else if (paramWrapper.paramResource) {
                        // Check if param value changed
                        if (paramWrapper.paramResource.value === +paramWrapper.value) {
                            paramWrapper.editStatus = PARAM_VALUE_STATUS.unchanged;
                        } else {
                            paramWrapper.editStatus = PARAM_VALUE_STATUS.changed;
                        }
                    } else {
                        // No paramResource. Interpret this as create
                        // unless value is default
                        if (+paramWrapper.value === baseValue) {
                            // Remove default value
                            paramWrapper.value = "";
                            paramWrapper.editStatus = PARAM_VALUE_STATUS.unchanged;
                        } else {
                            paramWrapper.editStatus = PARAM_VALUE_STATUS.changed;
                        }
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

            svc.initParamWrapperValue = function(baseValue, paramWrapper) {
                if (!valueInput(paramWrapper)) {
                    paramWrapper.value = baseValue.toString();
                }
            };

            /**
             * @ngdoc
             * @name ParamModelService#wrapParam
             * @methodOf ParamModelService
             * @description
             * Create an object with embedded param resource to be used in editor.
             * @param {?object} paramResource   May be null, when target has no param
             * @param {number} paramResource.value  Existing param value
             * @returns {object} the object created
             */
            svc.wrapParam = function (paramResource) {
                return {
                    paramResource : paramResource,
                    value : paramResource ? paramResource.value : "",
                    enableEdit : true,
                    editStatus : PARAM_VALUE_STATUS.unchanged
                };
            };

            /**
             * @ngdoc
             * @name ParamModelService#naParam
             * @methodOf ParamModelService
             * @description
             * Create an object to block param editing where param cannot be applied.
             * @param {string} [value="N/A"]    Optional value string.
             * @returns {object} the object created
             */
            svc.naParam = function ( value ) {
                var naVal =  (arguments.length) ? value : "N/A";
                return {
                    paramResource : null,
                    value : naVal,
                    enableEdit : false,
                    editStatus : PARAM_VALUE_STATUS.unchanged
                };
            };

            /**
             * @ngdoc
             * @name ParamModelService#canRevertChanges
             * @methodOf ParamModelService
             * @description
             * Check data for revertible changes.
             * @param {[]} data Array of objects having wrappedParam property
             * @returns {boolean} true iff there is at least one change, valid or otherwise
             */
            svc.canRevertChanges = function (data) {
                return data.some(function (d) {
                        return d.paramWrapper.editStatus !== PARAM_VALUE_STATUS.unchanged;
                    }) ;
            };

            /**
             * @ngdoc
             * @name ParamModelService#canAbandonChanges
             * @methodOf ParamModelService
             * @description
             * Check data for changes that can be abandoned.
             * @param {[]} data  Array of objects having wrappedParam property
             * @returns {boolean} false iff there is at least one valid change
             */
            svc.canAbandonChanges = function (data) {
                return !data.some(function (d) {
                    return d.paramWrapper.editStatus === PARAM_VALUE_STATUS.changed;
                }) ;
            };

            /**
             * @ngdoc
             * @name ParamModelService#canApplyChanges
             * @methodOf ParamModelService
             * @description
             * Check data for changes that can be applied.
             * @param {[]} data Array of objects having wrappedParam property
             * @returns {boolean} true iff there is at least one valid change and no
             * invalid change
             */
            svc.canApplyChanges = function (data) {
                return (
                    data.some(function (d) {
                        return d.paramWrapper.editStatus === PARAM_VALUE_STATUS.changed;
                    }) &&
                    !data.some(function (d) {
                        return d.paramWrapper.editStatus === PARAM_VALUE_STATUS.invalid;
                    })
                );
            };
            // Share implementation of change button functions
            /**
             * Function to determine if Apply Changes button should be enabled.
             * @returns {boolean}
             */
            svc.canApply = function (scenario, data) {
                return (scenario &&
                ScenarioModelService.canUpdate(scenario) &&
                svc.canApplyChanges( data));
            };
            /**
             * Function to determine if Revert Changes button should be enabled.
             * @returns {boolean}
             */
            svc.canRevert = function (scenario, data) {
                return (scenario &&
                ScenarioModelService.canUpdate(scenario) &&
                svc.canRevertChanges( data));
            };

            /**
             * @ngdoc
             * @name ParamModelService#getResources
             * @methodOf ParamModelService
             * @description
             * Get param resources, but do not remodel.
             * @param {number} scenarioID   ScenarioID filter
             * @returns {Deferred} promise. Resolves to loaded resources.
             */
            svc.getResources = function( scenarioID) {
                var deferred = $q.defer();
                ParamService.load({scenarioID: scenarioID})
                    .then(function(params) {
                        origResources.scenarios[scenarioID] = params;
                        deferred.resolve(params);
                    },
                    function(err) {
                        deferred.reject("Param Model load failed. " + err);
                    });
                return deferred.promise;
            };

            /**
             * @ngdoc
             * @name ParamModelService#updateResources
             * @methodOf ParamModelService
             * @description
             * Send PUT request containing current changes.
             * @param {number} scenarioID   Request scenarioID
             * @param {[]} changes   Array of changed param resources
             * @param {function} successCB  Function to call on success response
             * @param {function} errorCB    Function to call on error response
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
                            if (changedParam.hasOwnProperty("name")){
                                origParam.name = changedParam.name;
                            }
                        }
                    }
                    else {
                        params.push(changedParam);
                    }
                });
                return ParamService.replace({scenarioID: scenarioID}, params, successCB, errorCB);
            };

            svc.getChangedData = function (data){
                return data.filter(hasChangedParam);
            };

            /**
             * @ngdoc
             * @name ParamModelService#applyFragmentFlowParamChanges
             * @methodOf ParamModelService
             * @description
             * Gather Fragment Flow Parameter changes and send to Web API
             * @param {number} scenarioID   Parameters' scenarioID
             * @param {[]} data   Array of objects containing edited param data
             * @param {function} successCB  Function to call on success response
             * @param {function} errorCB    Function to call on error response
             */
            svc.applyFragmentFlowParamChanges = function (scenarioID, data, successCB, errorCB) {
                var changedParams = data.filter(hasChangedParam);

                svc.updateResources(scenarioID, changedParams.map(svc.changeFragmentFlowParam),
                    successCB, errorCB);
            };

            /**
             * @ngdoc
             * @name ParamModelService#revertChanges
             * @methodOf ParamModelService
             * @description
             * Revert changes in wrapped parameters.
             * @param {[]} data  Array of objects with embedded paramWrapper
             */
            svc.revertChanges = function (data) {
                data.forEach(function (e) {
                    if (e.paramWrapper.enableEdit) {
                        e.paramWrapper = svc.wrapParam(e.paramWrapper.paramResource);
                    }
                });
            };

            return svc;
        }
    ]);
