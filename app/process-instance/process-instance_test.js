'use strict';

describe('lcaApp.process.instance module', function() {

    var scope, ctrl;

    beforeEach(module('lcaApp.process.instance'));

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        ctrl = $controller('ProcessInstanceController', {$scope: scope});
    }));


    it('should ....', inject(function() {
        expect(scope).toBeDefined();
        expect(ctrl).toBeDefined();
    }));

});