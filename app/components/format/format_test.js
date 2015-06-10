describe('Unit test format service', function() {

    var svc;

    // load modules
    beforeEach(module('lcaApp.format'));

    beforeEach(inject(function (_FormatService_) {
        svc = _FormatService_;
    }));

    // Test service availability
    it('should have an injected service', function () {
        expect(svc).toBeDefined();
    });

    // Test number format
    it('should format a number', function () {
        var ff = svc.format(".2g");
        expect(ff).toBeDefined();
        expect(ff(100)).toEqual("1.0e+2");
    });
});
