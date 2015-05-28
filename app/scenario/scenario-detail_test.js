'use strict';

describe('Unit test lcaApp.scenario.detail module', function() {

    var scope, ctrl;

    beforeEach(module('ui.router'));
    beforeEach(module('lcaApp.scenario.detail'));

    beforeEach(inject(function ($controller, $rootScope,  _$state_) {
        scope = $rootScope.$new();
        ctrl = $controller('ScenarioDetailController', {$scope: scope, $state: _$state_});
    }));


    it('controller should have a scope', inject(function() {
        expect(scope).toBeDefined();
        expect(ctrl).toBeDefined();
    }));

});