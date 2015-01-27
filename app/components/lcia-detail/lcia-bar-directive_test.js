describe('Unit test LCIA bar chart directive', function() {
    var $compile,
        $rootScope;

    function getResultWithDetails() {
        return  [
                {
                    "flowID": 40,
                    "result": 3.51846969850466E-15
                },
                {
                    "flowID": 213,
                    "result": 8.06688699141299E-15
                },
                {
                    "flowID": 965,
                    "result": 8.53175144386221E-16
                },
                {
                    "flowID": 307,
                    "result": 9.5462368673581109E-14
                },
                {
                    "flowID": 941,
                    "result": 1.4590590091409256E-16
                },
                {
                    "flowID": 1147,
                    "result": 4.61466337179055E-12
                },
                {
                    "flowID": 964,
                    "result": 2.285091832070264E-10
                },
                {
                    "flowID": 224,
                    "result": 3.59959791945857E-14
                },
                {
                    "flowID": 913,
                    "result": 2.5125807721086468E-13
                },
                {
                    "flowID": 968,
                    "result": 4.2614068399325248E-12
                },
                {
                    "flowID": 1078,
                    "result": 5.2263265458143164E-26
                },
                {
                    "flowID": 883,
                    "result": 2.4139057481651133E-15
                },
                {
                    "flowID": 1028,
                    "result": 5.4130991268119382E-19
                },
                {
                    "flowID": 912,
                    "result": 2.7198087610237488E-12
                },
                {
                    "flowID": 966,
                    "result": 1.2083434233237014E-11
                },
                {
                    "flowID": 838,
                    "result": 1.7485910312673347E-15
                },
                {
                    "flowID": 840,
                    "result": 1.2445843005445139E-19
                },
                {
                    "flowID": 7,
                    "result": 1.3339468144370791E-16
                },
                {
                    "flowID": 9,
                    "result": 2.8782218735006615E-15
                },
                {
                    "flowID": 10,
                    "result": 4.3011910456216383E-17
                },
                {
                    "flowID": 369,
                    "result": 4.5937875496107667E-20
                },
                {
                    "flowID": 386,
                    "result": 5.9171176180987035E-18
                },
                {
                    "flowID": 387,
                    "result": 1.3528022576125663E-16
                },
                {
                    "flowID": 388,
                    "result": 3.5755068477286146E-09
                },
                {
                    "flowID": 414,
                    "result": 6.3850986961986927E-17
                },
                {
                    "flowID": 415,
                    "result": 1.6340493665377625E-13
                },
                {
                    "flowID": 449,
                    "direction": "Input",
                    "result": 3.1036108487605382E-14
                }
            ];
    }

    function getFlows() {
        return [
            {
                "flow": {
                    "flowID": 7,
                    "name": "phosphorus",
                    "casNumber": "007723-14-0    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable element resources from ground"
                },
                "direction": "Input",
                "magnitude": 2.14806250311929E-12,
                "result": 2.14806250311929E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 9,
                    "name": "platinum",
                    "casNumber": "007440-06-4    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable element resources from ground"
                },
                "direction": "Input",
                "magnitude": 3.16636069692042E-16,
                "result": 3.16636069692042E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 10,
                    "name": "potassium",
                    "casNumber": "007440-09-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable element resources from ground"
                },
                "direction": "Input",
                "magnitude": 4.77910116180182E-12,
                "result": 4.77910116180182E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 11,
                    "name": "potassium chloride",
                    "casNumber": "007447-40-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable material resources from ground"
                },
                "direction": "Input",
                "magnitude": 5.15652267526529E-14,
                "result": 5.15652267526529E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 12,
                    "name": "primary energy from geothermics",
                    "referenceFlowPropertyID": 24,
                    "flowTypeID": 2,
                    "category": "Renewable energy resources from ground"
                },
                "direction": "Input",
                "magnitude": 4.32785854729973E-05,
                "result": 4.32785854729973E-05,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 13,
                    "name": "primary energy from hydro power",
                    "referenceFlowPropertyID": 24,
                    "flowTypeID": 2,
                    "category": "Renewable energy resources from water"
                },
                "direction": "Input",
                "magnitude": 0.00012864553013246,
                "result": 0.00012864553013246,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 14,
                    "name": "primary energy from solar energy",
                    "referenceFlowPropertyID": 24,
                    "flowTypeID": 2,
                    "category": "Renewable energy resources from air"
                },
                "direction": "Input",
                "magnitude": 5.38644189254466E-06,
                "result": 5.38644189254466E-06,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 15,
                    "name": "primary energy from wind power",
                    "referenceFlowPropertyID": 24,
                    "flowTypeID": 2,
                    "category": "Renewable energy resources from air"
                },
                "direction": "Input",
                "magnitude": 3.2983166196669E-05,
                "result": 3.2983166196669E-05,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 17,
                    "name": "Acids, unspecified",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Other emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 1.35741316568461E-08,
                "result": 1.35741316568461E-08,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 21,
                    "name": "waste heat",
                    "referenceFlowPropertyID": 24,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 2.5573102875924E-05,
                "result": 2.5573102875924E-05,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 22,
                    "name": "waste heat",
                    "referenceFlowPropertyID": 24,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 4.31187337062877E-05,
                "result": 4.31187337062877E-05,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 24,
                    "name": "waste heat",
                    "referenceFlowPropertyID": 24,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 1.86863856532157E-11,
                "result": 1.86863856532157E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 25,
                    "name": "xenon-137",
                    "casNumber": "014835-21-3    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 8.29542061478724E-09,
                "result": 8.29542061478724E-09,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 26,
                    "name": "xenon-138",
                    "casNumber": "015751-81-2    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 9.11242667610388E-09,
                "result": 9.11242667610388E-09,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 27,
                    "name": "volatile organic compound",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 5.71062654722811E-17,
                "result": 5.71062654722811E-17,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 28,
                    "name": "volatile organic compound",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 8.94904064246554E-07,
                "result": 8.94904064246554E-07,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 30,
                    "name": "acenaphthene",
                    "casNumber": "000083-32-9    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 1.54514725210007E-18,
                "result": 1.54514725210007E-18,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 31,
                    "name": "acenaphthene",
                    "casNumber": "000083-32-9    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 9.50585931894217E-18,
                "result": 9.50585931894217E-18,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 32,
                    "name": "acenaphthylene",
                    "casNumber": "000208-96-8    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 6.485901516176E-19,
                "result": 6.485901516176E-19,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 33,
                    "name": "acenaphthylene",
                    "casNumber": "000208-96-8    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 3.84605004205559E-18,
                "result": 3.84605004205559E-18,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 34,
                    "name": "acid (as H+)",
                    "casNumber": "012408-02-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 6.60237242598389E-09,
                "result": 6.60237242598389E-09,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 35,
                    "name": "acrolein",
                    "casNumber": "000107-02-8    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 3.1492651928764E-12,
                "result": 3.1492651928764E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 37,
                    "name": "acryolonitrile",
                    "casNumber": "000107-13-1    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 2.42763033358934E-19,
                "result": 2.42763033358934E-19,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 38,
                    "name": "particles (PM10)",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 6.39301348984773E-10,
                "result": 6.39301348984773E-10,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 39,
                    "name": "antimony",
                    "casNumber": "007440-36-0    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to non-agricultural soil"
                },
                "direction": "Output",
                "magnitude": 2.6575588714906E-19,
                "result": 2.6575588714906E-19,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 40,
                    "name": "antimony",
                    "casNumber": "007440-36-0    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable element resources from ground"
                },
                "direction": "Input",
                "magnitude": 3.51846969850466E-15,
                "result": 3.51846969850466E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 42,
                    "name": "benzene",
                    "casNumber": "000071-43-2    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.10931479263233E-08,
                "result": 1.10931479263233E-08,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 43,
                    "name": "benzene",
                    "casNumber": "000071-43-2    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 4.49373832493547E-09,
                "result": 4.49373832493547E-09,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 44,
                    "name": "benzo[a]pyrene",
                    "casNumber": "000050-32-8    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 7.43238858726084E-16,
                "result": 7.43238858726084E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 45,
                    "name": "benzylchloride",
                    "casNumber": "000100-44-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 2.84024533038357E-15,
                "result": 2.84024533038357E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 46,
                    "name": "calcium",
                    "casNumber": "007440-70-2    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 7.00397177095135E-16,
                "result": 7.00397177095135E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 48,
                    "name": "calcium carbonate",
                    "casNumber": "000471-34-1    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable material resources from ground"
                },
                "direction": "Input",
                "magnitude": 5.62909837942817E-08,
                "result": 5.62909837942817E-08,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 49,
                    "name": "carbon dioxide",
                    "casNumber": "000124-38-9    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Renewable material resources from air"
                },
                "direction": "Input",
                "magnitude": 0.843238182001507,
                "result": 0.843238182001507,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 50,
                    "name": "carbon disulfide",
                    "casNumber": "000075-15-0    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 5.27847058126126E-16,
                "result": 5.27847058126126E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 52,
                    "name": "carbon monoxide",
                    "casNumber": "000630-08-0    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 8.5064920309627E-05,
                "result": 8.5064920309627E-05,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 53,
                    "name": "carbon-14",
                    "casNumber": "014762-75-5    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 2.91421522209723E-09,
                "result": 2.91421522209723E-09,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 54,
                    "name": "carbon-14",
                    "casNumber": "014762-75-5    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 2.88497609118803E-12,
                "result": 2.88497609118803E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 55,
                    "name": "carbonate",
                    "casNumber": "003812-32-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 2.6441597778869E-12,
                "result": 2.6441597778869E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 57,
                    "name": "clay",
                    "casNumber": "070694-09-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable material resources from ground"
                },
                "direction": "Input",
                "magnitude": 2.09240437540269E-09,
                "result": 2.09240437540269E-09,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 58,
                    "name": "cobalt",
                    "casNumber": "007440-48-4    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.23386011224381E-11,
                "result": 1.23386011224381E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 60,
                    "name": "particles (PM2.5)",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 5.23424300468216E-12,
                "result": 5.23424300468216E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 61,
                    "name": "dibenz[a,h]anthracene",
                    "casNumber": "000053-70-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.51927413517535E-19,
                "result": 1.51927413517535E-19,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 62,
                    "name": "acetic acid",
                    "casNumber": "000064-19-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 2.53301271795676E-14,
                "result": 2.53301271795676E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 63,
                    "name": "acetic acid",
                    "casNumber": "000064-19-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 4.49051546779098E-14,
                "result": 4.49051546779098E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 64,
                    "name": "2,3,7,8-tetrachlorodibenzo-p-dioxin",
                    "casNumber": "001746-01-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 1.08894328824907E-22,
                "result": 1.08894328824907E-22,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 65,
                    "name": "HFC-143",
                    "casNumber": "000430-66-0    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 2.63223876661682E-18,
                "result": 2.63223876661682E-18,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 67,
                    "name": "1,2-dibromoethane",
                    "casNumber": "000106-93-4    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 4.86899199494326E-18,
                "result": 4.86899199494326E-18,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 68,
                    "name": "1,2-dibromoethane",
                    "casNumber": "000106-93-4    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 2.00408631794183E-21,
                "result": 2.00408631794183E-21,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 69,
                    "name": "bromide",
                    "casNumber": "024959-67-9    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to non-agricultural soil"
                },
                "direction": "Output",
                "magnitude": 1.09512432568517E-17,
                "result": 1.09512432568517E-17,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 70,
                    "name": "HFC-116",
                    "casNumber": "000076-16-4    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 5.06063333024697E-16,
                "result": 5.06063333024697E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 71,
                    "name": "mercaptan",
                    "casNumber": "000075-08-1    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 8.87986033006173E-13,
                "result": 8.87986033006173E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 72,
                    "name": "ethanol",
                    "casNumber": "000064-17-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 9.5034876468475E-15,
                "result": 9.5034876468475E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 77,
                    "name": "natural aggregate",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable material resources from ground"
                },
                "direction": "Input",
                "magnitude": 8.81197058614082E-07,
                "result": 8.81197058614082E-07,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 78,
                    "name": "fluoride",
                    "casNumber": "016984-48-8    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 8.05742955274979E-09,
                "result": 8.05742955274979E-09,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 79,
                    "name": "fluoride",
                    "casNumber": "016984-48-8    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 6.64007369174867E-09,
                "result": 6.64007369174867E-09,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 81,
                    "name": "fluoride",
                    "casNumber": "016984-48-8    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to non-agricultural soil"
                },
                "direction": "Output",
                "magnitude": 4.19277670940015E-16,
                "result": 4.19277670940015E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 82,
                    "name": "fluoride",
                    "casNumber": "016984-48-8    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 8.43700548368388E-14,
                "result": 8.43700548368388E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 83,
                    "name": "fluorine",
                    "casNumber": "007782-41-4    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 3.91557201327652E-15,
                "result": 3.91557201327652E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 84,
                    "name": "fluorine",
                    "casNumber": "007782-41-4    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 3.57018601131413E-12,
                "result": 3.57018601131413E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 86,
                    "name": "sodium",
                    "casNumber": "007440-23-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to non-agricultural soil"
                },
                "direction": "Output",
                "magnitude": 5.32622423166236E-13,
                "result": 5.32622423166236E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 87,
                    "name": "formaldehyde",
                    "casNumber": "000050-00-0    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.26431453873285E-10,
                "result": 1.26431453873285E-10,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 90,
                    "name": "granite",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable material resources from ground"
                },
                "direction": "Input",
                "magnitude": 1.29129273063262E-26,
                "result": 1.29129273063262E-26,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 92,
                    "name": "helium",
                    "casNumber": "007440-59-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.24238020591343E-14,
                "result": 1.24238020591343E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 93,
                    "name": "hexamethylene diamine",
                    "casNumber": "000124-09-4    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 4.1321367380244E-21,
                "result": 4.1321367380244E-21,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 94,
                    "name": "hexane",
                    "casNumber": "000110-54-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.1387026759568E-13,
                "result": 1.1387026759568E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 95,
                    "name": "hydrogen",
                    "casNumber": "001333-74-0    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 3.39839595135877E-13,
                "result": 3.39839595135877E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 96,
                    "name": "hydrogen arsenide",
                    "casNumber": "007784-42-1    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 8.28682137754131E-19,
                "result": 8.28682137754131E-19,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 97,
                    "name": "hydrogen peroxide",
                    "casNumber": "007722-84-1    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 1.06978430620893E-11,
                "result": 1.06978430620893E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 98,
                    "name": "hydrogen sulfide",
                    "casNumber": "007783-06-4    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.47386959826929E-08,
                "result": 1.47386959826929E-08,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 101,
                    "name": "hydrogen-3",
                    "casNumber": "010028-17-8    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 7.97411215514138E-09,
                "result": 7.97411215514138E-09,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 102,
                    "name": "hydrogen-3",
                    "casNumber": "010028-17-8    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 2.38329560519381E-07,
                "result": 2.38329560519381E-07,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 103,
                    "name": "hydrogen-3",
                    "casNumber": "010028-17-8    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 3.82514905049593E-08,
                "result": 3.82514905049593E-08,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 104,
                    "name": "hydroxide",
                    "casNumber": "014280-30-9    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 1.9377366786298E-13,
                "result": 1.9377366786298E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 105,
                    "name": "nitrous oxide",
                    "casNumber": "010024-97-2    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 9.36827021186902E-06,
                "result": 9.36827021186902E-06,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 111,
                    "name": "xenon-131",
                    "casNumber": "014683-11-5    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.71960312996827E-09,
                "result": 1.71960312996827E-09,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 112,
                    "name": "xenon-133",
                    "casNumber": "014932-42-4    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 2.9107888163147E-08,
                "result": 2.9107888163147E-08,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 113,
                    "name": "xenon-135",
                    "casNumber": "014995-62-1    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 5.02553248515328E-08,
                "result": 5.02553248515328E-08,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 114,
                    "name": "zinc",
                    "casNumber": "007440-66-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.61697434174184E-13,
                "result": 1.61697434174184E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 115,
                    "name": "zinc",
                    "casNumber": "007440-66-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 5.16607422718137E-09,
                "result": 5.16607422718137E-09,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 116,
                    "name": "zinc",
                    "casNumber": "007440-66-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to non-agricultural soil"
                },
                "direction": "Output",
                "magnitude": 9.3624658532805E-17,
                "result": 9.3624658532805E-17,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 117,
                    "name": "zinc",
                    "casNumber": "007440-66-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 9.86918298603339E-16,
                "result": 9.86918298603339E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 121,
                    "name": "particles (PM2.5 - PM10)",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 3.87461739012992E-05,
                "result": 3.87461739012992E-05,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 122,
                    "name": "sodium",
                    "casNumber": "007440-23-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 0.000184002218252489,
                "result": 0.000184002218252489,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 124,
                    "name": "chloride",
                    "casNumber": "016887-00-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 9.4112249540012E-05,
                "result": 9.4112249540012E-05,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 126,
                    "name": "chromium VI",
                    "casNumber": "018540-29-9    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 6.64572339932178E-13,
                "result": 6.64572339932178E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 127,
                    "name": "acetic acid",
                    "casNumber": "000064-19-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 6.19820510703659E-18,
                "result": 6.19820510703659E-18,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 128,
                    "name": "acetone",
                    "casNumber": "000067-64-1    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 8.38360591334447E-15,
                "result": 8.38360591334447E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 129,
                    "name": "acetone",
                    "casNumber": "000067-64-1    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 2.60568389295252E-11,
                "result": 2.60568389295252E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 130,
                    "name": "bis(n-octyl) phthalate",
                    "casNumber": "000117-84-0    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 2.96197013025715E-16,
                "result": 2.96197013025715E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 131,
                    "name": "ammonia",
                    "casNumber": "007664-41-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to non-agricultural soil"
                },
                "direction": "Output",
                "magnitude": 1.14618657424281E-13,
                "result": 1.14618657424281E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 132,
                    "name": "ammonia",
                    "casNumber": "007664-41-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 1.2103148142309E-17,
                "result": 1.2103148142309E-17,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 133,
                    "name": "ammonium",
                    "casNumber": "014798-03-9    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 7.08854881715831E-14,
                "result": 7.08854881715831E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 134,
                    "name": "tar",
                    "casNumber": "008007-45-2    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 7.26827049567473E-10,
                "result": 7.26827049567473E-10,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 135,
                    "name": "tin oxide",
                    "casNumber": "001332-29-2    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 4.95856408562927E-22,
                "result": 4.95856408562927E-22,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 136,
                    "name": "iodine-131",
                    "casNumber": "010043-66-0    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 5.11477073037742E-12,
                "result": 5.11477073037742E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 139,
                    "name": "iron",
                    "casNumber": "007439-89-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": -1.71141043288686E-13,
                "result": -1.71141043288686E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 140,
                    "name": "iron",
                    "casNumber": "007439-89-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 4.46166283229121E-07,
                "result": 4.46166283229121E-07,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 142,
                    "name": "iron",
                    "casNumber": "007439-89-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to non-agricultural soil"
                },
                "direction": "Output",
                "magnitude": 6.71180182923339E-15,
                "result": 6.71180182923339E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 143,
                    "name": "iron",
                    "casNumber": "007439-89-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 5.75533388520264E-16,
                "result": 5.75533388520264E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 144,
                    "name": "iron",
                    "casNumber": "007439-89-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable element resources from ground"
                },
                "direction": "Input",
                "magnitude": -2.46680255342679E-09,
                "result": -2.46680255342679E-09,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 147,
                    "name": "isoprene",
                    "casNumber": "000078-79-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 0.0211812054386074,
                "result": 0.0211812054386074,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 148,
                    "name": "krypton-85",
                    "casNumber": "013983-27-2    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 2.11299433357798E-06,
                "result": 2.11299433357798E-06,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 152,
                    "name": "mercury",
                    "casNumber": "007439-97-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to agricultural soil"
                },
                "direction": "Output",
                "magnitude": 6.44554725542677E-17,
                "result": 6.44554725542677E-17,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 154,
                    "name": "methane",
                    "casNumber": "000074-82-8    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 7.91846757174786E-06,
                "result": 7.91846757174786E-06,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 156,
                    "name": "dichloromethane",
                    "casNumber": "000075-09-2    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.2167317193271E-11,
                "result": 1.2167317193271E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 158,
                    "name": "bentonite",
                    "casNumber": "001302-78-9    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable material resources from ground"
                },
                "direction": "Input",
                "magnitude": 2.18950154066461E-10,
                "result": 2.18950154066461E-10,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 161,
                    "name": "cadmium",
                    "casNumber": "007440-43-9    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to agricultural soil"
                },
                "direction": "Output",
                "magnitude": 2.77592344470247E-16,
                "result": 2.77592344470247E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 162,
                    "name": "cadmium",
                    "casNumber": "007440-43-9    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 2.01021486516993E-12,
                "result": 2.01021486516993E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 163,
                    "name": "R-40",
                    "casNumber": "000074-87-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 2.15047146443327E-15,
                "result": 2.15047146443327E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 164,
                    "name": "R-40",
                    "casNumber": "000074-87-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 1.05244400187163E-13,
                "result": 1.05244400187163E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 165,
                    "name": "FC-14",
                    "casNumber": "000075-73-0    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 4.35156196563699E-14,
                "result": 4.35156196563699E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 166,
                    "name": "anthracene",
                    "casNumber": "000120-12-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 1.43901062841002E-17,
                "result": 1.43901062841002E-17,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 168,
                    "name": "antimony",
                    "casNumber": "007440-36-0    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.53681169764221E-13,
                "result": 1.53681169764221E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 169,
                    "name": "antimony",
                    "casNumber": "007440-36-0    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 1.39619001784489E-10,
                "result": 1.39619001784489E-10,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 172,
                    "name": "cobalt-58",
                    "casNumber": "013981-38-9    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 8.51442703263014E-12,
                "result": 8.51442703263014E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 173,
                    "name": "cobalt-60",
                    "casNumber": "010198-40-0    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.06618062214835E-13,
                "result": 1.06618062214835E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 174,
                    "name": "ammonia",
                    "casNumber": "007664-41-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 7.49888377808191E-06,
                "result": 7.49888377808191E-06,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 176,
                    "name": "nickel",
                    "casNumber": "007440-02-0    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.84933650349087E-13,
                "result": 1.84933650349087E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 177,
                    "name": "nickel",
                    "casNumber": "007440-02-0    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 1.87798648603595E-16,
                "result": 1.87798648603595E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 178,
                    "name": "nickel",
                    "casNumber": "007440-02-0    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable element resources from ground"
                },
                "direction": "Input",
                "magnitude": -1.1914370166548E-10,
                "result": -1.1914370166548E-10,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 180,
                    "name": "nitrate",
                    "casNumber": "014797-55-8    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 3.37788750565925E-19,
                "result": 3.37788750565925E-19,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 181,
                    "name": "nitrite",
                    "casNumber": "014797-65-0    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 5.84895178076319E-17,
                "result": 5.84895178076319E-17,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 183,
                    "name": "nitrite",
                    "casNumber": "014797-65-0    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 1.58627921284717E-16,
                "result": 1.58627921284717E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 184,
                    "name": "dinitrogen",
                    "casNumber": "007727-37-9    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Renewable element resources from air"
                },
                "direction": "Input",
                "magnitude": 4.00556913811314E-14,
                "result": 4.00556913811314E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 185,
                    "name": "nitrogen dioxide",
                    "casNumber": "010102-44-0    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 0.000678923129321707,
                "result": 0.000678923129321707,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 186,
                    "name": "nitrogen monoxide",
                    "casNumber": "010102-43-9    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 4.57224246436025E-14,
                "result": 4.57224246436025E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 187,
                    "name": "o-cresol",
                    "casNumber": "000095-48-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 7.49592032874988E-11,
                "result": 7.49592032874988E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 188,
                    "name": "octane",
                    "casNumber": "000111-65-9    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 6.20913507419887E-15,
                "result": 6.20913507419887E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 190,
                    "name": "oxygen",
                    "casNumber": "007782-44-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 3.82848490252821E-10,
                "result": 3.82848490252821E-10,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 193,
                    "name": "phenol",
                    "casNumber": "000108-95-2    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 1.44440098496915E-09,
                "result": 1.44440098496915E-09,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 194,
                    "name": "phenol",
                    "casNumber": "000108-95-2    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 1.61663106376976E-14,
                "result": 1.61663106376976E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 197,
                    "name": "phosphate",
                    "casNumber": "014265-44-2    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 2.19335582850652E-09,
                "result": 2.19335582850652E-09,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 199,
                    "name": "phosphate",
                    "casNumber": "014265-44-2    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 8.7215273907343E-18,
                "result": 8.7215273907343E-18,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 200,
                    "name": "phosphine",
                    "casNumber": "007803-51-2    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.03613398685137E-16,
                "result": 1.03613398685137E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 203,
                    "name": "potassium",
                    "casNumber": "007440-09-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 3.69414152749005E-13,
                "result": 3.69414152749005E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 211,
                    "name": "arsenic trioxide",
                    "casNumber": "001327-53-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 9.9779515061565E-21,
                "result": 9.9779515061565E-21,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 212,
                    "name": "barium sulfate",
                    "casNumber": "007727-43-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable material resources from ground"
                },
                "direction": "Input",
                "magnitude": 1.02472574640623E-16,
                "result": 1.02472574640623E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 213,
                    "name": "bauxite",
                    "casNumber": "001318-16-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable material resources from ground"
                },
                "direction": "Input",
                "magnitude": 9.27228389817585E-10,
                "result": 9.27228389817585E-10,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 214,
                    "name": "biological oxygen demand",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 7.76655439758559E-07,
                "result": 7.76655439758559E-07,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 215,
                    "name": "biological oxygen demand",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 5.71062654722811E-15,
                "result": 5.71062654722811E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 216,
                    "name": "polychlorinated biphenyls",
                    "casNumber": "001336-36-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 5.03099405590864E-19,
                "result": 5.03099405590864E-19,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 218,
                    "name": "calcium chloride",
                    "casNumber": "010043-52-4    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable material resources from ground"
                },
                "direction": "Input",
                "magnitude": 1.04917616061689E-14,
                "result": 1.04917616061689E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 219,
                    "name": "chemical oxygen demand",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 1.80127986503036E-06,
                "result": 1.80127986503036E-06,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 220,
                    "name": "chemical oxygen demand",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 2.60257132704187E-13,
                "result": 2.60257132704187E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 222,
                    "name": "colemanite",
                    "casNumber": "001318-33-8    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable material resources from ground"
                },
                "direction": "Input",
                "magnitude": 1.20605724597089E-10,
                "result": 1.20605724597089E-10,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 224,
                    "name": "fluorspar",
                    "casNumber": "014542-23-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable material resources from ground"
                },
                "direction": "Input",
                "magnitude": 1.37389233567121E-11,
                "result": 1.37389233567121E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 225,
                    "name": "gypsum",
                    "casNumber": "007778-18-9    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable material resources from ground"
                },
                "direction": "Input",
                "magnitude": 1.54203880012334E-09,
                "result": 1.54203880012334E-09,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 226,
                    "name": "baryte",
                    "casNumber": "007727-43-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable material resources from ground"
                },
                "direction": "Input",
                "magnitude": 6.18568191197004E-12,
                "result": 6.18568191197004E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 227,
                    "name": "hydrogen chloride",
                    "casNumber": "007647-01-0    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 1.01661397253194E-14,
                "result": 1.01661397253194E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 228,
                    "name": "hydrogen fluoride",
                    "casNumber": "007664-39-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.63078728176022E-09,
                "result": 1.63078728176022E-09,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 229,
                    "name": "decane",
                    "casNumber": "000124-18-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 9.03048264552363E-07,
                "result": 9.03048264552363E-07,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 230,
                    "name": "decane",
                    "casNumber": "000124-18-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to non-agricultural soil"
                },
                "direction": "Output",
                "magnitude": 1.76283818222248E-14,
                "result": 1.76283818222248E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 231,
                    "name": "decane",
                    "casNumber": "000124-18-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 1.36502272570203E-13,
                "result": 1.36502272570203E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 232,
                    "name": "polycyclic aromatic hydrocarbons",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 4.80654128241686E-15,
                "result": 4.80654128241686E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 234,
                    "name": "polycyclic aromatic hydrocarbons",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to non-agricultural soil"
                },
                "direction": "Output",
                "magnitude": 1.0126264576986E-15,
                "result": 1.0126264576986E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 237,
                    "name": "protactinium-234",
                    "casNumber": "015100-28-4    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.13100036668596E-16,
                "result": 1.13100036668596E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 238,
                    "name": "CFC-114",
                    "casNumber": "000076-14-2    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 4.5065715409284E-16,
                "result": 4.5065715409284E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 240,
                    "name": "radium-226",
                    "casNumber": "013982-63-3    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 3.5618636221635E-09,
                "result": 3.5618636221635E-09,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 243,
                    "name": "radium-228",
                    "casNumber": "015262-20-1    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 4.81810670010379E-22,
                "result": 4.81810670010379E-22,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 244,
                    "name": "scandium",
                    "casNumber": "007440-20-2    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 2.76702941014378E-19,
                "result": 2.76702941014378E-19,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 246,
                    "name": "selenium",
                    "casNumber": "007782-49-2    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 2.87267393891858E-11,
                "result": 2.87267393891858E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 248,
                    "name": "selenium",
                    "casNumber": "007782-49-2    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to non-agricultural soil"
                },
                "direction": "Output",
                "magnitude": 1.28403191021167E-18,
                "result": 1.28403191021167E-18,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 250,
                    "name": "silver-110",
                    "casNumber": "014391-76-5    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 1.92455627643361E-12,
                "result": 1.92455627643361E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 251,
                    "name": "styrene",
                    "casNumber": "000100-42-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 6.51378616029615E-16,
                "result": 6.51378616029615E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 253,
                    "name": "sulfur",
                    "casNumber": "007704-34-9    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 6.90363273492182E-09,
                "result": 6.90363273492182E-09,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 254,
                    "name": "tert-butyl methyl ether",
                    "casNumber": "001634-04-4    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.42012266519178E-16,
                "result": 1.42012266519178E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 260,
                    "name": "thallium",
                    "casNumber": "007440-28-0    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 3.02600889287935E-16,
                "result": 3.02600889287935E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 261,
                    "name": "thallium",
                    "casNumber": "007440-28-0    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 2.94201787558485E-11,
                "result": 2.94201787558485E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 265,
                    "name": "thorium-230",
                    "casNumber": "014269-63-7    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 3.94766220624141E-13,
                "result": 3.94766220624141E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 266,
                    "name": "thorium-230",
                    "casNumber": "014269-63-7    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 6.0541778710119E-11,
                "result": 6.0541778710119E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 269,
                    "name": "toluene",
                    "casNumber": "000108-88-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 4.1298685886987E-09,
                "result": 4.1298685886987E-09,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 270,
                    "name": "tin",
                    "casNumber": "007440-31-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 5.69512157884389E-10,
                "result": 5.69512157884389E-10,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 271,
                    "name": "tin",
                    "casNumber": "007440-31-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 1.20864999587213E-19,
                "result": 1.20864999587213E-19,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 273,
                    "name": "titanium",
                    "casNumber": "007440-32-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": -3.78611818395195E-15,
                "result": -3.78611818395195E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 274,
                    "name": "titanium",
                    "casNumber": "007440-32-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 2.14413203074387E-09,
                "result": 2.14413203074387E-09,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 275,
                    "name": "titanium",
                    "casNumber": "007440-32-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 1.22931067956226E-20,
                "result": 1.22931067956226E-20,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 276,
                    "name": "toluene",
                    "casNumber": "000108-88-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 9.61586025650734E-15,
                "result": 9.61586025650734E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 277,
                    "name": "2,4-dinitrotoluene",
                    "casNumber": "000121-14-2    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.13609813215343E-18,
                "result": 1.13609813215343E-18,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 278,
                    "name": "thorium-234",
                    "casNumber": "015065-10-8    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.1663261528155E-16,
                "result": 1.1663261528155E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 279,
                    "name": "thorium-234",
                    "casNumber": "015065-10-8    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 5.28504872729808E-13,
                "result": 5.28504872729808E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 281,
                    "name": "tin",
                    "casNumber": "007440-31-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 2.0478169507203E-14,
                "result": 2.0478169507203E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 282,
                    "name": "chromium",
                    "casNumber": "007440-47-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to agricultural soil"
                },
                "direction": "Output",
                "magnitude": 5.57218633051818E-19,
                "result": 5.57218633051818E-19,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 283,
                    "name": "chromium",
                    "casNumber": "007440-47-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 4.83884649301849E-12,
                "result": 4.83884649301849E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 288,
                    "name": "manganese",
                    "casNumber": "007439-96-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 2.76973980684691E-09,
                "result": 2.76973980684691E-09,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 289,
                    "name": "manganese",
                    "casNumber": "007439-96-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 1.61767215315378E-11,
                "result": 1.61767215315378E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 291,
                    "name": "manganese",
                    "casNumber": "007439-96-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to non-agricultural soil"
                },
                "direction": "Output",
                "magnitude": 9.54815054800106E-16,
                "result": 9.54815054800106E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 292,
                    "name": "carbon dioxide (biogenic)",
                    "casNumber": "000124-38-9    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 0.843238183108019,
                "result": 0.843238183108019,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 293,
                    "name": "uranium-235",
                    "casNumber": "015117-96-1    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 5.19266163618064E-13,
                "result": 5.19266163618064E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 294,
                    "name": "uranium-235",
                    "casNumber": "015117-96-1    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 9.56374273785514E-14,
                "result": 9.56374273785514E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 295,
                    "name": "uranium-238",
                    "casNumber": "007440-61-1    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 2.98647137137574E-12,
                "result": 2.98647137137574E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 298,
                    "name": "2-chloro-1-phenylethanone",
                    "casNumber": "000532-27-4    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 2.84024533038357E-17,
                "result": 2.84024533038357E-17,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 301,
                    "name": "carbon-14",
                    "casNumber": "014762-75-5    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 2.91148487729176E-11,
                "result": 2.91148487729176E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 302,
                    "name": "carbonate",
                    "casNumber": "003812-32-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 7.50635252395406E-13,
                "result": 7.50635252395406E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 304,
                    "name": "chromium",
                    "casNumber": "007440-47-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 6.34732815180177E-09,
                "result": 6.34732815180177E-09,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 305,
                    "name": "chromium",
                    "casNumber": "007440-47-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to non-agricultural soil"
                },
                "direction": "Output",
                "magnitude": 1.36392940132125E-16,
                "result": 1.36392940132125E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 306,
                    "name": "chromium",
                    "casNumber": "007440-47-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 1.33855281413848E-14,
                "result": 1.33855281413848E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 307,
                    "name": "chromium",
                    "casNumber": "007440-47-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable element resources from ground"
                },
                "direction": "Input",
                "magnitude": 4.87052901395822E-09,
                "result": 4.87052901395822E-09,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 308,
                    "name": "chromium III",
                    "casNumber": "016065-83-1    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to agricultural soil"
                },
                "direction": "Output",
                "magnitude": 6.44554738340034E-15,
                "result": 6.44554738340034E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 309,
                    "name": "chromium III",
                    "casNumber": "016065-83-1    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.16832460108467E-15,
                "result": 1.16832460108467E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 310,
                    "name": "pentane",
                    "casNumber": "000109-66-0    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 3.80657111267913E-13,
                "result": 3.80657111267913E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 311,
                    "name": "palladium",
                    "casNumber": "007440-05-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 2.90404696007048E-19,
                "result": 2.90404696007048E-19,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 312,
                    "name": "boron",
                    "casNumber": "007440-42-8    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 6.45212983243786E-14,
                "result": 6.45212983243786E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 313,
                    "name": "boron",
                    "casNumber": "007440-42-8    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 8.17852738108517E-09,
                "result": 8.17852738108517E-09,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 315,
                    "name": "boron",
                    "casNumber": "007440-42-8    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 6.4048119439378E-18,
                "result": 6.4048119439378E-18,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 316,
                    "name": "bromate",
                    "casNumber": "015541-45-4    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 1.46690854199866E-21,
                "result": 1.46690854199866E-21,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 317,
                    "name": "methyl ethyl ketone",
                    "casNumber": "000078-93-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 2.09755139801087E-13,
                "result": 2.09755139801087E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 319,
                    "name": "cumene",
                    "casNumber": "000098-82-8    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 2.16821574281318E-17,
                "result": 2.16821574281318E-17,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 320,
                    "name": "ammonia",
                    "casNumber": "007664-41-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 3.51474219440368E-05,
                "result": 3.51474219440368E-05,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 321,
                    "name": "ethyl benzene",
                    "casNumber": "000100-41-4    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 9.5172619038717E-16,
                "result": 9.5172619038717E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 324,
                    "name": "non-methane volatile organic compounds",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 0.00058931696115987,
                "result": 0.00058931696115987,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 325,
                    "name": "calcium",
                    "casNumber": "007440-70-2    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to non-agricultural soil"
                },
                "direction": "Output",
                "magnitude": 7.09158438207328E-11,
                "result": 7.09158438207328E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 328,
                    "name": "Docosane",
                    "casNumber": "000629-97-0    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Other emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 2.78828452637018E-12,
                "result": 2.78828452637018E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 330,
                    "name": "Water (sea water from technosphere, waste water)",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Other emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 1.53387037949923E-08,
                "result": 1.53387037949923E-08,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 336,
                    "name": "hexadecane",
                    "casNumber": "000544-76-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 1.57299751809805E-10,
                "result": 1.57299751809805E-10,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 337,
                    "name": "quartz sand",
                    "casNumber": "014808-60-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable material resources from ground"
                },
                "direction": "Input",
                "magnitude": 1.8980084634983E-09,
                "result": 1.8980084634983E-09,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 338,
                    "name": "raw pumice",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable material resources from ground"
                },
                "direction": "Input",
                "magnitude": 6.68496888537718E-11,
                "result": 6.68496888537718E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 341,
                    "name": "Radioactive isotopes (unspecific)",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Radioactive emissions to air"
                },
                "direction": "Output",
                "magnitude": 0.477586830961053,
                "result": 0.477586830961053,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 342,
                    "name": "Land Transformation",
                    "referenceFlowPropertyID": 28,
                    "flowTypeID": 2,
                    "category": "Transformation"
                },
                "direction": "Input",
                "magnitude": -1.4000073430871E-11,
                "result": -1.4000073430871E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 354,
                    "name": "Copper (+II)",
                    "casNumber": "015158-11-9    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Heavy metals to sea water"
                },
                "direction": "Output",
                "magnitude": 6.90471933180635E-15,
                "result": 6.90471933180635E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 358,
                    "name": "rhodium",
                    "casNumber": "007440-16-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable element resources from ground"
                },
                "direction": "Input",
                "magnitude": 3.16650125903434E-17,
                "result": 3.16650125903434E-17,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 359,
                    "name": "2-hexanone",
                    "casNumber": "000591-78-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 1.70142144049666E-11,
                "result": 1.70142144049666E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 360,
                    "name": "river water",
                    "casNumber": "007732-18-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Renewable material resources from water"
                },
                "direction": "Input",
                "magnitude": 0.111717712405382,
                "result": 0.111717712405382,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 361,
                    "name": "ruthenium",
                    "casNumber": "007440-18-8    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable element resources from ground"
                },
                "direction": "Input",
                "magnitude": 6.24828510858962E-17,
                "result": 6.24828510858962E-17,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 363,
                    "name": "sea water",
                    "casNumber": "007732-18-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Renewable material resources from water"
                },
                "direction": "Input",
                "magnitude": 1.54812881859602E-08,
                "result": 1.54812881859602E-08,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 364,
                    "name": "silicon",
                    "casNumber": "007440-21-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable element resources from ground"
                },
                "direction": "Input",
                "magnitude": 2.75820127263128E-13,
                "result": 2.75820127263128E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 365,
                    "name": "silver",
                    "casNumber": "007440-22-4    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable element resources from ground"
                },
                "direction": "Input",
                "magnitude": -3.21121186679806E-13,
                "result": -3.21121186679806E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 367,
                    "name": "sodium chloride",
                    "casNumber": "007647-14-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable material resources from ground"
                },
                "direction": "Input",
                "magnitude": 4.04496581848339E-10,
                "result": 4.04496581848339E-10,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 368,
                    "name": "sodium nitrate",
                    "casNumber": "007631-99-4    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable material resources from ground"
                },
                "direction": "Input",
                "magnitude": 4.90691237640397E-23,
                "result": 4.90691237640397E-23,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 369,
                    "name": "sodium sulfate",
                    "casNumber": "007757-82-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable material resources from ground"
                },
                "direction": "Input",
                "magnitude": 4.63083422339795E-15,
                "result": 4.63083422339795E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 370,
                    "name": "soil",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable material resources from ground"
                },
                "direction": "Input",
                "magnitude": 1.16231423395959E-06,
                "result": 1.16231423395959E-06,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 377,
                    "name": "Erosion Resistance",
                    "referenceFlowPropertyID": 4,
                    "flowTypeID": 2,
                    "category": "Transformation"
                },
                "direction": "Input",
                "magnitude": -5.94642729301738E-12,
                "result": -5.94642729301738E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 385,
                    "name": "stone",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable material resources from ground"
                },
                "direction": "Input",
                "magnitude": 6.34810549810641E-12,
                "result": 6.34810549810641E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 386,
                    "name": "sulfur",
                    "casNumber": "007704-34-9    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable element resources from ground"
                },
                "direction": "Input",
                "magnitude": 1.51332931409174E-14,
                "result": 1.51332931409174E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 387,
                    "name": "talc",
                    "casNumber": "014807-96-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable material resources from ground"
                },
                "direction": "Input",
                "magnitude": 1.14644259119709E-13,
                "result": 1.14644259119709E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 388,
                    "name": "tantalum",
                    "casNumber": "007440-25-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable element resources from ground"
                },
                "direction": "Input",
                "magnitude": 3.10913638932923E-10,
                "result": 3.10913638932923E-10,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 391,
                    "name": "Lead-210/kg",
                    "casNumber": "014255-04-0    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Other emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 2.70742755913738E-19,
                "result": 2.70742755913738E-19,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 395,
                    "name": "Water (river water from technosphere, waste water)",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Other emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 1.95943295798684E-07,
                "result": 1.95943295798684E-07,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 396,
                    "name": "nitrogen trifluoride",
                    "casNumber": "007783-54-2    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 2.63719062676407E-16,
                "result": 2.63719062676407E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 397,
                    "name": "Waste (deposited)",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Stockpile goods"
                },
                "direction": "Output",
                "magnitude": 2.83813461239218E-08,
                "result": 2.83813461239218E-08,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 398,
                    "name": "arsenic V",
                    "casNumber": "061805-96-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 6.10460016709192E-12,
                "result": 6.10460016709192E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 400,
                    "name": "High radioactive waste",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Radioactive waste"
                },
                "direction": "Output",
                "magnitude": 3.74730822422174E-14,
                "result": 3.74730822422174E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 404,
                    "name": "magnesium",
                    "casNumber": "007439-95-4    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 9.25367330400354E-11,
                "result": 9.25367330400354E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 405,
                    "name": "magnesium",
                    "casNumber": "007439-95-4    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to non-agricultural soil"
                },
                "direction": "Output",
                "magnitude": 1.14915399695635E-13,
                "result": 1.14915399695635E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 408,
                    "name": "sulfur",
                    "casNumber": "007704-34-9    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 5.12302065697971E-17,
                "result": 5.12302065697971E-17,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 410,
                    "name": "tar",
                    "casNumber": "008007-45-2    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 1.03971008425099E-11,
                "result": 1.03971008425099E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 412,
                    "name": "acid (as H+)",
                    "casNumber": "012408-02-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 6.58091194452989E-17,
                "result": 6.58091194452989E-17,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 414,
                    "name": "tin",
                    "casNumber": "007440-31-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable element resources from ground"
                },
                "direction": "Input",
                "magnitude": 5.55225973582495E-16,
                "result": 5.55225973582495E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 415,
                    "name": "titanium",
                    "casNumber": "007440-32-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable element resources from ground"
                },
                "direction": "Input",
                "magnitude": 1.07503247798537E-10,
                "result": 1.07503247798537E-10,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 416,
                    "name": "Water (rain water)",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Water"
                },
                "direction": "Input",
                "magnitude": 1.03142407790638E-07,
                "result": 1.03142407790638E-07,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 426,
                    "name": "Pit Methane (in MJ)",
                    "casNumber": "000074-82-8    ",
                    "referenceFlowPropertyID": 24,
                    "flowTypeID": 2,
                    "category": "Natural gas (resource)"
                },
                "direction": "Input",
                "magnitude": 1.76102464698344E-09,
                "result": 1.76102464698344E-09,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 431,
                    "name": "antimony-125",
                    "casNumber": "014234-35-6    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 1.7056463529779E-12,
                "result": 1.7056463529779E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 433,
                    "name": "phosphate",
                    "casNumber": "014265-44-2    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to non-agricultural soil"
                },
                "direction": "Output",
                "magnitude": 8.97465983097206E-14,
                "result": 8.97465983097206E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 438,
                    "name": "arsenic V",
                    "casNumber": "061805-96-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to non-agricultural soil"
                },
                "direction": "Output",
                "magnitude": 1.13806192826444E-17,
                "result": 1.13806192826444E-17,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 439,
                    "name": "Tantalum",
                    "casNumber": "007440-25-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Heavy metals to fresh water"
                },
                "direction": "Output",
                "magnitude": 1.51617116003669E-19,
                "result": 1.51617116003669E-19,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 440,
                    "name": "Groundwater Replenishment",
                    "referenceFlowPropertyID": 11,
                    "flowTypeID": 2,
                    "category": "Transformation"
                },
                "direction": "Input",
                "magnitude": -2.10923662578916E-10,
                "result": -2.10923662578916E-10,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 441,
                    "name": "Ammonium chloride",
                    "casNumber": "012125-02-9    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Other emissions to air"
                },
                "direction": "Output",
                "magnitude": 2.20010792114403E-11,
                "result": 2.20010792114403E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 449,
                    "name": "uranium",
                    "casNumber": "007440-61-1    ",
                    "referenceFlowPropertyID": 24,
                    "flowTypeID": 2,
                    "category": "Non-renewable energy resources from ground"
                },
                "direction": "Input",
                "magnitude": 8.6451555675781E-08,
                "result": 8.6451555675781E-08,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 458,
                    "name": "Nickel (+II)",
                    "casNumber": "014701-22-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Heavy metals to sea water"
                },
                "direction": "Output",
                "magnitude": 2.60664964650814E-15,
                "result": 2.60664964650814E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 465,
                    "name": "Nickel (+II)",
                    "casNumber": "014701-22-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Heavy metals to air"
                },
                "direction": "Output",
                "magnitude": 1.64532574282356E-10,
                "result": 1.64532574282356E-10,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 466,
                    "name": "Mechanical Filtration",
                    "referenceFlowPropertyID": 46,
                    "flowTypeID": 2,
                    "category": "Occupation"
                },
                "direction": "Input",
                "magnitude": 1.70558597223604E-07,
                "result": 1.70558597223604E-07,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 476,
                    "name": "Clean gas",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Other emissions to air"
                },
                "direction": "Output",
                "magnitude": 3.51266728637499E-10,
                "result": 3.51266728637499E-10,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 480,
                    "name": "Mechanical Filtration",
                    "referenceFlowPropertyID": 2,
                    "flowTypeID": 2,
                    "category": "Transformation"
                },
                "direction": "Input",
                "magnitude": -2.58250815145849E-10,
                "result": -2.58250815145849E-10,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 482,
                    "name": "nitrate",
                    "casNumber": "014797-55-8    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 4.06274753474475E-07,
                "result": 4.06274753474475E-07,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 483,
                    "name": "uranium-234",
                    "casNumber": "013966-29-5    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.75531395503365E-12,
                "result": 1.75531395503365E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 484,
                    "name": "uranium-238",
                    "casNumber": "007440-61-1    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 4.32279234641531E-11,
                "result": 4.32279234641531E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 485,
                    "name": "uranium-238",
                    "casNumber": "007440-61-1    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 4.6557528443179E-14,
                "result": 4.6557528443179E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 487,
                    "name": "vanadium",
                    "casNumber": "007440-62-2    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.73080836034933E-14,
                "result": 1.73080836034933E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 488,
                    "name": "vanadium",
                    "casNumber": "007440-62-2    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 7.07584747047748E-11,
                "result": 7.07584747047748E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 490,
                    "name": "vanadium",
                    "casNumber": "007440-62-2    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 3.18174528827878E-17,
                "result": 3.18174528827878E-17,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 491,
                    "name": "vinyl acetate",
                    "casNumber": "000108-05-4    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 3.08369493013073E-17,
                "result": 3.08369493013073E-17,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 492,
                    "name": "bromine",
                    "casNumber": "007726-95-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.56203699731787E-14,
                "result": 1.56203699731787E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 493,
                    "name": "bromine",
                    "casNumber": "007726-95-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 5.58260007987806E-07,
                "result": 5.58260007987806E-07,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 498,
                    "name": "total organic carbon",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 4.53989476272194E-12,
                "result": 4.53989476272194E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 499,
                    "name": "total organic carbon",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 5.71062654722811E-15,
                "result": 5.71062654722811E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 500,
                    "name": "cresol",
                    "casNumber": "001319-77-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 1.15699828664683E-19,
                "result": 1.15699828664683E-19,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 501,
                    "name": "cresol",
                    "casNumber": "001319-77-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 8.88409398675244E-20,
                "result": 8.88409398675244E-20,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 502,
                    "name": "m-cresol",
                    "casNumber": "000108-39-4    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 8.48966390872783E-18,
                "result": 8.48966390872783E-18,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 503,
                    "name": "chromium III",
                    "casNumber": "016065-83-1    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 6.88794185208089E-14,
                "result": 6.88794185208089E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 504,
                    "name": "chromium III",
                    "casNumber": "016065-83-1    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to non-agricultural soil"
                },
                "direction": "Output",
                "magnitude": 7.56726944988686E-17,
                "result": 7.56726944988686E-17,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 505,
                    "name": "chromium VI",
                    "casNumber": "018540-29-9    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 2.47966879701315E-11,
                "result": 2.47966879701315E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 507,
                    "name": "sulfide",
                    "casNumber": "018496-25-8    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 2.12303887275852E-10,
                "result": 2.12303887275852E-10,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 508,
                    "name": "sulfide",
                    "casNumber": "018496-25-8    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 4.80544358648798E-13,
                "result": 4.80544358648798E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 509,
                    "name": "para-cresol",
                    "casNumber": "000106-44-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 8.08748883153756E-11,
                "result": 8.08748883153756E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 511,
                    "name": "feldspar",
                    "casNumber": "012168-80-8    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable material resources from ground"
                },
                "direction": "Input",
                "magnitude": 9.09070082365367E-25,
                "result": 9.09070082365367E-25,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 512,
                    "name": "lead",
                    "casNumber": "007439-92-1    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 6.86399521058268E-12,
                "result": 6.86399521058268E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 513,
                    "name": "lead",
                    "casNumber": "007439-92-1    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 1.49511486324957E-09,
                "result": 1.49511486324957E-09,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 514,
                    "name": "lead",
                    "casNumber": "007439-92-1    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to non-agricultural soil"
                },
                "direction": "Output",
                "magnitude": 2.57703271294476E-17,
                "result": 2.57703271294476E-17,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 515,
                    "name": "lead",
                    "casNumber": "007439-92-1    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 1.44593305827927E-15,
                "result": 1.44593305827927E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 516,
                    "name": "lead-210",
                    "casNumber": "014255-04-0    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 2.6316197760733E-13,
                "result": 2.6316197760733E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 518,
                    "name": "ethane",
                    "casNumber": "000074-84-0    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 2.05464159565086E-12,
                "result": 2.05464159565086E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 521,
                    "name": "strontium",
                    "casNumber": "007440-24-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to non-agricultural soil"
                },
                "direction": "Output",
                "magnitude": 2.36564828251897E-14,
                "result": 2.36564828251897E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 522,
                    "name": "strontium",
                    "casNumber": "007440-24-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 2.13669648796206E-16,
                "result": 2.13669648796206E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 524,
                    "name": "strontium-90",
                    "casNumber": "010098-97-2    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 2.99649693518346E-12,
                "result": 2.99649693518346E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 525,
                    "name": "chloride",
                    "casNumber": "016887-00-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 6.46260832356395E-10,
                "result": 6.46260832356395E-10,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 526,
                    "name": "zinc oxide",
                    "casNumber": "001314-13-2    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 9.92745851310361E-22,
                "result": 9.92745851310361E-22,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 527,
                    "name": "sulfate",
                    "casNumber": "014808-79-8    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 3.23566726889775E-15,
                "result": 3.23566726889775E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 528,
                    "name": "benzo[g,h,i]perylene",
                    "casNumber": "000191-24-2    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 2.27381775037116E-16,
                "result": 2.27381775037116E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 529,
                    "name": "benzo[k]fluoranthene",
                    "casNumber": "000207-08-9    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 9.25854904922873E-16,
                "result": 9.25854904922873E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 530,
                    "name": "benzo[k]fluoranthene",
                    "casNumber": "000207-08-9    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 2.34779493753207E-20,
                "result": 2.34779493753207E-20,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 531,
                    "name": "benzo[k]fluoranthene",
                    "casNumber": "000207-08-9    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 6.52143087903438E-19,
                "result": 6.52143087903438E-19,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 532,
                    "name": "n-butane",
                    "casNumber": "000106-97-8    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 6.89433515728671E-13,
                "result": 6.89433515728671E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 535,
                    "name": "tungsten",
                    "casNumber": "007440-33-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 4.16263060828021E-15,
                "result": 4.16263060828021E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 537,
                    "name": "zinc",
                    "casNumber": "007440-66-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to agricultural soil"
                },
                "direction": "Output",
                "magnitude": 2.57981095540799E-14,
                "result": 2.57981095540799E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 538,
                    "name": "barium",
                    "casNumber": "007440-39-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 4.20459254551171E-14,
                "result": 4.20459254551171E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 540,
                    "name": "copper",
                    "casNumber": "007440-50-8    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to non-agricultural soil"
                },
                "direction": "Output",
                "magnitude": 1.7878501339244E-15,
                "result": 1.7878501339244E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 541,
                    "name": "methacrylic acid",
                    "casNumber": "000079-41-4    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 8.11498665823876E-17,
                "result": 8.11498665823876E-17,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 542,
                    "name": "sulfur trioxide",
                    "casNumber": "007446-11-9    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 7.56181023058464E-18,
                "result": 7.56181023058464E-18,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 543,
                    "name": "sulfite",
                    "casNumber": "014265-45-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 1.65322790944198E-14,
                "result": 1.65322790944198E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 545,
                    "name": "antimony-124",
                    "casNumber": "014683-10-4    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 5.1792950449973E-14,
                "result": 5.1792950449973E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 546,
                    "name": "antimony-124",
                    "casNumber": "014683-10-4    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 1.49808507848395E-12,
                "result": 1.49808507848395E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 548,
                    "name": "basalt",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable material resources from ground"
                },
                "direction": "Input",
                "magnitude": 7.7681364246199E-11,
                "result": 7.7681364246199E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 552,
                    "name": "n-butyl-acetate",
                    "casNumber": "000123-86-4    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 8.17130039944323E-16,
                "result": 8.17130039944323E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 556,
                    "name": "sulfate",
                    "casNumber": "014808-79-8    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to non-agricultural soil"
                },
                "direction": "Output",
                "magnitude": 6.13035547285015E-15,
                "result": 6.13035547285015E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 558,
                    "name": "curium",
                    "casNumber": "007440-51-9    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 7.3265077733534E-14,
                "result": 7.3265077733534E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 560,
                    "name": "butadiene",
                    "casNumber": "000106-99-0    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 3.00208074751936E-13,
                "result": 3.00208074751936E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 562,
                    "name": "HFC-245fa",
                    "casNumber": "000460-73-1    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 5.23603549350933E-17,
                "result": 5.23603549350933E-17,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 566,
                    "name": "butene",
                    "casNumber": "025167-67-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 4.44015633652845E-17,
                "result": 4.44015633652845E-17,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 572,
                    "name": "cesium-134",
                    "casNumber": "013967-70-9    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 2.42803769899856E-14,
                "result": 2.42803769899856E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 573,
                    "name": "cesium-134",
                    "casNumber": "013967-70-9    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 3.97159696629408E-12,
                "result": 3.97159696629408E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 574,
                    "name": "cesium-134",
                    "casNumber": "013967-70-9    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 3.49727913188199E-13,
                "result": 3.49727913188199E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 576,
                    "name": "cesium-137",
                    "casNumber": "010045-97-3    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 4.07640516939304E-14,
                "result": 4.07640516939304E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 577,
                    "name": "cesium-137",
                    "casNumber": "010045-97-3    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 2.83970936714887E-11,
                "result": 2.83970936714887E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 578,
                    "name": "cesium-137",
                    "casNumber": "010045-97-3    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 4.67761083889217E-12,
                "result": 4.67761083889217E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 579,
                    "name": "chlorate",
                    "casNumber": "014866-68-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 2.95447776768745E-17,
                "result": 2.95447776768745E-17,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 581,
                    "name": "chlorine",
                    "casNumber": "007782-50-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.20507153913095E-14,
                "result": 1.20507153913095E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 582,
                    "name": "chlorine",
                    "casNumber": "007782-50-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 1.74821057799076E-13,
                "result": 1.74821057799076E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 583,
                    "name": "toluene",
                    "casNumber": "000108-88-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 3.18710076116947E-12,
                "result": 3.18710076116947E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 586,
                    "name": "biphenyl",
                    "casNumber": "000092-52-4    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 3.51114669530775E-14,
                "result": 3.51114669530775E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 587,
                    "name": "biphenyl",
                    "casNumber": "000092-52-4    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 7.93019492811552E-12,
                "result": 7.93019492811552E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 588,
                    "name": "acetophenone",
                    "casNumber": "000098-86-2    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 6.08623999367907E-17,
                "result": 6.08623999367907E-17,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 589,
                    "name": "chromium VI",
                    "casNumber": "018540-29-9    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to non-agricultural soil"
                },
                "direction": "Output",
                "magnitude": 8.87212885961016E-19,
                "result": 8.87212885961016E-19,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 593,
                    "name": "HFC-32",
                    "casNumber": "000075-10-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 4.41921395652187E-19,
                "result": 4.41921395652187E-19,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 594,
                    "name": "benzene",
                    "casNumber": "000071-43-2    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 1.57721085659078E-14,
                "result": 1.57721085659078E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 595,
                    "name": "beryllium",
                    "casNumber": "007440-41-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 2.91279825179352E-13,
                "result": 2.91279825179352E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 599,
                    "name": "Physicochemical Filtration",
                    "referenceFlowPropertyID": 22,
                    "flowTypeID": 2,
                    "category": "Occupation"
                },
                "direction": "Input",
                "magnitude": -2.8642755602936E-08,
                "result": -2.8642755602936E-08,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 609,
                    "name": "Erosion Resistance",
                    "referenceFlowPropertyID": 34,
                    "flowTypeID": 2,
                    "category": "Occupation"
                },
                "direction": "Input",
                "magnitude": 7.02318258516721E-10,
                "result": 7.02318258516721E-10,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 626,
                    "name": "Overburden (deposited)",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Stockpile goods"
                },
                "direction": "Output",
                "magnitude": 2.21428909941121E-07,
                "result": 2.21428909941121E-07,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 627,
                    "name": "zinc",
                    "casNumber": "007440-66-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable element resources from ground"
                },
                "direction": "Input",
                "magnitude": -1.68503848868775E-10,
                "result": -1.68503848868775E-10,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 631,
                    "name": "Oil sand (100% bitumen) (in MJ)",
                    "referenceFlowPropertyID": 24,
                    "flowTypeID": 2,
                    "category": "Crude oil (resource)"
                },
                "direction": "Input",
                "magnitude": -3.27589396063026E-10,
                "result": -3.27589396063026E-10,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 632,
                    "name": "Land Occupation",
                    "referenceFlowPropertyID": 29,
                    "flowTypeID": 2,
                    "category": "Occupation"
                },
                "direction": "Input",
                "magnitude": 3.5798153253053E-10,
                "result": 3.5798153253053E-10,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 652,
                    "name": "Water (evapotranspiration)",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Inorganic emissions to air"
                },
                "direction": "Output",
                "magnitude": 8.71993612109714E-08,
                "result": 8.71993612109714E-08,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 658,
                    "name": "arsenic V",
                    "casNumber": "061805-96-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 4.62662093479135E-15,
                "result": 4.62662093479135E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 660,
                    "name": "Yttrium",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Other emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 1.75603191054719E-11,
                "result": 1.75603191054719E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 662,
                    "name": "Nickel (+II)",
                    "casNumber": "014701-22-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Heavy metals to agricultural soil"
                },
                "direction": "Output",
                "magnitude": 3.22317164102271E-15,
                "result": 3.22317164102271E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 669,
                    "name": "Biotic Production",
                    "referenceFlowPropertyID": 6,
                    "flowTypeID": 2,
                    "category": "Occupation"
                },
                "direction": "Input",
                "magnitude": 3.29181643296915E-10,
                "result": 3.29181643296915E-10,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 689,
                    "name": "Nickel (+II)",
                    "casNumber": "014701-22-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Heavy metals to industrial soil"
                },
                "direction": "Output",
                "magnitude": 2.42610956713497E-15,
                "result": 2.42610956713497E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 694,
                    "name": "Radioactive tailings",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Radioactive waste"
                },
                "direction": "Output",
                "magnitude": 2.8556611594445E-11,
                "result": 2.8556611594445E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 705,
                    "name": "Groundwater Replenishment",
                    "referenceFlowPropertyID": 9,
                    "flowTypeID": 2,
                    "category": "Occupation"
                },
                "direction": "Input",
                "magnitude": 8.23719921566709E-08,
                "result": 8.23719921566709E-08,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 728,
                    "name": "Eicosane",
                    "casNumber": "000112-95-8    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Other emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 3.96779509042244E-11,
                "result": 3.96779509042244E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 740,
                    "name": "Medium radioactive wastes",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Radioactive waste"
                },
                "direction": "Output",
                "magnitude": 3.00928342623805E-13,
                "result": 3.00928342623805E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 743,
                    "name": "Radioactive emissions (general)",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Radioactive emissions to air"
                },
                "direction": "Output",
                "magnitude": 5.89233055697399E-10,
                "result": 5.89233055697399E-10,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 750,
                    "name": "Physicochemical Filtration",
                    "referenceFlowPropertyID": 35,
                    "flowTypeID": 2,
                    "category": "Transformation"
                },
                "direction": "Input",
                "magnitude": -4.98914691234577E-11,
                "result": -4.98914691234577E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 770,
                    "name": "Radioactive isotopes (unspecific)",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Radioactive emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 0.000683251508382966,
                "result": 0.000683251508382966,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 785,
                    "name": "Oil sand (10% bitumen) (in MJ)",
                    "referenceFlowPropertyID": 24,
                    "flowTypeID": 2,
                    "category": "Crude oil (resource)"
                },
                "direction": "Input",
                "magnitude": -3.75224201125679E-10,
                "result": -3.75224201125679E-10,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 799,
                    "name": "Lanthanides",
                    "casNumber": "007439-91-0    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Heavy metals to air"
                },
                "direction": "Output",
                "magnitude": 5.39128885952846E-19,
                "result": 5.39128885952846E-19,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 800,
                    "name": "arsenic V",
                    "casNumber": "061805-96-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 7.13081292758138E-10,
                "result": 7.13081292758138E-10,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 804,
                    "name": "Water (river water from technosphere, turbined)",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Other emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 0.143468276704608,
                "result": 0.143468276704608,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 807,
                    "name": "Tailings (deposited)",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Stockpile goods"
                },
                "direction": "Output",
                "magnitude": 3.6059521225361E-08,
                "result": 3.6059521225361E-08,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 810,
                    "name": "particles (PM10)",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 2.76016851683383E-13,
                "result": 2.76016851683383E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 813,
                    "name": "cyanide",
                    "casNumber": "000057-12-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.0426270533914E-14,
                "result": 1.0426270533914E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 815,
                    "name": "HCFC-140",
                    "casNumber": "000071-55-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 6.53664851399418E-14,
                "result": 6.53664851399418E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 833,
                    "name": "olivine",
                    "casNumber": "019086-72-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable material resources from ground"
                },
                "direction": "Input",
                "magnitude": 1.09736095732328E-17,
                "result": 1.09736095732328E-17,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 834,
                    "name": "osmium",
                    "casNumber": "007440-04-2    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable element resources from ground"
                },
                "direction": "Input",
                "magnitude": 1.28765335008097E-17,
                "result": 1.28765335008097E-17,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 835,
                    "name": "oxygen",
                    "casNumber": "007782-44-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Renewable element resources from air"
                },
                "direction": "Input",
                "magnitude": 9.23867041448922E-12,
                "result": 9.23867041448922E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 838,
                    "name": "palladium",
                    "casNumber": "007440-05-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable element resources from ground"
                },
                "direction": "Input",
                "magnitude": 1.86815281118305E-16,
                "result": 1.86815281118305E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 840,
                    "name": "peat;  8.4 MJ/kg",
                    "referenceFlowPropertyID": 24,
                    "flowTypeID": 2,
                    "category": "Non-renewable energy resources from ground"
                },
                "direction": "Input",
                "magnitude": 1.84382859339928E-11,
                "result": 1.84382859339928E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 841,
                    "name": "Biotic Production",
                    "referenceFlowPropertyID": 52,
                    "flowTypeID": 2,
                    "category": "Transformation"
                },
                "direction": "Input",
                "magnitude": 1.08180741739086E-11,
                "result": 1.08180741739086E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 845,
                    "name": "Uranium oxide (U3O8), 332 GJ per kg, in ore",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Uranium (resource)"
                },
                "direction": "Input",
                "magnitude": 4.14518603135961E-10,
                "result": 4.14518603135961E-10,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 851,
                    "name": "Nickel (+II)",
                    "casNumber": "014701-22-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Heavy metals to fresh water"
                },
                "direction": "Output",
                "magnitude": 7.02097288019301E-10,
                "result": 7.02097288019301E-10,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 857,
                    "name": "Occup. as Convent. arable land",
                    "referenceFlowPropertyID": 29,
                    "flowTypeID": 2,
                    "category": "Hemeroby"
                },
                "direction": "Input",
                "magnitude": 3.71607326795465E-10,
                "result": 3.71607326795465E-10,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 862,
                    "name": "Low radioactive wastes",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Radioactive waste"
                },
                "direction": "Output",
                "magnitude": 5.93314073143612E-13,
                "result": 5.93314073143612E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 872,
                    "name": "dodecane",
                    "casNumber": "000112-40-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 1.44112787673266E-10,
                "result": 1.44112787673266E-10,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 879,
                    "name": "Spoil (deposited)",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Stockpile goods"
                },
                "direction": "Output",
                "magnitude": 1.17632759750996E-06,
                "result": 1.17632759750996E-06,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 882,
                    "name": "HFC-23",
                    "casNumber": "000075-46-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 4.70913495623988E-17,
                "result": 4.70913495623988E-17,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 883,
                    "name": "manganese",
                    "casNumber": "007439-96-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable element resources from ground"
                },
                "direction": "Input",
                "magnitude": 1.02719393538941E-10,
                "result": 1.02719393538941E-10,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 885,
                    "name": "manganese-54",
                    "casNumber": "013966-31-9    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 2.64329193459765E-12,
                "result": 2.64329193459765E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 887,
                    "name": "sulfur",
                    "casNumber": "007704-34-9    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 3.98207863633149E-17,
                "result": 3.98207863633149E-17,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 888,
                    "name": "fluoranthene",
                    "casNumber": "000206-44-0    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 5.97465607857697E-15,
                "result": 5.97465607857697E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 889,
                    "name": "formaldehyde",
                    "casNumber": "000050-00-0    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 5.99238759731792E-20,
                "result": 5.99238759731792E-20,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 890,
                    "name": "CFC-12",
                    "casNumber": "000075-71-8    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 8.0419086083256E-14,
                "result": 8.0419086083256E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 891,
                    "name": "m-xylene",
                    "casNumber": "000108-38-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 7.89469778409691E-11,
                "result": 7.89469778409691E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 892,
                    "name": "strontium-90",
                    "casNumber": "010098-97-2    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 7.91259403588301E-13,
                "result": 7.91259403588301E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 893,
                    "name": "hydrazine",
                    "casNumber": "000302-01-2    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 6.89773865950295E-16,
                "result": 6.89773865950295E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 894,
                    "name": "lead dioxide",
                    "casNumber": "001309-60-0    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 6.38455835682974E-19,
                "result": 6.38455835682974E-19,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 895,
                    "name": "2,4-dimethylphenol",
                    "casNumber": "000105-67-9    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 7.29873410396672E-11,
                "result": 7.29873410396672E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 897,
                    "name": "caprolactam",
                    "casNumber": "000105-60-2    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.68824810697282E-16,
                "result": 1.68824810697282E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 898,
                    "name": "phenanthrene",
                    "casNumber": "000085-01-8    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 7.20982781888078E-13,
                "result": 7.20982781888078E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 899,
                    "name": "phenanthrene",
                    "casNumber": "000085-01-8    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 2.83920929828061E-14,
                "result": 2.83920929828061E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 902,
                    "name": "1,3,5-trimethylbenzene",
                    "casNumber": "000108-67-8    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 4.83459998348854E-21,
                "result": 4.83459998348854E-21,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 903,
                    "name": "cadmium",
                    "casNumber": "007440-43-9    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 1.05240587002899E-10,
                "result": 1.05240587002899E-10,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 904,
                    "name": "cadmium",
                    "casNumber": "007440-43-9    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to non-agricultural soil"
                },
                "direction": "Output",
                "magnitude": -3.90192385012323E-17,
                "result": -3.90192385012323E-17,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 905,
                    "name": "cadmium",
                    "casNumber": "007440-43-9    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 2.01075645616396E-15,
                "result": 2.01075645616396E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 907,
                    "name": "calcium",
                    "casNumber": "007440-70-2    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 8.37073423698397E-06,
                "result": 8.37073423698397E-06,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 909,
                    "name": "benzo[a]anthracene",
                    "casNumber": "000056-55-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 6.73260726754907E-16,
                "result": 6.73260726754907E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 910,
                    "name": "benzo[a]anthracene",
                    "casNumber": "000056-55-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 1.70678875551863E-19,
                "result": 1.70678875551863E-19,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 911,
                    "name": "benzo[a]anthracene",
                    "casNumber": "000056-55-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 1.26780155566887E-18,
                "result": 1.26780155566887E-18,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 912,
                    "name": "molybdenum",
                    "casNumber": "007439-98-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable element resources from ground"
                },
                "direction": "Input",
                "magnitude": 3.82532877781118E-11,
                "result": 3.82532877781118E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 913,
                    "name": "gold",
                    "casNumber": "007440-57-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable element resources from ground"
                },
                "direction": "Input",
                "magnitude": 6.97939103363513E-15,
                "result": 6.97939103363513E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 914,
                    "name": "chlorobenzene",
                    "casNumber": "000108-90-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 8.92648532406264E-17,
                "result": 8.92648532406264E-17,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 916,
                    "name": "ethyl benzene",
                    "casNumber": "000100-41-4    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 7.24810973746582E-14,
                "result": 7.24810973746582E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 917,
                    "name": "ethyl benzene",
                    "casNumber": "000100-41-4    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 2.45893977308521E-10,
                "result": 2.45893977308521E-10,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 918,
                    "name": "anthracene",
                    "casNumber": "000120-12-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.76716380428105E-15,
                "result": 1.76716380428105E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 919,
                    "name": "anthracene",
                    "casNumber": "000120-12-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 2.89461512106022E-18,
                "result": 2.89461512106022E-18,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 921,
                    "name": "argon",
                    "casNumber": "007440-37-1    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 5.19873554155168E-12,
                "result": 5.19873554155168E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 922,
                    "name": "argon-41",
                    "casNumber": "014163-25-8    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 2.36826004578658E-09,
                "result": 2.36826004578658E-09,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 923,
                    "name": "chloroethane",
                    "casNumber": "000075-00-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.70414719823014E-16,
                "result": 1.70414719823014E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 925,
                    "name": "HFC-125",
                    "casNumber": "000354-33-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 2.94614263768125E-18,
                "result": 2.94614263768125E-18,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 927,
                    "name": "tetrachloroethene",
                    "casNumber": "000127-18-4    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 5.04744862388112E-13,
                "result": 5.04744862388112E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 930,
                    "name": "diethylamine",
                    "casNumber": "000109-89-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": -5.19086421627098E-21,
                "result": -5.19086421627098E-21,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 931,
                    "name": "trichloroethene",
                    "casNumber": "000079-01-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 2.42722917077187E-15,
                "result": 2.42722917077187E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 933,
                    "name": "ethylene",
                    "casNumber": "000074-85-1    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 6.26304862197972E-15,
                "result": 6.26304862197972E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 935,
                    "name": "vinyl chloride",
                    "casNumber": "000075-01-4    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.09685195486239E-15,
                "result": 1.09685195486239E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 936,
                    "name": "vinyl chloride",
                    "casNumber": "000075-01-4    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 3.83497974995082E-17,
                "result": 3.83497974995082E-17,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 937,
                    "name": "cobalt",
                    "casNumber": "007440-48-4    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 1.54206383255476E-17,
                "result": 1.54206383255476E-17,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 939,
                    "name": "cobalt",
                    "casNumber": "007440-48-4    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to non-agricultural soil"
                },
                "direction": "Output",
                "magnitude": 2.32309931067215E-16,
                "result": 2.32309931067215E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 940,
                    "name": "cobalt",
                    "casNumber": "007440-48-4    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 5.77287442499203E-11,
                "result": 5.77287442499203E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 941,
                    "name": "cobalt",
                    "casNumber": "007440-48-4    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable element resources from ground"
                },
                "direction": "Input",
                "magnitude": 5.69944925445674E-15,
                "result": 5.69944925445674E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 943,
                    "name": "cobalt-58",
                    "casNumber": "013981-38-9    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 3.82122695945903E-14,
                "result": 3.82122695945903E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 944,
                    "name": "isophorone",
                    "casNumber": "000078-59-1    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 2.35334613088924E-15,
                "result": 2.35334613088924E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 945,
                    "name": "dimethylamine",
                    "casNumber": "000124-40-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.32094142249326E-18,
                "result": 1.32094142249326E-18,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 946,
                    "name": "fluoranthene",
                    "casNumber": "000206-44-0    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 2.50627503018742E-19,
                "result": 2.50627503018742E-19,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 947,
                    "name": "fluoranthene",
                    "casNumber": "000206-44-0    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 1.95381943275339E-18,
                "result": 1.95381943275339E-18,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 948,
                    "name": "fluorene",
                    "casNumber": "000086-73-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 7.66077868570969E-15,
                "result": 7.66077868570969E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 949,
                    "name": "furan",
                    "casNumber": "000110-00-9    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 4.1873018309143E-17,
                "result": 4.1873018309143E-17,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 953,
                    "name": "heptane",
                    "casNumber": "000142-82-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.15614900344289E-14,
                "result": 1.15614900344289E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 954,
                    "name": "naphthalene",
                    "casNumber": "000091-20-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 2.79141752613341E-12,
                "result": 2.79141752613341E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 955,
                    "name": "naphthalene",
                    "casNumber": "000091-20-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 9.07551028440122E-11,
                "result": 9.07551028440122E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 956,
                    "name": "hexane",
                    "casNumber": "000110-54-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 1.30162307247768E-20,
                "result": 1.30162307247768E-20,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 957,
                    "name": "hexane",
                    "casNumber": "000110-54-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 9.70019099251226E-21,
                "result": 9.70019099251226E-21,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 958,
                    "name": "hydrocyanic acid",
                    "casNumber": "000074-90-8    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 2.16499828709008E-16,
                "result": 2.16499828709008E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 959,
                    "name": "hydrocyanic acid",
                    "casNumber": "000074-90-8    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 1.19271967319152E-20,
                "result": 1.19271967319152E-20,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 961,
                    "name": "HFC-134a",
                    "casNumber": "000811-97-2    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 4.49959878834382E-17,
                "result": 4.49959878834382E-17,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 964,
                    "name": "crude oil; 42.3 MJ/kg",
                    "referenceFlowPropertyID": 24,
                    "flowTypeID": 2,
                    "category": "Non-renewable energy resources from ground"
                },
                "direction": "Input",
                "magnitude": 0.0293336563808763,
                "result": 0.0293336563808763,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 965,
                    "name": "brown coal;  11.9 MJ/kg",
                    "referenceFlowPropertyID": 24,
                    "flowTypeID": 2,
                    "category": "Non-renewable energy resources from ground"
                },
                "direction": "Input",
                "magnitude": 1.09521841384624E-07,
                "result": 1.09521841384624E-07,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 966,
                    "name": "natural gas;  44.1 MJ/kg",
                    "referenceFlowPropertyID": 24,
                    "flowTypeID": 2,
                    "category": "Non-renewable energy resources from ground"
                },
                "direction": "Input",
                "magnitude": 0.0015511468848828,
                "result": 0.0015511468848828,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 967,
                    "name": "sulfide",
                    "casNumber": "018496-25-8    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to non-agricultural soil"
                },
                "direction": "Output",
                "magnitude": 2.19574665758922E-14,
                "result": 2.19574665758922E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 968,
                    "name": "hard coal;  26.3 MJ/kg",
                    "referenceFlowPropertyID": 24,
                    "flowTypeID": 2,
                    "category": "Non-renewable energy resources from ground"
                },
                "direction": "Input",
                "magnitude": 0.000547035537860401,
                "result": 0.000547035537860401,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 970,
                    "name": "inert rock",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable material resources from ground"
                },
                "direction": "Input",
                "magnitude": 3.53203728512596E-07,
                "result": 3.53203728512596E-07,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 971,
                    "name": "particles (> PM10)",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 7.10642341876735E-06,
                "result": 7.10642341876735E-06,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 972,
                    "name": "particles (> PM10)",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 4.5453123147941E-12,
                "result": 4.5453123147941E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 973,
                    "name": "silicium tetrafluoride",
                    "casNumber": "007783-61-1    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 4.62560484628489E-17,
                "result": 4.62560484628489E-17,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 974,
                    "name": "particles (> PM10)",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.81349393938677E-11,
                "result": 1.81349393938677E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 976,
                    "name": "aluminium",
                    "casNumber": "007429-90-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.51856025122396E-14,
                "result": 1.51856025122396E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 977,
                    "name": "aluminium",
                    "casNumber": "007429-90-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 2.23665828230585E-07,
                "result": 2.23665828230585E-07,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 978,
                    "name": "aluminium",
                    "casNumber": "007429-90-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to non-agricultural soil"
                },
                "direction": "Output",
                "magnitude": 1.81537975188743E-14,
                "result": 1.81537975188743E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 979,
                    "name": "aluminium",
                    "casNumber": "007429-90-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 1.60761802626448E-18,
                "result": 1.60761802626448E-18,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 980,
                    "name": "1,2-dichloroethane",
                    "casNumber": "000107-06-2    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.62328968032197E-16,
                "result": 1.62328968032197E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 981,
                    "name": "1,2-dichloroethane",
                    "casNumber": "000107-06-2    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 4.54535041182683E-22,
                "result": 4.54535041182683E-22,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 983,
                    "name": "molybdenum",
                    "casNumber": "007439-98-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.49244522951304E-14,
                "result": 1.49244522951304E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 984,
                    "name": "molybdenum",
                    "casNumber": "007439-98-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 5.99268037612784E-11,
                "result": 5.99268037612784E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 986,
                    "name": "beryllium",
                    "casNumber": "007440-41-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 3.96526462265379E-11,
                "result": 3.96526462265379E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 988,
                    "name": "beryllium",
                    "casNumber": "007440-41-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to non-agricultural soil"
                },
                "direction": "Output",
                "magnitude": 1.87855884153517E-23,
                "result": 1.87855884153517E-23,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 989,
                    "name": "beryllium",
                    "casNumber": "007440-41-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 2.64456751233562E-18,
                "result": 2.64456751233562E-18,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 990,
                    "name": "cobalt-60",
                    "casNumber": "010198-40-0    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 1.97638279366226E-11,
                "result": 1.97638279366226E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 991,
                    "name": "cobalt-60",
                    "casNumber": "010198-40-0    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 5.59564661101119E-13,
                "result": 5.59564661101119E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 992,
                    "name": "copper",
                    "casNumber": "007440-50-8    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to agricultural soil"
                },
                "direction": "Output",
                "magnitude": 6.44992540182932E-15,
                "result": 6.44992540182932E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 993,
                    "name": "copper",
                    "casNumber": "007440-50-8    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.24863006876959E-13,
                "result": 1.24863006876959E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 994,
                    "name": "copper",
                    "casNumber": "007440-50-8    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 7.34077832092967E-10,
                "result": 7.34077832092967E-10,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 995,
                    "name": "acetaldehyde",
                    "casNumber": "000075-07-0    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 5.8999392776605E-12,
                "result": 5.8999392776605E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 997,
                    "name": "chrysene",
                    "casNumber": "000218-01-9    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 8.41924577743418E-16,
                "result": 8.41924577743418E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 998,
                    "name": "chrysene",
                    "casNumber": "000218-01-9    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 6.26417901071929E-19,
                "result": 6.26417901071929E-19,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 999,
                    "name": "chrysene",
                    "casNumber": "000218-01-9    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 5.60531363035989E-18,
                "result": 5.60531363035989E-18,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1004,
                    "name": "iodine-129",
                    "casNumber": "015046-84-1    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.19920301865772E-13,
                "result": 1.19920301865772E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1005,
                    "name": "cyanide",
                    "casNumber": "000057-12-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 4.26715192278119E-11,
                "result": 4.26715192278119E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1007,
                    "name": "cyclohexane",
                    "casNumber": "000110-82-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 8.73015536589409E-18,
                "result": 8.73015536589409E-18,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1008,
                    "name": "iodine-129",
                    "casNumber": "015046-84-1    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 8.12426097304675E-12,
                "result": 8.12426097304675E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1009,
                    "name": "iodine-131",
                    "casNumber": "010043-66-0    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 7.65456901503047E-11,
                "result": 7.65456901503047E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1010,
                    "name": "iodine-131",
                    "casNumber": "010043-66-0    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 3.04830305543007E-13,
                "result": 3.04830305543007E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1011,
                    "name": "iridium",
                    "casNumber": "007439-88-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable element resources from ground"
                },
                "direction": "Input",
                "magnitude": 1.05545356564014E-17,
                "result": 1.05545356564014E-17,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1014,
                    "name": "barium",
                    "casNumber": "007440-39-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 2.02747031219528E-14,
                "result": 2.02747031219528E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1015,
                    "name": "barium",
                    "casNumber": "007440-39-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 3.06458111858582E-06,
                "result": 3.06458111858582E-06,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1018,
                    "name": "dolomite",
                    "casNumber": "069227-00-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable material resources from ground"
                },
                "direction": "Input",
                "magnitude": 2.18421470772688E-10,
                "result": 2.18421470772688E-10,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1019,
                    "name": "isopropanol",
                    "casNumber": "000067-63-0    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 4.82753427301101E-14,
                "result": 4.82753427301101E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1021,
                    "name": "lithium",
                    "casNumber": "007439-93-2    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 1.55497634632318E-07,
                "result": 1.55497634632318E-07,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1024,
                    "name": "mercury",
                    "casNumber": "007439-97-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.15517622916026E-12,
                "result": 1.15517622916026E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1025,
                    "name": "mercury",
                    "casNumber": "007439-97-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 2.45377532512451E-12,
                "result": 2.45377532512451E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1026,
                    "name": "mercury",
                    "casNumber": "007439-97-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to non-agricultural soil"
                },
                "direction": "Output",
                "magnitude": 1.34181812186922E-19,
                "result": 1.34181812186922E-19,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1027,
                    "name": "mercury",
                    "casNumber": "007439-97-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 1.18344447798759E-17,
                "result": 1.18344447798759E-17,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1028,
                    "name": "mercury",
                    "casNumber": "007439-97-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable element resources from ground"
                },
                "direction": "Input",
                "magnitude": 2.06606836901219E-19,
                "result": 2.06606836901219E-19,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1029,
                    "name": "methacrylate",
                    "casNumber": "000096-33-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.71256716402582E-18,
                "result": 1.71256716402582E-18,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1031,
                    "name": "Halon-1001",
                    "casNumber": "000074-83-9    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 6.49198932659101E-16,
                "result": 6.49198932659101E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1034,
                    "name": "HCFC-22",
                    "casNumber": "000075-45-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 6.04341823662748E-17,
                "result": 6.04341823662748E-17,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1035,
                    "name": "CFC-10",
                    "casNumber": "000056-23-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 8.0419086083256E-15,
                "result": 8.0419086083256E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1037,
                    "name": "methanol",
                    "casNumber": "000067-56-1    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.592262198277E-14,
                "result": 1.592262198277E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1038,
                    "name": "methanol",
                    "casNumber": "000067-56-1    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 1.95420654462356E-13,
                "result": 1.95420654462356E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1041,
                    "name": "potassium",
                    "casNumber": "007440-09-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to non-agricultural soil"
                },
                "direction": "Output",
                "magnitude": 1.03066062366147E-13,
                "result": 1.03066062366147E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1042,
                    "name": "chloride",
                    "casNumber": "016887-00-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to non-agricultural soil"
                },
                "direction": "Output",
                "magnitude": 8.12852943213984E-13,
                "result": 8.12852943213984E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1043,
                    "name": "hydrogen iodide",
                    "casNumber": "010034-85-2    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.35327478170299E-20,
                "result": 1.35327478170299E-20,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1044,
                    "name": "lead",
                    "casNumber": "007439-92-1    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to agricultural soil"
                },
                "direction": "Output",
                "magnitude": 9.66839611121928E-15,
                "result": 9.66839611121928E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1046,
                    "name": "methyl methacrylate",
                    "casNumber": "000080-62-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 2.35460274113314E-16,
                "result": 2.35460274113314E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1048,
                    "name": "naphthalene",
                    "casNumber": "000091-20-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 5.44563858044324E-16,
                "result": 5.44563858044324E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1053,
                    "name": "sodium",
                    "casNumber": "007440-23-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 1.14043944254118E-13,
                "result": 1.14043944254118E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1054,
                    "name": "chloride",
                    "casNumber": "016887-00-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 2.08869245326811E-10,
                "result": 2.08869245326811E-10,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1056,
                    "name": "nitrate",
                    "casNumber": "014797-55-8    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 1.4578926701454E-14,
                "result": 1.4578926701454E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1058,
                    "name": "phenol",
                    "casNumber": "000108-95-2    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 7.50218801594695E-12,
                "result": 7.50218801594695E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1061,
                    "name": "plutonium",
                    "casNumber": "007440-07-5    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.75022832058851E-16,
                "result": 1.75022832058851E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1062,
                    "name": "plutonium",
                    "casNumber": "007440-07-5    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 2.31830180079181E-13,
                "result": 2.31830180079181E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1063,
                    "name": "polonium-210",
                    "casNumber": "013981-52-7    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 3.94742966410994E-13,
                "result": 3.94742966410994E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1064,
                    "name": "adsorbable organic halogen compounds",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 4.04320061909565E-12,
                "result": 4.04320061909565E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1065,
                    "name": "adsorbable organic halogen compounds",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 5.17011610362216E-21,
                "result": 5.17011610362216E-21,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1066,
                    "name": "air",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Renewable material resources from air"
                },
                "direction": "Input",
                "magnitude": 2.01612935625036E-07,
                "result": 2.01612935625036E-07,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1067,
                    "name": "ammonium",
                    "casNumber": "014798-03-9    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 6.34506822645298E-21,
                "result": 6.34506822645298E-21,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1068,
                    "name": "hydrocarbons (unspecified)",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 1.28119536448997E-10,
                "result": 1.28119536448997E-10,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1070,
                    "name": "hydrogen bromide",
                    "casNumber": "010035-10-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.31435757904026E-17,
                "result": 1.31435757904026E-17,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1071,
                    "name": "hydrogen chloride",
                    "casNumber": "007647-01-0    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.35262966639622E-08,
                "result": 1.35262966639622E-08,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1072,
                    "name": "hydrogen fluoride",
                    "casNumber": "007664-39-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 1.10400790689264E-15,
                "result": 1.10400790689264E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1073,
                    "name": "kaolin",
                    "casNumber": "001332-58-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable material resources from ground"
                },
                "direction": "Input",
                "magnitude": 2.10436995956189E-10,
                "result": 2.10436995956189E-10,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1075,
                    "name": "magnesite",
                    "casNumber": "000546-93-0    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable material resources from ground"
                },
                "direction": "Input",
                "magnitude": 6.7250525411347E-13,
                "result": 6.7250525411347E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1076,
                    "name": "magnesium",
                    "casNumber": "007439-95-4    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 1.63639068048892E-06,
                "result": 1.63639068048892E-06,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1077,
                    "name": "magnesium",
                    "casNumber": "007439-95-4    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 1.1661451482488E-15,
                "result": 1.1661451482488E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1078,
                    "name": "magnesium",
                    "casNumber": "007439-95-4    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable element resources from ground"
                },
                "direction": "Input",
                "magnitude": 2.10738973621545E-20,
                "result": 2.10738973621545E-20,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1079,
                    "name": "dinitrogen",
                    "casNumber": "007727-37-9    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 3.57855945271226E-11,
                "result": 3.57855945271226E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1081,
                    "name": "polycyclic aromatic hydrocarbons",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.32020882855272E-12,
                "result": 1.32020882855272E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1083,
                    "name": "propane",
                    "casNumber": "000074-98-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 2.30139813193227E-12,
                "result": 2.30139813193227E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1084,
                    "name": "1,2-dichloropropane",
                    "casNumber": "000078-87-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 3.8635478500528E-23,
                "result": 3.8635478500528E-23,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1085,
                    "name": "propene",
                    "casNumber": "000115-07-1    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.98156728472166E-11,
                "result": 1.98156728472166E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1087,
                    "name": "propionic acid",
                    "casNumber": "000079-09-4    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 2.64578979089962E-18,
                "result": 2.64578979089962E-18,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1088,
                    "name": "propylene glycol monomethyl ether acetate",
                    "casNumber": "000108-65-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.57649695272128E-14,
                "result": 1.57649695272128E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1090,
                    "name": "2,3,7,8-tetrachlorodibenzo-p-dioxin",
                    "casNumber": "001746-01-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 3.6934238448292E-17,
                "result": 3.6934238448292E-17,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1091,
                    "name": "protactinium-234",
                    "casNumber": "015100-28-4    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 5.28504844245775E-13,
                "result": 5.28504844245775E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1092,
                    "name": "indeno(1,2,3-cd)pyrene",
                    "casNumber": "000193-39-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 5.13356229652952E-16,
                "result": 5.13356229652952E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1095,
                    "name": "radium-226",
                    "casNumber": "013982-63-3    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.78223163861218E-12,
                "result": 1.78223163861218E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1098,
                    "name": "radon-222",
                    "casNumber": "014859-67-7    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.61416461898296E-07,
                "result": 1.61416461898296E-07,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1100,
                    "name": "rhodium",
                    "casNumber": "007440-16-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 2.80337291173773E-19,
                "result": 2.80337291173773E-19,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1105,
                    "name": "ruthenium-106",
                    "casNumber": "013967-48-1    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 4.19324072401012E-13,
                "result": 4.19324072401012E-13,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1106,
                    "name": "ruthenium-106",
                    "casNumber": "013967-48-1    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 1.5737756093469E-11,
                "result": 1.5737756093469E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1108,
                    "name": "selenium",
                    "casNumber": "007782-49-2    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.25208429894566E-11,
                "result": 1.25208429894566E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1109,
                    "name": "silver",
                    "casNumber": "007440-22-4    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.51856025122396E-14,
                "result": 1.51856025122396E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1110,
                    "name": "silver",
                    "casNumber": "007440-22-4    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 5.47296798514091E-09,
                "result": 5.47296798514091E-09,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1112,
                    "name": "silver",
                    "casNumber": "007440-22-4    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 1.00927439826246E-19,
                "result": 1.00927439826246E-19,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1115,
                    "name": "water vapour",
                    "casNumber": "007732-18-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 0.000702629500750413,
                "result": 0.000702629500750413,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1117,
                    "name": "strontium",
                    "casNumber": "007440-24-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.04872121777987E-17,
                "result": 1.04872121777987E-17,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1118,
                    "name": "strontium",
                    "casNumber": "007440-24-6    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 1.42052759847925E-07,
                "result": 1.42052759847925E-07,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1119,
                    "name": "molybdenum",
                    "casNumber": "007439-98-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 3.39868246702506E-20,
                "result": 3.39868246702506E-20,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1121,
                    "name": "sulfur dioxide",
                    "casNumber": "007446-09-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 0.00029811607897672,
                "result": 0.00029811607897672,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1122,
                    "name": "sulfur hexafluoride",
                    "casNumber": "002551-62-4    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 6.90857537008634E-16,
                "result": 6.90857537008634E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1124,
                    "name": "sulfate",
                    "casNumber": "014808-79-8    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 2.00027652591726E-07,
                "result": 2.00027652591726E-07,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1126,
                    "name": "sulfate",
                    "casNumber": "014808-79-8    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 1.11815103760585E-12,
                "result": 1.11815103760585E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1127,
                    "name": "tellurium",
                    "casNumber": "013494-80-9    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.16390603169989E-16,
                "result": 1.16390603169989E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1134,
                    "name": "americium-241",
                    "casNumber": "086954-36-1    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 5.5281554668029E-14,
                "result": 5.5281554668029E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1135,
                    "name": "magnesium chloride",
                    "casNumber": "007786-30-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable material resources from ground"
                },
                "direction": "Input",
                "magnitude": 1.07032718627574E-11,
                "result": 1.07032718627574E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1136,
                    "name": "acenaphthylene",
                    "casNumber": "000208-96-8    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 2.1031144889936E-15,
                "result": 2.1031144889936E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1140,
                    "name": "xylene (all isomers)",
                    "casNumber": "001330-20-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 2.52021464388454E-12,
                "result": 2.52021464388454E-12,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1141,
                    "name": "xylene (all isomers)",
                    "casNumber": "001330-20-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 2.21720428129343E-09,
                "result": 2.21720428129343E-09,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1142,
                    "name": "xylene (all isomers)",
                    "casNumber": "001330-20-7    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 3.54351879345153E-15,
                "result": 3.54351879345153E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1143,
                    "name": "uranium-234",
                    "casNumber": "013966-29-5    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 2.33989445185293E-11,
                "result": 2.33989445185293E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1144,
                    "name": "uranium-234",
                    "casNumber": "013966-29-5    ",
                    "referenceFlowPropertyID": 27,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 4.6557528443179E-14,
                "result": 4.6557528443179E-14,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1145,
                    "name": "ground water",
                    "casNumber": "007732-18-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Renewable material resources from water"
                },
                "direction": "Input",
                "magnitude": 1.9476577720913E-05,
                "result": 1.9476577720913E-05,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1146,
                    "name": "lake water",
                    "casNumber": "007732-18-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Renewable material resources from water"
                },
                "direction": "Input",
                "magnitude": 0.0324341319322915,
                "result": 0.0324341319322915,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1147,
                    "name": "copper",
                    "casNumber": "007440-50-8    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable element resources from ground"
                },
                "direction": "Input",
                "magnitude": 1.84586534871622E-09,
                "result": 1.84586534871622E-09,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1148,
                    "name": "lead",
                    "casNumber": "007439-92-1    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Non-renewable element resources from ground"
                },
                "direction": "Input",
                "magnitude": -2.24636862994631E-11,
                "result": -2.24636862994631E-11,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1150,
                    "name": "used air",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.57282354608726E-07,
                "result": 1.57282354608726E-07,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1151,
                    "name": "volatile organic compound",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 3.3567900457867E-09,
                "result": 3.3567900457867E-09,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1152,
                    "name": "chloroform",
                    "casNumber": "000067-66-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 2.39392106418043E-16,
                "result": 2.39392106418043E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1153,
                    "name": "manganese",
                    "casNumber": "007439-96-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to sea water"
                },
                "direction": "Output",
                "magnitude": 6.03092104729706E-17,
                "result": 6.03092104729706E-17,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1154,
                    "name": "carbon dioxide",
                    "casNumber": "000124-38-9    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 0.0427534258530966,
                "result": 0.0427534258530966,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1155,
                    "name": "methyl ethyl ketone",
                    "casNumber": "000078-93-3    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.58242239835656E-15,
                "result": 1.58242239835656E-15,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1159,
                    "name": "chlorine",
                    "casNumber": "007782-50-5    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to non-agricultural soil"
                },
                "direction": "Output",
                "magnitude": 2.07014908593725E-16,
                "result": 2.07014908593725E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1161,
                    "name": "bromoform",
                    "casNumber": "000075-25-2    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.58242239835656E-16,
                "result": 1.58242239835656E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1162,
                    "name": "dimethyl sulphate",
                    "casNumber": "000077-78-1    ",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Emissions to air, unspecified"
                },
                "direction": "Output",
                "magnitude": 1.9475967979773E-16,
                "result": 1.9475967979773E-16,
                "stDev": 0.0
            },
            {
                "flow": {
                    "flowID": 1164,
                    "name": "Water (river water from technosphere, cooling water)",
                    "referenceFlowPropertyID": 23,
                    "flowTypeID": 2,
                    "category": "Other emissions to fresh water"
                },
                "direction": "Output",
                "magnitude": 1.77070429025056E-07,
                "result": 1.77070429025056E-07,
                "stDev": 0.0
            }
        ]
    }


// Load the module which contains the directive
    beforeEach(module('lcaApp.lciaBar.directive'));

// Store references to $rootScope and $compile
// so they are available to all tests in this describe block
    beforeEach(inject(function(_$rootScope_, _$compile_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it('Use the directive to display details', function() {
        $rootScope.lcia = {
            positiveResults : getResultWithDetails(),
            positiveSum : 0.001,
            colors : function () {
                return colorbrewer.PuRd;
            }
        };
        $rootScope.flows = getFlows();

        // Compile a piece of HTML containing the directive
        var element =
            $compile("<lcia-bar-chart lcia=\"lcia\" flows=\"flows\"></lcia-bar-chart>")($rootScope);
        element.scope().$digest();
    });

});
