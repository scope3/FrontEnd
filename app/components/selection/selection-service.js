/**
 * Service for recalling selections during web app session.
 */
angular.module('lcaApp.selection.service', [])
    .constant('SELECTION_KEYS', {
        topLevelFragmentID : "TLF",
        fragmentScenarios : "FS"
    })
    .factory('SelectionService', function () {
        var selections = {};

        return {
            contains: function(key) {
                return selections.hasOwnProperty(key);
            },
            set: function (key, value) {
                selections[key] = value;
                return selections[key];
            },
            get: function (key) {
                if (selections.hasOwnProperty(key)) {
                    return selections[key];
                }
                else {
                    return null;
                }
            },
            remove: function(key) {
                if (selections.hasOwnProperty(key) ) {
                    delete selections[key];
                }
            }
        };
    });