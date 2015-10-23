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
	.controller('EmployeeCtrl', 'xtmotorsAPIService', '$q',['$scope', function ($scope, xtmotorsAPIService, $q) {
		// $scope.employee = 'employee'; 
		xtmotorsAPIService.get({section:'employee'})
		.$promise.then(function(employees){
			$scope.employees = employees;
		},function(error){
			console.log(error);
		});
	}]);