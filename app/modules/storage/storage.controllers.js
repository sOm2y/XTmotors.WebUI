'use strict';
/**
 * @ngdoc overview
 * @name xtmotorwebuiApp
 * @description
 * # xtmotorwebuiApp
 *
 * storage controller of the application.
 */
angular.module('storage.controllers',[])
	.controller('StorageCtrl',['$rootScope','$scope','$translate','$translatePartialLoader','xtmotorsCRUDService','xtmotorsAPIService','$q','$state', function ($rootScope,$scope, $translate, $translatePartialLoader,xtmotorsCRUDService,xtmotorsAPIService,$q,$state) {

		$rootScope.isLoading = true;

		$scope.getCarBatch = function(car, batchId){
	      xtmotorsAPIService.get({section:'Imports/' + batchId})
	      .$promise.then(function(batch) {   
	        car.arriveTime = batch.eta;
	        $rootScope.isLoading = false;
	      },function(error){
	        $rootScope.showError(error);
	      });
	    };

	    $scope.getCarImportRecord = function(car){
	      xtmotorsAPIService.get({ section:'ImportRecords/'+car.carId})
	      .$promise.then(function(res){
	        $scope.importSummary = res;
	        $scope.getCarBatch(car, res.batchId);
	      },function(error){
	        car.arriveTime = "HAS NOT BEEN FINALIZED";
	      });
	    };

		xtmotorsAPIService.query({section:'car/summary'})
  			.$promise.then(function(itemList) {

				$translatePartialLoader.addPart('storage');
  			$translate.refresh();

				$scope.inStore=[];
				$scope.onTheWay=[];
				$scope.selected = [];
				$rootScope.isLoading = false;

				_.forEach(itemList, function(car){ 
          			$scope.getCarImportRecord(car);
        		})

				angular.forEach(itemList, function(item,key){
					if(item.carStatus == 'For Sale' || item.carStatus == 'Sold' || item.carStatus == 'Reserved'){
						$scope.inStore.push(item);
					}else {
						$scope.onTheWay.push(item);
					}
				});

    		$scope.inStoreList = $scope.inStore;
      	$scope.onTheWayList = $scope.onTheWay;

        $scope.editCar = function(car){
          $state.go('car.details',{carId: car.carId}, {reload: true});
          $rootScope.isFromStorage = true;
        };


         $scope.selectedItemChange = function(selectVehicle) {
          if(selectVehicle !== null){
            $scope.vehicleModel = selectVehicle;
          }
        };


        function changeDateFormat(date){
          var wofTime = moment(date).startOf('day').toDate();
          return wofTime;
        }

        $scope.backToCar = function(){
          // xtmotorsCRUDService.cancelEdit($scope);
          $state.go('car');
        };
        $scope.saveCar= function(car,vehicleModel,importRecord,contract,importSummary){
          // var formValid = xtmotorsAPIService.validateForm($scope);
          // if(formValid){
          $q.all({
              car: xtmotorsAPIService.update({section:'car/'+car.carId}, car).$promise,
              vehicleModel: xtmotorsAPIService.update({ section:'VehicleModel/'},vehicleModel).$promise,
              importRecord: xtmotorsAPIService.update({ section:'ImportRecords/'+car.carId}, importRecord).$promise,
              contract: xtmotorsAPIService.update({ section:'Contract/'+car.carId}, contract).$promise,
              // maintenance: xtmotorsAPIService.update({section:'Maintenance/'+$scope.maintenance.recordId}, $scope.maintenance).$promise,
              importSummary: xtmotorsAPIService.update({ section:'Import/'+ importRecord.batchId}, importSummary).$promise
          })
          .then(function(res){
            // console.log(res);
          },function(error){
            console.log(error);
            $mdToast.show({
              template: '<md-toast class="md-toast md-toast-' +error.status+ '"><span flex>' + error.statusText + '</span></md-toast>',
              position: 'top right',
              hideDelay: 5000,
              parent: $element
            });
          }).finally(function(){

          })
        };

      		}, function(error) {

    		}).finally(function(){
       			//$rootScope.isLoading = false;
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
	        limitForInStore: 5,
	        limitForOnTheWay: 5,
	        pageForInStore: 1,
	        pageForOnTheWay: 1
	    };

		$scope.checkCarStatusColor = function(carStatus){
			switch(carStatus){
			    case "Sold":
			        return "sold";
			    case "Reserved":
			        return "reserved";
			    case "For Sale":
			        return "sale";
			    case "Inspection":
			        return "inspection";
			    case "Arrived Port":
			        return "arrived";
			    case "Departed Port":
			        return "departed";
			}
	    };
			// xtmotorsCRUDService.get('Car',$scope)
			// console.log($scope.itemList[0]);
			// angular.forEach($scope.itemList, function(item,key){
			// 		if(item.carStatus == 'For Sale' || item.carStatus == 'Sold'){
			// 			$scope.inStore.push(item);
			// 			console.log(item);
			// 		}else {
			// 			$scope.onTheWay.push(item);
			// 		}
			// 	});

	}]);
