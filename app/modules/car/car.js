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
            .state('car.details', {
                url: "/details",
                params: {myParam: null},
                views: {
                    "car-details-view": { 
                        templateUrl: "views/car/car.details.html",
                        controller: 'CarDetailsCtrl'
                    }
                },
                data: {
                    requireLogin: true
                }
            });
    }]);