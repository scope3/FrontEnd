'use strict';

describe('lcaApp.fragment.flowParam module', function() {

    var scope, ctrl;

    beforeEach(module('lcaApp.fragment.flowParam'));

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        ctrl = $controller('FragmentFlowParamController', {$scope: scope});
    }));


    it('should ....', inject(function() {
        expect(scope).toBeDefined();
        expect(ctrl).toBeDefined();
    }));

});