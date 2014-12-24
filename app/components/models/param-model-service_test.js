/**
 * Unit test module, lcaApp.models.param
 */
describe('Unit test Param Model service', function() {
    var paramModelService, paramService, scenarioID, mockParams, q, log;

    function fakeSuccessfulLoad() {
        var deferred = q.defer();
        deferred.resolve(mockParams);
        return deferred.promise;
    }

    beforeEach(module('lcaApp.models.param', 'lcaApp.resources.mocks'));

    beforeEach(inject(function(_ParamModelService_) {
        paramModelService = _ParamModelService_;
    }));

    beforeEach(inject(function(_ParamService_, paramFilter, paramResponse, $q, $log) {
        paramService = _ParamService_;
        mockParams = paramResponse;
        scenarioID = paramFilter.scenarioID;
        q = $q;
        log = $log;
    }));


    it('ParamModelService should have been injected', function() {
        expect(paramModelService).toBeDefined();
    });

    it('should handle successful ParamService load', function() {
        var model;
        spyOn(paramService, 'load').andCallFake(fakeSuccessfulLoad);
        paramModelService.load(scenarioID).then(
            function(response) {
                expect(response).toBeDefined();
                expect(response.processes).toBeDefined();
                expect(response.lciaMethods).toBeDefined();
                expect(response.processes[43]).toBeDefined();
                expect(response.processes[43].flows).toBeDefined();
                expect(response.processes[43].flows[154]).toBeDefined();
                expect(response.processes[43].flows[154].processID).toEqual(43);
            },
            function(err) {
                expect(err).not.toBeDefined();
            }
        );

        //expect(model.processes).toBeDefined();
    });

});