'use strict';

/**
 * @ngdoc function
 * @name xtmotorwebuiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the xtmotorwebuiApp
 */
angular.module('settlement',
    [
        'settlement.controllers',
        // 'settlement.directives',
        // 'settlement.services'
    ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('settlement', {
                url: "/settlement",
                templateUrl: "modules/settlement/settlement.html",
                controller: 'SettlementCtrl',
                data: {
                    requireLogin: true
                }
            });
    }]);