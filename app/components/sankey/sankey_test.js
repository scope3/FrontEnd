/**
 * Unit test directives
 */
describe('Unit test sankey diagram directive', function() {
    var $compile;
    var $rootScope;

// Load the module which contains the directive
    beforeEach(module('lcaApp.sankey'));


// Store references to $rootScope and $compile
// so they are available to all tests in this describe block
    beforeEach(inject(function(_$rootScope_, _$compile_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it('Use the directive', function() {
        // Compile a piece of HTML containing the directive
        var element = $compile("<sankey-diagram></sankey-diagram>")($rootScope);
        // fire all the watches, so the scope expression {{1 + 1}} will be evaluated
        element.scope().$digest();
        // Check that the compiled element contains the templated content
        //expect(element.html()).toNotContain("X");
    });
});