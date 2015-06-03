'use strict';

describe('test lca-app', function() {

  it('should have a title', function() {
    browser.get('index.html');
    expect(browser.getTitle()).toEqual('Used Oil LCA');
  });

  describe('home', function() {

    beforeEach(function() {
      browser.get('index.html#/home');
    });


    it('should list scenarios', function() {
      var scenarioElements = element.all(by.repeater('scenario in scenarios')),
          model;
      expect(scenarioElements.count()).toBeGreaterThan(1);
    });

  });

});
