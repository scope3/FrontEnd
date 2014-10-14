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

