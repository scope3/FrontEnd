'use strict';

angular.module('lcaApp.fragment.sankey', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/fragment-sankey/:scenarioID/:fragmentID', {
    templateUrl: 'fragment-sankey/fragment-sankey.html',
    controller: 'FragmentSankeyCtrl'
  });
}])

.controller('FragmentSankeyCtrl', ['$scope', '$routeParams', 'ResourceService',

    function($scope, $routeParams, ResourceService) {
        var fragmentID = $routeParams.fragmentID,
            scenarioID = $routeParams.scenarioID,
            fragmentResource = ResourceService.getResource("fragment"),
            processResource = ResourceService.getResource("process"),
            ffpResource = ResourceService.getResource("fragmentFlowProperty"),
            ffResource = ResourceService.getResource("fragmentFlow"),
            processes = processResource.query(),
            flowProperties = ffpResource.query({fragmentID: fragmentID}),
            fragmentFlows = ffResource({scenarioID: scenarioID, fragmentID: fragmentID});

}]);