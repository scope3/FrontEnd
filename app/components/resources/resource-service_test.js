/**
 * Unit test services
 */
describe('Unit test resource factories', function () {
    var shouldSucceed = true; // Set to false if web api not running
    // load modules
    beforeEach(module('lcaApp.resources.service'));

    // Test service availability
    it('inject NodeTypeService, load and get', inject(function (NodeTypeService) {
        expect(NodeTypeService).toBeDefined();
        NodeTypeService.load().then(
            function (results) {
                var nodeType;
                expect(results).toBeDefined();
                expect(NodeTypeService.objects).toBeDefined();
                expect(results).toEqual(NodeTypeService.objects);
                nodeType = NodeTypeService.get(2);
                expect(nodeType).not.toBe(null);
                expect(nodeType.name).toEqual("Fragment");
            },
            function (errMsg) {
                if (shouldSucceed) {
                    throw(errMsg);
                } else {
                    expect(errMsg).toBeDefined();
                    expect(errMsg).not.toBe(null);
                }
            }
        )
    }));

    function testResourceService(resourceService, filterObject) {
        expect(resourceService).toBeDefined();
        resourceService.load(filterObject).then(
            function (results) {
                expect(results).toBeDefined();
                expect(resourceService.objects).toBeDefined();
                expect(results).toEqual(resourceService.objects);
            },
            function (errMsg) {
                if (shouldSucceed) {
                    throw(errMsg);
                } else {
                    expect(errMsg).toBeDefined();
                    expect(errMsg).not.toBe(null);
                }
            }
        )
    }

    function testResult(resourceService, properties) {
        expect(resourceService.objects.length).toBeGreaterThan(0);
        var first = resourceService.objects[0];
        expect(resourceService.idName).toBeDefined();
        expect(first[resourceService.idName]).toBeDefined();
        var oid = first[resourceService.idName];
        expect(resourceService.get(oid)).toEqual(first);
    }

    it('test ScenarioService', inject(function (ScenarioService) {
        testResourceService(ScenarioService);
    }));

    it('test FragmentService', inject(function (FragmentService) {
        testResourceService(FragmentService);
    }));

    it('test ProcessService', inject(function (ProcessService) {
        testResourceService(ProcessService);
    }));

    it('test ProcessForFlowTypeService', inject(function (ProcessForFlowTypeService) {
        testResourceService(ProcessForFlowTypeService, {flowTypeID: 2});
        //testResult(ProcessForFlowTypeService,
//            ["processID",
//            "name",
//            "referenceYear",
//            "geography",
//            "referenceTypeID",
//            "processTypeID",
//            "version"])
    }));

    it('test FragmentFlowService', inject(function (FragmentFlowService) {
        testResourceService(FragmentFlowService, {fragmentID: 1, scenarioID: 1});
    }));

    it('test FlowPropertyForFragmentService', inject(function (FlowPropertyForFragmentService) {
        testResourceService(FlowPropertyForFragmentService, {fragmentID: 1} );
    }));

    it('test FlowForFragmentService', inject(function (FlowForFragmentService) {
        testResourceService(FlowForFragmentService, {fragmentID: 1} );
    }));
});

