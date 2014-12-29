/**
 * Service providing data model for LCIA factors.
 * This model facilitates factor lookup with a nested associative array.
 * LCIA factors are first indexed by lciaMethodID., then by flowID.
 *
 * Example :
 *
{
    lciaMethods: {
        2 :
        {
            flows: {
                49 :
                {
                    "lciaid": 5205,
                    "lciaMethodID": 2,
                    "flowID": 49,
                    "directionID": 1,
                    "factor": -1.0
                }
            ,
                65 :
                {
                    "lciaid": 5374,
                    "lciaMethodID": 2,
                    "flowID": 65,
                    "directionID": 2,
                    "factor": 353.0
                }
            }
        }
    }
}
 */
angular.module('lcaApp.models.lciaFactor', [] )
    .factory('LciaFactorModelService',
        function() {
            var svc = {},
                model = { lciaMethods : {} };

            function nest(parent, property) {
                if (! (property in parent)) {
                    parent[property] = {};
                }
                return parent[property];
            }

            function updateModel(lciaMethodID, factors) {
                if ( factors && factors.length > 0) {
                    var m = {};
                    factors.forEach( function (f) {
                        if ("flowID" in f ) {
                            nest( nest(m, "flows"), f.flowID);
                            m.flows[f.flowID] = f;
                        }
                    });
                    model.lciaMethods[lciaMethodID] = m;
                }
                else {
                    model.lciaMethods[lciaMethodID] = null;
                }
            }

            /**
             * Create model for LCIA factors. If factors were already modeled for given LCIA method, that part of private
             * model will be recreated.
             * @param lciaMethodID
             * @param factors    Loaded LCIA factor resources
             * @returns {{flows : {}}}
             */
            svc.createModel = function (lciaMethodID, factors) {
                updateModel(lciaMethodID, factors);
                return model.lciaMethods[lciaMethodID];
            };

            /**
             * Getter function for LCIA factor model.
             * @param lciaMethodID
             * @returns {*}
             */
            svc.getModel = function(lciaMethodID) {
                if (lciaMethodID in model.lciaMethods) {
                    return model.lciaMethods[lciaMethodID];
                }
                else {
                    return null;
                }
            };

            return svc;
        }
    );
