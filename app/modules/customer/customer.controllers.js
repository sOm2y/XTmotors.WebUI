'use strict';
/**
 * @ngdoc overview
 * @name xtmotorwebuiApp
 * @description
 * # xtmotorwebuiApp
 *
 * customer controller of the application.
 */
angular.module('customer.controllers',[])
	.controller('CustomerCtrl', ['$rootScope','$scope','xtmotorsAPIService','$q', function ($rootScope,$scope,xtmotorsAPIService,$q) {
			$rootScope.isLoading = true;
			xtmotorsAPIService.query({section:'Customer'})
			.$promise.then(function(customer){
				$rootScope.customers = customer;

				$scope.totalCustomers = $scope.customers.length;
		        $scope.totalPages     = 10;
		        $scope.pagination = {
		            currentPage:  1
		        };        
		        $scope.customersPerPage    = 20;
		        
		        
		        $scope.paginatedCustomers = $scope.customers.slice(0, $scope.customersPerPage);

		        $scope.pageChanged = function(){
		         // $scope.currentPage = 1;
		          var begin = (($scope.pagination.currentPage - 1) * $scope.customersPerPage),
		              end   = begin + $scope.customersPerPage;

		          $scope.paginatedCustomers = $scope.customers.slice(begin, end);

		        };
			},function(error){
				console.log(error);
			})
			.finally(function(){
		       $rootScope.isLoading = false;
		    });
		
		
	}])
	.controller('CustomerDetailsCtrl', ['$rootScope','$scope', function ($rootScope,$scope) {
		
		
	}]);