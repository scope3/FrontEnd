/**
 * Unit test waterfall
 */
describe('Unit test waterfall module', function() {
    var $compile;
    var $rootScope;

// Load the module
    beforeEach(module('lcaApp.waterfall'));

// Store references to $rootScope and $compile
// so they are available to all tests in this describe block
    beforeEach(inject(function(_$rootScope_, _$compile_, _WaterfallService_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $rootScope.waterfallService = _WaterfallService_;
    }));

    function addData(wf) {
        var scenarios = ["A", "B"],
            stages = ["stage 1","stage 2","stage 3"],
            values = [];

        values.push([0.1, 0.25, -0.01]);
        values.push([0.15, -0.02, 0.25]);

        wf.scenarios(scenarios)
            .stages(stages)
            .values(values);
    }

    function addValues(previousValue, currentValue) {
        return previousValue + currentValue;
    }

    // Test service availability
    it('should have a waterfall service', function() {
        expect($rootScope).toBeDefined();
        expect($rootScope.waterfallService).toBeDefined();
        expect($rootScope.waterfallService.createInstance()).toBeDefined();
    });

    // Test data added to service
    it('should accept data', function() {
        var wf = $rootScope.waterfallService.createInstance();
        addData(wf);
        expect(wf.scenarios().length).toEqual(2);
        expect(wf.stages().length).toEqual(3);
        expect(wf.values().length).toEqual(2);
        expect(wf.values()[0].length).toEqual(3);
    });

    // Test layout
    it('should do layout', function() {
        var wf = $rootScope.waterfallService.createInstance();
        addData(wf);
        expect(wf.layout()).toBeDefined();
        expect(wf.resultStages().length).toEqual(wf.stages().length);
        expect(wf.segments.length).toEqual(wf.scenarios().length);
        expect(wf.segments[0][2]["endVal"])
            .toEqual(wf.values()[0].reduce(addValues));
        expect(wf.segments[1][2]["endVal"])
            .toEqual(wf.values()[1].reduce(addValues));
    });

    it('should be able to compile and digest the directive', function() {
        var wf = $rootScope.waterfallService.createInstance();
        addData(wf);
        wf.layout();
        // Compile a piece of HTML containing the directive
        var element = $compile("<waterfall-chart service=\"wf\" index=\"0\" color=\"blue\"></waterfall-chart>")($rootScope);
        // fire all the watches, so the scope expression {{1 + 1}} will be evaluated
        element.scope().$digest();

    });
});