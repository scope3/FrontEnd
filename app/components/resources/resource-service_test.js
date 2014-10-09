/**
 * Unit test services
 */
describe('Unit test resource resources', function() {

    // load modules
    beforeEach(module('lcaApp.resources.service'));

    // Test service availability
    it('check the existence of ResourceService factory', inject(function(ResourceService) {
        expect(ResourceService).toBeDefined();
    }));
});

describe('Unit test d3.sankey service', function() {

    // load modules
    beforeEach(module('d3.sankey'));

    // Test service availability
    it('check the existence of SankeyService factory', inject(function(SankeyService) {
        expect(SankeyService).toBeDefined();
    }));
});
