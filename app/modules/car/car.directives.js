'use strict';
angular.module('car.directives', [])
	.directive('vehicleSummary', [function () {
		return {
			restrict: 'E',
			templateUrl:'modules/car/vehicleSummary.html'
		};
	}])
	.directive('importSummary', [function () {
		return {
			restrict: 'E',
			templateUrl:'modules/car/importSummary.html'
		};
	}])
	.directive('maintenanceRecordList', [function () {
		return {
			restrict: 'E',
			templateUrl:'modules/car/maintenanceRecordList.html'
		};
	}])
	.directive('maintenanceRecordDetails', [function () {
		return {
			restrict: 'E',
			templateUrl:'modules/car/maintenanceRecordDetails.html'
		};
	}])
	.directive('contractSummary', [function () {
		return {
			restrict: 'E',
			templateUrl:'modules/car/contractSummary.html'
		};
	}]);
	
