'use strict';

// Declare app level module which depends on views, and components
angular.module('lcaApp', [
    'LocalStorageModule',
    'ui.router',
    'lcaApp.home',
    'lcaApp.fragment.sankey',
    'lcaApp.fragment.flowParam',
    'lcaApp.process.instance',
    'lcaApp.process.LCIA',
    'lcaApp.process.flowParam',
    'lcaApp.fragment.LCIA',
    'lcaApp.lciaMethod.detail',
    'lcaApp.scenario.detail',
    'lcaApp.scenario.edit'
    ]
)
    .config(['$stateProvider', '$urlRouterProvider', 'localStorageServiceProvider',
        function ($stateProvider, $urlRouterProvider, localStorageServiceProvider) {
            $urlRouterProvider.otherwise("/");
            $stateProvider.state('home', {
                url: "/",
                templateUrl: 'home/home.html',
                controller: 'HomeCtrl'
            })
                .state('fragment-sankey', {
                    url: '/fragment-sankey/{scenarioID}/{fragmentID}',
                    views: {
                        "@": {
                            templateUrl: 'fragment-sankey/fragment-sankey.html',
                            controller: 'FragmentSankeyCtrl'
                        }
                    }
                })
                .state('fragment-sankey.process-instance', {
                    url: '/process-instance/{fragmentFlowID}?activity',
                    views: {
                        "@": {
                            templateUrl: 'process-instance/process-instance.html',
                            controller: 'ProcessInstanceController'
                        }
                    }
                })
                .state('fragment-sankey.process-instance.flow-param', {
                    url: '/flow-param/{processID}/{lciaMethodID}',
                    views: {
                        "@": {
                            templateUrl: 'process-flow-param/process-flow-param.html',
                            controller: 'ProcessFlowParamCtrl'
                        }
                    }
                })
                .state('fragment-sankey.fragment-flow-param', {
                    url: '/fragment-flow-param',
                    views: {
                        "@": {
                            templateUrl: 'fragment-flow-param/fragment-flow-param.html',
                            controller: 'FragmentFlowParamController'
                        }
                    }
                })
                .state('fragment-flows', {
                    url: '/fragment-sankey',
                    views: {
                        "@": {
                            templateUrl: 'fragment-sankey/fragment-sankey.html',
                            controller: 'FragmentSankeyCtrl'
                        }
                    }
                })
                .state('fragment-flows.fragment-flow-param', {
                    url: '/fragment-flow-param/{scenarioID}/{fragmentID}',
                    views: {
                        "@": {
                            templateUrl: 'fragment-flow-param/fragment-flow-param.html',
                            controller: 'FragmentFlowParamController'
                        }
                    }
                })
                .state('process-lcia', {
                    url: '/process-lcia',
                    views: {
                        "@": {
                            templateUrl: 'process-lcia/process-lcia.html',
                            controller: 'ProcessLciaCtrl'
                        }
                    }
                })
                .state('process-lcia.flow-param', {
                    url: '/flow-param/{scenarioID}/{processID}/{lciaMethodID}',
                    views: {
                        "@": {
                            templateUrl: 'process-flow-param/process-flow-param.html',
                            controller: 'ProcessFlowParamCtrl'
                        }
                    }
                })
                .state('fragment-lcia', {
                    url: '/fragment-lcia',
                    views: {
                        "@": {
                            templateUrl: 'fragment-lcia/fragment-lcia.html',
                            controller: 'FragmentLciaCtrl'
                        }
                    }
                })
            .state('lcia-method', {
                url: '/lcia-method/{lciaMethodID}',
                views: {
                    "@": {
                        templateUrl: 'lcia-method/lcia-method-detail.html',
                        controller: 'LciaMethodDetailController'
                    }
                }
            })
            .state('new-scenario', {
                url: '/scenario/new',
                views: {
                    "@": {
                        templateUrl: 'scenario/scenario-edit.html',
                        controller: 'ScenarioEditController'
                    }
                }
            })
            .state('scenario', {
                url: '/scenario/{scenarioID}',
                views: {
                    "@": {
                        templateUrl: 'scenario/scenario-detail.html',
                        controller: 'ScenarioDetailController'
                    }
                }
            })
                .state('scenario.edit', {
                    url: '/edit',
                    views: {
                        "@": {
                            templateUrl: 'scenario/scenario-edit.html',
                            controller: 'ScenarioEditController'
                        }
                    }
                });
            localStorageServiceProvider.setPrefix('UsedOilLCA');
        }]);

