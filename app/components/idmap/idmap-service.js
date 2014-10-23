/**
 * Service that maps object ID to object
 */
angular.module('lcaApp.idmap.service', [])
    .factory('IdMapService', function () {
        var idMap = {};

        return {
            add: function (idName, objectArray) {
                if (!(idName in idMap)) {
                    idMap[idName] = {};
                }
                objectArray.forEach(function (d) {
                    if (idName in d) {
                        var idVal = d[idName];
                        idMap[idName][idVal] = d;
                    }
                });
                return idMap[idName];
            },
            get: function (idName, idValue) {
                if (idName in idMap && idValue in idMap[idName]) {
                    return idMap[idName][idValue];
                }
                else {
                    return null;
                }
            }
        };
    });