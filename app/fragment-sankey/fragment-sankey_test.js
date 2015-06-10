'use strict';

describe('lcaApp.fragment.sankey module', function() {

    var scope, ctrl;

  beforeEach(module('lcaApp.fragment.sankey'));

  beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        ctrl = $controller('FragmentSankeyController', {$scope: scope});
    }));


    it('should ....', inject(function() {
        expect(scope).toBeDefined();
        expect(ctrl).toBeDefined();
    }));

  });
