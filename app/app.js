'use strict';
// Declare app level module which depends on views, and components
angular.module('lcaApp', [
        'lcaApp.config',
        'lcaApp.info.directive',
        'LocalStorageModule',
        'ui.router',
        'lcaApp.html',
        'lcaApp.home',
        'lcaApp.compositionProfiles',
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
            .state('home.composition-profiles', {
                url: '/composition-profiles',
                views: {
                    "@": {
                        templateUrl: 'composition-profiles/composition-profiles.html',
                        controller: 'CompositionProfilesController'
                    }
                }
            })
            .state('home.fragment-sankey', {
                url: '/fragment-sankey?scenarioID&fragmentID',
                views: {
                    "@": {
                        templateUrl: 'fragment-sankey/fragment-sankey.html',
                        controller: 'FragmentSankeyController'
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
                        controller: 'ProcessFlowParamController'
                    }
                }
            })
            .state('home.fragment-sankey.fragment-lcia', {
                url: '/fragment-lcia',
                views: {
                    "@": {
                        templateUrl: 'fragment-lcia/fragment-lcia.html',
                        controller: 'FragmentLciaController'
                    }
                }
            })
            .state('home.process-lcia', {
                url: '/process-lcia',
                views: {
                    "@": {
                        templateUrl: 'process-lcia/process-lcia.html',
                        controller: 'ProcessLciaController'
                    }
                }
            })
            .state('home.process-lcia.flow-param', {
                url: '/flow-param/{scenarioID}/{processID}/{lciaMethodID}',
                views: {
                    "@": {
                        templateUrl: 'process-flow-param/process-flow-param.html',
                        controller: 'ProcessFlowParamController'
                    }
                }
            })
            .state('home.fragment-lcia', {
                url: '/fragment-lcia',
                views: {
                    "@": {
                        templateUrl: 'fragment-lcia/fragment-lcia.html',
                        controller: 'FragmentLciaController'
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
    .controller('LcaAppController', ['$rootScope', 'HELP_ROOT', 'INFO_MSG',
        function($rootScope, HELP_ROOT, INFO_MSG) {
            $rootScope.helpPage = HELP_ROOT;
            $rootScope.infoMsg = INFO_MSG;
            $rootScope.displayInfo = true;

            $rootScope.$on('$stateChangeStart',
                function(event, toState) {
                    //
                    // Help context is derived from last part of toState name
                    //
                    var lastPos = toState.name.lastIndexOf('.'),
                        helpPage = HELP_ROOT;

                    if (lastPos >= 0) {
                        var context = toState.name.slice(lastPos+1);

                        switch (context) {
                            case 'fragment-sankey' :
                                helpPage += '/Fragment';
                                break;
                            case 'fragment-lcia' :
                                helpPage += '/LCIA#fragment-lcia';
                                break;
                            case 'lcia-method' :
                                helpPage += '/LCIA#lcia-method';
                                break;
                            case 'process-instance' :
                            case 'process-lcia' :
                                helpPage += '/Process';
                                break;
                            case 'flow-param' :
                                helpPage += '/LCIA#lcia-flow-details';
                                break;
                            case 'scenario' :
                                helpPage += '/Scenario';
                                break;
                        }
                    }
                    $rootScope.helpPage = helpPage;
                }
            );
        }
    ])
;
