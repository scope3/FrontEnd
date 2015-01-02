angular.module('lcaApp.mock.params', [])
    .value('mockParams',
    {
        filter: {scenarioID: 2},
        objects: [
            {
                "paramID": 1,
                "paramTypeID": 1,
                "scenarioID": 2,
                "name": "Local Collection Mixer || Inter-Facility Mixer",
                "fragmentFlowID": 155,
                "value": 360.985
            },
            {
                "paramID": 2,
                "paramTypeID": 1,
                "scenarioID": 2,
                "name": "Local Collection Mixer || Diesel MHD",
                "fragmentFlowID": 115,
                "value": 30.0
            },
            {
                "paramID": 3,
                "paramTypeID": 1,
                "scenarioID": 2,
                "name": "Improper disposal (splitter) || Used oil, improperly disposed, to agricultural soil via dumping",
                "fragmentFlowID": 213,
                "value": 0.5
            },
            {
                "paramID": 4,
                "paramTypeID": 1,
                "scenarioID": 2,
                "name": "Improper disposal (splitter) || Used oil, improperly disposed, to industrial soil via dumping",
                "fragmentFlowID": 214,
                "value": 0.5
            },
            {
                "paramID": 5,
                "paramTypeID": 2,
                "scenarioID": 2,
                "name": "Improper disposal (splitter) || Used oil, improperly disposed, to fresh water via filtered storm drain",
                "fragmentFlowID": 237,
                "value": 0.5
            },
            {
                "paramID": 5,
                "paramTypeID": 2,
                "scenarioID": 2,
                "name": "Improper disposal (splitter) || Used oil, improperly disposed, to fresh water via filtered storm drain",
                "fragmentFlowID": 238,
                "value": 0.5
            },
            {
                "paramID": 6,
                "paramTypeID": 2,
                "scenarioID": 2,
                "name": "Improper disposal (splitter) || Used oil, improperly disposed, to fresh water via unfiltered storm drain",
                "fragmentFlowID": 240,
                "value": 0.56
            },
            {
                "paramID": 6,
                "paramTypeID": 2,
                "scenarioID": 2,
                "name": "Improper disposal (splitter) || Used oil, improperly disposed, to fresh water via unfiltered storm drain",
                "fragmentFlowID": 241,
                "value": 0.44
            },
            {
                "paramID": 7,
                "paramTypeID": 2,
                "scenarioID": 2,
                "name": "Local Collection Mixer || UO_Transfer to RFO",
                "fragmentFlowID": 176,
                "value": 0.08942
            },
            {
                "paramID": 7,
                "paramTypeID": 2,
                "scenarioID": 2,
                "name": "Local Collection Mixer || UO_Transfer to RFO",
                "fragmentFlowID": 151,
                "value": 0.45
            },
            {
                "paramID": 7,
                "paramTypeID": 2,
                "scenarioID": 2,
                "name": "Local Collection Mixer || UO_Transfer to RFO",
                "fragmentFlowID": 164,
                "value": 0.225
            },
            {
                "paramID": 7,
                "paramTypeID": 2,
                "scenarioID": 2,
                "name": "Local Collection Mixer || UO_Transfer to RFO",
                "fragmentFlowID": 159,
                "value": 0.15
            },
            {
                "paramID": 7,
                "paramTypeID": 2,
                "scenarioID": 2,
                "name": "Local Collection Mixer || UO_Transfer to RFO",
                "fragmentFlowID": 162,
                "value": 0.006
            },
            {
                "paramID": 7,
                "paramTypeID": 2,
                "scenarioID": 2,
                "name": "Local Collection Mixer || UO_Transfer to RFO",
                "fragmentFlowID": 165,
                "value": 0.005305
            },
            {
                "paramID": 7,
                "paramTypeID": 2,
                "scenarioID": 2,
                "name": "Local Collection Mixer || UO_Transfer to RFO",
                "fragmentFlowID": 167,
                "value": 0.001872
            },
            {
                "paramID": 7,
                "paramTypeID": 2,
                "scenarioID": 2,
                "name": "Local Collection Mixer || UO_Transfer to RFO",
                "fragmentFlowID": 169,
                "value": 0.055951
            },
            {
                "paramID": 7,
                "paramTypeID": 2,
                "scenarioID": 2,
                "name": "Local Collection Mixer || UO_Transfer to RFO",
                "fragmentFlowID": 174,
                "value": 0.009339
            },
            {
                "paramID": 8,
                "paramTypeID": 2,
                "scenarioID": 2,
                "name": "Improper disposal || sewer",
                "fragmentFlowID": 216,
                "value": 0.32
            },
            {
                "paramID": 8,
                "paramTypeID": 2,
                "scenarioID": 2,
                "name": "Improper disposal || sewer",
                "fragmentFlowID": 225,
                "value": 0.68
            },
            {
                "paramID": 9,
                "paramTypeID": 10,
                "scenarioID": 2,
                "name": "Acidification: ILCD2011 ReCiPe2008  || sulfur dioxide [Emissions to air, unspecified]",
                "flowID": 1121,
                "lciaMethodID": 17,
                "value": 1.16E-08
            },
            {
                "paramID": 10,
                "paramTypeID": 5,
                "scenarioID": 2,
                "name": "Used oil || Zinc content",
                "compositionDataID": 36,
                "value": 0.002
            },
            {
                "paramID": 11,
                "paramTypeID": 6,
                "scenarioID": 2,
                "name": "Used oil, improperly disposed, to fresh water via unfiltered storm drain || copper [Emissions to fresh water]",
                "flowID": 994,
                "processID": 163,
                "value": 0.5
            },
            {
                "paramID": 12,
                "paramTypeID": 8,
                "scenarioID": 2,
                "name": "Truck Class 6 MHD Diesel || methane [Emissions to air, unspecified]",
                "flowID": 154,
                "processID": 43,
                "value": 0.0006285
            }
        ]
    })
    .factory('MockParamService', ['mockParams', '$q',
        function (mockParams, $q) {
            var svc = {};

            svc.load = function () {
                var deferred = $q.defer();
                deferred.resolve(mockParams.objects);
                return deferred.promise;
            };

            return svc;

        }])
;