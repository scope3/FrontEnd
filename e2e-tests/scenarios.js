'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {

  browser.get('index.html');

  it('should automatically redirect to /scenarios when location hash/fragment is empty', function() {
    expect(browser.getLocationAbsUrl()).toMatch("/scenarios");
  });


  describe('scenarios', function() {

    beforeEach(function() {
      browser.get('index.html#/scenarios');
    });


    it('should render scenarios when user navigates to /scenarios', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 1/);
    });

  });


  describe('fragment-sankey', function() {

    beforeEach(function() {
      browser.get('index.html#/fragment-sankey');
    });


    it('should render fragment-sankey when user navigates to /fragment-sankey', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 2/);
    });

  });
});
