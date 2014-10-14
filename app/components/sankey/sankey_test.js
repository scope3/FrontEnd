/**
 * Unit test directives
 */
describe('Unit test sankey diagram directive', function() {
    var $compile;
    var $rootScope;


// Load the module which contains the directive
    beforeEach(module('lcaApp.sankey'));


// Store references to $rootScope and $compile
// so they are available to all tests in this describe block
    beforeEach(inject(function(_$rootScope_, _$compile_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;

        $rootScope.graph = {"nodes": [
            {"nodeTypeID": 3, "fragmentFlowID": 151, "nodeName": ""},
            {"nodeTypeID": 1, "fragmentFlowID": 152, "nodeName": "Scenario", "processID": 72},
            {"nodeTypeID": 2, "fragmentFlowID": 153, "nodeName": "Local Collection Mixer", "subFragmentID": 3},
            {"nodeTypeID": 3, "fragmentFlowID": 154, "nodeName": ""},
            {"nodeTypeID": 2, "fragmentFlowID": 155, "nodeName": "Inter-Facility Mixer", "subFragmentID": 7},
            {"nodeTypeID": 3, "fragmentFlowID": 156, "nodeName": ""},
            {"nodeTypeID": 3, "fragmentFlowID": 157, "nodeName": ""},
            {"nodeTypeID": 3, "fragmentFlowID": 158, "nodeName": ""},
            {"nodeTypeID": 3, "fragmentFlowID": 159, "nodeName": ""},
            {"nodeTypeID": 2, "fragmentFlowID": 160, "nodeName": "Waste Oil Preprocessing", "subFragmentID": 6},
            {"nodeTypeID": 3, "fragmentFlowID": 161, "nodeName": ""},
            {"nodeTypeID": 1, "fragmentFlowID": 162, "nodeName": "Transfer Losses", "processID": 9},
            {"nodeTypeID": 3, "fragmentFlowID": 163, "nodeName": ""},
            {"nodeTypeID": 3, "fragmentFlowID": 164, "nodeName": ""},
            {"nodeTypeID": 2, "fragmentFlowID": 165, "nodeName": "Haz Waste Landfill Output", "subFragmentID": 4},
            {"nodeTypeID": 3, "fragmentFlowID": 166, "nodeName": ""},
            {"nodeTypeID": 2, "fragmentFlowID": 167, "nodeName": "Haz Waste Incineration Output", "subFragmentID": 5},
            {"nodeTypeID": 3, "fragmentFlowID": 168, "nodeName": ""},
            {"nodeTypeID": 1, "fragmentFlowID": 169, "nodeName": "Wastewater to Treatment", "processID": 63},
            {"nodeTypeID": 3, "fragmentFlowID": 170, "nodeName": ""},
            {"nodeTypeID": 1, "fragmentFlowID": 171, "nodeName": "Waste water treatment (contains organic load)", "processID": 187},
            {"nodeTypeID": 4, "fragmentFlowID": 172, "nodeName": ""},
            {"nodeTypeID": 4, "fragmentFlowID": 173, "nodeName": ""},
            {"nodeTypeID": 1, "fragmentFlowID": 174, "nodeName": "Used Oil Rejuvenation/Other", "processID": 32},
            {"nodeTypeID": 3, "fragmentFlowID": 175, "nodeName": ""},
            {"nodeTypeID": 3, "fragmentFlowID": 176, "nodeName": ""},
            {"nodeTypeID": 1, "fragmentFlowID": 177, "nodeName": "UO water fraction", "processID": 38},
            {"nodeTypeID": 3, "fragmentFlowID": 178, "nodeName": ""},
            {"nodeTypeID": 3, "fragmentFlowID": 179, "nodeName": ""}
        ], "links": [
            {"flowID": 16, "fragmentFlowID": 151, "magnitude": 0.547163, "value": 0.54716300000001, "source": 1, "target": 0},
            {"flowID": 373, "fragmentFlowID": 152, "magnitude": 1, "value": 1.00000000000001, "source": 2, "target": 1},
            {"flowID": 860, "fragmentFlowID": 154, "magnitude": null, "value": 1e-14, "source": 2, "target": 3},
            {"flowID": 820, "fragmentFlowID": 155, "magnitude": null, "value": 1e-14, "source": 4, "target": 1},
            {"flowID": 346, "fragmentFlowID": 156, "magnitude": null, "value": 1e-14, "source": 1, "target": 5},
            {"flowID": 699, "fragmentFlowID": 157, "magnitude": null, "value": 1e-14, "source": 1, "target": 6},
            {"flowID": 475, "fragmentFlowID": 158, "magnitude": null, "value": 1e-14, "source": 1, "target": 7},
            {"flowID": 690, "fragmentFlowID": 159, "magnitude": 0.101098, "value": 0.10109800000001, "source": 1, "target": 8},
            {"flowID": 675, "fragmentFlowID": 160, "magnitude": null, "value": 1e-14, "source": 1, "target": 9},
            {"flowID": 351, "fragmentFlowID": 161, "magnitude": null, "value": 1e-14, "source": 9, "target": 10},
            {"flowID": 766, "fragmentFlowID": 162, "magnitude": 0.013594, "value": 0.01359400000001, "source": 1, "target": 11},
            {"flowID": 346, "fragmentFlowID": 163, "magnitude": null, "value": 1e-14, "source": 11, "target": 12},
            {"flowID": 617, "fragmentFlowID": 164, "magnitude": 0.186743, "value": 0.18674300000000998, "source": 1, "target": 13},
            {"flowID": 649, "fragmentFlowID": 165, "magnitude": 0.005305, "value": 0.00530500000001, "source": 1, "target": 14},
            {"flowID": 351, "fragmentFlowID": 166, "magnitude": null, "value": 1e-14, "source": 14, "target": 15},
            {"flowID": 622, "fragmentFlowID": 167, "magnitude": 0.001872, "value": 0.00187200000001, "source": 1, "target": 16},
            {"flowID": 351, "fragmentFlowID": 168, "magnitude": null, "value": 1e-14, "source": 16, "target": 17},
            {"flowID": 672, "fragmentFlowID": 169, "magnitude": 0.055951, "value": 0.05595100000001, "source": 1, "target": 18},
            {"flowID": 351, "fragmentFlowID": 170, "magnitude": null, "value": 1e-14, "source": 18, "target": 19},
            {"flowID": 602, "fragmentFlowID": 171, "magnitude": 0.055951, "value": 0.05595100000001, "source": 18, "target": 20},
            {"flowID": 421, "fragmentFlowID": 172, "magnitude": null, "value": 1e-14, "source": 21, "target": 20},
            {"flowID": 683, "fragmentFlowID": 173, "magnitude": null, "value": 1e-14, "source": 22, "target": 20},
            {"flowID": 619, "fragmentFlowID": 174, "magnitude": 0.009339, "value": 0.00933900000001, "source": 1, "target": 23},
            {"flowID": 651, "fragmentFlowID": 175, "magnitude": null, "value": 1e-14, "source": 23, "target": 24},
            {"flowID": 808, "fragmentFlowID": 176, "magnitude": 0.071822, "value": 0.07182200000001, "source": 1, "target": 25},
            {"flowID": 782, "fragmentFlowID": 177, "magnitude": null, "value": 1e-14, "source": 1, "target": 26},
            {"flowID": 655, "fragmentFlowID": 178, "magnitude": null, "value": 1e-14, "source": 26, "target": 27},
            {"flowID": 446, "fragmentFlowID": 179, "magnitude": 0.175463, "value": 0.17546300000001, "source": 26, "target": 28}
        ]};




}));

    it('Use the directive', function() {
        // Compile a piece of HTML containing the directive
        var element = $compile("<sankey-diagram data=\"graph\" getNodeLabel=\"d.nodeName\" getLinkTip=\"d.magnitude\"></sankey-diagram>")($rootScope);
        // fire all the watches, so the scope expression {{1 + 1}} will be evaluated
        element.scope().$digest();
        // Check that the compiled element contains the templated content
        //expect(element.html()).toNotContain("X");
    });
});

describe('Unit test d3.sankey service', function() {

    // load modules
    beforeEach(module('d3.sankey'));

    // Test service availability
    it('check the existence of SankeyService factory', inject(function(SankeyService) {
        expect(SankeyService).toBeDefined();
    }));
});