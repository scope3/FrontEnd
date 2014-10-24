angular.module('d3.tip', [])
    .factory('TipService', [function(){
        return d3.tip().attr('class', 'd3-tip');
    }]);