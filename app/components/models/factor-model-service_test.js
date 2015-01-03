/**
 * Unit test module, lcaApp.models.lciaFactor
 */
describe('Unit test Lciafactor Model service', function() {
    var lciaFactorModelService, lciaMethodID, lciaFactors;

    beforeEach(module('lcaApp.models.lciaFactor', 'lcaApp.mock.lciaFactors', 'lcaApp.resources.service'));

    beforeEach(inject(function(_LciaFactorModelService_) {
        lciaFactorModelService = _LciaFactorModelService_;
    }));

    beforeEach(inject(function( mockLciaFactors) {
        lciaFactors = mockLciaFactors.objects;
        lciaMethodID = mockLciaFactors.filter.lciaMethodID;
    }));

    beforeEach(inject(function( _LciaFactorService_, _MockLciaFactorService_) {
        spyOn(_LciaFactorService_, "load").andCallFake(_MockLciaFactorService_.load);
    }));

    it('LciaFactorModelService should have been injected', function() {
        expect(lciaFactorModelService).toBeDefined();
    });

    it('should create a model for LCIA Method Factors', function() {
        var model =
        lciaFactorModelService.createModel(lciaMethodID, lciaFactors);
        expect(model).toBeDefined();
    });

    it('should associate factors by flow ', function() {
        var model = lciaFactorModelService.createModel(lciaMethodID, lciaFactors);

        lciaFactors.forEach( function(f) {
            expect(model.flows[f.flowID]).toEqual(f);
        });
    });

    it('should get model if created', function() {
        expect(lciaFactorModelService.getModel(lciaMethodID-1)).toBeNull();
        expect(lciaFactorModelService.createModel(lciaMethodID, lciaFactors)).toEqual(lciaFactorModelService.getModel(lciaMethodID));
    });

    it('should load LCIA factor resources', function() {
        expect(lciaFactorModelService.load(lciaMethodID)).toBeDefined();
    });
});