'use strict';
/**
 * @ngdoc overview
 * @name xtmotorwebuiApp
 * @description
 * # xtmotorwebuiApp
 *
 * employee controller of the application.
 */
angular.module('employee.controllers',[])
	.controller('EmployeeCtrl', ['$rootScope','$scope','xtmotorsAPIService','$q', function ($rootScope,$scope, xtmotorsAPIService, $q ) {
		// $scope.employee = 'employee'; 
		$rootScope.isLoading = true;
		xtmotorsAPIService.query({section:'Employee'})
		.$promise.then(function(employees){
			$scope.employees = employees;
			$scope.totalEmployees = $scope.employees.length;
		    $scope.totalPages = 10;
		   	$scope.pagination = {
		        currentPage:  1
		    };        
		    $scope.employeesPerPage = 20;
			$scope.paginatedEmployees = $scope.employees.slice(0, $scope.employeesPerPage);

		    $scope.pageChanged = function(){
		         // $scope.currentPage = 1;
		        var begin = (($scope.pagination.currentPage - 1) * $scope.employeesPerPage),
		            end   = begin + $scope.employeesPerPage;

		        $scope.paginatedEmployees = $scope.employees.slice(begin, end);

		    };
		},function(error){
			console.log(error);
		}).finally(function(){
	       $rootScope.isLoading = false;
	    });
	}])
	.controller('EmployeeDetailsCtrl', ['$scope', function ($scope) {
		
	}]);