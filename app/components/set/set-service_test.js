
describe('Unit test set service', function() {

    var setService;

    // load modules
    beforeEach(module('d3.set'));

    beforeEach(inject(function (_SetService_) {
        setService = _SetService_;
    }));

    // Test service availability
    it('should have an injected set', function () {
        expect(setService).toBeDefined();
    });

    it('should be able to add value and return it (number converted to string)', function () {
        expect(setService.add(1)).toEqual('1');
    });

    it('should be able to add duplicate values and return array of distinct values', function () {
        setService.add(1);
        setService.add(2);
        setService.add(2);
        setService.add(3);
        var values = setService.values();
        expect(values).toBeDefined();
        expect(values.length).toEqual(3);
        expect(values).toContain('1');
        expect(values).toContain('2');
        expect(values).toContain('3');
    });
});