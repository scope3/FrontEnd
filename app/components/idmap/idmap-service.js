/**
 * @ngdoc service
 * @module lcaApp.idmap.service
 * @name IdMapService
 * @description
 * Factory service that maintains associative arrays mapping object ID to object.
 */
angular.module('lcaApp.idmap.service', [])
    .factory('IdMapService', function () {
        var idMap = {};

        return {
            /**
             * @ngdoc
             * @name IdMapService#add
             * @methodOf IdMapService
             * @description
             * Add objects to an associative array.
             * @param {string} routeKey Key to the associative array
             * @param {string} idName Property name for object ID
             * @param {[]} objectArray Array of objects to be added
             * @returns {object} Associative array, indexed by object ID
             */
            add: function (routeKey, idName, objectArray) {
                if (!idMap.hasOwnProperty(routeKey)) {
                    idMap[routeKey] = {};
                }
                objectArray.forEach(function (d) {
                    if (d.hasOwnProperty(idName)) {
                        var idVal = d[idName];
                        idMap[routeKey][idVal] = d;
                    }
                });
                return idMap[routeKey];
            },
            /**
             * @ngdoc
             * @name IdMapService#clear
             * @methodOf IdMapService
             * @description
             * Creates an empty associative array
             * @param {string} routeKey     Key to the associative array
             * @returns {object}            Empty associative array
             */
            clear: function (routeKey) {
                idMap[routeKey] = {};
                return idMap[routeKey];
            },
            /**
             * @ngdoc
             * @name IdMapService#get
             * @methodOf IdMapService
             * @description
             * Get the object with a given object ID
             * @param {string} routeKey     Key to the associative array
             * @param {number} idValue      Object ID value
             * @returns {?object}                The object, if found. Otherwise, null.
             */
            get: function (routeKey, idValue) {
                if (idMap.hasOwnProperty(routeKey) && idMap[routeKey].hasOwnProperty(idValue)) {
                    return idMap[routeKey][idValue];
                }
                else {
                    return null;
                }
            }
        };
    });