'use strict';

describe('lcaApp.LCIA.comparison module', function() {

    var scope, ctrl;

    beforeEach(module('lcaApp.LCIA.comparison'));

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        ctrl = $controller('LciaComparisonController', {$scope: scope});
    }));


    it('should ....', inject(function() {
        expect(scope).toBeDefined();
        expect(ctrl).toBeDefined();
    }));

});