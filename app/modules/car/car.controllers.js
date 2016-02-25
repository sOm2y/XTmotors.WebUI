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
	.controller('CarCtrl', ['$rootScope','$scope','$translate','$translatePartialLoader','xtmotorsAPIService','$q','$state','$mdEditDialog','$timeout',function ($rootScope,$scope, $translate, $translatePartialLoader,xtmotorsAPIService,$q,$state,$mdEditDialog,$timeout) {
		if($scope.cars){$rootScope.isLoading = false;}
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
          order: 'CarId',
          limit: 15,
          page: 1
        };
        
        $scope.getTypes = function () {
          return ['Candy', 'Ice cream', 'Other', 'Pastry'];
        };
        
        $scope.loadStuff = function () {
          $scope.promise = $timeout(function () {
            // loading
          }, 2000);
        };
        
        $scope.logItem = function (item) {
          console.log(item.name, 'was selected');
        };
        
        $scope.logOrder = function (order) {
          console.log('order: ', order);
        };
        
        $scope.logPagination = function (page, limit) {
          console.log('page: ', page);
          console.log('limit: ', limit);
        };

        $rootScope.editCar = function(car){
          $q.all({
        // importSummary: xtmotorsAPIService.query({section:'import'}).$promise
              importRecord: xtmotorsAPIService.get({ section:'ImportRecords/'+car.CarId}).$promise,
              contract: xtmotorsAPIService.get({ section:'Contract/'+car.CarId}).$promise
            })
            .then(function(res) {
                  $scope.importRecord  = res.importRecord;
                  // $scope.maintenance   = res.maintenance;
                  $scope.contract      = res.contract;

                  if($scope.importRecord){
                    $q.all({
                      maintenance: xtmotorsAPIService.query({section:'Maintenance/Car/'+car.CarId}).$promise,
                      importSummary: xtmotorsAPIService.get({ section:'Import/'+$scope.importRecord.BatchId}).$promise
                    })
                     .then(function(res){
                      $scope.importSummary = res.importSummary;
                      $scope.maintenanceRecords = res.maintenance;
                     },function(error){

                     });
                  }
                // $scope.importRecord = response.importRecord;
                   _.pull($scope.itemList,car);
                  $scope.itemCopy = angular.copy(car);
                  $scope.item = car;
                  $state.go('car.details');
            },function(error){
            
          });
       
        };

        $scope.createItem = function(){
            if(!$scope.item){
                $scope.newItem = true;
                $scope.item = {};
            }
          };
        $scope.backToCustomer = function(){
          xtmotorsCRUDService.cancelEdit($scope);
          $state.go('car');
        };
        $scope.saveCustomer= function(car){
              // var formValid = xtmotorsAPIService.validateForm($scope);
              // if(formValid){
              xtmotorsCRUDService.update('Car/CarBriefView', $scope, car);
              // }
          };
    
  
      }, function(error) {
        console.log(error);
    }).finally(function(){
       $rootScope.isLoading = false;
    });


  	
	}])
  .controller('CarDetailsCtrl', ['$rootScope','$scope','xtmotorsAPIService','$q','$translate','$translatePartialLoader','$stateParams', '$mdDialog',
    function ($rootScope,$scope,xtmotorsAPIService, $q,$translate, $translatePartialLoader,$stateParams,$mdDialog) {
    $translatePartialLoader.addPart('carDetails');
    $translate.refresh();  
    $scope.doSecondaryAction = function(event) {
    $mdDialog.show(
      $mdDialog.alert()
        .title('Secondary Action')
        .textContent('Secondary actions can be used for one click actions')
        .ariaLabel('Secondary click demo')
        .ok('Neat!')
        .targetEvent(event)
      );
    };
  

  }])
  .controller('ImportInfoCtrl', ['$rootScope','$scope','xtmotorsAPIService','xtmotorsCRUDService','$translate','$translatePartialLoader','$stateParams', 
    function ($rootScope,$scope,xtmotorsAPIService,xtmotorsCRUDService,$translate, $translatePartialLoader,$stateParams) {




  }]);
