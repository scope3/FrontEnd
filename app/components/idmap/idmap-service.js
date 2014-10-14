/**
 * Service that maps object ID to object
 */
angular.module('lcaApp.idmap.service', [])
    .factory('IdMapService', function () {
        var idMapService = {idMap: {}};

        idMapService.add = function (idName, objectArray) {
            if (!(idName in idMapService.idMap)) {
                idMapService.idMap[idName] = {};
            }
            objectArray.forEach(function (d) {
                if ( idName in d) {
                    var idVal = d[idName];
                    idMapService.idMap[idName][idVal] = d;
                }
            });
            return idMapService.idMap[idName];
        };

        idMapService.get = function (idName, idValue) {
            if (idName in idMapService.idMap && idValue in idMapService.idMap[idName]) {
                return idMapService.idMap[idName][idValue];
            }
            else {
                return null;
            }
        };

        return idMapService;
    });