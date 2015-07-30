/**
 * @ngdoc service
 * @module lcaApp.resources.process
 * @name ProcessExtension
 * @memberOf lcaApp.resources.process
 * @description
 * Factory service - used to extend process resource.
 */
angular.module('lcaApp.resources.process', [])
    .factory('ProcessExtension', [
        function() {

            function Instance() {
                var longName = null,
                    extension = { };

                extension.getLongName = function () {
                    if (!longName) {
                        longName = this.name;
                        if (this.geography) {
                            longName = longName + " [" + this.geography + "]";
                        }
                    }
                    return longName;
                };

                return extension;
            }

            return {
                /**
                 * @ngdoc
                 * @name ProcessExtension#createInstance
                 * @methodOf ProcessExtension
                 * @description
                 * Create an object with a getLongName method
                 * @returns {object} the object
                 */
                createInstance: function () {
                    return new Instance();
                }
            }
        }]);