/**
 * Unit test plot
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
    var template = "<svg><plot config=\"config\" data=\"data\"></plot></svg>";
    var plotService, d3Service;

// Load the module
    beforeEach(module('lcaApp.plot'));

// Store references to $rootScope and $compile
// so they are available to all tests in this describe block
    beforeEach(inject(function(_$rootScope_, _$compile_,
                               _PlotService_, _d3Service_ ) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        plotService = _PlotService_;
        d3Service = _d3Service_;
    }));


    function getValue(d) {
        return d.value;
    }

    function getName(d) {
        return d.name;
    }

    function getNumLabel(d) {
        return d3Service.format("^.2g").call(d.value);
    }


    function getColor(d) {
        return d["color"];
    }

    // Test bar
    it('should be able to create a bar definition object', function() {
        var bar = plotService.createBar();

        expect(bar.shape()).toBeTruthy();  // Has a default shape
        expect(bar.color()).toBeTruthy();  // Has default color
        expect(bar.orientation()).toBeTruthy();  // Has default color
        // defaults, other than shape, can be overridden
        expect(bar.width(12).width()).toBe(12);
        expect(bar.color(getColor).color()).toBe(getColor);
        expect(bar.orientation("vertical").orientation()).toBe("vertical");
    });

    // Test axis
    it('should be able to create an axis object', function() {
        var axis = plotService.createAxis();

        expect(axis.orientation()).toBeTruthy();  // Has a default orientation
        // defaults can be overridden
        expect(axis.orientation("left").orientation()).toBe("left");
    });

    // Test dimension
    it('should create a dimension object', function() {
        var di = plotService.createDimension(),
            ai = plotService.createAxis(),
            s = "linear",
            dom = [0,1];

        expect(di.axis(ai).axis()).toBe(ai);
        expect(di.scale(s).scale()).toBe(s);
        expect(di.domain(dom).domain()).toBe(dom);
        expect(di.unit("kg").unit()).toBe("kg");
        expect(di.valueFn(getValue).valueFn()).toBe(getValue);
        expect(di.labelFn(getNumLabel).labelFn()).toBe(getNumLabel);
    });

    // Test margin
    it('should create margin object', function() {
        var margin = plotService.createMargin();

        expect(margin.top).toBe(0);
        expect(margin.bottom).toBe(0);
        expect(margin.left).toBe(0);
        expect(margin.right).toBe(0);

        margin = plotService.createMargin(1, 2, 3, 4);
        expect(margin.top).toBe(1);
        expect(margin.right).toBe(2);
        expect(margin.bottom).toBe(3);
        expect(margin.left).toBe(4);

        margin = plotService.createMargin(5);
        expect(margin.top).toBe(5);
        expect(margin.right).toBe(5);
        expect(margin.bottom).toBe(5);
        expect(margin.left).toBe(5);
    });

    // Test complete definition
    it('should create complete definition object', function() {
        var instance = plotService.createConfig(),
            x = plotService.createDimension(),
            y = plotService.createDimension(),
            m = plotService.createMargin(),
            bar = plotService.createBar();

        expect(instance).toBeTruthy();
        expect(instance.x(x).x()).toBe(x);
        expect(instance.y(y).y()).toBe(y);
        expect(instance.margin(m).margin()).toBe(m);
        expect(instance.content(bar).content()).toBe(bar);
    });

    it('should be able to compile and digest the directive', function() {
        var config = plotService.createConfig();

        config.x(plotService.createDimension().scale("ordinal").valueFn(getName))
              .y(plotService.createDimension().scale("linear").valueFn(getValue))
            .margin(plotService.createMargin())
            .content(plotService.createBar());

        $rootScope.config = config;
        $rootScope.data = data;

        // Compile a piece of HTML containing the directive
        var element = $compile(template)($rootScope);
        // fire all the watches, so the scope will be evaluated
        element.scope().$digest();
        var replaceElt = element.find("g").eq(0);
        expect(replaceElt).toBeDefined();
        //expect(angular.element(replaceElt).hasClass("lcia-bar-container")).toBe(true);
    });

});