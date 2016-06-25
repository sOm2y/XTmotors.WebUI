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
        'consignment.directives',
        // 'consignment.services'
    ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('consignment', {
                url: "/consignment",
                templateUrl: "modules/consignment/consignment.html",
                controller: 'ConsignmentCtrl',
                data: {
                    requireLogin: true
                }
            })
             .state('consignment.details', {
                url:"/:batchId",
                views:{
                    "consignment-details-view":{
                        templateUrl:"modules/consignment/consignment.details.html",
                        controller: 'ConsignmentDetailsCtrl',
                    }
                },
                data:{
                    requireLogin: true
                }
            });
            
    }]);