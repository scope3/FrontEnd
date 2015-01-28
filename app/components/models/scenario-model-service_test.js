describe('Unit test Scenario Model service', function() {
    var modelService;

    beforeEach(module('lcaApp.models.scenario'));

    beforeEach(inject(function(_ScenarioModelService_) {
        modelService = _ScenarioModelService_;
    }));

    it('ScenarioModelService should have been injected', function() {
        expect(modelService).toBeDefined();
    });

    it('should recall active scenarioID', function() {
        var scenarioID = 7;
        modelService.setActiveID(scenarioID);
        expect(modelService.getActiveID()).toEqual(scenarioID);
    });

    it('should forget active scenarioID', function() {
        modelService.setActiveID(8);
        modelService.removeActiveID();
        expect(modelService.getActiveID()).toBeNull();
    });
});