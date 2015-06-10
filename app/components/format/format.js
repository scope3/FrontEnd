/**
 * Module for formatting numbers
 * Uses d3.format for now.
 * In the future, will provide engineering notation.
 * Factory is used by directives, while filter is used in html
 */
'use strict';

angular.module('lcaApp.format', ['d3'])
/**
 * @ngdoc service
 * @module lcaApp.format
 * @name FormatService
 * @memberOf lcaApp.format
 * @description
 * Factory service for formatting. Uses d3.format.
 */
    .factory('FormatService', [ 'd3Service', function(d3Service){
        var svc = {};
        /**
         * @ngdoc
         * @name FormatService#format
         * @methodOf FormatService
         * @description
         * Get formatting function from d3.format.
         * External Link -  {@link https://github.com/mbostock/d3/wiki/Formatting#d3_format}
         *
         * @param {string} spec Format specification
         * @returns {function} Format function
         */
        svc.format = function (spec) {
            var formatSpec = spec || ".4g";
            return d3Service.format(formatSpec);
        };
        return svc;
    }])
/**
 * @ngdoc filter
 * @module lcaApp.format
 * @name numFormat
 * @memberOf lcaApp.format
 * @function
 * @description
 * Angular filter to format numbers using FormatService.
 */
    .filter('numFormat', [ 'FormatService', function(FormatService){
        return function (input, spec) {
            var formatter = FormatService.format(spec);
            if (input ) {
                return formatter(input);
            }
            else {
                return input;
            }
        };
    }]);