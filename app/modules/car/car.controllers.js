'use strict';
/**
 * @ngdoc overview
 * @name xtmotorwebuiApp
 * @description
 * # xtmotorwebuiApp
 *
 * Main controller of the application.
 */
angular.module('car.controllers',[])
	.controller('CarCtrl', ['$scope','$translate','$translatePartialLoader','xtmotorsAPIService','$q',function ($scope, $translate, $translatePartialLoader,xtmotorsAPIService,$q) {
		xtmotorsAPIService.get({})
      .$promise.then(function(data) {
        $scope.data = data;
      }, function(error) {
        console.log(error);
    });

    $scope.tableHeaderName = [{title:'id'},{title:'brand'},{title:'model'},{title:'year'},{title:'odometer'},{title:'salePrice'},{title:'status'}];

    $translatePartialLoader.addPart('car');
  	$translate.refresh();

    $scope.totalItems = $scope.cars.length;
    $scope.itemsPerPage = 10;
    $scope.currentPage = 1;
  
    $scope.pageCount = function () {
      return Math.ceil($scope.cars.length / $scope.itemsPerPage);
    };

    $scope.$watch('currentPage + itemsPerPage', function() {
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
        end = begin + $scope.itemsPerPage;

      $scope.filteredFriends = $scope.cars.slice(begin, end);
    });

  	
	}])
  .controller('CarDetailsCtrl', ['$scope','$translate','$translatePartialLoader',function ($scope, $translate, $translatePartialLoader) {
    $translatePartialLoader.addPart('carDetails');
    $translate.refresh();
    
  }]);
