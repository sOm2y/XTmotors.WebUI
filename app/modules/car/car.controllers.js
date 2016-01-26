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
	.controller('CarCtrl', ['$rootScope','$scope','$translate','$translatePartialLoader','xtmotorsAPIService','$q','$state',function ($rootScope,$scope, $translate, $translatePartialLoader,xtmotorsAPIService,$q,$state) {
		// xtmotorsAPIService.query({section:'Car'})
  //     .$promise.then(function(cars) {
        // $scope.cars = cars;
     
        $scope.tableHeaderName = [{title:'id'},{title:'brand'},{title:'model'},{title:'year'},{title:'odometer'},{title:'salePrice'},{title:'status'}];

        $translatePartialLoader.addPart('car');
        $translate.refresh();

        $scope.totalItems = $scope.cars.length;
        $scope.itemsPerPage =20;
        $scope.currentPage = 1;

        $scope.pageCount = function () {
          return Math.ceil($scope.cars.length / $scope.itemsPerPage);
        };

        $scope.$watch('currentPage + itemsPerPage', function() {
          var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
            end = begin + $scope.itemsPerPage;

          $scope.filteredCars = $rootScope.cars.slice(begin, end);
        });
        $scope.editCar = function(car){
          $state.go('car.details',{myParam:car});
        };
  
    //   }, function(error) {
    //     console.log(error);
    // });

  	
	}])
  .controller('CarDetailsCtrl', ['$rootScope','$scope','$translate','$translatePartialLoader','$stateParams', function ($rootScope,$scope, $translate, $translatePartialLoader,$stateParams) {
    $translatePartialLoader.addPart('carDetails');
    $translate.refresh();
    if($stateParams.myParam){$scope.editCar = $stateParams.myParam;}
    // _.pull($rootScope.cars, $scope.editCar);
    $scope.carCopy = angular.copy($scope.editCar);
  }]);
