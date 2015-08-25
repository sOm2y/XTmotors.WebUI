'use strict';
/**
 * @ngdoc overview
 * @name xtmotorwebuiApp
 * @description
 * # xtmotorwebuiApp
 *
 * Main controller of the application.
 */
angular.module('customer.controllers',[])
	.controller('CustomerCtrl', ['$scope', function ($scope) {
		$scope.customer = 'customer'; 
	}]);