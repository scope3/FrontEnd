var HomePage = require("./HomePage");
var capture = require("./capture");

describe("Home", function () {

    var page = new HomePage();

    describe("basics", function () {

        beforeAll(function () {
            page.get();
        });

        afterAll(function () {
            capture.takeScreenshot("HomePage-basics");
        });

        it('should have a title', function () {
            expect(browser.getTitle()).toEqual('Used Oil LCA');
        });

        it('should list scenarios', function () {
            expect(page.scenarios.count()).toBeGreaterThan(1);
            expect(page.scenarios.get(0).getText()).toContain('Model Base Case');
        });

        it('should list LCIA methods', function () {
            expect(page.lciaMethods.count()).toBeGreaterThan(1);
            expect(page.lciaMethods.get(0).getText()).toContain('ILCD2011');
        });

        it('should display information messages', function () {
            expect(page.infoMessages.count()).toBeGreaterThan(1);
        });
    });

    describe("auth", function () {

        beforeAll(function () {
            page.get(browser.params.auth);
        });

        afterAll(function () {
            capture.takeScreenshot("HomePage-auth");
        });

        it('should have a title', function () {
            expect(browser.getTitle()).toEqual('Used Oil LCA');
        });

        it('should have a New scenario button', function () {
            expect(page.newButton.isPresent()).toBe(true);
        });
    });

    describe("new", function () {

        beforeAll(function () {
            page.get(browser.params.auth);
        });

        afterAll(function () {
            capture.takeScreenshot("HomePage-new");
        });

        it('should have a New scenario button', function () {
            page.newButton.click();
            expect(browser.getCurrentUrl()).toContain("new");
        });
    });
});