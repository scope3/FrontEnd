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

    function getWrappedParam() {
        paramModelService.createModel(scenarioID, params);
        return paramModelService.wrapParam(params[0]);
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

    it('should wrap param resource', function() {
        var mockParam, paramWrapper;
        mockParam = params[0];
        expect(mockParam).toBeDefined();
        expect(mockParam.value).toBeDefined();
        paramWrapper = paramModelService.wrapParam(mockParam);
        expect(paramWrapper).toBeDefined();
        expect(paramWrapper.paramResource).toBe(mockParam);
        expect(paramWrapper.value).toEqual(mockParam.value);
        expect(paramWrapper.editStatus).toBe(statusConstants.unchanged);
    });

    it('should wrap null param', function() {
        var paramWrapper;

        paramWrapper = paramModelService.wrapParam(null);
        expect(paramWrapper).toBeDefined();
        expect(paramWrapper.paramResource).toBe(null);
        expect(paramWrapper.value).toEqual("");
        expect(paramWrapper.editStatus).toBe(statusConstants.unchanged);
    });

    it('should detect invalid change, param value is not a number', function() {
        var errMsg, baseValue, paramWrapper;

        paramWrapper = getWrappedParam();
        baseValue = paramWrapper.value;
        paramWrapper.value = "10s";

        errMsg = paramModelService.setParamWrapperStatus(null, paramWrapper);
        expect(errMsg).toBeDefined();
        expect(paramWrapper.editStatus).toBe(statusConstants.invalid);
        errMsg = paramModelService.setParamWrapperStatus(baseValue, paramWrapper);
        expect(paramWrapper.editStatus).toBe(statusConstants.invalid);
        expect(errMsg).toBeDefined();
    });


    it('should detect no change', function() {
        var paramWrapper;

        paramWrapper = getWrappedParam();
        paramModelService.setParamWrapperStatus(paramWrapper.value, paramWrapper);
        expect(paramWrapper.editStatus).toBe(statusConstants.unchanged);
    });

    it('should detect valid change', function() {
        var result, paramWrapper, baseVal;

        paramWrapper = getWrappedParam();
        baseVal = paramWrapper.value;
        paramWrapper.value = baseVal + 1;

        result = paramModelService.setParamWrapperStatus(null, paramWrapper);
        expect(result).toBe(null);
        expect(paramWrapper.editStatus).toBe(statusConstants.changed);
        result = paramModelService.setParamWrapperStatus(baseVal, paramWrapper);
        expect(result).toBe(null);
        expect(paramWrapper.editStatus).toBe(statusConstants.changed);
    });

    it('should represent Not Applicable param', function() {
        var paramWrapper;

        paramWrapper = paramModelService.naParam();
        expect(paramWrapper).toBeDefined();
        expect(paramWrapper.paramResource).toBe(null);
        expect(paramWrapper.value).toEqual("N/A");
        expect(paramWrapper.editStatus).toBe(statusConstants.unchanged);
    });

    it('should detect when changes can be applied', function() {
        var mockParam, paramWrapper, mockData = [], naParam;

        mockParam = params[0];
        naParam = paramModelService.naParam();
        paramWrapper = paramModelService.wrapParam(mockParam);
        mockData.push( { mockID: 1, paramWrapper: paramWrapper});
        mockData.push( { mockID: 2, paramWrapper: naParam});
        paramWrapper.value = mockParam.value + 1;
        paramModelService.setParamWrapperStatus(mockParam.value, paramWrapper);
        expect(paramModelService.canApplyChanges(mockData)).toBe(true);
    });

    it('should be able to revert invalid changes', function() {
        var mockParam, paramWrapper, mockData = [], naParam;

        mockParam = params[0];
        naParam = paramModelService.naParam();
        paramWrapper = paramModelService.wrapParam(mockParam);
        mockData.push( { mockID: 1, paramWrapper: paramWrapper});
        mockData.push( { mockID: 2, paramWrapper: naParam});
        paramWrapper.value = "10s";
        paramModelService.setParamWrapperStatus(mockParam.value, paramWrapper);
        expect(paramModelService.canRevertChanges(mockData)).toBe(true);
        paramModelService.revertChanges(mockData);
        expect(mockData[0].paramWrapper.value).toEqual(mockParam.value);
        expect(mockData[1].paramWrapper).toEqual(naParam);
        expect(paramModelService.canApplyChanges(mockData)).toBe(false);
        expect(paramModelService.canRevertChanges(mockData)).toBe(false);
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