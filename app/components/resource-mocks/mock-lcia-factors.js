angular.module('lcaApp.mock.lciaFactors', [])
    .value('mockLciaFactors',
    {
        filter: {lciaMethodID: 2},
        objects: [
            {
                "lciaid": 5205,
                "lciaMethodID": 2,
                "flowID": 49,
                "direction": "Input",
                "factor": -1.0
            },
            {
                "lciaid": 5374,
                "lciaMethodID": 2,
                "flowID": 65,
                "direction": "Output",
                "factor": 353.0
            },
            {
                "lciaid": 5384,
                "lciaMethodID": 2,
                "flowID": 66,
                "direction": "Output",
                "factor": 124.0
            },
            {
                "lciaid": 5354,
                "lciaMethodID": 2,
                "flowID": 70,
                "direction": "Output",
                "factor": 12200.0
            },
            {
                "lciaid": 5504,
                "lciaMethodID": 2,
                "flowID": 105,
                "direction": "Output",
                "factor": 298.0
            },
            {
                "lciaid": 5484,
                "lciaMethodID": 2,
                "flowID": 154,
                "direction": "Output",
                "factor": 25.0
            },
            {
                "lciaid": 5245,
                "lciaMethodID": 2,
                "flowID": 155,
                "direction": "Output",
                "factor": 14400.0
            },
            {
                "lciaid": 5260,
                "lciaMethodID": 2,
                "flowID": 156,
                "direction": "Output",
                "factor": 8.7
            },
            {
                "lciaid": 5262,
                "lciaMethodID": 2,
                "flowID": 157,
                "direction": "Output",
                "factor": 8.7
            },
            {
                "lciaid": 5329,
                "lciaMethodID": 2,
                "flowID": 160,
                "direction": "Output",
                "factor": 151.0
            },
            {
                "lciaid": 5524,
                "lciaMethodID": 2,
                "flowID": 163,
                "direction": "Output",
                "factor": 13.0
            },
            {
                "lciaid": 5274,
                "lciaMethodID": 2,
                "flowID": 165,
                "direction": "Output",
                "factor": 7390.0
            },
            {
                "lciaid": 5230,
                "lciaMethodID": 2,
                "flowID": 238,
                "direction": "Output",
                "factor": 10000.0
            },
            {
                "lciaid": 5206,
                "lciaMethodID": 2,
                "flowID": 292,
                "direction": "Output",
                "factor": 1.0
            },
            {
                "lciaid": 5626,
                "lciaMethodID": 2,
                "flowID": 396,
                "direction": "Output",
                "factor": 17200.0
            },
            {
                "lciaid": 5414,
                "lciaMethodID": 2,
                "flowID": 562,
                "direction": "Output",
                "factor": 1030.0
            },
            {
                "lciaid": 5419,
                "lciaMethodID": 2,
                "flowID": 593,
                "direction": "Output",
                "factor": 675.0
            },
            {
                "lciaid": 5546,
                "lciaMethodID": 2,
                "flowID": 736,
                "direction": "Output",
                "factor": 6130.0
            },
            {
                "lciaid": 5319,
                "lciaMethodID": 2,
                "flowID": 815,
                "direction": "Output",
                "factor": 146.0
            },
            {
                "lciaid": 5225,
                "lciaMethodID": 2,
                "flowID": 881,
                "direction": "Output",
                "factor": 4750.0
            },
            {
                "lciaid": 5394,
                "lciaMethodID": 2,
                "flowID": 882,
                "direction": "Output",
                "factor": 14800.0
            },
            {
                "lciaid": 5240,
                "lciaMethodID": 2,
                "flowID": 890,
                "direction": "Output",
                "factor": 10900.0
            },
            {
                "lciaid": 5359,
                "lciaMethodID": 2,
                "flowID": 925,
                "direction": "Output",
                "factor": 3500.0
            },
            {
                "lciaid": 5369,
                "lciaMethodID": 2,
                "flowID": 961,
                "direction": "Output",
                "factor": 1430.0
            },
            {
                "lciaid": 5284,
                "lciaMethodID": 2,
                "flowID": 1031,
                "direction": "Output",
                "factor": 5.0
            },
            {
                "lciaid": 5294,
                "lciaMethodID": 2,
                "flowID": 1032,
                "direction": "Output",
                "factor": 1890.0
            },
            {
                "lciaid": 5299,
                "lciaMethodID": 2,
                "flowID": 1033,
                "direction": "Output",
                "factor": 7140.0
            },
            {
                "lciaid": 5334,
                "lciaMethodID": 2,
                "flowID": 1034,
                "direction": "Output",
                "factor": 1810.0
            },
            {
                "lciaid": 5216,
                "lciaMethodID": 2,
                "flowID": 1035,
                "direction": "Output",
                "factor": 1400.0
            },
            {
                "lciaid": 5218,
                "lciaMethodID": 2,
                "flowID": 1036,
                "direction": "Output",
                "factor": 1400.0
            },
            {
                "lciaid": 5314,
                "lciaMethodID": 2,
                "flowID": 1093,
                "direction": "Output",
                "factor": 609.0
            },
            {
                "lciaid": 5529,
                "lciaMethodID": 2,
                "flowID": 1122,
                "direction": "Output",
                "factor": 22800.0
            },
            {
                "lciaid": 5250,
                "lciaMethodID": 2,
                "flowID": 1152,
                "direction": "Output",
                "factor": 31.0
            },
            {
                "lciaid": 5200,
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