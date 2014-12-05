/**
 * Extension to LCIA method resources
 */
angular.module('lcaApp.resources.lciaMethod', ['lcaApp.colorCode.service'])
    .factory('LciaMethodExtension', [ 'ColorCodeService',
        function(ColorCodeService) {

            function Instance() {
                var shortName = null,
                    isActive = true,
                    extension = {};

                extension.getDefaultColor = function () {
                    var scales = ColorCodeService.getImpactCategoryColors(this["impactCategoryID"]);
                    if (scales && 3 in scales && 0 in scales[3]) {
                        return scales[3][0];
                    }
                    else {
                        return "#ffffff"
                    }
                };

                extension.getColorScales = function () {
                    return ColorCodeService.getImpactCategoryColors(this["impactCategoryID"]);
                };

                extension.getShortName = function () {
                    if (!shortName) {
                        var parts = this.name.split("; ");
                        if (parts.length > 1) {
                            shortName = parts[1];
                        } else {
                            shortName = this.name;
                        }
                    }
                    return shortName;
                };

                extension.isActive = function (_) {
                    if (!arguments.length) {
                        return isActive;
                    }
                    isActive = _;
                    return extension;
                };

                return extension;
            }

            return {
                createInstance: function () {
                    return new Instance();
                }
            }
        }]);