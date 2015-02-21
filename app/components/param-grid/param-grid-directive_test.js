describe('Unit test param grid directive', function() {
    var $compile,
        $rootScope,
        $httpBackend,
        htmlTemplate = "<param-grid options=\"options\" data=\"data\" columns=\"gridColumns\" params=\"paramData\"></param-grid>";

   // Load the module which contains the directive
    beforeEach(module('lcaApp.paramGrid.directive'));

// Store references to $rootScope and $compile
// so they are available to all tests in this describe block
    beforeEach(inject(function(_$rootScope_, _$compile_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    function compileDirective() {
        // Compile a piece of HTML containing the directive
        var element =
            $compile(htmlTemplate)($rootScope);
        element.scope().$digest();
        return element;
    }

    it('should compile with no data', function() {
        $rootScope.data = [];
        $rootScope.gridColumns = [];
        $rootScope.options = { };
        $rootScope.paramData = {};

        expect(compileDirective()).toBeDefined();
    });

    it('should handle data with no params', function() {
        $rootScope.data = [{ name: "Flow A", factor: 1.1}, { name: "Flow B", factor: 2.2}];
        $rootScope.gridColumns = [{field: 'name', displayName: 'Flow Name', enableCellEdit: false},
            {field: 'factor', displayName: 'Factor', cellFilter: 'numFormat', enableCellEdit: false}];
        $rootScope.options = {};
        $rootScope.paramData = {};

        var elt = compileDirective();
        expect(elt).toBeDefined();
        expect(elt.html()).toContain($rootScope.data[0].name);
        expect(elt.html()).toContain($rootScope.gridColumns[0].displayName);
        expect(elt.html()).toContain($rootScope.data[1].name);
        expect(elt.html()).toContain($rootScope.gridColumns[1].displayName);
    });

});