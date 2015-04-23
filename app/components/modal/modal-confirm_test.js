'use strict';

describe('Unit test lcaApp.modal.confirm module', function() {

    var scope, ctrl,
        parameters = { title : "Confirm Delete", question : "Are you sure you want to permanently delete the resource?"};

    beforeEach(module('lcaApp.modal.confirm'));

    beforeEach(inject(function ($controller, $rootScope, _$modal_) {
        scope = $rootScope.$new();
        ctrl = $controller('ModalConfirmController', {$scope: scope, $modalInstance: _$modal_, parameters: parameters});
    }));


    it('controller should have a scope', inject(function() {
        expect(scope).toBeDefined();
        expect(ctrl).toBeDefined();
    }));

});