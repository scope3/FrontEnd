/**
 * Unit test module, lcaApp.models.param
 */
describe('Unit test Param Model service', function() {
    var paramModelService, scenarioID, params, statusConstants;

    beforeEach(module('lcaApp.models.param', 'lcaApp.mock.params', 'lcaApp.resources.service'));

    beforeEach(inject(function(_ParamModelService_, _PARAM_VALUE_STATUS_) {
        paramModelService = _ParamModelService_;
        statusConstants = _PARAM_VALUE_STATUS_;
    }));

    beforeEach(inject(function( mockParams) {
        params = mockParams.objects;
        scenarioID = mockParams.filter.scenarioID;
    }));

    beforeEach(inject(function( _ParamService_, _MockParamService_) {
        spyOn(_ParamService_, "load").andCallFake(_MockParamService_.load);
    }));

    function testModel (model) {
        params.forEach( function(p) {
            switch (p.paramTypeID) {
                case 6 :
                case 8:
                    expect(model.processes[p.processID].flows[p.flowID]["paramTypes"][p.paramTypeID]).toEqual(p);
                    break;
                case 10:
                    expect(model.lciaMethods[p.lciaMethodID].flows[p.flowID]).toEqual(p);
                    break;
            }
        });
    }

    function getProcessParam() {
        return params.find(function(p){
            return p.hasOwnProperty("processID");
        });
    }

    function getMethodParam() {
        return params.find(function(p){
            return p.hasOwnProperty("lciaMethodID");
        });
    }

    it('ParamModelService should have been injected', function() {
        expect(paramModelService).toBeDefined();
    });

    it('should create a model for scenario params', function() {
        var model =
        paramModelService.createModel(scenarioID, params);
        expect(model).toBeDefined();
    });

    it('should index param types, 6, 8, and 10 ', function() {
        var model = paramModelService.createModel(scenarioID, params);
        testModel(model);
    });

    it('should get model if created', function() {
        expect(paramModelService.getModel(scenarioID-1)).toBeNull();
        expect(paramModelService.createModel(scenarioID, params)).toEqual(paramModelService.getModel(scenarioID));
    });

    it('should get a param for a given scenario, LCIA method, and flow', function() {
        var mockParam, foundParam;

        paramModelService.createModel(scenarioID, params);
        mockParam = getMethodParam();
        foundParam = paramModelService.getLciaMethodFlowParam( mockParam.scenarioID, mockParam.lciaMethodID, mockParam.flowID);
        expect(foundParam).toBeDefined();
        expect(foundParam).toEqual(mockParam);
    });

    it('should get a param for a given scenario, process, flow, and param type', function() {
        var mockParam, foundParam;

        paramModelService.createModel(scenarioID, params);
        mockParam = getProcessParam();
        foundParam = paramModelService.getProcessFlowParam( mockParam.scenarioID, mockParam.processID, mockParam.flowID,
                                                            mockParam.paramTypeID);
        expect(foundParam).toBeDefined();
        expect(foundParam).toEqual(mockParam);
    });

    it('should detect invalid change, param value matches default value', function() {
        var mockParam, result;

        paramModelService.createModel(scenarioID, params);
        mockParam = params[0];
        expect(mockParam).toBeDefined();
        expect(mockParam.value).toBeDefined();
        result = paramModelService.getParamValueStatus(mockParam.value, null, mockParam.value);
        expect(result).toBeDefined();
        expect(result.paramValueStatus).toBe(statusConstants.invalid);
        result = paramModelService.getParamValueStatus(mockParam.value + 1, mockParam, mockParam.value + 1);
        expect(result.paramValueStatus).toBe(statusConstants.invalid);
    });

    it('should detect invalid change, param value is not a number', function() {
        var result;

        paramModelService.createModel(scenarioID, params);
        result = paramModelService.getParamValueStatus(1, null, "10s");
        expect(result).toBeDefined();
        expect(result.paramValueStatus).toBe(statusConstants.invalid);
        result = paramModelService.getParamValueStatus(1, params[0], "10s");
        expect(result.paramValueStatus).toBe(statusConstants.invalid);
    });

    it('should detect no change', function() {
        var result, mockParam, baseVal;

        paramModelService.createModel(scenarioID, params);
        result = paramModelService.getParamValueStatus(1, null, "");
        expect(result).toBeDefined();
        expect(result.paramValueStatus).toBe(statusConstants.unchanged);
        mockParam = params[0];
        baseVal = mockParam.value - 1;
        result = paramModelService.getParamValueStatus(baseVal, mockParam, mockParam.value.toString());
        expect(result.paramValueStatus).toBe(statusConstants.unchanged);
    });

    it('should detect valid change', function() {
        var result, mockParam, newVal, baseVal;

        paramModelService.createModel(scenarioID, params);
        result = paramModelService.getParamValueStatus(1, null, "2.1");
        expect(result).toBeDefined();
        expect(result.paramValueStatus).toBe(statusConstants.changed);
        mockParam = params[0];
        newVal = mockParam.value - 1;
        baseVal = mockParam.value + 1;
        result = paramModelService.getParamValueStatus(baseVal, mockParam, newVal.toString());
        expect(result.paramValueStatus).toBe(statusConstants.changed);
    });

    it('should load param resources', function() {
        expect(paramModelService.load(scenarioID)).toBeDefined();

        /** Still cannot figure out to test promise in jasmine
        runs(function() {
            waitFlag = false;
            paramModelService.load(scenarioID)
                .then(
                function(response) {
                    waitFlag = true;
                },
                function(err) {
                    waitFlag = true;
                })
            }
        );

        waitsFor(function() {
            return waitFlag;
        }, "The model should be loaded", 1500);

        runs(function() {
            expect(paramModelService.getModel(scenarioID)).toBeDefined();
            testModel(paramModelService.getModel(scenarioID));
        });
         */
    });
});