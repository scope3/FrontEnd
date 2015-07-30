/**
 * @ngdoc service
 * @module lcaApp.models.scenario
 * @name ScenarioModelService
 * @memberOf lcaApp.models.scenario
 * @description
 * Factory service providing model for scenarios.
 */
angular.module('lcaApp.models.scenario', ['lcaApp.resources.service', 'LocalStorageModule', 'lcaApp.selection.service'] )
    .factory('ScenarioModelService', ['ScenarioService', 'MODEL_BASE_CASE_SCENARIO_ID', 'localStorageService',
        'SelectionService', 'SELECTION_KEYS',
        function(ScenarioService, MODEL_BASE_CASE_SCENARIO_ID, localStorageService,
                 SelectionService, SELECTION_KEYS) {
            var svc = ScenarioService,
                storageKey = "activeScenarioID";

            /**
             * @ngdoc
             * @name ScenarioModelService#getActiveID
             * @methodOf ScenarioModelService
             * @description
             * Get ID of active scenario
             * @returns {?number}  ScenarioID of active scenario, if found. Otherwise, null.
             */
            svc.getActiveID = function () {
                var id = localStorageService.get(storageKey);
                return id ? +id : null; // convert from string to number
            };
            /**
             * @ngdoc
             * @name ScenarioModelService#setActiveID
             * @methodOf ScenarioModelService
             * @description
             * Set active scenarioID.
             * @param {number} scenarioID ScenarioID of active scenario
             * @returns {boolean} returned by localStorageService.set.
             */
            svc.setActiveID = function ( scenarioID) {
                return localStorageService.set(storageKey, scenarioID);
            };

            /**
             * @ngdoc
             * @name ScenarioModelService#removeActiveID
             * @methodOf ScenarioModelService
             * @description
             * Remove active scenarioID from local storage.
             * @returns {boolean} returned by localStorageService.remove.
             */
            svc.removeActiveID = function ( ) {
                return localStorageService.remove(storageKey);
            };

            /**
             * @ngdoc
             * @name ScenarioModelService#getBaseCaseID
             * @methodOf ScenarioModelService
             * @description
             * Get scenarioID of Base Case scenario.
             * @returns {number} Base Case scenarioID.
             */
            svc.getBaseCaseID = function () {
                return MODEL_BASE_CASE_SCENARIO_ID
            };

            /**
             * @ngdoc
             * @name ScenarioModelService#getBaseCase
             * @methodOf ScenarioModelService
             * @description
             * Get Base Case scenario resource from ScenarioService.
             * @returns {object} Base Case scenario.
             */
            svc.getBaseCase = function () {
                return ScenarioService.get(MODEL_BASE_CASE_SCENARIO_ID);
            };

            /**
             * @ngdoc
             * @name ScenarioModelService#isBaseCase
             * @methodOf ScenarioModelService
             * @description
             * Check if scenario is the Base Case.
             * @param {object} scenario Scenario resource
             * @returns {boolean} iff scenario is base case.
             */
            svc.isBaseCase = function (scenario) {
                return (scenario.scenarioID === MODEL_BASE_CASE_SCENARIO_ID);
            };

            /**
             * @ngdoc
             * @name ScenarioModelService#getActiveScenario
             * @methodOf ScenarioModelService
             * @description
             * Get active scenario. If none is active, activate the base case scenario.
             * @returns {object}  Active scenario.
             */
            svc.getActiveScenario = function () {
                var scenarioID = svc.getActiveID(),
                    scenario = null;
                if (scenarioID) {
                    scenario = svc.get(scenarioID);
                }
                if (!scenario) {
                    scenarioID = svc.getBaseCaseID();
                    scenario = svc.get(scenarioID);
                    if (scenario) {
                        svc.setActiveID(scenarioID);
                    }
                }
                return scenario;
            };

            /**
             * @ngdoc
             * @name ScenarioModelService#selectFragmentScenarioIDs
             * @methodOf ScenarioModelService
             * @description
             * Set selected topLevelFragmentID and scenarios
             * @param {number} topLevelFragmentID Selected topLevelFragmentID
             * @param {[]} scenarios Selected scenarios having selected topLevelFragmentID
             * @returns {object} ScenarioModelService singleton
             */
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

            /**
             * @ngdoc
             * @name ScenarioModelService#getSelectedTopLevelFragmentID
             * @methodOf ScenarioModelService
             * @description
             * Get selected topLevelFragmentID.
             * @returns {number} topLevelFragmentID
             */
            svc.getSelectedTopLevelFragmentID = function () {
                return SelectionService.get(SELECTION_KEYS.topLevelFragmentID);
            };

            /**
             * @ngdoc
             * @name ScenarioModelService#getSelectedScenarioIDs
             * @methodOf ScenarioModelService
             * @description
             * Get selected scenarios with selected topLevelFragmentID.
             * @returns {[]} Array of scenarios
             */
            svc.getSelectedScenarioIDs = function () {
                var fs = SelectionService.get(SELECTION_KEYS.fragmentScenarios);
                return fs ? fs : [];
            };

            /**
             * @ngdoc
             * @name ScenarioModelService#canCreateScenario
             * @methodOf ScenarioModelService
             * @description
             * Determine if current user may create a scenario.
             * @param {[]} scenarioGroups Array of loaded scenario groups.
             * @returns {boolean} if user has access to create a scenario
             */
            svc.canCreateScenario = function (scenarioGroups) {
                return svc.authenticated &&
                    scenarioGroups.some( function(sg) {
                        return sg.hasOwnProperty("visibility") && sg.visibility === "Private";
                });
            };

            return svc;
        }
    ]);