'use strict';

/**
 * @ngdoc function
 * @name xtmotorwebuiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the xtmotorwebuiApp
 */
angular.module('storage',
    [
        'storage.controllers',
        // 'storage.directives',
        // 'storage.services'
    ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('storage', {
                url: "/storage",
                templateUrl: "modules/storage/storage.html",
                controller: 'StorageCtrl',
                data: {
                    requireLogin: true
                }
            });
    }]);