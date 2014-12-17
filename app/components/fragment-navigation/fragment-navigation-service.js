/**
 * Service for keeping track of fragment navigation state
 */
angular.module('lcaApp.fragmentNavigation.service', [])
    .factory('FragmentNavigationService', [ function () {

        var svc = {},
            stack = [],
            context = {
                "fragmentID" : null,
                "scenarioID" : null
            }
            ;

        /**
         * Set context for navigation. If it changes,
         * this service will clear navigation state. Otherwise,
         * no action is performed.
         * @param { String | Number } scenarioID
         * @param { String | Number } fragmentID
         * @returns {{}} the service, enables method chaining
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
         * Add to current navigation state
         * @param {{}, Number} state
         */
        svc.add = function (state) {
            stack.push(state);
        };

        /**
         * Get last navigation state
         * @returns null if there is no navigation state,
         * otherwise, last state added
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
         * Return to a previous state
         * @param index to the state in stack
         * @returns {{}} the service for method chaining
         */
        svc.setLast = function (index) {
            stack.splice(index+1);
            return svc;
        };

        /**
         * Get the stack of all navigation states
         * @returns {*|Array}
         */
        svc.getAll = function () {
            return stack;
        };

        return svc;
    }
    ]
);
