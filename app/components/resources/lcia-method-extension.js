/**
 * Extension to LCIA method resources
 */
angular.module('lcaApp.resources.lciaMethod', ['lcaApp.colorCode.service', 'LocalStorageModule'])
    .factory('LciaMethodExtension', [ 'ColorCodeService', 'localStorageService',
        function(ColorCodeService, localStorageService) {

            function getStorageKey( id, propertyName) {
                return "lciaMethod_" + id + "_" + propertyName;
            }

            function Instance() {
                var shortName = null,
                    extension = { };

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

                /**
                 * Get isActive value from local storage, if it was stored there.
                 * Otherwise, default to true and store.
                 * @returns {boolean|*} isActive value
                 */
                extension.getIsActive = function () {
                    if ( ! ("isActive" in this)) {
                        var storageKey = getStorageKey(this.lciaMethodID, "isActive"),
                            storageVal = localStorageService.get(storageKey);
                        if (storageVal == null) {
                            this.isActive = true;
                            localStorageService.set(storageKey, this.isActive);
                        } else {
                            // Convert from string to boolean
                            this.isActive = storageVal === "true";
                        }
                    }
                    return this.isActive;
                };

                /**
                 * Store current isActive value.
                 * Used to record change.
                 */
                extension.storeIsActive = function () {
                    if ("isActive" in this) {
                        var storageKey = getStorageKey(this.lciaMethodID, "isActive");
                        localStorageService.set(storageKey, this.isActive);
                    }
                };

                return extension;
            }

            return {
                createInstance: function () {
                    return new Instance();
                }
            }
        }]);