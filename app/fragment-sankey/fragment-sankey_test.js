'use strict';

describe('lcaApp.fragment.sankey module', function() {

  beforeEach(module('lcaApp.fragment.sankey'));

  describe('fragment-sankey controller', function(){

    it('should ....', inject(function($rootScope, $stateParams, $controller) {
      //spec body
        var scope = $rootScope.$new(),
            ctrl = $controller('FragmentSankeyCtrl', {$scope:scope});
        $stateParams.fragmentID = 8;
      expect(ctrl).toBeDefined();
    }));

  });
});