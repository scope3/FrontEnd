'use strict';
/**
 * @ngdoc service
 * @module lcaApp.name
 * @name NameService
 * @memberOf lcaApp.name
 * @description
 * Factory service for transforming entity names.
 */
angular.module('lcaApp.name', ['d3'])
    .factory('NameService', [ 'd3Service', function(d3Service){
        var svc = {},
            shortNameBreakChars = d3Service.set();

        /**
         * @ngdoc
         * @name NameService#shorten
         * @methodOf NameService
         * @description
         * Shorten a name so that it does not exceed maximum length.
         * Cut-off position decided in the following order of preference
         *  1. last position of punctuation char ( ",", "(", ".", or ";" )
         *  2. last position of space char
         *  3. max length
         *
         * @param {string} name	    The name to be shortened
         * @param {number} maxLen   Maximum length
         * @return {string} shortened name
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