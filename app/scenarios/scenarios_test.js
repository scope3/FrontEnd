'use strict';

describe('lcaApp.scenarios module', function () {

    var scope, ctrl;

    beforeEach(module('lcaApp.scenarios'));

    beforeEach(inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            ctrl = $controller('ScenarioListCtrl', {$scope: scope});
        }
    ));


    it('scope and controller are defined', function () {
        //spec body
        expect(scope).toBeDefined();
        expect(ctrl).toBeDefined();
    });


});