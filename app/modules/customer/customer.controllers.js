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
	.controller('CustomerCtrl', ['$scope','xtmotorsAPIService','$q', function ($scope,xtmotorsAPIService,$q) {
		$scope.customer = 'customer'; 
		xtmotorsAPIService.query({section:'Customer'})
		.$promise.then(function(customer){
			$scope.customers = customer;
		},function(error){
			console.log(error);
		});
	}])
	.controller('CustomerDetailsCtrl', ['$scope', function ($scope) {
		
	}]);