'use strict';

describe('Unit test lcaApp.home module', function() {

    var scope, ctrl;

    beforeEach(module('lcaApp.home'));

    beforeEach(inject(function ($controller, $rootScope, _$state_, _$modal_) {
        scope = $rootScope.$new();
        ctrl = $controller('HomeCtrl', {$scope: scope, $state: _$state_, $modal: _$modal_});
    }));


    it('controller should have a scope', inject(function() {
        expect(scope).toBeDefined();
        expect(ctrl).toBeDefined();
    }));

});