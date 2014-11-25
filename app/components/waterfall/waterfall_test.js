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

    function addData() {
        var scenarios = ["A", "B"],
            stages = [1,2,3],
            values = [];
        values.push([0.1, 0.25, -0.01]);
        values.push([0.15, -0.02, 0.25]);

        $rootScope.waterfallService
            .scenarios(scenarios)
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
    });

    // Test data added to service
    it('should accept data', function() {
        addData();
        expect($rootScope.waterfallService.scenarios().length).toEqual(2);
        expect($rootScope.waterfallService.stages().length).toEqual(3);
        expect($rootScope.waterfallService.values().length).toEqual(2);
        expect($rootScope.waterfallService.values()[0].length).toEqual(3);
    });

    // Test layout
    it('should do layout', function() {
        addData();
        expect($rootScope.waterfallService.layout()).toBeDefined();
        expect($rootScope.waterfallService.resultStages.length).toEqual($rootScope.waterfallService.stages().length);
        expect($rootScope.waterfallService.segments.length).toEqual($rootScope.waterfallService.scenarios().length);
        expect($rootScope.waterfallService.segments[0][2]["endVal"])
            .toEqual($rootScope.waterfallService.values()[0].reduce(addValues));
        expect($rootScope.waterfallService.segments[1][2]["endVal"])
            .toEqual($rootScope.waterfallService.values()[1].reduce(addValues));
    });

    it('should be able to compile and digest the directive', function() {
        addData();
        // Compile a piece of HTML containing the directive
        var element = $compile("<waterfall-chart service=\"waterfallService\" index=\"0\" color=\"blue\"></waterfall-chart>")($rootScope);
        // fire all the watches, so the scope expression {{1 + 1}} will be evaluated
        element.scope().$digest();

    });
});