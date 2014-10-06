'use strict';

describe('lcaApp.scenarios module', function() {

  beforeEach(module('lcaApp.resourceServices'));
  beforeEach(module('lcaApp.scenarios'));

  describe('scenarios controller', function(){

    it('should have some scenarios', inject(function($controller) {
      //spec body
      var scope = {},
          ctrl = $controller('ScenarioListCtrl', {$scope:scope});
        expect(ctrl).toBeDefined();
        expect(scope).toBeDefined();
        expect(scope.scenarios).toBeDefined();
    }));

  });
});