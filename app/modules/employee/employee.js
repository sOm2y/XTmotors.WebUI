'use strict';

/**
 * @ngdoc function
 * @name xtmotorwebuiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the xtmotorwebuiApp
 */
angular.module('employee',
    [
        'employee.controllers',
        // 'employee.directives',
        // 'employee.services'
    ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('employee', {
                url: "/employee",
                templateUrl: "views/employee/employee.html",
                controller: 'EmployeeCtrl',
                data: {
                    requireLogin: true
                }
            })
            .state('employee.details',{
                url:"/details",
                views:{
                    "employee-details-view":{
                        templateUrl:"views/employee/employee.details.html",
                        controller: 'EmployeeDetailsCtrl'
                    }
                },
                data:{
                    requireLogin: true
                }
            });
    }]);