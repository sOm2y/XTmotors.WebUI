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


        vehicleModelList: xtmotorsAPIService.query({ section:'VehicleModel/'})
          .$promise.then(function(res){
            $scope.vehicleModelList  = res;
            $rootScope.isVehicleModelListLoaded = true;
          },function(error){
            //console.log("error");
        });


        $rootScope.editCar = function(car){
          $q.all({
              importRecord: xtmotorsAPIService.get({section:'ImportRecords/'+car.carId}).$promise,
              vehicleModel: xtmotorsAPIService.get({ section:'VehicleModel/'+car.carId}).$promise,
              //vehicleModelList: xtmotorsAPIService.query({ section:'VehicleModel/'}).$promise,
              car: xtmotorsAPIService.get({ section:'car/'+car.carId}).$promise,
              contract: xtmotorsAPIService.get({ section:'Contract/'+car.carId}).$promise
            })
            .then(function(res) {
                  $scope.importRecord  = res.importRecord;
                  $scope.contract      = res.contract;
                  $scope.car           = res.car;
                  $scope.vehicleModel  = res.vehicleModel;
                  //$scope.vehicleModelList  = res.vehicleModelList;
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
        };

        if($rootScope.newCar){
          $scope.createNewCar();
        }

        $scope.saveCar= function(car,vehicleModel,importRecord,contract,importSummary){
          // var formValid = xtmotorsAPIService.validateForm($scope);
          // if(formValid){
          $q.all({
              car: xtmotorsAPIService.update({section:'car/'+car.carId}, car).$promise,
              vehicleModel: xtmotorsAPIService.update({ section:'VehicleModel/' +vehicleModel.vehicleModelId},vehicleModel).$promise,
              importRecord: xtmotorsAPIService.update({ section:'ImportRecords/'+importRecord.carId}, importRecord).$promise,
              contract: xtmotorsAPIService.update({ section:'Contract/'+contract.carId}, contract).$promise,
              // maintenance: xtmotorsAPIService.update({section:'Maintenance/'+$scope.maintenance.recordId}, $scope.maintenance).$promise,
              importSummary: xtmotorsAPIService.update({ section:'Import/'+ importSummary.batchId}, importSummary).$promise
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
              
          })
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
  .controller('CarDetailsCtrl', ['$rootScope','$scope','xtmotorsAPIService','$q','$translate','$translatePartialLoader','$stateParams', '$mdDialog','$mdToast', '$element',
    function ($rootScope,$scope,xtmotorsAPIService, $q,$translate, $translatePartialLoader,$stateParams,$mdDialog,$mdToast,$element) {
    $translatePartialLoader.addPart('carDetails');
    $translate.refresh();  
    $scope.showMaintenanceReordDetails = false;
    var newMaintenanceRecord = false;

    $scope.addMaintenanceRecord = function(){
        $scope.showMaintenanceReordDetails = true;
        $scope.maintenanceRecord = {};
        newMaintenanceRecord = true;
    };

    $scope.backToMaintenanceRecordList = function(){
      $scope.showMaintenanceReordDetails = false;
    };

    $scope.editMaintenanceReord = function(record){
      if(!_.isUndefined(record)){
        $scope.maintenanceRecord = record;
        $scope.showMaintenanceReordDetails = true;
        newMaintenanceRecord = false;
      }
    };

    $scope.save = function(record){
      xtmotorsAPIService.save({section:'Maintenance/'}, record)
          .$promise.then(function(res){
            $mdToast.show({
                template: '<md-toast class="md-toast md-toast-success"><span flex>' + 'New maintenance has been saved'  + '</span></md-toast>',
                position: 'top right',
                hideDelay: 5000,
                parent: $element
            });
            newMaintenanceRecord = false;
          },function(error){
            $mdToast.show({
                template: '<md-toast class="md-toast md-toast-' +error.status+ '"><span flex>' + error.statusText + '</span></md-toast>',
                position: 'top right',
                hideDelay: 5000,
                parent: $element
            });
            newMaintenanceRecord = true;
          }).finally(function(){
              
          });
    }

    $scope.update = function(record){
      xtmotorsAPIService.update({section:'Maintenance/'+record.carId}, record)
          .$promise.then(function(res){
            $mdToast.show({
                template: '<md-toast class="md-toast md-toast-success"><span flex>' + 'Maintenance record has been updated'  + '</span></md-toast>',
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

    $scope.saveMaintenanceRecord = function(record){
      //TODO: check is an edit maintenance object or create new maintenance object
      //then use xtmotorsAPIService.update for updateing edit object
      //use xtmotorsAPIService.save for saving new object
      //console.log(record);
        if(newMaintenanceRecord){
          $scope.save(record);         
        }else{
          $scope.update(record);
        }

    };

  }])
  .controller('ImportInfoCtrl', ['$rootScope','$scope','xtmotorsAPIService','xtmotorsCRUDService','$translate','$translatePartialLoader','$stateParams', 
    function ($rootScope,$scope,xtmotorsAPIService,xtmotorsCRUDService,$translate, $translatePartialLoader,$stateParams) {




  }]);


