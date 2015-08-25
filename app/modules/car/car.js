'use strict';

/**
 * @ngdoc function
 * @name xtmotorwebuiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the xtmotorwebuiApp
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
                controller: 'CarCtrl'
            });
    }]);