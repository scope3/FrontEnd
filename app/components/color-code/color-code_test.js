
describe('Unit test color code service', function() {

    var colorCodeService;

    // load modules
    beforeEach(module('lcaApp.colorCode.service'));

    beforeEach(inject(function (_ColorCodeService_) {
        colorCodeService = _ColorCodeService_;
    }));

    // Test service availability
    it('check the existence of injected color code service', function () {
        expect(colorCodeService).toBeDefined();
    });

    it('should be able to get colors for impact category', function () {
        var impactCategory = 1,
            colors = colorCodeService.getImpactCategoryColors(impactCategory),
            classSize = 3;
        expect(colors).toBeDefined();
        expect(colors[classSize]).toBeDefined();
        expect(colors[classSize].length).toBe(classSize);
    });
});