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
    xtmotorsAPIService.query({section:'car/summary'})
      .$promise.then(function(cars) {
        $rootScope.cars = cars;

        $scope.tableHeaderName = [{title:'id'},{title:'brand'},{title:'model'},{title:'year'},{title:'odometer'},{title:'salePrice'},{title:'status'}];

        $translatePartialLoader.addPart('car');
        $translatePartialLoader.addPart('carDetails');
        $translatePartialLoader.addPart('contractSummary');
        $translatePartialLoader.addPart('importSummary');
        $translatePartialLoader.addPart('vehicleSummary');
        $translatePartialLoader.addPart('maintenanceRecordDetails');
        $translatePartialLoader.addPart('maintenanceRecordList');
        $translatePartialLoader.addPart('errorMessage');
        $translate.refresh();

        $scope.selected = [];

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


        vehicleModelList: xtmotorsAPIService.query({ section:'VehicleModels/'})
          .$promise.then(function(res){
            $scope.vehicleModelList  = res;
            $rootScope.isVehicleModelListLoaded = true;
          },function(error){
            //console.log("error");
        });


        $rootScope.editCar = function(car){
          $q.all({

              car: xtmotorsAPIService.get({ section:'car/'+car.carId}).$promise,
              // contract: xtmotorsAPIService.get({ section:'Contracts/'+car.carId}).$promise,
              // importRecord: xtmotorsAPIService.get({section:'ImportRecords/'+car.carId}).$promise

            })
            .then(function(res) {
                  // $scope.importRecord  = res.importRecord;
                  // $scope.contract      = res.contract;
                  $scope.car           = res.car;

                  //$scope.vehicleModelList  = res.vehicleModelList;
                  if($scope.importRecord){
                    $q.all({
                      maintenance: xtmotorsAPIService.query({section:'Maintenance/Car/'+$scope.car.carId}).$promise,
                      // importSummary: xtmotorsAPIService.get({ section:'Imports/'+$scope.importRecord.batchId}).$promise,
                      vehicleModel: xtmotorsAPIService.get({ section:'VehicleModels/'+$scope.car.vehicleModelId}).$promise
                    })
                    .then(function(res){
                      // $scope.importSummary = res.importSummary;
                      $scope.maintenanceRecords = res.maintenance;
                      // $scope.importSummary.eta = changeDateFormat($scope.importSummary.eta);
                      // $scope.importSummary.createTime = changeDateFormat($scope.importSummary.createTime);
                      $scope.vehicleModel  = res.vehicleModel;
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
                // $scope.contract.contractDate = changeDateFormat($scope.contract.contractDate);
            },function(error){
              $mdToast.show({
                template: '<md-toast class="md-toast md-toast-' +error.status+ '"><span flex>' + error.statusText + '</span></md-toast>',
                position: 'top right',
                hideDelay: 5000,
                parent: $element
              });
            });
        };

        $scope.createNewCar = function(){
          if($rootScope.newCar){
              $scope.car = {};
              $scope.vehicleModel = {};
              $scope.importRecord = {};
              $scope.maintenanceRecord = {};
              $scope.contract = {};
              //$scope.fetchVehicleModelList();
          }
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
          $rootScope.newCar = false;
        };

        $scope.saveCar= function(car,vehicleModel,importRecord,importSummary){
          // var formValid = xtmotorsAPIService.validateForm($scope);
          // if(formValid){
          if($rootScope.newCar){
            $q.all({
              car: xtmotorsAPIService.save({section:'car/'}, car).$promise,
              // vehicleModel: xtmotorsAPIService.save({ section:'VehicleModels/'},vehicleModel).$promise,
              // importRecord: xtmotorsAPIService.save({ section:'ImportRecords/'}, importRecord).$promise,
              //contract: xtmotorsAPIService.update({ section:'Contract/'+contract.carId}, contract).$promise,
              // maintenance: xtmotorsAPIService.update({section:'Maintenance/'+$scope.maintenance.recordId}, $scope.maintenance).$promise,
              // importSummary: xtmotorsAPIService.save({ section:'Imports/'}, importSummary).$promise
            })
            .then(function(res){
              $mdToast.show({
                template: '<md-toast class="md-toast md-toast-success"><span flex>' + 'Car has been saved'  + '</span></md-toast>',
                position: 'top right',
                hideDelay: 5000,
                parent: $element
              });
              $rootScope.newCar = false;
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

            });
          }else{
            $q.all({
              car: xtmotorsAPIService.update({section:'car/'+car.carId}, car).$promise,
              vehicleModel: xtmotorsAPIService.update({ section:'VehicleModels/' +vehicleModel.vehicleModelId},vehicleModel).$promise,
              importRecord: xtmotorsAPIService.update({ section:'ImportRecords/'+importRecord.carId}, importRecord).$promise,
              //contract: xtmotorsAPIService.update({ section:'Contract/'+contract.carId}, contract).$promise,
              // maintenance: xtmotorsAPIService.update({section:'Maintenance/'+$scope.maintenance.recordId}, $scope.maintenance).$promise,
              importSummary: xtmotorsAPIService.update({ section:'Imports/'+ importSummary.batchId}, importSummary).$promise
            })
            .then(function(res){
              $mdToast.show({
                template: '<md-toast class="md-toast md-toast-success"><span flex>' + 'Car record has been saved'  + '</span></md-toast>',
                position: 'top right',
                hideDelay: 5000,
                parent: $element
              });
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

            });
          }

        };


      }, function(error) {
        $mdToast.show({
          template: '<md-toast class="md-toast md-toast-' +error.status+ '"><span flex>' + error.statusText + '</span></md-toast>',
          position: 'top right',
          hideDelay: 5000,
          parent: $element
        });
    }).finally(function(){

      $rootScope.isLoading = false;
    });

    function updateContract(contract){
      xtmotorsAPIService.update({ section:'Contracts/'+contract.carId}, contract)
        .$promise.then(function(res){
          $mdToast.show({
              template: '<md-toast class="md-toast md-toast-success"><span flex>' + 'Contract record has been updated'  + '</span></md-toast>',
              position: 'top right',
              hideDelay: 5000,
              parent: $element
          });
        },function(error){
          $mdToast.show({
              template: '<md-toast class="md-toast md-toast-' +error.status+ '"><span flex>' + error.statusText + '</span></md-toast>',
              position: 'top right',
              hideDelay: 5000,
              parent: $element
          });
        }).finally(function(){

        });
    }

    $scope.saveContract= function(contract){
      if(contract.paymentStatus){
        updateContract(contract);
      }else{
        //Wait for ID

        //console.log("empty");
        // contract.carId = "";
        // contract.customerId = "";
        // contract.employeeId = "";
        // contract.contractNum = "";
        // contract.currency = "";
        // updateContract(contract);
      }
    }

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
	}])
  .controller('CarDetailsCtrl', ['$rootScope','$scope','xtmotorsAPIService','$q','$translate','$translatePartialLoader','$stateParams', '$mdDialog','Upload','$timeout','$mdToast','$element',
    function ($rootScope,$scope,xtmotorsAPIService, $q,$translate, $translatePartialLoader,$stateParams,$mdDialog,Upload,$timeout,$mdToast,$element) {
    $translatePartialLoader.addPart('carDetails');
    $translate.refresh();
    $scope.showMaintenanceReordDetails = false;
    $scope.uploading = false;
    var createMaintenanceRecord = false;
    var saveStatus = false;
    $scope.log = '';

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
                $mdToast.show({
                  template: '<md-toast class="md-toast md-toast-success"><span flex>' + 'Photos has been saved'  + '</span></md-toast>',
                  position: 'top right',
                  hideDelay: 5000,
                  parent: $element
                });
            }, function (error) {
                if (error.status > 0) {
                  $mdToast.show({
                    template: '<md-toast class="md-toast md-toast-' +error.status+ '"><span flex>' + error.statusText + '</span></md-toast>',
                    position: 'top right',
                    hideDelay: 5000,
                    parent: $element
                  });
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

    $scope.addMaintenanceRecord = function(){
        $scope.showMaintenanceReordDetails = true;
        $scope.maintenanceRecord = {
          carId: $scope.car.carId
        };
      createMaintenanceRecord = true;
      saveStatus = false;

    };

    $scope.cancelToMaintenanceRecordList = function(){
      $scope.showMaintenanceReordDetails = false;
      saveStatus = false;
    };

    $scope.backToMaintenanceRecordList = function(){
      $scope.showMaintenanceReordDetails = false;
      saveStatus = false;

      $q.all({
        maintenance: xtmotorsAPIService.query({section:'Maintenance/Car/'+$scope.car.carId}).$promise,
      })
        .then(function(res){
          $scope.maintenanceRecords = res.maintenance;
        },function(error){
          $mdToast.show({
            template: '<md-toast class="md-toast md-toast-' +error.status+ '"><span flex>' + error.statusText + '</span></md-toast>',
            position: 'top right',
            hideDelay: 5000,
            parent: $element
          });
        });
    };

    $scope.saveStatus = function(){
      if(saveStatus){
        return true;
      } else {
        return false;
      }
    };

    $scope.editMaintenanceRecord = function(record){
      if(!_.isUndefined(record)){
        $scope.maintenanceRecord = record;
        $scope.showMaintenanceReordDetails = true;
        createMaintenanceRecord = false;
      }
    };

    $scope.save = function(record){
      xtmotorsAPIService.save({section:'Maintenance'}, record)
          .$promise.then(function(res){
            $mdToast.show({
                template: '<md-toast class="md-toast md-toast-success"><span flex>' + 'New maintenance has been saved'  + '</span></md-toast>',
                position: 'top right',
                hideDelay: 5000,
                parent: $element
            });
        createMaintenanceRecord = false;
        saveStatus = true;
          },function(error){
            $mdToast.show({
                template: '<md-toast class="md-toast md-toast-' +error.status+ '"><span flex>' + error.statusText + '</span></md-toast>',
                position: 'top right',
                hideDelay: 5000,
                parent: $element
            });
        createMaintenanceRecord = true;
        saveStatus = false;
      }).finally(function(){
          });
    }

    $scope.update = function(record){
      xtmotorsAPIService.update({section:'Maintenance/'+record.recordId}, record)
          .$promise.then(function(res){
            $mdToast.show({
                template: '<md-toast class="md-toast md-toast-success"><span flex>' + 'Maintenance record has been updated'  + '</span></md-toast>',
                position: 'top right',
                hideDelay: 5000,
                parent: $element
            });
        saveStatus = true;
          },function(error){
            $mdToast.show({
                template: '<md-toast class="md-toast md-toast-' +error.status+ '"><span flex>' + error.statusText + '</span></md-toast>',
                position: 'top right',
                hideDelay: 5000,
                parent: $element
            });
        saveStatus = false;
          }).finally(function(){

          });
    }

    $scope.saveMaintenanceRecord = function(record){
      //TODO: check is an edit maintenance object or create new maintenance object
      //then use xtmotorsAPIService.update for updateing edit object
      //use xtmotorsAPIService.save for saving new object
      //console.log(record);
        if(createMaintenanceRecord){
          $scope.save(record);
        }else{
          $scope.update(record);
        }

    };

  }])
  .controller('ImportInfoCtrl', ['$rootScope','$scope','xtmotorsAPIService','xtmotorsCRUDService','$translate','$translatePartialLoader','$stateParams',
    function ($rootScope,$scope,xtmotorsAPIService,xtmotorsCRUDService,$translate, $translatePartialLoader,$stateParams) {




  }]);
