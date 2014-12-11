'use strict';

describe('Unit test lcaApp.lciaMethod.detail module', function() {

    var scope, ctrl;

    beforeEach(module('lcaApp.lciaMethod.detail'));

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        ctrl = $controller('LciaMethodDetailController', {$scope: scope});
    }));


    it('should ....', inject(function() {
        expect(scope).toBeDefined();
        expect(ctrl).toBeDefined();
    }));

});