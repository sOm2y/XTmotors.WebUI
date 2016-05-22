'use strict';

/**
 * @ngdoc function
 * @name xtmotorwebuiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the xtmotorwebuiApp
 */
angular.module('sales',
    [
        'sales.controllers',
        // 'customer.directives',
        // 'customer.services'
    ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('sales', {
                url: "/sales",
                templateUrl: "modules/sales/sales.html",
                controller: 'SalesCtrl',
                data: {
                    requireLogin: true
                }
            })
            .state('sales.details',{
                url:"/:ContractsId",
                views:{
                    "sales-details-view":{
                        templateUrl:"modules/sales/sales.details.html",
                        controller: 'SalesDetailsCtrl',
                    }
                },
                data:{
                    requireLogin: true
                }
            });
    }]);