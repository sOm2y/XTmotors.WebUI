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
	.controller('ConsignmentCtrl', ['$scope','xtmotorsAPIService','$state',function ($scope,xtmotorsAPIService,$state) {
		$scope.consignment = 'consignment';
		$scope.countToPaid = 20408;
		$scope.countFromPaid = 0;
		$scope.countToUnpaid = 10403;
		$scope.countFromUnpaid = 0;

		$scope.options = {
      autoSelect: true,
      boundaryLinks: false,
      largeEditDialog: false,
      pageSelector: false,
      rowSelection: false
    };

    $scope.query = {
      order: 'batchId',
      limit: 15,
      page: 1
    };

		xtmotorsAPIService.query({section:'Imports/'})
		.$promise.then(function(imports){
			$scope.imports = imports;

			$scope.createImport = function(){
					$state.go('consignment.details');
			}
			$scope.editImport = function(importDetail){
				$scope.import = importDetail;
				$state.go('consignment.details',{batchId:$scope.import.batchId});
				// $scope.customer.dob = changeDateFormat(customer.dob);
			};
			$scope.backToConsignment = function(){
				$state.go('consignment');
			};
		});
	}])
	.controller('ConsignmentDetailsCtrl', ['$scope','xtmotorsAPIService' ,function ($scope,xtmotorsAPIService) {
		xtmotorsAPIService.query({section:'ImportRecords/'})
		.$promise.then(function(importRecords){
			$scope.importRecords = importRecords;
		});

	}]);
