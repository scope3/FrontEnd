/**
 * Extension to flowPropertyMagnitude resources
 */
angular.module('lcaApp.resources.flowPropertyMagnitude', [])
    .factory('FlowPropertyMagnitudeExtension', [
        function() {

            function Instance(obj) {
                return ( obj && obj["flowProperty"] ) ? { flowPropertyID: obj["flowProperty"].flowPropertyID } : null;
            }

            return {
                createInstance: function (obj) {
                    return new Instance(obj);
                }
            }
        }]);