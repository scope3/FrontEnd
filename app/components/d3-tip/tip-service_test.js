describe('Unit test d3-tip service', function() {

    var tipService;

    // load modules
    beforeEach(module('d3.tip'));

    beforeEach(inject(function (_TipService_) {
        tipService = _TipService_;
    }));

    // Test service availability
    it('should have an injected tip service', function () {
        expect(tipService).toBeDefined();
    });
});
