/**
 * Unit test directive
 */
describe('Unit test change buttons directive', function() {
    var $compile;
    var scope;
    var haveChanges = true, haveError = false;

// Load the module which contains the directive
    beforeEach(module('lcaApp.changeButtons.directive'));


// Store references to scope and $compile
// so they are available to all tests in this describe block
    beforeEach(inject(function(_$rootScope_, _$compile_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        scope = _$rootScope_.$new();

        scope.canApply = function () {
            return haveChanges && !haveError;
        };

        scope.canRevert = function () {
            return haveChanges;
        };

        scope.applyChanges = function () {
            haveChanges = false;
        };

        scope.revertChanges = function () {
            haveChanges = false;
        };

    }));

    it('Use the change-buttons directive', function() {
        // Compile a piece of HTML containing the directive
        var element = $compile("<change-buttons></change-buttons>")(scope);
        element.scope().$digest();
        expect(element.find('button')).toBeDefined();
        scope.applyChanges();
        // TO DO : test that buttons have been disabled
    });
});