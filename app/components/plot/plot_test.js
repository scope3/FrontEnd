/**
 * Unit test waterfall
 */
describe('Unit test plot module', function() {
    var $compile;
    var $rootScope;
    var data = [
        {name: "A", value: .08167},
        {name: "B", value: .01492},
        {name: "C", value: .02782},
        {name: "D", value: .04253},
        {name: "E", value: .12702},
        {name: "F", value: .02288}
    ];
    var axisService, plotService, dimService, d3Service, marginService;

// Load the module
    beforeEach(module('lcaApp.plot'));

// Store references to $rootScope and $compile
// so they are available to all tests in this describe block
    beforeEach(inject(function(_$rootScope_, _$compile_,
                               _PlotAxisService_, _PlotService_, _PlotDimensionService_, _PlotMarginService_,
                               _d3Service_ ){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        axisService = _PlotAxisService_;
        plotService = _PlotService_;
        dimService = _PlotDimensionService_;
        d3Service = _d3Service_;
        marginService = _PlotMarginService_;
    }));

    function create_instance(service) {
        var instance = null;
        expect(service).toBeTruthy();
        instance = service.createInstance();
        expect(instance).not.toBeNull();
        return instance;
    }

    function getValue(d) {
        return d.value;
    }

    function getNumLabel(d) {
        return d3Service.format("^.2g").call(d.value);
    }

    // Test plot service
    it('should have a plot service', function() {
        var instance = create_instance(plotService);

        expect(instance.shape()).toBeTruthy();  // Has a default shape
        expect(instance.height() || instance.width()).toBeTruthy();  // Has default width or height
        // defaults can be overridden
        expect(instance.shape("circle").shape()).toBe("circle");    // only rect is currently supported
        expect(instance.height(12).height()).toBe(12);
    });

    // Test axis service
    it('should have an axis service', function() {
        var instance = create_instance(axisService);

        expect(instance.margin()).toBeTruthy();  // Has a default margin
        expect(instance.orientation()).toBeTruthy();  // Has a default orientation
        // defaults can be overridden
        expect(instance.margin(200).margin()).toBe(200);
        expect(instance.orientation("left").orientation()).toBe("left");
    });

    // Test dimension service
    it('should have an dimension service', function() {
        var di = create_instance(dimService),
            ai = create_instance(axisService),
            s = d3Service.scale.linear();

        expect(di.axis(ai).axis()).toBe(ai);
        expect(di.scale(s).scale()).toBe(s);
        expect(di.data(data).data()).toBe(data);
        expect(di.unit("kg").unit()).toBe("kg");
        expect(di.valueFn(getValue).valueFn()).toBe(getValue);
        expect(di.labelFn(getNumLabel).labelFn()).toBe(getNumLabel);
    });

    // Test margin service
    it('should have an margin service', function() {
        var instance = create_instance(marginService);

        expect(instance.top).toBeDefined();
        expect(instance.bottom).toBeDefined();
        expect(instance.left).toBeDefined();
        expect(instance.right).toBeDefined();
    });
});