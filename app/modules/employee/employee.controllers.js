'use strict';
/**
 * @ngdoc overview
 * @name xtmotorwebuiApp
 * @description
 * # xtmotorwebuiApp
 *
 * Main controller of the application.
 */
angular.module('employee.controllers',[])
	.controller('EmployeeCtrl', ['$scope', function ($scope) {
		$scope.employee = 'employee'; 
	}]);