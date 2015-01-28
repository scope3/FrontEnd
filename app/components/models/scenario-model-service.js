angular.module('lcaApp.models.scenario', ['lcaApp.resources.service', 'LocalStorageModule'] )
    .factory('ScenarioModelService', ['ScenarioService', 'localStorageService',
        function(ScenarioService, localStorageService) {
            var svc = ScenarioService,
                storageKey = "activeScenarioID";

            svc.getActiveID = function () {
                var id = localStorageService.get(storageKey);
                return id ? +id : null; // convert from string to number
            };

            svc.setActiveID = function ( scenarioID) {
                return localStorageService.set(storageKey, scenarioID);
            };

            svc.removeActiveID = function ( ) {
                return localStorageService.remove(storageKey);
            };

            return svc;
        }
    ]);