var ScenarioDetailPage = require("./ScenarioDetailPage");
var ParamGridDirective = require("./ParamGridDirective");
var capture = require("./capture");

describe("Scenario Detail", function () {

    var page = new ScenarioDetailPage(),
        grid = new ParamGridDirective();


    describe("basics", function () {

        beforeAll(function () {
            page.get(1);
        });

        it("should display a name", function () {
            expect(page.name.isPresent()).toBe(true);
            expect(page.name.getText()).toEqual("Model Base Case");
        });

        it("should display a fragment", function () {
            expect(page.fragmentName.isPresent()).toBe(true);
            expect(page.fragmentName.getText()).toBeTruthy();
        });

        it("should display activity level", function () {
            expect(page.activityLevel.isPresent()).toBe(true);
            expect(page.activityLevel.getText()).toBeTruthy();
        });

        it("should display reference flow", function () {
            expect(page.referenceFlowName.isPresent()).toBe(true);
            expect(page.referenceFlowName.getText()).toBeTruthy();
        });

        it("should display reference unit", function () {
            expect(page.referenceUnit.isPresent()).toBe(true);
            expect(page.referenceUnit.getText()).toBeTruthy();
        });

        it("should display description", function () {
            expect(page.description.isPresent()).toBe(true);
        });

        it("should have a param grid", function () {
            grid.get(0);
            expect(grid.gridOptions).toBeDefined();
        });

        afterAll(function () {
            capture.takeScreenshot("ScenarioDetailPage-basics");
        });
    });

    describe("navigate", function () {
        beforeAll(function () {
            page.get(1);
        });

        it("should link to fragment", function () {
            page.fragmentName.click();
            expect(browser.getCurrentUrl()).toContain('fragment-sankey');
            capture.takeScreenshot("ScenarioDetailPage-navigate-fragment");
        });

    });
});