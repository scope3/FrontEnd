'use strict';

describe('lcaApp.process.LCIA module', function() {

    var scope, ctrl;

    beforeEach(module('lcaApp.process.LCIA'));

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        ctrl = $controller('ProcessLciaCtrl', {$scope: scope});
    }));


    it('should ....', inject(function() {
        expect(scope).toBeDefined();
        expect(ctrl).toBeDefined();
    }));

});