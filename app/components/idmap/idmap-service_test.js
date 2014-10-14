/**
 * Unit test services
 */
describe('Unit test idmap resources', function() {

    // load modules
    beforeEach(module('lcaApp.idmap.service'));

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
        idMapService;



    beforeEach(inject(function(_IdMapService_) {
        idMapService = _IdMapService_;
    }));

    // Test service availability
    it('check the existence of injected IdMapService', function() {
        expect(idMapService).toBeDefined();

    });

    it('should be able to add objects, get by ID', function() {
        var testMap = idMapService.add("scenarioID", testData),
            testObj = null;
        expect(testMap).toBeDefined();
        expect(testMap.length === testData.length);
        testObj = idMapService.get("scenarioID", testData[1].scenarioID);
        expect(testObj).not.toBe(null);
        expect(testObj).toEqual(testData[1]);
    });
});