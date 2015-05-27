'use strict';
// Declare app level module which depends on views, and components
angular.module('lcaApp', [
        'lcaApp.config',
    'LocalStorageModule',
    'ui.router',
    'lcaApp.html',
    'lcaApp.home',
    'lcaApp.fragment.sankey',
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
            //$urlRouterProvider.otherwise("/");
            // Invalid route, go home with extracted auth parameter
            $urlRouterProvider.otherwise(function($injector, $location){
                var homeURL = "/home",
                    searchObject = $location.search();
                if ( searchObject && searchObject.hasOwnProperty("auth")) {
                    homeURL = "/home?auth=" + searchObject.auth;
                }
                return homeURL;
            });
            $stateProvider.state('home', {
                url: "/home?auth",
                templateUrl: 'home/home.html',
                controller: 'HomeCtrl'
            })
                .state('home.fragment-sankey', {
                    url: '/fragment-sankey?scenarioID&fragmentID',
                    views: {
                        "@": {
                            templateUrl: 'fragment-sankey/fragment-sankey.html',
                            controller: 'FragmentSankeyCtrl'
                        }
                    }
                })
                .state('home.fragment-sankey.process-instance', {
                    url: '/process-instance/{fragmentFlowID}?activity',
                    views: {
                        "@": {
                            templateUrl: 'process-instance/process-instance.html',
                            controller: 'ProcessInstanceController'
                        }
                    }
                })
                .state('home.fragment-sankey.process-instance.flow-param', {
                    url: '/flow-param/{processID}/{lciaMethodID}',
                    views: {
                        "@": {
                            templateUrl: 'process-flow-param/process-flow-param.html',
                            controller: 'ProcessFlowParamCtrl'
                        }
                    }
                })
                .state('home.fragment-sankey.fragment-lcia', {
                    url: '/fragment-lcia',
                    views: {
                        "@": {
                            templateUrl: 'fragment-lcia/fragment-lcia.html',
                            controller: 'FragmentLciaCtrl'
                        }
                    }
                })
                .state('home.process-lcia', {
                    url: '/process-lcia',
                    views: {
                        "@": {
                            templateUrl: 'process-lcia/process-lcia.html',
                            controller: 'ProcessLciaCtrl'
                        }
                    }
                })
                .state('home.process-lcia.flow-param', {
                    url: '/flow-param/{scenarioID}/{processID}/{lciaMethodID}',
                    views: {
                        "@": {
                            templateUrl: 'process-flow-param/process-flow-param.html',
                            controller: 'ProcessFlowParamCtrl'
                        }
                    }
                })
                .state('home.fragment-lcia', {
                    url: '/fragment-lcia',
                    views: {
                        "@": {
                            templateUrl: 'fragment-lcia/fragment-lcia.html',
                            controller: 'FragmentLciaCtrl'
                        }
                    }
                })
            .state('home.lcia-method', {
                url: '/lcia-method/{lciaMethodID}',
                views: {
                    "@": {
                        templateUrl: 'lcia-method/lcia-method-detail.html',
                        controller: 'LciaMethodDetailController'
                    }
                }
            })
            .state('home.new-scenario', {
                url: '/scenario/new',
                views: {
                    "@": {
                        templateUrl: 'scenario/scenario-edit.html',
                        controller: 'ScenarioEditController'
                    }
                }
            })
            .state('home.scenario', {
                url: '/scenario/{scenarioID}',
                views: {
                    "@": {
                        templateUrl: 'scenario/scenario-detail.html',
                        controller: 'ScenarioDetailController'
                    }
                }
            })
                .state('home.scenario.edit', {
                    url: '/edit',
                    views: {
                        "@": {
                            templateUrl: 'scenario/scenario-edit.html',
                            controller: 'ScenarioEditController'
                        }
                    }
                });
            localStorageServiceProvider.setPrefix('UsedOilLCA');
        }])
    .controller('LcaAppController', ['$rootScope', 'HELP_ROOT',
        function($rootScope, HELP_ROOT) {
            $rootScope.helpPage = HELP_ROOT;
        }
    ])
;
