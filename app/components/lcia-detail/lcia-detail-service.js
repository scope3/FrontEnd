/**
 * Angular service for handling LCIA details.
 * Provides data model for Process LCIA bar chart.
 */
angular.module('lcaApp.lciaDetail.service', [])
    .factory('LciaDetailService', [ function () {
        /*global d3 */
        function Instance() {
            var model = {},
            // Input
                activityLevel = 1,     // Derived from fragment navigation
                colors = [],        // Array of colors
                methodParams = [],
                processParams = [],
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

            model.methodParams = function (_) {
                if (!arguments.length) {
                    return methodParams;
                }
                methodParams = _;
                return model;
            };

            model.processParams = function (_) {
                if (!arguments.length) {
                    return processParams;
                }
                processParams = _;
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
                return flowID in processParams || flowID in methodParams ;
            }

            model.prepareBarChartData = function () {
                var positiveResults = [],
                    positiveSum = 0;
                if (resultDetails.length > 0) {
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
            };

            return model;
        }

        return {
            createInstance: function () {
                return new Instance();
            }
        }
    }]);
