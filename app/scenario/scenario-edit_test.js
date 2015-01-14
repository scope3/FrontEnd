'use strict';

describe('Unit test lcaApp.scenario.edit module', function() {

    var scope, ctrl;

    beforeEach(module('lcaApp.scenario.edit'));

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        ctrl = $controller('ScenarioEditController', {$scope: scope});
    }));


    it('controller should have a scope', inject(function() {
        expect(scope).toBeDefined();
        expect(ctrl).toBeDefined();
    }));

});