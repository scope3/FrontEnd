/**
 * Unit test services
 */
describe('Unit test selection service', function() {

    // load modules
    beforeEach(module('lcaApp.selection.service'));

    var testData = [
        {
            "scenarioID":0,
            "topLevelFragmentID":8,
            "activityLevel":3200,
            "name":"Model Base Case"
        },
        {
            "scenarioID":1,
            "topLevelFragmentID":8,
            "activityLevel":3200,
            "name":"Default Scenario"
        },
        {
            "scenarioID":2,
            "topLevelFragmentID":8,
            "activityLevel":3200,
            "name":"Process Substitution"
        }
        ],
        selectionService;



    beforeEach(inject(function(_SelectionService_) {
        selectionService = _SelectionService_;
    }));

    // Test service availability
    it('check the existence of injected SelectionService', function() {
        expect(selectionService).toBeDefined();

    });

    it('should be able to set and get array of objects', function() {
        var key = "fragmentScenarios",
            testMap = selectionService.set(key, testData);
        expect(testMap).toBeDefined();
        expect(testMap.length === testData.length);
        expect(testMap).toEqual(testData);
        expect(selectionService.get(key)).toEqual(testData);
    });

    it('should be able to set and get single value', function() {
        var key = "fragment";
        expect(selectionService.contains(key)).toBe(false);
        expect(selectionService.set(key, 8)).toEqual(selectionService.get(key));
        expect(selectionService.contains(key)).toBe(true);
    });

    it('should be able to remove a key', function() {
        var key = "fragment";
        selectionService.set(key, 8);
        expect(selectionService.contains(key)).toBe(true);
        selectionService.remove(key);
        expect(selectionService.contains(key)).toBe(false);
        expect(selectionService.get(key)).toBe(null);

    });
});