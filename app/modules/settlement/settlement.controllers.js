'use strict';
/**
 * @ngdoc overview
 * @name xtmotorwebuiApp
 * @description
 * # xtmotorwebuiApp
 *
 * Main controller of the application.
 */
angular.module('settlement.controllers',[])
	.controller('SettlementCtrl', ['$scope', function ($scope) {
		$scope.settlement = 'settlement'; 
	}]);