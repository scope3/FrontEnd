var CompositionProfilesPage = require("./CompositionProfilesPage");
var capture = require("./capture");

describe("Composition Profiles", function () {

    var page = new CompositionProfilesPage();

    beforeAll(function () {
        page.get();
        capture.takeScreenshot("CompositionProfilesPage-before");
    });

    afterAll(function () {
        capture.takeScreenshot("CompositionProfilesPage-after");
    });

    describe("basics", function () {
        beforeAll(function () {
            page.get();
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

        xit("should have a param grid", function () {
            expect(page.paramGrid.isPresent()).toBe(true);
        });
    });
});