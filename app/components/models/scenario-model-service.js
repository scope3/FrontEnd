angular.module('lcaApp.models.scenario', ['lcaApp.resources.service', 'LocalStorageModule', 'lcaApp.selection.service'] )
    .factory('ScenarioModelService', ['ScenarioService', 'MODEL_BASE_CASE_SCENARIO_ID', 'localStorageService',
        'SelectionService', 'SELECTION_KEYS',
        function(ScenarioService, MODEL_BASE_CASE_SCENARIO_ID, localStorageService,
                 SelectionService, SELECTION_KEYS) {
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

            svc.getBaseCaseID = function () {
                return MODEL_BASE_CASE_SCENARIO_ID
            };

            svc.getBaseCase = function () {
                return ScenarioService.get(MODEL_BASE_CASE_SCENARIO_ID);
            };

            svc.isBaseCase = function (scenario) {
                return (scenario.scenarioID === MODEL_BASE_CASE_SCENARIO_ID);
            };

            svc.selectFragmentScenarioIDs = function(topLevelFragmentID, scenarios) {
                var scenarioIDs = scenarios.filter( function (s) {
                    return (s.topLevelFragmentID === topLevelFragmentID);
                }).map (function (s) {
                    return s.scenarioID;
                });
                SelectionService.set(SELECTION_KEYS.topLevelFragmentID, topLevelFragmentID);
                SelectionService.set(SELECTION_KEYS.fragmentScenarios, scenarioIDs);

                return svc;
            };

            svc.getSelectedTopLevelFragmentID = function () {
                return SelectionService.get(SELECTION_KEYS.topLevelFragmentID);
            };

            svc.getSelectedScenarioIDs = function () {
                var fs = SelectionService.get(SELECTION_KEYS.fragmentScenarios);
                return fs ? fs : [];
            };

            return svc;
        }
    ]);