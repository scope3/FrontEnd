describe("Unit test LCIA detail service", function() {
    var lciaDetailService, scenarioID, processID, lciaMethodID, processLcia, paramModelService,
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
    beforeEach(module('lcaApp.models.param', 'lcaApp.mock.params'));

    beforeEach(inject(function(_LciaDetailService_, mockProcessLCIA) {
        lciaDetailService = _LciaDetailService_;
        processLcia = mockProcessLCIA;
        lciaMethodID = processLcia.filter.lciaMethodID;
        processID = processLcia.filter.processID;
    }));

    beforeEach(inject(function(_ParamModelService_, mockParams) {
        paramModelService = _ParamModelService_;
        paramModelService.createModel(scenarioID, mockParams.objects);
        scenarioID = mockParams.filter.scenarioID;
    }));

    it("should create instance", function() {
        expect(lciaDetailService.createInstance()).toBeDefined();
    });

    it( "should accept context object IDs", function() {
        var dtlModel = lciaDetailService.createInstance();
        expect( dtlModel.scenarioID(scenarioID).scenarioID()).toEqual(scenarioID);
        expect( dtlModel.processID(processID).processID()).toEqual(processID);
        expect( dtlModel.lciaMethodID(lciaMethodID).lciaMethodID()).toEqual(lciaMethodID);
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
            dtlResult = processLcia.result.lciaScore[0].lciaDetail,
            processFlowParams = paramModelService.getProcessFlowParams(scenarioID, processID) || {},
            methodFlowParams = paramModelService.getLciaMethodFlowParams(scenarioID, lciaMethodID) || {};
        dtlModel.scenarioID(scenarioID)
            .processID(processID)
            .lciaMethodID(lciaMethodID)
            .resultDetails(dtlResult)
            .prepareBarChartData();

        dtlModel.positiveResults.forEach( function(p){
           expect(p.hasParam).toBeDefined();
           expect(p.flowID).toBeDefined();
           expect(!p.hasParam || p.flowID in processFlowParams || p.flowID in methodFlowParams);
        });
    });
});