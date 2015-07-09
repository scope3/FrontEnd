'use strict';

describe('test lca-app anonymously', function () {

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
            var methodElements = element.all(by.repeater('method in lciaMethods'));
            expect(methodElements.count()).toBeGreaterThan(1);
            expect(methodElements.get(0).getText()).toContain('ILCD2011');

        });

        it('should display information messages', function () {
            var infoElements = element.all(by.css('.alert-info'));
            expect(infoElements.count()).toBe(3);
            expect(infoElements.get(0).getText()).toContain('home');
            expect(infoElements.get(1).getText()).toContain('scenarios');
            expect(infoElements.get(2).getText()).toContain('LCIA');
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

    describe('fragment-sankey view', function () {

        beforeEach(function () {
            browser.get('index.html#/home/fragment-sankey?scenarioID=1&fragmentID=1');
        });

        xit('should select scenario', function () {
            var scenarioElement = element(by.model('scenario'));
            expect(scenarioElement.getText()).toEqual('Model Base Case');

        });

        it('should contain sankey-diagram', function() {
            var sankeyElement = element(by.css('sankey-diagram'));
            expect(sankeyElement).toBeDefined();
        });

    });

});
