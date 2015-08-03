/**
 * @ngdoc service
 * @module lcaApp.lciaDetail.service
 * @name LciaDetailService
 * @memberOf lcaApp.lciaDetail.service
 * @description
 * Factory service. Creates objects that prepare LCIA bar chart data.
 */
angular.module('lcaApp.lciaDetail.service', ['lcaApp.models.param'])
    .factory('LciaDetailService', [ 'ParamModelService', function (ParamModelService) {
        function Instance() {
            var model = {},
            // Input
                activityLevel = 1,     // Derived from fragment navigation
                colors = [],        // Array of colors
                scenarioID = 0,
                processID = 0,
                lciaMethodID = 0,
                resultDetails = [];

            /** @namespace model */

            /**
             * @function model.activityLevel
             * @description
             * Get/set activityLevel, from fragment navigation
             *
             * @param {number} _ , set argument
             * @returns {object} model
             */
            model.activityLevel = function (_) {
                if (!arguments.length) {
                    return activityLevel;
                }
                activityLevel = _;
                return model;
            };

            /**
             * @function model.colors
             * @description
             * Get/set array of colors to use in bar chart
             *
             * @param {[]} _ , set argument
             * @returns {object} model
             */
            model.colors = function (_) {
                if (!arguments.length) {
                    return colors;
                }
                colors = _;
                return model;
            };

            /**
             * @function model.scenarioID
             * @description
             * Get/set scenarioID of selected scenario
             *
             * @param {number} _ , set argument
             * @returns {object} model
             */
            model.scenarioID = function (_) {
                if (!arguments.length) {
                    return scenarioID;
                }
                scenarioID = _;
                return model;
            };

            /**
             * @function model.processID
             * @description
             * Get/set processID of selected process
             *
             * @param {number} _ , set argument
             * @returns {object} model
             */
            model.processID = function (_) {
                if (!arguments.length) {
                    return processID;
                }
                processID = _;
                return model;
            };

            /**
             * @function model.lciaMethodID
             * @description
             * Get/set lciaMethodID of selected LCIA method
             *
             * @param {number} _ , set argument
             * @returns {object} model
             */
            model.lciaMethodID = function (_) {
                if (!arguments.length) {
                    return lciaMethodID;
                }
                lciaMethodID = _;
                return model;
            };

            /**
             * @function model.resultDetails
             * @description
             * Get/set resultDetails, from web API property, lciaDetail
             *
             * @param {[]} _ , set argument
             * @returns {object} model
             */
            model.resultDetails = function (_) {
                if (!arguments.length) {
                    return resultDetails;
                }
                resultDetails = _;
                return model;
            };

            function flowHasParam(flowID) {
                var fpParams = ParamModelService.getFlowPropertyParams(scenarioID, flowID);

                return (fpParams && fpParams.length) ||
                       (model.processFlowParams && flowID in model.processFlowParams) ||
                       (model.methodFlowParams && flowID in model.methodFlowParams);
            }

            function getFlowParams() {
                model.processFlowParams = ParamModelService.getProcessFlowParams(scenarioID, processID);
                model.methodFlowParams = ParamModelService.getLciaMethodFlowParams(scenarioID, lciaMethodID);
            }

            /**
             * @function model.prepareBarChartData
             * @description
             * Method to prepare bar chart data.
             * Call after model properties have been set
             * @returns {object}    model
             */
            model.prepareBarChartData = function () {
                var positiveResults = [],
                    positiveSum = 0;
                if (resultDetails.length > 0) {
                    getFlowParams();
                    positiveResults = resultDetails
                        .filter(function (el) {
                            return el.result > 0;
                        });
                    positiveResults.forEach( function (p) {
                        p.result = p.result * activityLevel;
                        positiveSum += p.result;
                        p.hasParam = flowHasParam(p.flowID);
                    });
                }
                model.positiveResults = positiveResults;
                model.positiveSum = positiveSum;
                return model;
            };

            return model;
        }

        return {
            /**
             * @ngdoc
             * @name LciaDetailService#createInstance
             * @methodOf LciaDetailService
             * @description
             * Creates data model object
             * @returns {object}    data model object
             */
            createInstance: function () {
                return new Instance();
            }
        }
    }]);
