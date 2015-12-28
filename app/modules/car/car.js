'use strict';

/**
 * @ngdoc function
 * @name xtmotorwebuiApp: car config
 * @description
 * # car config of the xtmotorwebuiApp
 */
angular.module('car',
    [
        'car.controllers'
        // 'car.directives',
        // 'car.services'
    ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('car', {
                url: "/car",
                templateUrl: "views/car/car.html",
                controller: 'CarCtrl',
                data: {
                    requireLogin: true
                }
            })
            .state('car-details', {
                url: "/car-details",
                templateUrl: "views/car/carDetails.html",
                controller: 'CarDetailsCtrl',
                data: {
                    requireLogin: true
                }
            })
            ;
    }]);