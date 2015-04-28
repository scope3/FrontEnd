/*
 * d3-plugin, sankey, wrapped in an angular service
 */
angular.module('d3.sankey.service', [])
    .factory('SankeyService', [function(){
        return d3.sankey();
    }]);
