/**
 * Directive for link to resource reference.
 */
angular.module('lcaApp.referenceLink.directive', [])
.directive('referenceLink',
    function() {
        return {
            restrict: 'E',
            template: '<a ng-hide={{noRefLink}} ng-href=\"{{refXML}}\" target=\"_blank\" ng-transclude></a>',
            scope : { resource : '=' },
            replace : true,
            transclude : true,
            controller : referenceLinkController
        };

        function referenceLinkController($scope) {

            $scope.refXML = null;

            $scope.noRefLink = function() {
                return $scope.refXML === null;
            };

            function setRefXML() {
                if ($scope.resource && $scope.resource.hasOwnProperty("links")) {
                    var xmlLink = $scope.resource.links.find( function (l) {
                        return l["rel"] === "reference";
                    });
                    $scope.refXML = xmlLink ? xmlLink["href"] : null;
                } else {
                    $scope.refXML = null;
                }

            }

            $scope.$watch('resource',setRefXML);

            setRefXML();

        }
    });