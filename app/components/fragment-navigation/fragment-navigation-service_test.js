/**
 * Test using Jasmine spec
 */
describe('Unit test fragment navigation service', function() {

    var scenarioID = 1,
        fragmentID = 1,
        navStates = [
            {
                "fragmentID": 1,
                "name": "Level 1 fragment"
            },
            {
                "fragmentID": 2,
                "name": "Level 2 fragment"
            },
            {
                "fragmentID": 3,
                "name": "Level 3 fragment"
            }
        ],
        fragmentNavigationService;

    function startNav() {
        fragmentNavigationService.add(navStates[0]);
        expect(fragmentNavigationService.getLast()).toBeDefined();
        expect(fragmentNavigationService.getLast().fragmentID).toEqual(navStates[0].fragmentID);
    }

    beforeEach(module('lcaApp.fragmentNavigation.service'));

    beforeEach(inject(function(_FragmentNavigationService_) {
        fragmentNavigationService = _FragmentNavigationService_;
    }));

    it('FragmentNavigationService should have been injected', function() {
        expect(fragmentNavigationService).toBeDefined();
    });

    it('should be able to store and retrieve state', function() {
        expect(fragmentNavigationService.setContext(scenarioID, fragmentID)).toBeDefined();
        startNav();
    });

    it('should be able to setContext without changing navigation state', function() {
        expect(fragmentNavigationService.setContext(scenarioID, fragmentID)).toBeDefined();
        startNav();
        expect(fragmentNavigationService.setContext(scenarioID, fragmentID)).toBeDefined();
        expect(fragmentNavigationService.getLast().fragmentID).toEqual(navStates[0].fragmentID);
    });

    it('setContext should reset navigation state when scenarioID or fragmentID changes', function() {
        expect(fragmentNavigationService.setContext(scenarioID, fragmentID)).toBeDefined();
        startNav();
        expect(fragmentNavigationService.setContext(scenarioID+1, fragmentID)).toBeDefined();
        expect(fragmentNavigationService.getLast()).toEqual(null);
        startNav();
        expect(fragmentNavigationService.setContext(scenarioID+1, fragmentID+1)).toBeDefined();
        expect(fragmentNavigationService.getLast()).toEqual(null);
    });

    it('should be able to store and retrieve multiple states', function() {
        expect(fragmentNavigationService.setContext(scenarioID, fragmentID)).toBeDefined();
        startNav();
        fragmentNavigationService.add(navStates[1]);
        fragmentNavigationService.add(navStates[2]);
        expect(fragmentNavigationService.getAll()).toEqual(navStates);
    });

    it('should be able to reset navigation to previous state', function() {
        expect(fragmentNavigationService.setContext(scenarioID, fragmentID)).toBeDefined();
        startNav();
        fragmentNavigationService.add(navStates[1]);
        fragmentNavigationService.add(navStates[2]);
        expect(fragmentNavigationService.setLast(1)).toBeDefined();
        expect(fragmentNavigationService.getLast()).toBeDefined();
        expect(fragmentNavigationService.getLast().fragmentID).toEqual(navStates[1].fragmentID);
    });
});