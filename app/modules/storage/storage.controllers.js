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

		xtmotorsAPIService.query({section:'car/summary'})
  			.$promise.then(function(itemList) {
				
				$translatePartialLoader.addPart('storage');
  				$translate.refresh();
				
				$scope.inStore=[];
				$scope.onTheWay=[];
				$scope.selected = [];
				
				angular.forEach(itemList, function(item,key){
					if(item.carStatus == 'For Sale' || item.carStatus == 'Sold'){
						$scope.inStore.push(item);
					}else {
						$scope.onTheWay.push(item);
					}
				});
        		  		
        		$scope.inStoreList = $scope.inStore;
          		$scope.onTheWayList = $scope.onTheWay;	

          		$rootScope.editCar = function(car){
          $q.all({
              importRecord: xtmotorsAPIService.get({section:'ImportRecords/'+car.carId}).$promise,
              vehicleModel: xtmotorsAPIService.get({ section:'VehicleModel/'+car.carId}).$promise,
              vehicleModelList: xtmotorsAPIService.query({ section:'VehicleModel/'}).$promise,
              car: xtmotorsAPIService.get({ section:'car/'+car.carId}).$promise,
              contract: xtmotorsAPIService.get({ section:'Contract/'+car.carId}).$promise
            })
            .then(function(res) {
                  $scope.importRecord  = res.importRecord;
                  $scope.contract      = res.contract;
                  $scope.car           = res.car;
                  $scope.vehicleModel  = res.vehicleModel;
                  $scope.vehicleModelList  = res.vehicleModelList;
                  if($scope.importRecord){
                    $q.all({
                      maintenance: xtmotorsAPIService.query({section:'Maintenance/Car/'+$scope.car.carId}).$promise,
                      importSummary: xtmotorsAPIService.get({ section:'Import/'+$scope.importRecord.batchId}).$promise
                    })
                    .then(function(res){
                      $scope.importSummary = res.importSummary;
                      $scope.maintenanceRecords = res.maintenance;
                      $scope.importSummary.eta = changeDateFormat($scope.importSummary.eta);
                      $scope.importSummary.createTime = changeDateFormat($scope.importSummary.createTime);
                    },function(error){
                      console.log(error);
                      $mdToast.show({
                        template: '<md-toast class="md-toast md-toast-' +error.status+ '"><span flex>' + error.statusText + '</span></md-toast>',
                        position: 'top right',
                        hideDelay: 5000,
                        parent: $element
                      });
                    });
                  }
                $state.go('car.details',{carId: car.carId});
                $scope.car.wofTime = changeDateFormat($scope.car.wofTime);
                $scope.contract.contractDate = changeDateFormat($scope.contract.contractDate);
            },function(error){
              $mdToast.show({
                template: '<md-toast class="md-toast md-toast-' +error.status+ '"><span flex>' + error.statusText + '</span></md-toast>',
                position: 'top right',
                hideDelay: 5000,
                parent: $element
              });
            });
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
       			$rootScope.isLoading = false;
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