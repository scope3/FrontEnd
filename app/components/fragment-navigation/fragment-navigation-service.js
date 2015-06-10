/**
 * @ngdoc service
 * @module lcaApp.fragmentNavigation.service
 * @name FragmentNavigationService
 * @memberOf lcaApp.fragmentNavigation.service
 * @description
 * Factory service for keeping track of fragment navigation state.
 */
angular.module('lcaApp.fragmentNavigation.service', [])
    .factory('FragmentNavigationService', [ function () {

        var svc = {},
            stack = [],
            context = {
                "fragmentID" : 0,
                "scenarioID" : 0
            }
            ;

        /**
         * @ngdoc
         * @name FragmentNavigationService#setContext
         * @methodOf FragmentNavigationService
         * @description
         * Set context for navigation. If it changes,
         * this service will clear navigation state. Otherwise,
         * no action is performed.
         * @param { string | number } scenarioID Scenario ID
         * @param { string | number } fragmentID Fragment ID
         * @returns {object} the service singleton, enables method chaining
         */
        svc.setContext = function (scenarioID, fragmentID) {
            // Store IDs as numbers.
            var sID = +scenarioID, fID = +fragmentID;
            if ( (context.fragmentID && fID !== context.fragmentID) ||
                  (context.scenarioID && sID !== context.scenarioID)
                )
            {
                stack = [];
            }
            context.fragmentID = fID;
            context.scenarioID = sID;

            return svc;
        };

        /**
         * @ngdoc
         * @name FragmentNavigationService#getContext
         * @methodOf FragmentNavigationService
         * @description
         * Get current navigation context
         * @returns {object} context {fragmentID: number, scenarioID: number}
         */
        svc.getContext = function () {
            return context;
        };

        /**
         * @ngdoc
         * @name FragmentNavigationService#add
         * @methodOf FragmentNavigationService
         * @description
         * Add to current navigation state
         * @param {object} state { fragmentID : number, name : string}
         */
        svc.add = function (state) {
            stack.push(state);
        };

        /**
         * @ngdoc
         * @name FragmentNavigationService#getLast
         * @methodOf FragmentNavigationService
         * @description
         * Get last navigation state
         * @returns { ?object } null if there is no navigation state,
         * otherwise, last state added.
         */
        svc.getLast = function () {
            if (stack.length > 0) {
                return stack[stack.length - 1]
            }
            else {
                return null;
            }
        };

        /**
         * @ngdoc
         * @name FragmentNavigationService#setLast
         * @methodOf FragmentNavigationService
         * @description
         * Return to a previous state
         * @param {number} index Navigation state index
         * @returns {object} the service singleton
         */
        svc.setLast = function (index) {
            stack.splice(index+1);
            return svc;
        };

        /**
         * @ngdoc
         * @name FragmentNavigationService#getAll
         * @methodOf FragmentNavigationService
         * @description
         * Get the stack of all navigation states
         * @returns {[]} Array of navigation states
         */
        svc.getAll = function () {
            return stack;
        };

        return svc;
    }
    ]
);
