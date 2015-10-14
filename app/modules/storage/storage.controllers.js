'use strict';
/**
 * @ngdoc overview
 * @name xtmotorwebuiApp
 * @description
 * # xtmotorwebuiApp
 *
 * Main controller of the application.
 */
angular.module('storage.controllers',[])
	.controller('StorageCtrl',['$scope','$translate','$translatePartialLoader',function ($scope, $translate, $translatePartialLoader) {
		$translatePartialLoader.addPart('storage');
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

	}]);