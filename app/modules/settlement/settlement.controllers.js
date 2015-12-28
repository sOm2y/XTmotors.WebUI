'use strict';
/**
 * @ngdoc overview
 * @name xtmotorwebuiApp
 * @description
 * # xtmotorwebuiApp
 *
 * settlement controller of the application.
 */
angular.module('settlement.controllers',[])
	.controller('SettlementCtrl', ['$scope', function ($scope) {
		$scope.settlement = 'settlement'; 
		$scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales", "Tele Sales", "Corporate Sales"];
        $scope.data = [300, 500, 100, 40, 120];

       
	}]);