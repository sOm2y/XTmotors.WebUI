'use strict';

/**
 * @ngdoc function
 * @name xtmotorwebuiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the xtmotorwebuiApp
 */
angular.module('customer',
    [
        'customer.controllers',
        // 'customer.directives',
        // 'customer.services'
    ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('customer', {
                url: "/customer",
                templateUrl: "views/customer/customer.html",
                controller: 'CustomerCtrl',
                data: {
                    requireLogin: true
                }
            })
            .state('customer.details',{
                url:"/details",
                views:{
                    "customer-details-view":{
                        templateUrl:"views/customer/customer.details.html",
                        controller: 'CustomerDetailsCtrl',
                    }
                },
                data:{
                    requireLogin: true
                }
            });
    }]);