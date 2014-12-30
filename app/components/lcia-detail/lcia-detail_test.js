describe("Unit test LCIA detail service", function() {
    var lciaDetailService, processID, lciaMethodID, processLcia,
        mockMethodParams = {
            1121: {
                "paramID": 9,
                    "paramTypeID": 10,
                    "scenarioID": 2,
                    "name": "Acidification: ILCD2011 ReCiPe2008  || sulfur dioxide [Emissions to air, unspecified]",
                    "flowID": 1121,
                    "lciaMethodID": 17,
                    "value": 1.16E-08
            } },
        mockProcessParams = {
            154: {
                paramTypes: {
                    8 : {
                        "paramID": 12,
                        "paramTypeID": 8,
                        "scenarioID": 2,
                        "name": "Truck Class 6 MHD Diesel || methane [Emissions to air, unspecified]",
                        "flowID": 154,
                        "processID": 43,
                        "value": 0.0006285
                    }
                }
            }},
        mockColors = {
            3: ["#f7fcb9","#addd8e","#31a354"],
            4: ["#ffffcc","#c2e699","#78c679","#238443"],
            5: ["#ffffcc","#c2e699","#78c679","#31a354","#006837"],
            6: ["#ffffcc","#d9f0a3","#addd8e","#78c679","#31a354","#006837"],
            7: ["#ffffcc","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#005a32"],
            8: ["#ffffe5","#f7fcb9","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#005a32"],
            9: ["#ffffe5","#f7fcb9","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#006837","#004529"]
        };

    beforeEach(module('lcaApp.lciaDetail.service', 'lcaApp.mock.processLCIA'));

    beforeEach(inject(function(_LciaDetailService_, mockProcessLCIA) {
        lciaDetailService = _LciaDetailService_;
        processLcia = mockProcessLCIA;
        lciaMethodID = processLcia.filter.lciaMethodID;
        processID = processLcia.filter.processID;
    }));

    it("should create instance", function() {
        expect(lciaDetailService.createInstance()).toBeDefined();
    });

    it( "should accept params", function() {
        var dtlModel = lciaDetailService.createInstance();
        expect( dtlModel.methodParams(mockMethodParams).methodParams()).toEqual(mockMethodParams);
        expect( dtlModel.processParams(mockProcessParams).processParams()).toEqual(mockProcessParams);
    });

    it( "should accept color scales", function() {
        var dtlModel = lciaDetailService.createInstance();
        expect( dtlModel.colors(mockColors).colors()).toEqual(mockColors);
    });

    it( "should accept Process LCIA result details", function() {
        var dtlModel = lciaDetailService.createInstance(),
            dtlResult = processLcia.result.lciaScore[0].lciaDetail;
        expect( dtlModel.resultDetails(dtlResult).resultDetails()).toEqual(dtlResult);
    });

    it( "should generate bar chart data from process LCIA result", function() {
        var dtlModel = lciaDetailService.createInstance(),
            dtlResult = processLcia.result.lciaScore[0].lciaDetail;
        dtlModel.resultDetails(dtlResult)
                .prepareBarChartData();
        expect( dtlModel.positiveResults).toBeDefined();
        expect( dtlModel.positiveResults.length).toBeGreaterThan(0);
        expect( dtlModel.positiveSum).toBeDefined();
        expect( dtlModel.positiveSum).toBeGreaterThan(0);
        var total = dtlModel.positiveResults
            .map( function(p) {
                return p.result;
            }).reduce(function(a, b) {
                return a + b;
            });
        expect(dtlModel.positiveSum).toEqual(total);
    });

    it( "should detect flows with parameter(s)", function() {
        var dtlModel = lciaDetailService.createInstance(),
            dtlResult = processLcia.result.lciaScore[0].lciaDetail;
        dtlModel.resultDetails(dtlResult)
            .methodParams(mockMethodParams)
            .processParams(mockProcessParams)
            .prepareBarChartData();
       dtlModel.positiveResults.forEach( function(p){
           expect(p.hasParam).toBeDefined();
           expect(p.flowID).toBeDefined();
           expect(p.flowID === 1121 || p.flowID === 154).toEqual(p.hasParam);
        });
    });
});