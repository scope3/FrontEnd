'use strict';

describe('test lca-app', function () {

    it('should have a title', function () {
        browser.get('index.html');
        expect(browser.getTitle()).toEqual('Used Oil LCA');
    });

    describe('home view', function () {

        beforeEach(function () {
            browser.get('index.html#/home');
        });


        it('should list scenarios', function () {
            var scenarioElements = element.all(by.repeater('scenario in scenarios'));
            expect(scenarioElements.count()).toBeGreaterThan(1);
            expect(scenarioElements.get(0).getText()).toContain('Model Base Case');
        });

        it('should list LCIA methods', function () {
            var elts = element.all(by.repeater('method in lciaMethods'));
            expect(elts.count()).toBeGreaterThan(1);
            expect(elts.get(0).getText()).toContain('ILCD2011');

        });

    });

    describe('detail scenario view', function () {

        beforeEach(function () {
            browser.get('index.html#/home/scenario/1');
        });

        it('should display scenario attributes', function () {
            var labels = element.all(by.css('dt')),
                attributes = element.all(by.css('dd'));
            expect(attributes.count()).toEqual(labels.count());
            expect(labels.get(0).getText()).toEqual('Name');
            expect(attributes.get(0).getText()).toEqual('Model Base Case');
        });

        it('should link to top level fragment', function () {
            var tlfLink = element.all(by.css('dd')).get(1).all(by.css('a')).first();
            tlfLink.click();
            expect(browser.getCurrentUrl()).toContain('fragment-sankey');
        });

        it('should contain a parameter grid', function () {
            var grid = element.all(by.css('.ngGrid')).first(),
                gridOpts = grid.getAttribute("gridOptions");

            expect(gridOpts).toBeDefined();
            expect(grid.all(by.css('.ngHeaderSortColumn')).get(0).getText()).toEqual('Parameter Type');
        });

    });

});
