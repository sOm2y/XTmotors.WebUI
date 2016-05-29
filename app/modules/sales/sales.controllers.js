'use strict';
/**
 * @ngdoc overview
 * @name xtmotorwebuiApp
 * @description
 * # xtmotorwebuiApp
 *
 * consignment controller of the application.
 */
angular.module('sales.controllers',[])
	.controller('SalesCtrl', ['$scope','xtmotorsAPIService', function ($scope,xtmotorsAPIService) {

		xtmotorsAPIService.query({ section:'contracts/'})
		.$promise.then(function(contracts){
			$scope.contracts = contracts;
		});

    $scope.options = {
      autoSelect: true,
      boundaryLinks: false,
      largeEditDialog: false,
      pageSelector: false,
      rowSelection: false
    };

    $scope.query = {
      order: 'carId',
      limitForSales: 15,
      pageForSales: 1
    };
    
	}]);
