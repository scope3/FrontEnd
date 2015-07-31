var CompositionProfilesPage = require("./CompositionProfilesPage"),
    ParamGridDirective = require("./ParamGridDirective"),
    capture = require("./capture");

describe("Composition Profiles", function () {

    var page = new CompositionProfilesPage(),
        grid = new ParamGridDirective();

    describe("basics", function () {
        beforeAll(function () {
            page.get();
            grid.get(0);
        });

        afterAll(function () {
            capture.takeScreenshot("CompositionProfilesPage-basics");
        });

        it("should display a composition flow", function () {
            expect(page.flow.isPresent()).toBe(true);
        });

        it("should display a reference property", function () {
            expect(page.referenceFlowPropertyName.isPresent()).toBe(true);
        });

        it("should display a reference unit", function () {
            expect(page.referenceUnit.isPresent()).toBe(true);
        });

        it("should have a scenario selection", function () {
            expect(page.scenario.isPresent()).toBe(true);
        });

        it("should have a param grid", function () {
            expect(grid.gridOptions).toBeDefined();
        });

        it("should have grid rows", function () {
            expect(grid.renderedRows).toBeDefined();
            expect(grid.renderedRows.count()).toBeGreaterThan(0);
        });
    });
});