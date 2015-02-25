/**
 * Module for formatting numbers
 * Uses d3.format for now.
 * In the future, will provide engineering notation.
 * Factory is used by directives, while filter is used in html
 */
'use strict';

angular.module('lcaApp.format', ['d3'])
    .factory('FormatService', [ 'd3Service', function(d3Service){
        var svc = {};
        svc.format = function (spec) {
            var formatSpec = spec || ".4g";
            return d3Service.format(formatSpec);
        };
        return svc;
    }])
    .filter('numFormat', [ 'FormatService', function(FormatService){
        return function (input, spec) {
            var formatter = FormatService.format(spec);
            if (input && input.length > 0) {
                return formatter(input);
            }
            else {
                return input;
            }
        };
    }]);