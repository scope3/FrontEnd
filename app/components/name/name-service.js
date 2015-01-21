/**
 * Module for transforming entity names
 */
'use strict';

angular.module('lcaApp.name', ['d3'])
    .factory('NameService', [ 'd3Service', function(d3Service){
        var svc = {},
            shortNameBreakChars = d3Service.set();

        /**
         * Shorten a name so that it does not exceed maximum length.
         * Cut-off position decided in the following order of preference
         *  1. last position of character in shortNameBreakChars
         *  2. last position of space char
         *  3. max length
         *
         * @param {String} name	    The name to be shortened.
         * @param {Number} maxLen   maximum length
         * @return {String} shortened name
         */
        svc.shorten = function (name, maxLen) {
            if (name && name.length > maxLen) {
                var endIndex = - 1;
                for (var i = maxLen - 1; i > 0 && endIndex === -1; --i) {
                    if (shortNameBreakChars.has(name.charAt(i))) { endIndex = i; }
                }
                if (endIndex === -1) { endIndex = name.lastIndexOf(" ", maxLen - 1); }
                if (endIndex === -1) { endIndex = maxLen; }
                return name.slice(0, endIndex);
            } else {
                return name;
            }
        };

        [",", "(", ".", ";"].forEach( function(c) {
            shortNameBreakChars.add(c);
        });

        return svc;
    }]);