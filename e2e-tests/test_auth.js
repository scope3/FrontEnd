'use strict';

describe('test lca-app, authenticated mode', function () {

    var authParam = "?auth=4e49337";

    describe('new scenario view', function () {

        beforeEach(function () {
            browser.get('index.html#/home/scenario/new' + authParam);
        });

        xit('fragment selection should initialize other fields', function () {
            var fragName = 'Natural Gas Supply Mixer',
                fragSelect = element(by.model('scenario.topLevelFragmentID')),
                fragOption = fragSelect.element(by.cssContainingText('option', fragName));

            fragOption.click();
            expect(element(by.model('scenario.name')).getText()).toEqual(fragName);
        });

        it('Save button should be disabled before fragment is selected', function () {
            var btn = element(by.buttonText("Save"));
            expect(btn.isEnabled()).toBe(false);
            btn = element(by.buttonText("Cancel"));
            expect(btn.isEnabled()).toBe(true);
        });

    });

});
