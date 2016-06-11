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
	.controller('ConsignmentCtrl', ['$rootScope','$scope','xtmotorsAPIService','$state', '$mdToast', '$element',
		function ($rootScope,$scope,xtmotorsAPIService,$state,$mdToast,$element) {
		$scope.consignment = 'consignment';
		$scope.countToPaid = 20408;
		$scope.countFromPaid = 0;
		$scope.countToUnpaid = 10403;
		$scope.countFromUnpaid = 0;
		// $rootScope.newBatch = false;

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
		},function(error){
            $scope.showError(error);
        });;

		$scope.createImport = function(){
			$rootScope.newBatch = true;
			$state.go('consignment.details', {batchId:$scope.imports.length+1}, {reload: true});
		};

		$scope.editImport = function(importDetail){
			//$scope.import = importDetail;
			$rootScope.newBatch = false;
			$state.go('consignment.details',{batchId:importDetail.batchId});
			// $scope.customer.dob = changeDateFormat(customer.dob);
		};

		$scope.backToConsignment = function(){
			$rootScope.newBatch = false;
			$state.go('consignment', {}, {reload: true});
		};

		$scope.showError = function(error){
        	$mdToast.show({
                template: '<md-toast class="md-toast md-toast-' +error.status+ '"><span flex>' + error.statusText + '</span></md-toast>',
                position: 'top right',
                hideDelay: 5000,
                parent: $element
            });
        };
	}])
	.controller('ConsignmentDetailsCtrl', ['$rootScope','$scope','xtmotorsAPIService','$stateParams',
		function ($rootScope,$scope,xtmotorsAPIService,$stateParams) {
			if($rootScope.newBatch){
				$scope.batch = [];
				$scope.batch.batchId = $stateParams.batchId;
			}else{
				getImportRecord();
				getBatchRecords();
			}

		function getBatchRecords(){
			xtmotorsAPIService.query({section:'ImportRecords/batch/'+$stateParams.batchId})
			.$promise.then(function(importRecords){
				$scope.importRecords = importRecords;
			});
		}

		function getImportRecord(){
			xtmotorsAPIService.get({section:'Imports/'+$stateParams.batchId})
			.$promise.then(function(batch){
				console.log(batch);
				$scope.batch = batch;
			});
		}
		

		$scope.selectedItemChange = function(selectedCar){
			if(selectedCar !== null){
            	$scope.carToAdd = selectedCar;
          	}		
		};

		$scope.saveCarToBatch = function(car){
			console.log(car);
		};

	}]);
