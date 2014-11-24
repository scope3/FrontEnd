/**
 * Module for formatting numbers
 * Uses d3.format for now.
 * In the future, will provide engineering notation.
 * Factory is used by directives, while filter is used in html
 */
'use strict';

angular.module('lcaApp.format', [])
    .factory('FormatService', [ function(){
        var svc = {};
        svc.format = function (spec) {
            var formatSpec = spec || ".4g";
            return d3.format(formatSpec);
        };
        return svc;
    }])
    .filter('numFormat', function(){
        return function (input, spec) {
            var formatSpec = spec || ".4g",
                formatter = d3.format(formatSpec);
            return formatter(input);
        };
    });