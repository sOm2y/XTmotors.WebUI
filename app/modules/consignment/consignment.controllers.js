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
	.controller('ConsignmentCtrl', ['$rootScope','$scope','xtmotorsAPIService','$state', '$mdToast', '$element','$translate','$translatePartialLoader',
		function ($rootScope,$scope,xtmotorsAPIService,$state,$mdToast,$element,$translate,$translatePartialLoader) {
		
		$translatePartialLoader.addPart('consignments');
		$translatePartialLoader.addPart('errorMessage');
    	$translate.refresh();

		$rootScope.isLoading = true;
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
			$rootScope.isLoading = false;
		},function(error){
            $scope.showError(error);
        });

        xtmotorsAPIService.query({section:'car/summary'})
		.$promise.then(function(cars){
			$scope.cars = cars;
		},function(error){
            $scope.showError(error);
        });

        $scope.changeDateFormat = function(time){
	      return new Date(moment(time));
	    };

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
                template: '<md-toast class="md-toast md-toast-500' +error.status+ '"><span flex>' + error.statusText + '</span></md-toast>',
                position: 'top right',
                hideDelay: 5000,
                parent: $element
            });
        };

        $scope.successToast = function(message){
			$mdToast.show({
                template: '<md-toast class="md-toast md-toast-success"><span flex>' + message  + '</span></md-toast>',
                position: 'top right',
                hideDelay: 5000,
                parent: $element
            });
		};

	}])
	.controller('ConsignmentDetailsCtrl', ['$rootScope','$scope','xtmotorsAPIService','$stateParams', '$state',
		function ($rootScope,$scope,xtmotorsAPIService,$stateParams,$state) {
			if($rootScope.newBatch){
				$scope.batch = {};
				$scope.batch.batchId = $stateParams.batchId;
			}else{
				getBatchRecords();
				getImportRecord();
			}

		function getImportRecord(){
			xtmotorsAPIService.query({section:'ImportRecords/batch/'+$stateParams.batchId})
			.$promise.then(function(importRecords){
				$scope.importRecords = importRecords;
			},function(error){
            	$scope.showError(error);
        	});
		}

		function getBatchRecords(){
			xtmotorsAPIService.get({section:'Imports/'+$stateParams.batchId})
			.$promise.then(function(batch){
				$scope.batch = batch;
				$scope.batch.eta = $scope.changeDateFormat($scope.batch.eta);
				$scope.batch.invoiceDate = $scope.changeDateFormat($scope.batch.invoiceDate);
			},function(error){
            	$scope.showError(error);
        	});
		}

		function updateBatchRecord(){
			xtmotorsAPIService.update({section:'Imports/'+$scope.batch.batchId}, $scope.batch)
			.$promise.then(function(batch){
				$scope.successToast("Batch updates saved.");
			},function(error){
            	$scope.showError(error);
        	});
		}

		function saveBatchRecord(batch){
			xtmotorsAPIService.save({section:'Imports'}, batch)
			.$promise.then(function(res){
				$scope.successToast("New batch saved.");
				$rootScope.newBatch = false;
			},function(error){
            	$scope.showError(error);
        	});
		}

		function saveImportRecord(importCarRecord){
			xtmotorsAPIService.save({section:'ImportRecords'}, importCarRecord)
			.$promise.then(function(res){
				$scope.successToast("Add was successful.");
				getImportRecord();
			},function(error){
				error.statusText = "The car has alreday been added";
            	$scope.showError(error);
        	});
		}

		$scope.deleteImportRecord = function(carId){
			xtmotorsAPIService.remove({section:'ImportRecords/'+carId})
			.$promise.then(function(res){
				$scope.successToast("Delete was successful.");
				getImportRecord();
			},function(error){
            	$scope.showError(error);
        	});
		}

		// function getCar(carId){
		// 	xtmotorsAPIService.get({ section:'car/'+carId})
		// 	.$promise.then(function(car){
		// 		$scope.car = car;
		// 	},function(error){
  //           	$scope.showError(error);
  //       	});
		// }
		
		$scope.selectedItemChange = function(selectedCar){
			if(selectedCar !== null){
            	$scope.carToAdd = selectedCar;
          	}		
		};

		$scope.saveCarToBatch = function(car){
			//Need to chck if the car has been added.
			$scope.importCarRecord = {
				"carId": car.carId,
				"batchId": $scope.batch.batchId,
				"quantity": 1,
				"amount": 1,
				"gst": car.gst,
				"total": car.total,
				"paymentStatus": car.paymentStatus,
				"currency": car.currency,
				"description": car.description
			}
			saveImportRecord($scope.importCarRecord);
		};

		$scope.editImportRecord = function(importRecord){
			// getCar(importRecord.carId);
			// $rootScope.editCar($scope.car);
			$state.go('car.details',{carId: importRecord.carId}, {reload: true});
			$rootScope.isFromConsignment = true;
		};

		$scope.saveBatch = function(batch){
			if($rootScope.newBatch){
				saveBatchRecord(batch);
			}else{
				updateBatchRecord();
			}	
		};
		

	}]);
