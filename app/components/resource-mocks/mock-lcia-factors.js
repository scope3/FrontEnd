angular.module('lcaApp.mock.lciaFactors', [])
    .value('mockLciaFactors',
    {
        filter: {lciaMethodID: 2},
        objects: [
            {
                "lciaMethodID": 2,
                "flowID": 49,
                "direction": "Input",
                "factor": -1.0
            },
            {
                "lciaMethodID": 2,
                "flowID": 65,
                "direction": "Output",
                "factor": 353.0
            },
            {
                "lciaMethodID": 2,
                "flowID": 66,
                "direction": "Output",
                "factor": 124.0
            },
            {
                "lciaMethodID": 2,
                "flowID": 70,
                "direction": "Output",
                "factor": 12200.0
            },
            {
                "lciaMethodID": 2,
                "flowID": 105,
                "direction": "Output",
                "factor": 298.0
            },
            {
                "lciaMethodID": 2,
                "flowID": 154,
                "direction": "Output",
                "factor": 25.0
            },
            {
                "lciaMethodID": 2,
                "flowID": 155,
                "direction": "Output",
                "factor": 14400.0
            },
            {
                "lciaMethodID": 2,
                "flowID": 156,
                "direction": "Output",
                "factor": 8.7
            },
            {
                "lciaMethodID": 2,
                "flowID": 157,
                "direction": "Output",
                "factor": 8.7
            },
            {
                "lciaMethodID": 2,
                "flowID": 160,
                "direction": "Output",
                "factor": 151.0
            },
            {
                "lciaMethodID": 2,
                "flowID": 163,
                "direction": "Output",
                "factor": 13.0
            },
            {
                "lciaMethodID": 2,
                "flowID": 165,
                "direction": "Output",
                "factor": 7390.0
            },
            {
                "lciaMethodID": 2,
                "flowID": 238,
                "direction": "Output",
                "factor": 10000.0
            },
            {
                "lciaMethodID": 2,
                "flowID": 292,
                "direction": "Output",
                "factor": 1.0
            },
            {
                "lciaMethodID": 2,
                "flowID": 396,
                "direction": "Output",
                "factor": 17200.0
            },
            {
                "lciaMethodID": 2,
                "flowID": 562,
                "direction": "Output",
                "factor": 1030.0
            },
            {
                "lciaMethodID": 2,
                "flowID": 593,
                "direction": "Output",
                "factor": 675.0
            },
            {
                "lciaMethodID": 2,
                "flowID": 736,
                "direction": "Output",
                "factor": 6130.0
            },
            {
                "lciaMethodID": 2,
                "flowID": 815,
                "direction": "Output",
                "factor": 146.0
            },
            {
                "lciaMethodID": 2,
                "flowID": 881,
                "direction": "Output",
                "factor": 4750.0
            },
            {
                "lciaMethodID": 2,
                "flowID": 882,
                "direction": "Output",
                "factor": 14800.0
            },
            {
                "lciaMethodID": 2,
                "flowID": 890,
                "direction": "Output",
                "factor": 10900.0
            },
            {
                "lciaMethodID": 2,
                "flowID": 925,
                "direction": "Output",
                "factor": 3500.0
            },
            {
                "lciaMethodID": 2,
                "flowID": 961,
                "direction": "Output",
                "factor": 1430.0
            },
            {
                "lciaMethodID": 2,
                "flowID": 1031,
                "direction": "Output",
                "factor": 5.0
            },
            {
                "lciaMethodID": 2,
                "flowID": 1032,
                "direction": "Output",
                "factor": 1890.0
            },
            {
                "lciaMethodID": 2,
                "flowID": 1033,
                "direction": "Output",
                "factor": 7140.0
            },
            {
                "lciaMethodID": 2,
                "flowID": 1034,
                "direction": "Output",
                "factor": 1810.0
            },
            {
                "lciaMethodID": 2,
                "flowID": 1035,
                "direction": "Output",
                "factor": 1400.0
            },
            {
                "lciaMethodID": 2,
                "flowID": 1036,
                "direction": "Output",
                "factor": 1400.0
            },
            {
                "lciaMethodID": 2,
                "flowID": 1093,
                "direction": "Output",
                "factor": 609.0
            },
            {
                "lciaMethodID": 2,
                "flowID": 1122,
                "direction": "Output",
                "factor": 22800.0
            },
            {
                "lciaMethodID": 2,
                "flowID": 1152,
                "direction": "Output",
                "factor": 31.0
            },
            {
                "lciaMethodID": 2,
                "flowID": 1154,
                "direction": "Output",
                "factor": 1.0
            }
        ]
    })
    .factory('MockLciaFactorService', ['mockLciaFactors', '$q',
        function (mockLciaFactors, $q) {
            var svc = {};

            svc.load = function () {
                var deferred = $q.defer();
                deferred.resolve(mockLciaFactors.objects);
                return deferred.promise;
            };

            return svc;
        }])
;