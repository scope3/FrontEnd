describe('Unit test param grid directive', function() {
    var $compile,
        $rootScope,
        params,
        paramModelService,
        scenarioID,
        htmlTemplate = "<param-grid options=\"options\" data=\"data\" columns=\"gridColumns\" params=\"paramData\"></param-grid>";

   // Load the module which contains the directive and mock params
    beforeEach(module('lcaApp.paramGrid.directive', 'lcaApp.mock.params'));

// Store references to $rootScope and $compile
// so they are available to all tests in this describe block
    beforeEach(inject(function(_$rootScope_, _$compile_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    beforeEach(inject(function(_ParamModelService_, mockParams) {
        paramModelService = _ParamModelService_;
        scenarioID = mockParams.filter.scenarioID;
        params = mockParams.objects;
    }));

    function addDataColumns() {
        $rootScope.data = [{ name: "Flow A", factor: 1.1}, { name: "Flow B", factor: 2.2}];
        $rootScope.gridColumns = [{field: 'name', displayName: 'Flow Name', enableCellEdit: false},
            {field: 'factor', displayName: 'Factor', cellFilter: 'numFormat', enableCellEdit: false}];
    }

    function compileDirective() {
        // Compile a piece of HTML containing the directive
        var element =
            $compile(htmlTemplate)($rootScope);
        element.scope().$digest();
        return element;
    }

    function getParam() {
        return (params.length > 0) ? params[0] : 0;
    }

    it('should compile with no data', function() {
        $rootScope.data = [];
        $rootScope.gridColumns = [];
        $rootScope.options = { };
        $rootScope.paramData = {};

        expect(compileDirective()).toBeDefined();
    });

    it('should handle data with no params', function() {
        addDataColumns();
        $rootScope.options = {};
        $rootScope.paramData = {};

        var elt = compileDirective();
        expect(elt).toBeDefined();
        expect(elt.html()).toContain($rootScope.data[0].name);
        expect(elt.html()).toContain($rootScope.gridColumns[0].displayName);
        expect(elt.html()).toContain($rootScope.data[1].name);
        expect(elt.html()).toContain($rootScope.gridColumns[1].displayName);
    });

    it('should handle data with param', function() {
        var param = getParam();
        addDataColumns();
        $rootScope.data[0].paramWrapper = paramModelService.wrapParam(param);

        var elt = compileDirective();
        expect(elt).toBeDefined();
    });

    it('should handle row where param is not applicable', function() {
        var param = getParam();
        addDataColumns();
        $rootScope.data[1].paramWrapper = paramModelService.naParam();

        var elt = compileDirective();
        expect(elt).toBeDefined();
    });

    it('should handle both types of param values in one grid', function() {
        var param = getParam();
        addDataColumns();
        $rootScope.data[0].paramWrapper = paramModelService.wrapParam(param);
        $rootScope.data[1].paramWrapper = paramModelService.naParam();

        var elt = compileDirective();
        expect(elt).toBeDefined();
    });
});