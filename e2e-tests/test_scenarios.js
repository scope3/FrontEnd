'use strict';

describe('test lca-app', function() {

  browser.get('index.html');

  it('should have a title', function() {

    expect(browser.getTitle()).toEqual('Used Oil LCA');
  });

  describe('home', function() {

    beforeEach(function() {
      browser.get('index.html#/home');
    });


    it('should contain a ui-view', function() {
      expect(element.all(by.css('[ui-view] div')).toBeDefined());
    });

    it('should list scenarios', function() {
      var scenarioElements = element.all(by.repeater('scenario in scenarios')),
          model;
      expect(scenarioElements).toBeDefined();
      expect(scenarioElements.count()).toBeGreaterThan(1);
    });

  });

});
