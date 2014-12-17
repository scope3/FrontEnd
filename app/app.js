'use strict';

// Declare app level module which depends on views, and components
angular.module('lcaApp', [
    'angularSpinner',
    'LocalStorageModule',
    'ui.router',
    'lcaApp.home',
    'lcaApp.fragment.sankey',
    'lcaApp.process.LCIA',
    'lcaApp.fragment.LCIA',
    'lcaApp.lciaMethod.detail',
    'lcaApp.version'])
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
                .state('fragment-sankey.process', {
                    url: '/process-lcia/{processID}?activity',
                    views: {
                        "@": {
                            templateUrl: 'process-lcia/process-lcia.html',
                            controller: 'ProcessLciaCtrl'
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
            });
            localStorageServiceProvider.setPrefix('UsedOilLCA');
        }]);

