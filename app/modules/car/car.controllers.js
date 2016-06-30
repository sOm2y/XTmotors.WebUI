'use strict';
/**
 * @ngdoc overview
 * @name xtmotorwebuiApp
 * @description
 * # xtmotorwebuiApp
 *
 * car controller of the application.
 */
angular.module('car.controllers',[])
	.controller('CarCtrl', ['$rootScope','$scope','$translate','$translatePartialLoader','xtmotorsAPIService','$q','$state','$stateParams','$mdEditDialog','$timeout','$mdToast','$element',function ($rootScope,$scope, $translate, $translatePartialLoader,xtmotorsAPIService,$q,$state, $stateParams,$mdEditDialog,$timeout,$mdToast,$element) {
		$rootScope.isLoading = true;
    $scope.selected = [];
    $scope.selectedcarStatus = '';

    $translatePartialLoader.addPart('car');
    $translatePartialLoader.addPart('carDetails');
    $translatePartialLoader.addPart('contractSummary');
    $translatePartialLoader.addPart('importSummary');
    $translatePartialLoader.addPart('vehicleSummary');
    $translatePartialLoader.addPart('maintenanceRecordDetails');
    $translatePartialLoader.addPart('maintenanceRecordList');
    $translatePartialLoader.addPart('errorMessage');
    $translate.refresh();


    $scope.options = {
      autoSelect: true,
      boundaryLinks: false,
      largeEditDialog: false,
      pageSelector: false,
      rowSelection: false
    };

    $scope.query = {
      order: 'carId',
      limit: 15,
      page: 1
    };

    $scope.getCarSummary = function(){
      xtmotorsAPIService.query({section:'car/summary'})
      .$promise.then(function(cars) {
        $rootScope.cars = cars;
        _.forEach(cars, function(car){ 
          $scope.getCarImportRecord(car);
        })
        //$scope.tableHeaderName = [{title:'id'},{title:'brand'},{title:'model'},{title:'year'},{title:'odometer'},{title:'salePrice'},{title:'status'}];
      },function(error){
        $rootScope.showError(error);
      });
    };

    $rootScope.showError = function(error){
      $mdToast.show({
        template: '<md-toast class="md-toast md-toast-' +error.status+ '"><span flex>' + error.statusText + '</span></md-toast>',
        position: 'top right',
        hideDelay: 5000,
        parent: $element
      });
    };

    $rootScope.successToast = function(message){
      $mdToast.show({
        template: '<md-toast class="md-toast md-toast-success"><span flex>' + message  + '</span></md-toast>',
        position: 'top right',
        hideDelay: 5000,
        parent: $element
      });
    };

    $rootScope.carStatusList = ["Sold", "Reserved", "For Sale", "Inspection", "Arrived Port", "Departed Port"];

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
        default:
          return "departed";
      }
    };

    $scope.getVehicleModelList = function(){
      xtmotorsAPIService.query({ section:'VehicleModels/'})
      .$promise.then(function(res){
        $rootScope.vehicleModelList  = res;
        $rootScope.isVehicleModelListLoaded = true;
      },function(error){
        $rootScope.showError(error);
      });
    };

    $scope.getCarById = function(carId){
      xtmotorsAPIService.get({ section:'car/'+carId})
      .$promise.then(function(res){
        $scope.car = res;
        $scope.getModelById(res.vehicleModelId);
        $scope.getCarImages(res.carId);
        $scope.selectedcarStatus = $scope.car.carStatus;
        //$scope.car.wofTime = changeDateFormat($scope.car.wofTime);
        $scope.getCarMaintenanceList(carId);
        $state.go('car.details',{carId: carId});
      },function(error){
        $rootScope.showError(error);
      });
    };

    $scope.getCarMaintenanceList = function(carId){
      xtmotorsAPIService.query({section:'Maintenance/Car/'+carId})
      .$promise.then(function(res){
        $scope.maintenanceRecords = res;
      },function(error){
        $rootScope.showError(error);
      });
    };

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
        $rootScope.showError(error);
      });
    };

    $scope.getCarImages = function(carId){
      xtmotorsAPIService.query({section:'images/car/'+carId})
      .$promise.then(function(res){
        $scope.images = res;
      },function(error){
        $rootScope.showError(error);
      });
    };

    $scope.getModelById = function(vehicleModelId){
      xtmotorsAPIService.get({ section:'VehicleModels/'+vehicleModelId})
      .$promise.then(function(res){
        $scope.vehicleModel = res;
      },function(error){
        $rootScope.showError(error);
      });
    };

    $rootScope.editCar = function(car){
      $scope.getCarById(car.carId);
      $rootScope.isCarEdited = true;
    };

    $scope.backToCar = function(){
      // xtmotorsCRUDService.cancelEdit($scope);
      $state.go('car');
      $scope.getCarSummary();
      $rootScope.newCar = false;
      $rootScope.isCarEdited = false;
    };

    $scope.getVehicleModelList();
    $scope.getCarSummary();

    // function updateContract(contract){
    //   xtmotorsAPIService.update({ section:'Contracts/'+contract.carId}, contract)
    //     .$promise.then(function(res){
    //       $mdToast.show({
    //           template: '<md-toast class="md-toast md-toast-success"><span flex>' + 'Contract record has been updated'  + '</span></md-toast>',
    //           position: 'top right',
    //           hideDelay: 5000,
    //           parent: $element
    //       });
    //     },function(error){
    //       $mdToast.show({
    //           template: '<md-toast class="md-toast md-toast-' +error.status+ '"><span flex>' + error.statusText + '</span></md-toast>',
    //           position: 'top right',
    //           hideDelay: 5000,
    //           parent: $element
    //       });
    //     }).finally(function(){

    //     });
    // }

    // $scope.saveContract= function(contract){
    //   if(contract.paymentStatus){
    //     updateContract(contract);
    //   }else{
    //     //Wait for ID

    //     //console.log("empty");
    //     // contract.carId = "";
    //     // contract.customerId = "";
    //     // contract.employeeId = "";
    //     // contract.contractNum = "";
    //     // contract.currency = "";
    //     // updateContract(contract);
    //   }
    // };


	}])

  .controller('CarDetailsCtrl', ['$rootScope','$scope','xtmotorsAPIService','$q','$translate','$translatePartialLoader','$stateParams', '$mdDialog','Upload','$timeout','$mdToast','$element',
    function ($rootScope,$scope,xtmotorsAPIService, $q,$translate, $translatePartialLoader,$stateParams,$mdDialog,Upload,$timeout,$mdToast,$element) {

    $translatePartialLoader.addPart('carDetails');
    $translate.refresh();
    $scope.showMaintenanceReordDetails = false;
    $scope.uploading = false;

    if($rootScope.newCar){
      $scope.car = {};
      $scope.car.carId = $stateParams.carId;
      //$scope.car.vehicleModelId = '';
    }else{
      if($scope.isCarEdited){
        $scope.isCarEdited = false;
      }else{
        $scope.getCarById($stateParams.carId);
      }
    }


    $scope.saveCar = function(){
      $scope.checkModelStatus();
    };

    $scope.statusChanged = function(selectedcarStatus){
      if(selectedcarStatus !== null){
        $scope.car.carStatus = selectedcarStatus;
        $rootScope.newVehicleModel = false;
      }
    }

    $scope.selectedItemChange = function(selectVehicle){
      if(selectVehicle !== null){
        $scope.vehicleModel = selectVehicle;
        $rootScope.newVehicleModel = false;
      }
    };

    $scope.createNewVehicleModel = function(){
      $rootScope.newVehicleModel = true;
    }

    $scope.checkCarStatus = function(){
      if($rootScope.newCar){
        $scope.saveCarRecord();
      }else{
        $scope.updateCarRecord();
      }
    };

    $scope.checkModelStatus =function(){
      if($rootScope.newVehicleModel){
        $scope.saveModelRecord();
      }else{
        $scope.updateModelRecord();
      }
    };

    //Reminder: need to set Vehicle Model first, then save the car record.
    $scope.saveModelRecord = function(){
      xtmotorsAPIService.save({ section:'VehicleModels/'},$scope.vehicleModel)
      .$promise.then(function(res){
        $rootScope.newVehicleModel = false;
        $scope.car.vehicleModelId = res.vehicleModelId;
        $scope.getVehicleModelList();
        $scope.checkCarStatus();
      },function(error){
        $rootScope.newVehicleModel = true;
        $rootScope.showError(error);
      });
    };

    $scope.updateModelRecord = function(){
      xtmotorsAPIService.update({ section:'VehicleModels/' +$scope.vehicleModel.vehicleModelId},$scope.vehicleModel)
      .$promise.then(function(res){
        $scope.car.vehicleModelId = res.vehicleModelId;
        $scope.checkCarStatus();
      },function(error){
        $rootScope.showError(error);
      });
    };

    $scope.saveCarRecord = function(){
      xtmotorsAPIService.save({section:'car/'}, $scope.car)
      .$promise.then(function(res){
        $rootScope.newCar = false;
        $scope.successToast("New car saved.");
        $scope.getCarSummary();
      },function(error){
        $rootScope.newCar = true;
        $rootScope.showError(error);
      });
    };

    $scope.updateCarRecord = function(){
      xtmotorsAPIService.update({section:'car/'+$scope.car.carId}, $scope.car)
      .$promise.then(function(res){
        $scope.successToast("Update was successful.");
      },function(error){
        $rootScope.showError(error);
      });
    };

    $scope.uploadFiles = function (files) {
       $scope.files = files;
        if (files && files.length) {
            Upload.upload({
              url: 'http://xtmotorwebapi.azurewebsites.net/api/images/upload/'+$scope.car.carId,
              data: {
                file: files
              }
            }).then(function (response) {
                $timeout(function () {
                    $scope.result = response.data;
                });
                $scope.getCarImages($scope.car.carId);
                $rootScope.successToast("Photos has been saved");
            }, function (error) {
                if (error.status > 0) {
                  $rootScope.showError(error);
                  $scope.uploading = false;
                }
            }, function (evt) {
                $scope.uploading = true;
                $scope.progress =
                    Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            }).finally(function(){
              $scope.uploading = false;
            });
        }
    };

    $scope.deleteImage = function(imageId){
      xtmotorsAPIService.remove({section:'Images/'+imageId})
      .$promise.then(function(res){
        $scope.successToast('Image has been deleted');
        $scope.getCarImages($scope.car.carId);
      },function(error){
        $rootScope.showError(error);
      });
    }

    $scope.addMaintenanceRecord = function(){
        $scope.showMaintenanceReordDetails = true;
        $scope.newMaintenanceRecord = true;
        $scope.maintenanceRecord = {
          carId: $scope.car.carId
        };
    };

    $scope.backToMaintenanceRecordList = function(){
      $scope.showMaintenanceReordDetails = false;
      $scope.getCarMaintenanceList($scope.car.carId);
    };


    $scope.editMaintenanceRecord = function(record){
      if(!_.isUndefined(record)){
        $scope.newMaintenanceRecord = false;
        $scope.maintenanceRecord = record;
        $scope.showMaintenanceReordDetails = true;
      }
    };

    $scope.saveMaintenanceRecord = function(record){
      xtmotorsAPIService.save({section:'Maintenance'}, record)
      .$promise.then(function(res){
        $scope.successToast('New maintenance has been saved');
        $scope.newMaintenanceRecord = false;
      },function(error){
        $scope.newMaintenanceRecord = true;
        $rootScope.showError(error);
      });
    };

    $scope.updateMaintenanceRecord = function(record){
      xtmotorsAPIService.update({section:'Maintenance/'+record.recordId}, record)
      .$promise.then(function(res){
        $scope.successToast('Update was successful');
      },function(error){
        $rootScope.showError(error);
      });
    };

    $scope.saveMaintenance = function(record){
      //TODO: check is an edit maintenance object or create new maintenance object
      //then use xtmotorsAPIService.update for updateing edit object
      //use xtmotorsAPIService.save for saving new object
        if($scope.newMaintenanceRecord){
          $scope.saveMaintenanceRecord(record);
        }else{
          $scope.updateMaintenanceRecord(record);
        }

    };

  }]);
