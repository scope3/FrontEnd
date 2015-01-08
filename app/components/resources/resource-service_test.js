/**
 * Unit test resource services
 *
 * These tests are not yet useful because they do not wait for load to complete,
 * and they need to use $httpBackend to mock web api calls
 */
describe('Unit test resource factories', function () {
    var shouldSucceed = true, // Set to false if web api not running
        rootScope,
        backend;
    // load modules
    beforeEach(module('lcaApp.resources.service'));

    beforeEach(inject (function($rootScope, $httpBackend){
        rootScope = $rootScope;
        backend = $httpBackend;
    }));

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

    function testResourceService(resourceService, resourceProperties, filterObject) {
        expect(resourceService).toBeDefined();
        resourceService.load(filterObject).then(
            function (results) {
                expect(results).toBeDefined();
                expect(resourceService.objects).toBeDefined();
                expect(results).toEqual(resourceService.objects);
                testResult(resourceService, resourceProperties);
            },
            function (errMsg) {
                if (shouldSucceed) {
                    throw(errMsg);
                } else {
                    expect(errMsg).toBeDefined();
                    expect(errMsg).not.toBe(null);
                }
            }
        );
    }

    function testResult(resourceService, properties) {
        expect(resourceService.objects.length).toBeGreaterThan(0);
        var first = resourceService.objects[0];
        expect(resourceService.idName).toBeDefined();
        expect(first[resourceService.idName]).toBeDefined();
        var oid = first[resourceService.idName];
        expect(resourceService.get(oid)).toEqual(first);
        properties.forEach(function (prop) {
            expect(prop in first);
        });
    }

    it('test ScenarioService', inject(function (ScenarioService) {
        testResourceService(ScenarioService,
            ["scenarioID",
                "name",
                "topLevelFragmentID"]);
    }));

    it('test FragmentService', inject(function (FragmentService) {
        testResourceService(FragmentService,
            ["fragmentID",
                "name"]);
    }));

    it('test ProcessService', inject(function (ProcessService) {
        testResourceService(ProcessService,
            ["processID",
                "name",
                "referenceYear",
                "geography",
                "referenceTypeID",
                "processTypeID",
                "version"]);
    }));

    it('test ProcessForFlowTypeService', inject(function (ProcessForFlowTypeService) {
        testResourceService(ProcessForFlowTypeService,
            ["processID",
                "name",
                "referenceYear",
                "geography",
                "referenceTypeID",
                "processTypeID",
                "version"], {flowTypeID: 2}
        );
    }));

    it('test FragmentFlowService', inject(function (FragmentFlowService) {
        testResourceService(FragmentFlowService,
            ["fragmentFlowID",
            "name",
            "shortName",
            "nodeTypeID",
            "directionID",
            "flowPropertyMagnitudes"], {fragmentID: 1, scenarioID: 1});
    }));

    it('test FlowPropertyForFragmentService', inject(function (FlowPropertyForFragmentService) {
        testResourceService(FlowPropertyForFragmentService,
        [ "flowPropertyID",
            "name",
            "referenceUnit"], {fragmentID: 1});
    }));

    it('test FlowForFragmentService', inject(function (FlowForFragmentService) {
        testResourceService(FlowForFragmentService,
        [ "flowID",
            "name",
            "referenceFlowPropertyID",
            "flowTypeID",
            "category"], {fragmentID: 1});
    }));

    it('test ImpactCategoryService', inject(function (ImpactCategoryService) {
        testResourceService(ImpactCategoryService,
            [ "impactCategoryID",
                "name"]);
    }));

    it('ScenarioService should be able to create scenario', inject(function (ScenarioService) {
        var scenario = {name: "test scenario", topLevelFragmentID: 8};
        // Callbacks are not invoked during the test, so this is really just a usage example
        ScenarioService.create(scenario,
        function() {
            expect(scenario.scenarioID).toBeDefined();
        },
        function(errResponse) {
            expect(errResponse).toBeDefined();
        });
    }));
});

