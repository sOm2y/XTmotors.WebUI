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
    xtmotorsAPIService.query({section:'Car/CarBriefView'})
      .$promise.then(function(cars) {
        $scope.cars = cars;
     
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
          order: 'name',
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

        $scope.editCar = function(car){
          $state.go('car.details',{myParam:car});
        };
  
      }, function(error) {
        console.log(error);
    }).finally(function(){
       $rootScope.isLoading = false;
    });

  	
	}])
  .controller('CarDetailsCtrl', ['$rootScope','$scope','xtmotorsAPIService','$translate','$translatePartialLoader','$stateParams', function ($rootScope,$scope,xtmotorsAPIService, $translate, $translatePartialLoader,$stateParams) {
    $translatePartialLoader.addPart('carDetails');
    $translate.refresh();  
    if($stateParams.myParam){
      // xtmotorsAPIService.query({section:'Car/CarBriefView/'+$stateParams.myParam.CarId})
      // .$promise.then(function(cars) {
         $scope.editCar = $stateParams.myParam;
        
      // })
      // .finally(function(){
       $rootScope.isLoading = false;
    // });
    }
      this.userState = '';
        this.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
            'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
            'WY').split(' ').map(function (state) { return { abbrev: state }; });
    // _.pull($rootScope.cars, $scope.editCar);
    $scope.carCopy = angular.copy($scope.editCar);
  }]);
