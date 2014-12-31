/**
 * Angular service for handling LCIA details.
 * Provides data model for Process LCIA bar chart.
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

            model.activityLevel = function (_) {
                if (!arguments.length) {
                    return activityLevel;
                }
                activityLevel = _;
                return model;
            };

            model.colors = function (_) {
                if (!arguments.length) {
                    return colors;
                }
                colors = _;
                return model;
            };

            model.scenarioID = function (_) {
                if (!arguments.length) {
                    return scenarioID;
                }
                scenarioID = _;
                return model;
            };

            model.processID = function (_) {
                if (!arguments.length) {
                    return processID;
                }
                processID = _;
                return model;
            };

            model.lciaMethodID = function (_) {
                if (!arguments.length) {
                    return lciaMethodID;
                }
                lciaMethodID = _;
                return model;
            };

            model.resultDetails = function (_) {
                if (!arguments.length) {
                    return resultDetails;
                }
                resultDetails = _;
                return model;
            };

            function flowHasParam(flowID) {
                return (model.processFlowParams && flowID in model.processFlowParams) ||
                       (model.methodFlowParams && flowID in model.methodFlowParams) ;
            }

            function getFlowParams() {
                model.processFlowParams = ParamModelService.getProcessFlowParams(scenarioID, processID);
                model.methodFlowParams = ParamModelService.getLciaMethodFlowParams(scenarioID, lciaMethodID);
            }

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
            createInstance: function () {
                return new Instance();
            }
        }
    }]);
