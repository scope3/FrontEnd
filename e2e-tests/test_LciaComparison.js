var LciaComparisonPage = require("./LciaComparisonPage"),
    capture = require("./capture"),
    util = require("./util");


describe("LCIA Comparison", function () {

    var page = new LciaComparisonPage();

    function testRowCount(page) {
        page.gridRows.count().then( function (rowCount) {
            expect(rowCount).not.toBeNaN();
            page.charts.count().then( function (chartCount) {
                expect(chartCount).not.toBeNaN();
                page.bars.count().then( function (barCount) {
                    expect(barCount).not.toBeNaN();
                    expect(chartCount * rowCount).toEqual(barCount);
                });
            });
        });
    }

    describe("basics", function () {
        beforeAll(function () {
            page.get();
        });

        it("should have an export button", function () {
            expect(page.exportButton.isPresent()).toBe(true);
            //page.exportButton.click();
        });

        it("should have a grid with one row", function () {
            expect(page.grid.isPresent()).toBe(true);
            expect(page.gridRows.count()).toEqual(1);
        });

        it("should have selection controls", function () {
            expect(page.selection.type.isPresent()).toBe(true);
            expect(page.selection.fragment.isPresent()).toBe(true);
            expect(page.selection.scenario.isPresent()).toBe(true);
            expect(page.selection.activityLevel.isPresent()).toBe(true);
            expect(page.selection.chartLabel.isPresent()).toBe(true);
            expect(page.selection.addButton.isPresent()).toBe(true);
        });

        it("should have charts in method columns", function () {
            expect(page.charts.count()).not.toBeNaN();
            expect(page.methodCols.count()).not.toBeNaN();
            expect(page.charts.count()).toEqual(page.methodCols.count());
        });

        afterAll(function () {
            capture.takeScreenshot("LciaComparisonPage-basics");
        });

    });

    describe("selection", function () {
        beforeAll(function () {
            page.get();
        });

        it("should be able to add selection", function () {
            page.gridRows.count().then( function (startCount) {
                util.selectDropdownByNum(page.selection.type, 1);
                util.selectDropdownByNum(page.selection.scenario, 1);
                page.selection.activityLevel.sendKeys("e6");
                page.selection.chartLabel.sendKeys("label 1");
                page.selection.addButton.click().then( function () {
                    page.gridRows.count().then( function (endCount) {
                        expect(endCount).toEqual(startCount + 1);
                        testRowCount(page);
                        capture.takeScreenshot("LciaComparisonPage-add");
                    });
                });
            });
        });

        it("should be able to remove row", function () {
            page.gridRows.count().then( function (startCount) {
                page.selection.addButton.click().then(function () {
                    page.gridRows.count().then( function (addCount) {
                        expect(page.removeRowButtons.count()).toEqual(addCount);
                        page.removeRowButtons.get(addCount-1).click().then( function () {
                            page.gridRows.count().then( function (endCount) {
                                expect(endCount).toEqual(startCount);
                                testRowCount(page);
                            });
                        });
                    });
                });
            });
        });

    });
});