describe('Unit test reference link directive', function() {
    var $compile,
        $rootScope,
        htmlTemplate = "<div><reference-link resource=\"resource\">Resource Data Set</reference-link></div>";

   // Load the module which contains the directive
    beforeEach(module('lcaApp.referenceLink.directive'));

// Store references to $rootScope and $compile
// so they are available to all tests in this describe block
    beforeEach(inject(function(_$rootScope_, _$compile_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    function addResource() {
        $rootScope.resource = {
            "processID": 1,
            "referenceYear": "2013",
            "geography": "US",
            "referenceTypeID": 1,
            "dataSource": "Full UO LCA Flat Export BK",
            "hasElementaryFlows": true,
            "name": "Metal Emissions, DK MDO",
            "uuid": "01c96a9f-aeb1-4c5f-bc36-5de9638799f9",
            "version": "00.00.000",
            "links": [
                {
                    "rel": "reference",
                    "href": "http://localhost:60393/xml/01c96a9f-aeb1-4c5f-bc36-5de9638799f9?version=00.00.000",
                    "title": "Link to ILCD Data Set"
                },
                {
                    "rel": "self",
                    "href": "http://localhost:60393/api/processes/1",
                    "title": "Metal Emissions, DK MDO"
                }
            ],
            "resourceType": "Process",
            "isPrivate": false
        };
    }

    function compileDirective() {
        // Compile a piece of HTML containing the directive
        var element =
            $compile(htmlTemplate)($rootScope);
        element.scope().$digest();
        return element;
    }

    it('should compile with no data', function() {
        $rootScope.resource = null;
        expect(compileDirective()).toBeDefined();
    });

    it('should handle resource with links', function() {
        addResource();

        var elt = compileDirective();
        expect(elt).toBeDefined();
        expect(elt.html()).toContain($rootScope.resource.links[0].href);
    });

    it('should handle resource with no links', function() {
        $rootScope.resource = { id : 1, name : "test" };
        expect(compileDirective()).toBeDefined();
    });


});