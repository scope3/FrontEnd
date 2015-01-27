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
                    "lciaMethodID": 2,
                    "flowID": 49,
                    "direction": "Input",
                    "factor": -1.0
                }
            ,
                65 :
                {
                    "lciaMethodID": 2,
                    "flowID": 65,
                    "direction": "Output",
                    "factor": 353.0
                }
            }
        }
    }
}
 */
angular.module('lcaApp.models.lciaFactor', ['lcaApp.resources.service'] )
    .factory('LciaFactorModelService', ['LciaFactorService', '$q',
        function(LciaFactorService, $q) {
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

            /**
             * Load LCIA factor resources
             * @param {Number} lciaMethodID   lciaMethodID filter
             * @returns {*} promise, model branch for the LCIA method
             */
            svc.load = function( lciaMethodID) {
                var deferred = $q.defer();
                LciaFactorService.load({lciaMethodID: lciaMethodID})
                    .then(function(response) {
                        deferred.resolve(svc.createModel(lciaMethodID, response));
                    },
                    function(err) {
                        deferred.reject("LCIA factor model load failed. " + err);
                    });
                return deferred.promise;
            };

            return svc;
        }
        ]
    );
