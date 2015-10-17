'use strict';

/**
 * @ngdoc overview
 * @name xtmotorwebuiApp
 * @description
 * # xtmotorwebuiApp
 *
 * Main module of the application.
 */
angular
  .module('xtmotorwebuiApp', [
    //libraries
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'jm.i18next',
    'ui.router',
    'pascalprecht.translate',
    'ui.bootstrap',
    'nvd3',

    //XTmotors app
    'app.controllers',
    'app.directives',
    'app.services',

    //modules
    'car',
    'consignment',
    'customer',
    'employee',
    'settlement',
    'storage'
  ])
  .config(['$urlRouterProvider', function ($urlRouterProvider) {
        $urlRouterProvider.otherwise(function($injector) {
            var $state = $injector.get("$state");
            $state.go("car");
        });     
    }])
  .config(['$translateProvider',function($translateProvider ) {
    $translateProvider.useLoader('$translatePartialLoader', {
      urlTemplate: '/locales/{lang}/{part}.json'
    });
       $translateProvider.preferredLanguage('en-AU');
    }])
  .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('appSetting', {
                url: "/setting",
                templateUrl: "views/app/appSetting.html",
                controller: 'StorageCtrl',
                data: {
                    requireLogin: true
                }
            });
    }])
  .constant('_', window._)
  .run(['$rootScope', '$state', '$stateParams','loginModal',
    function($rootScope, $state, $stateParams,loginModal){
      $rootScope._ = window._;
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;

      $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        var requireLogin = toState.data.requireLogin;

        if (requireLogin && typeof $rootScope.currentUser === 'undefined') {
          event.preventDefault();

          loginModal()
            .then(function () {
              return $state.go(toState.name, toParams);
            })
            .catch(function () {
              return $state.go('car');
            });
          }
        });

  }]);

