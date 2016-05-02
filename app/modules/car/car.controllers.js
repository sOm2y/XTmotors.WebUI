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
        $mdToast.show({
          template: '<md-toast class="md-toast md-toast-' +error.status+ '"><span flex>' + error.statusText + '</span></md-toast>',
          position: 'top right',
          hideDelay: 5000,
          parent: $element
        });
    }).finally(function(){

       $rootScope.isLoading = false;
    });
  	
	}])
  .controller('CarDetailsCtrl', ['$rootScope','$scope','xtmotorsAPIService','$q','$translate','$translatePartialLoader','$stateParams', '$mdDialog','Upload',
    function ($rootScope,$scope,xtmotorsAPIService, $q,$translate, $translatePartialLoader,$stateParams,$mdDialog,Upload) {
    $translatePartialLoader.addPart('carDetails');
    $translate.refresh();  
    $scope.showMaintenanceReordDetails = false;
    $scope.uploading = false;
    $scope.progressPercentage = 0;
    var creatMaintenanceRecord = false;


    $scope.$watch('files', function () {
      $scope.upload($scope.files);
    });

    $scope.log = '';

    $scope.upload = function (files) {
      $scope.files = files;
      console.log($scope.files);
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
              var file = files[i];
              if (!file.$error) {
                Upload.upload({
                    url: 'http://xtmotorwebapi.azurewebsites.net/api/Photo/Storage/',
                    data: {
                      username: $scope.username,
                      file: file  
                    }
                }).then(function (resp) {
                    $timeout(function() {
                        $scope.log = 'file: ' +
                        resp.config.data.file.name +
                        ', Response: ' + JSON.stringify(resp.data) +
                        '\n' + $scope.log;
                    });
                }, null, function (evt) {
                    $scope.uploading = true;
                    $scope.progressPercentage = parseInt(100.0 *
                        evt.loaded / evt.total);
                    $scope.log = 'progress: ' + $scope.progressPercentage + 
                      '% ' + evt.config.data.file.name + '\n' + 
                      $scope.log;
                }).finally(function(){
                   $scope.uploading =false;
                });
              }
            }
        }
    };

    $scope.addMaintenanceRecord = function(){
        $scope.showMaintenanceReordDetails = true;
        $scope.maintenanceRecord = {};
        creatMaintenanceRecord = true;
    };

    $scope.backToMaintenanceRecordList = function(){
      $scope.showMaintenanceReordDetails = false;
    };

    $scope.editMaintenanceReord = function(record){
      if(!_.isUndefined(record)){
        $scope.maintenanceRecord = record;
        $scope.showMaintenanceReordDetails = true;
        creatMaintenanceRecord = false;
      }
    };

    $scope.saveMaintenanceRecord = function(record){
      //TODO: check is an edit maintenance object or create new maintenance object
      //then use xtmotorsAPIService.update for updateing edit object
      //use xtmotorsAPIService.save for saving new object
      //console.log(record);
        if(creatMaintenanceRecord){
          xtmotorsAPIService.save({section:'Maintenance/'+record.carId}, record)
            .$promise.then(function(){
              //console.log("New Record!");
            },function(error){
              //console.log("error");
          });
          
        }else{
          xtmotorsAPIService.update({section:'Maintenance/'+record.carId}, record)
            .$promise.then(function(){
              //console.log("Record Updated!");
            },function(error){
              //console.log("error");
          });
              
        }

    };

  }])
  .controller('ImportInfoCtrl', ['$rootScope','$scope','xtmotorsAPIService','xtmotorsCRUDService','$translate','$translatePartialLoader','$stateParams', 
    function ($rootScope,$scope,xtmotorsAPIService,xtmotorsCRUDService,$translate, $translatePartialLoader,$stateParams) {




  }]);


