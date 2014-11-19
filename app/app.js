'use strict';

// Declare app level module which depends on views, and components
angular.module('lcaApp', [
    'angularSpinner',
    'ui.router',
    'ncy-angular-breadcrumb',
    'lcaApp.scenarios',
    'lcaApp.fragment.sankey',
    'lcaApp.process.LCIA',
    'lcaApp.fragment.LCIA',
    'lcaApp.version'
]).
    config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/scenarios");
        $stateProvider.state('scenarios', {
            url: "/scenarios",
            templateUrl: 'scenarios/scenarios.html',
            controller: 'ScenarioListCtrl',
            data: {
                ncyBreadcrumbLabel: 'Scenarios'
            }
        })
        .state('scenarios.fragment', {
            url: '/{scenarioID}/fragment-sankey/{fragmentID}',
            views: {
                "@" : {
                    templateUrl: 'fragment-sankey/fragment-sankey.html',
                    controller: 'FragmentSankeyCtrl'
                }
            },
            data: {
                ncyBreadcrumbLabel: 'Fragment Sankey Diagram'
            }
        })
            .state('scenarios.process', {
                url: '/{scenarioID}/process-lcia/{processID}?activity',
                views: {
                    "@" : {
                        templateUrl: 'process-lcia/process-lcia.html',
                        controller: 'ProcessLciaCtrl'
                    }
                },
                data: {
                    ncyBreadcrumbLabel: 'Process LCIA'
                }
            })
            .state('fragment-lcia', {
                url: '/fragment-lcia',
                views: {
                    "@" : {
                        templateUrl: 'fragment-lcia/fragment-lcia.html',
                        controller: 'FragmentLciaCtrl'
                    }
                },
                data: {
                    ncyBreadcrumbLabel: 'Fragment LCIA'
                }
            });
    }]);

