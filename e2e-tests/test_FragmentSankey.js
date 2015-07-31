var FragmentSankeyPage = require("./FragmentSankeyPage");
var capture = require("./capture");

describe("Scenario Detail", function () {

    var page = new FragmentSankeyPage();

    describe("basics", function () {

        beforeAll(function () {
            page.get();
        });

        it("should provide an option to select scenario", function () {
            expect(page.scenario.isPresent()).toBe(true);
            expect(page.scenario.element(by.cssContainingText('option', "Model Base Case")).isPresent()).toBe(true);
        });

        it('should contain sankey-diagram', function() {
            expect(page.sankeyDiagram.isPresent()).toBe(true);
        });

        it('should contain legend with 5 rows', function() {
            expect(page.legendRows.count()).toBe(5);
        });

        afterAll(function () {
            capture.takeScreenshot("FragmentSankeyPage-basics");
        });
    });

});