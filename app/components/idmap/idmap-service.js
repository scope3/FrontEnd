/**
 * Service that maintains associative arrays mapping object ID to object
 */
angular.module('lcaApp.idmap.service', [])
    .factory('IdMapService', function () {
        var idMap = {};

        return {
            /**
             * Add objects to an associative array.
             * @param {string} routeKey     Key to the associative array
             * @param (string} idName       Object ID property name
             * @param {[{}]} objectArray    Array of objects to be added
             * @returns {{}}                Associative array, indexed by object ID
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
             * Create an empty associative array
             * @param {string} routeKey     Key to the associative array
             * @returns {{}}                Empty associative array
             */
            clear: function (routeKey) {
                idMap[routeKey] = {};
                return idMap[routeKey];
            },
            /**
             * Get the object with a given object ID
             * @param {string} routeKey     Key to the associative array
             * @param {number} idValue      Object ID value
             * @returns {{}}                The object, if found. Otherwise, null.
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