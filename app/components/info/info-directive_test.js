describe('Unit test info directive', function() {
    var $compile,
        $rootScope;

   // Load the module which contains the directive
    beforeEach(module('lcaApp.info.directive'));

// Store references to $rootScope and $compile
// so they are available to all tests in this describe block
    beforeEach(inject(function(_$rootScope_, _$compile_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));


    function compileDirective(htmlTemplate) {
        // Compile a piece of HTML containing the directive
        var element =
            $compile(htmlTemplate)($rootScope);
        element.scope().$digest();
        return element;
    }

    it('should display msg', function() {
        var htmlTemplate = '<info ng-show="displayInfo">A test message</info>';
        $rootScope.displayInfo = true;
        expect(compileDirective(htmlTemplate)).toBeDefined();
    });


});