'use strict';

describe('lcaApp.fragment.sankey module', function() {

  beforeEach(module('lcaApp.fragment.sankey'));

  describe('fragment-sankey controller', function(){

    it('should ....', inject(function($rootScope, $routeParams, $controller) {
      //spec body
        var scope = {},
            ctrl = $controller('FragmentSankeyCtrl', {$scope:scope});
        $routeParams.fragmentID = 8;
      expect(ctrl).toBeDefined();
    }));

  });
});