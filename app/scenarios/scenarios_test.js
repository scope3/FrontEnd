'use strict';

describe('lcaApp.scenarios module', function() {

  beforeEach(module('lcaApp.scenarios'));


  describe('scenarios controller', function(){

    it('unit test scenarios', inject(function($controller) {
      //spec body
      var scope = {},
          ctrl = $controller('ScenarioListCtrl', {$scope:scope});
    }));

  });
});