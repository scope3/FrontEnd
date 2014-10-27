/**
 * Unit test services
 */
describe('Unit test resource factories', function () {

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
                expect(errMsg).toBeDefined();
                expect(errMsg).not.toBe(null);
            }
        )
    }));

    function testResourceService(resourceService) {
        expect(resourceService).toBeDefined();
        resourceService.load().then(
            function (results) {
                expect(results).toBeDefined();
                expect(resourceService.objects).toBeDefined();
                expect(results).toEqual(resourceService.objects);
            },
            function (errMsg) {
                expect(errMsg).toBeDefined();
                expect(errMsg).not.toBe(null);
            }
        )
    }

    it('inject ScenarioService', inject(function (ScenarioService) {
        testResourceService(ScenarioService);
    }));

    it('inject FragmentService', inject(function (FragmentService) {
        testResourceService(FragmentService);
    }));

    it('inject ProcessService', inject(function (ProcessService) {
        testResourceService(ProcessService);
    }));

    it('inject ProcessService', inject(function (ProcessService) {
        testResourceService(ProcessService);
    }));
    it('inject FragmentFlowService', inject(function (FragmentFlowService) {
        testResourceService(FragmentFlowService);
    }));

    it('inject FlowPropertyForFragmentService', inject(function (FlowPropertyForFragmentService) {
        testResourceService(FlowPropertyForFragmentService);
    }));

    it('inject FlowForFragmentService', inject(function (FlowForFragmentService) {
        testResourceService(FlowForFragmentService);
    }));
});

