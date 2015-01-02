/**
 * Unit test module, lcaApp.models.param
 */
describe('Unit test Param Model service', function() {
    var paramModelService, scenarioID, params;

    beforeEach(module('lcaApp.models.param', 'lcaApp.mock.params', 'lcaApp.resources.service'));

    beforeEach(inject(function(_ParamModelService_) {
        paramModelService = _ParamModelService_;
    }));

    beforeEach(inject(function( mockParams) {
        params = mockParams.objects;
        scenarioID = mockParams.filter.scenarioID;
    }));

    beforeEach(inject(function( _ParamService_, _MockParamService_) {
        spyOn(_ParamService_, "load").andCallFake(_MockParamService_.load);
    }));

    function testModel (model) {
        params.forEach( function(p) {
            switch (p.paramTypeID) {
                case 6 :
                case 8:
                    expect(model.processes[p.processID].flows[p.flowID]["paramTypes"][p.paramTypeID]).toEqual(p);
                    break;
                case 10:
                    expect(model.lciaMethods[p.lciaMethodID].flows[p.flowID]).toEqual(p);
                    break;
            }
        });
    }

    it('ParamModelService should have been injected', function() {
        expect(paramModelService).toBeDefined();
    });

    it('should create a model for scenario params', function() {
        var model =
        paramModelService.createModel(scenarioID, params);
        expect(model).toBeDefined();
    });

    it('should index param types, 6, 8, and 10 ', function() {
        var model = paramModelService.createModel(scenarioID, params);

        params.forEach( function(p) {
            switch(p.paramTypeID) {
                case 6 :
                case 8:
                    expect(model.processes[p.processID].flows[p.flowID]["paramTypes"][p.paramTypeID]).toEqual(p);
                    break;
                case 10:
                    expect(model.lciaMethods[p.lciaMethodID].flows[p.flowID]).toEqual(p);
                    break;
            }

        });
    });

    it('should get model if created', function() {
        expect(paramModelService.getModel(scenarioID-1)).toBeNull();
        expect(paramModelService.createModel(scenarioID, params)).toEqual(paramModelService.getModel(scenarioID));
    });

    it('should load param resources', function() {
        paramModelService.load(scenarioID)
            .then(function(response) {
                expect(response).toBeDefined();
                testModel(response);
            },
            function(err) {
                expect(err).toBeFalsy();
            })
    });
});