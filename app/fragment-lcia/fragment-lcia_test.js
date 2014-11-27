'use strict';

describe('lcaApp.fragment.LCIA module', function() {

    var scope, ctrl;

    beforeEach(module('lcaApp.fragment.LCIA'));

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        ctrl = $controller('FragmentLciaCtrl', {$scope: scope});
    }));


    it('should ....', inject(function() {
        expect(scope).toBeDefined();
        expect(ctrl).toBeDefined();
    }));

});