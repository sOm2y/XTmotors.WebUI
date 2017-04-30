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
    $translatePartialLoader.addPart('uploadCarPhotos');
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


		$scope.getImportRecords = function(){
			xtmotorsAPIService.query({section:'ImportRecords'})
			.$promise.then(function(importRecords) {
					$rootScope.importRecords = importRecords;
					$rootScope.isLoading = false;
				},function(error){
					$rootScope.showError(error);
			});
		};

		$scope.getBatchImports = function(){
			xtmotorsAPIService.query({section:'Imports'})
			.$promise.then(function(imports) {
					$rootScope.imports = imports;
					$rootScope.isLoading = false;
				},function(error){
					$rootScope.showError(error);
			});
		};

		$scope.getCarBatch = function(car, batchId){
			$scope.batch = _.find($rootScope.imports,function(importBatch){
				return batchId == importBatch.batchId
			});
			if($scope.batch){
				$scope.batch.eta = $scope.changeDateFormat($scope.batch.eta);
				$scope.batch.invoiceDate = $scope.changeDateFormat($scope.batch.invoiceDate);
				car.arriveTime = $scope.batch.eta;
			}else{
				car.arriveTime = "HAS NOT BEEN FINALIZED";
				$rootScope.showErrorMessage("Please add Batch for the car, CarID: "+car.carId);
			}
		};

    $scope.getCarImportRecord = function(car){
			$scope.importSummary = _.find($rootScope.importRecords,function(importRecord){
				return importRecord.carId == car.carId;
			});

			if($scope.importSummary){
				  $scope.getCarBatch(car, $scope.importSummary.batchId);
			}else{
				car.arriveTime = "HAS NOT BEEN FINALIZED";
				$rootScope.showErrorMessage("Please add Batch for the car, CarID: "+car.carId);
			}
    };

    $scope.getCarSummary = function(){
      xtmotorsAPIService.query({section:'car/summary'})
      .$promise.then(function(cars) {
        $rootScope.cars = cars;
        $rootScope.isLoading = false;
				$q.all([
					xtmotorsAPIService.query({section:'ImportRecords'}).$promise,
					xtmotorsAPIService.query({section:'Imports'}).$promise
				]).then(function(data){
					$rootScope.importRecords = data[0];
					$rootScope.imports = data[1];
					//Disabled until add settlement tab in car summary page
					_.forEach(cars, function(car){
						$scope.getCarImportRecord(car);
					})
				});

        // $scope.tableHeaderName = [{title:'id'},{title:'brand'},{title:'model'},{title:'year'},{title:'odometer'},{title:'salePrice'},{title:'status'}];
      },function(error){
        $rootScope.showError(error);
      });
    };

    $rootScope.showError = function(error){
      $mdToast.show({
        template: '<md-toast class="md-toast md-toast-500' +error.status+ '"><span flex>' + error.statusText + '</span></md-toast>',
        position: 'top right',
        hideDelay: 5000,
        parent: $element
      });
    };

    $rootScope.showErrorMessage = function(message){
      $mdToast.show({
        template: '<md-toast class="md-toast md-toast-500"><span flex>' + message  + '</span></md-toast>',
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
    $rootScope.carBodyType = ["Convertible", "Couple", "Hatchback", "Sedan", "Station Wagon", "RV/SUV", "Ute", "Van"];
    $rootScope.carCurrency = ["NZD", "JPY", "CNY"];

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
        $scope.getCarImportRecord(res);
        //$scope.getImportSummary();
        $scope.selectedcarStatus = $scope.car.carStatus;
        $scope.selectedcarCurrency = $scope.car.currency;
        $scope.car.wofTime = $scope.changeDateFormat($scope.car.wofTime);
        $scope.getCarMaintenanceList(carId);
        $state.go('car.details',{carId: carId});
      },function(error){
        $rootScope.showError(error);
      });
    };

    $scope.changeDateFormat = function(time){
      return new Date(moment(time));
    };

    $scope.getCarMaintenanceList = function(carId){
      xtmotorsAPIService.query({section:'Maintenance/Car/'+carId})
      .$promise.then(function(res){
        $scope.maintenanceRecords = res;
      },function(error){
        $rootScope.showError(error);
      });
    };



    $scope.getImportSummary = function(){
      xtmotorsAPIService.query({section:'Imports/'})
      .$promise.then(function(imports){
        $scope.imports = imports;
        $scope.isImportSummaryLoaded = true;
      },function(error){
        $scope.isImportSummaryLoaded = false;
        $scope.showError(error);
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
        $scope.selectedcarBodyType = $scope.vehicleModel.bodyType;
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
      $rootScope.newVehicleModel = false;
      $rootScope.isEditable = false;
      $scope.newImport = false;
    };

    $scope.backToStorgaePage = function(){
      $state.go('storage');
      $rootScope.isFromStorage = false;
      $rootScope.newCar = false;
      $rootScope.isCarEdited = false;
      $rootScope.newVehicleModel = false;
      $rootScope.isEditable = false;
      $scope.newImport = false;
    };

    $scope.backToConsigmentPage = function(){
      xtmotorsAPIService.get({ section:'ImportRecords/'+$scope.car.carId})
      .$promise.then(function(res){
        $state.go('consignment.details',{batchId:res.batchId});
        $rootScope.isFromConsignment = false;
        $rootScope.newCar = false;
        $rootScope.isCarEdited = false;
        $rootScope.newVehicleModel = false;
        $rootScope.isEditable = false;
        $scope.newImport = false;
      },function(error){
        $rootScope.showError(error);
      });
    };

    $scope.getVehicleModelList();
    $scope.getCarSummary();
		// $scope.getImportRecords();
		// $scope.getBatchImports();
    // $scope.getImportSummary();

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

    $scope.myDate = new Date();

    $scope.minDate = new Date(
      $scope.myDate.getFullYear() - 10,
      $scope.myDate.getMonth(),
      $scope.myDate.getDate());

    $translatePartialLoader.addPart('carDetails');
    $translate.refresh();
    $scope.showMaintenanceReordDetails = false;
    $scope.uploading = false;
    $scope.hideImportTab = true;

    if($rootScope.newCar){
      $scope.car = {
        "carId": $stateParams.carId,
        "vehicleModelId": null,
        "wofTime": new Date(),
        "registerationNum": null,
        "warranty": 0,
        "odometer": 0,
        "color": null,
        "vin": null,
        "length": 0,
        "width": 0,
        "height": 0,
        "carStatus": null,
        "carComment": null,
        "price": 0,
        "gst": 0,
        "total": 0,
        "paymentStatus": false,
        "currency": null,
        "description": null
      };
      // $scope.getImportSummary();
      //$scope.car.vehicleModelId = '';
    }else{
      $scope.getCarById($stateParams.carId);
    }

    $scope.checkImportStatus = function(){
      if($rootScope.newCar == true){
        if($scope.hideImportTab == true){
          return true;
        }
      }
      return false;
    }

    $scope.goToImportPage = function(){
      $scope.carSummary.$setSubmitted();
      $scope.vehicleInfo.$setSubmitted();

      if(($scope.carSummary.$invalid || $scope.vehicleInfo.$invalid)){
        $rootScope.showErrorMessage("Invalid fields, Please check again!");
      }else{
        $scope.selectedTab = 1;
        $scope.hideImportTab = false;
      }
    };

    $scope.checkBatchStatus = function(){
      if($scope.newImport){
        $scope.saveNewBatch();
      }
    };

    $scope.saveCar = function(){
        $scope.consignmentSummary.$setSubmitted();

        if($scope.consignmentSummary.$invalid){
          $rootScope.showErrorMessage("Invalid fields, Please check again!");
        }else{
          $scope.checkBatchStatus();
          $scope.checkModelStatus();
        }
    };

    $scope.saveCarImportRecord = function(){
      $scope.creatImportCarRecrod();

      if($scope.newCar){
        $scope.saveImportRecord($scope.importCarRecord);
      }else{
        $scope.updateImportRecord($scope.importCarRecord);
      }
    };

    $scope.statusChanged = function(selectedcarStatus){
      if(selectedcarStatus !== null){
        $scope.car.carStatus = selectedcarStatus;
      }
    };

    $scope.currencyChanged = function(selectedcarCurrency){
      if(selectedcarCurrency !== null){
        $scope.car.currency = selectedcarCurrency;
      }
    };

    $scope.bodyTypeChanged = function(selectedcarBodyType){
      if(selectedcarBodyType !== null){
        $scope.vehicleModel.bodyType = selectedcarBodyType;
      }
    };

    $scope.selectedItemChange = function(selectVehicle){
      if(selectVehicle !== null){
        $scope.vehicleModel = selectVehicle;
        $rootScope.newVehicleModel = false;
        $rootScope.isEditable = false;
      }
    };

    $scope.selectedImportChange = function(selectImport){
      if(selectImport !== null){
        $scope.newImport = false;
        $scope.batch = selectImport;
        $scope.batch.eta = $scope.changeDateFormat($scope.batch.eta);
        $scope.batch.invoiceDate = $scope.changeDateFormat($scope.batch.invoiceDate);
      }
    };

    $scope.creatImportCarRecrod = function(){
      $scope.importCarRecord = {
        "carId": $scope.car.carId,
        "batchId": $scope.batch.batchId,
        "quantity": 1,
        "amount": 1,
        "gst": $scope.car.gst,
        "total": $scope.car.total,
        "paymentStatus": $scope.car.paymentStatus,
        "currency": $scope.car.currency,
        "description": $scope.car.description
      }
    };

    $scope.createBatch = function(){
      $scope.newImport = true;
      // $scope.newImportRecord = true;
      $scope.batch = {
        "batchId": $scope.imports.length+1,
        "transportCompany": "",
        "checkLocation": "",
        "transportationExpense": 0,
        "eta": new Date(),
        "createTime": new Date(),
        "totalDue": 0,
        "fob": "string",
        "invoiceTotal": "",
        "invoiceDate": new Date(),
        "consignmentFrom": ""
      }
      // $scope.saveNewBatch();
      //console.log($scope.importCarRecord);
    };

    $scope.saveNewBatch = function(){
      xtmotorsAPIService.save({section:'Imports'}, $scope.batch)
      .$promise.then(function(res){
        $scope.newImport = false;
        $scope.successToast("New Import created, please go to Consigment page to edit details.");
      },function(error){
        $scope.newImport = true;
        $scope.showError(error);
      });
    }

    $scope.updateImportRecord = function(importCarRecord){
      xtmotorsAPIService.update({section:'ImportRecords/'+ $scope.car.carId}, importCarRecord)
      .$promise.then(function(res){
        $scope.successToast("Update was successful.");
      },function(error){
        $rootScope.showError(error);
      });
    };

    $scope.saveImportRecord = function(importCarRecord){
      xtmotorsAPIService.save({section:'ImportRecords'}, importCarRecord)
      .$promise.then(function(res){
        // $scope.newImportRecord = false;
        $rootScope.newCar = false;
        $scope.successToast("New car saved.");
      },function(error){
        $rootScope.showError(error);
      });
    };

    $scope.createNewVehicleModel = function(){
      $rootScope.isEditable = true;
      $rootScope.newVehicleModel = true;
      $scope.vehicleModel = {
        "makerName": null,
        "model": null,
        "year": 2016,
        "engine": null,
        "fuel": "",
        "fuelEconomyCity": null,
        "fuelEconomyHwy": null,
        "fuelEconomyMixed": null,
        "origin": "",
        "transmission": "",
        "seats": 0,
        "doors": 0,
        "driveTrain": "",
        "weight": 0,
        "description": null,
        "bodyType": "string"
      }
    };

    $scope.editVehicleModel = function(){
      $rootScope.isEditable = true;
      $rootScope.newVehicleModel = false;
    };

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
        $rootScope.isEditable = false;
        $scope.car.vehicleModelId = res.vehicleModelId;
        $scope.getVehicleModelList();
        $scope.checkCarStatus();
      },function(error){
        $rootScope.newVehicleModel = true;
        $rootScope.isEditable = true;
        $rootScope.showError(error);
      });
    };

    $scope.updateModelRecord = function(){
      xtmotorsAPIService.update({ section:'VehicleModels/' +$scope.vehicleModel.vehicleModelId},$scope.vehicleModel)
      .$promise.then(function(res){
        $scope.car.vehicleModelId = res.vehicleModelId;
        $scope.checkCarStatus();
        $rootScope.isEditable = false;
      },function(error){
        $rootScope.showError(error);
      });
    };

    $scope.saveCarRecord = function(){
      xtmotorsAPIService.save({section:'car/'}, $scope.car)
      .$promise.then(function(res){
        $scope.saveCarImportRecord();
        // $scope.successToast("New car saved.");
        //$scope.saveImportRecord($scope.importCarRecord);
        $scope.getCarSummary();
      },function(error){
        $rootScope.newCar = true;
        $rootScope.showError(error);
      });
    };

    $scope.updateCarRecord = function(){
      xtmotorsAPIService.update({section:'car/'+$scope.car.carId}, $scope.car)
      .$promise.then(function(res){
        // $scope.successToast("Update was successful.");
        $scope.saveCarImportRecord();
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
    };

    $scope.maintenanceCurrencyChanged = function(selectedMaintenanceCurrency){
      if(selectedMaintenanceCurrency !== null){
        $scope.maintenanceRecord.currency = selectedMaintenanceCurrency;
      }
    };

    $scope.addMaintenanceRecord = function(){
        $scope.showMaintenanceReordDetails = true;
        $scope.newMaintenanceRecord = true;
        $scope.maintenanceRecord = {
          carId: $scope.car.carId
        };
        $scope.selectedMaintenanceCurrency = $scope.maintenanceRecord.currency;
    };

    $scope.backToMaintenanceRecordList = function(){
      $scope.showMaintenanceReordDetails = false;
      $scope.getCarMaintenanceList($scope.car.carId);
    };


    $scope.editMaintenanceRecord = function(record){
      if(!_.isUndefined(record)){
        $scope.newMaintenanceRecord = false;
        $scope.maintenanceRecord = record;
        $scope.selectedMaintenanceCurrency = $scope.maintenanceRecord.currency;
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
