'use strict';

/**
 * @ngdoc function
 * @name xtmotorwebuiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the xtmotorwebuiApp
 */
angular.module('consignment',
    [
        'consignment.controllers',
        // 'consignment.directives',
        // 'consignment.services'
    ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('consignment', {
                url: "/consignment",
                templateUrl: "views/consignment/consignment.html",
                controller: 'ConsignmentCtrl',
                data: {
                    requireLogin: true
                }
            });
    }]);