'use strict';
/**
 * @ngdoc overview
 * @name xtmotorwebuiApp
 * @description
 * # xtmotorwebuiApp
 *
 * consignment controller of the application.
 */
angular.module('consignment.controllers',[])
	.controller('ConsignmentCtrl', ['$scope','xtmotorsAPIService', function ($scope,xtmotorsAPIService) {
		$scope.consignment = 'consignment'; 
		$scope.countToPaid = 20408;
		$scope.countFromPaid = 0;
		$scope.countToUnpaid = 10403;
		$scope.countFromUnpaid = 0;

		xtmotorsAPIService.query({ section:'Imports/'})
		.$promise.then(function(imports){
			$scope.imports = imports;
		});
	}]);