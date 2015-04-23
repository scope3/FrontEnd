'use strict';

describe('Unit test lcaApp.scenario.clone module', function() {

    var scope, ctrl, scenario = { name : "clone me"};

    beforeEach(module('lcaApp.scenario.clone'));

    beforeEach(inject(function ($controller, $rootScope, _$modal_) {
        scope = $rootScope.$new();
        ctrl = $controller('ScenarioCloneController', {$scope: scope, $modalInstance: _$modal_, scenario: scenario});
    }));


    it('controller should have a scope', inject(function() {
        expect(scope).toBeDefined();
        expect(ctrl).toBeDefined();
    }));

});