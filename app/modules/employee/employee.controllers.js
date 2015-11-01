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
	.controller('EmployeeCtrl', [ '$scope','xtmotorsAPIService','$q', function ($scope, xtmotorsAPIService, $q ) {
		// $scope.employee = 'employee'; 
		xtmotorsAPIService.query({section:'Employee'})
		.$promise.then(function(employees){
			$scope.employees = employees;
		},function(error){
			console.log(error);
		});
	}]);