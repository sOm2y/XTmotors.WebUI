'use strict';
/**
 * @ngdoc overview
 * @name xtmotorwebuiApp
 * @description
 * # xtmotorwebuiApp
 *
 * storage controller of the application.
 */
angular.module('storage.controllers',[])
	.controller('StorageCtrl',['$scope','$translate','$translatePartialLoader','xtmotorsCRUDService',function ($scope, $translate, $translatePartialLoader,xtmotorsCRUDService) {
		$translatePartialLoader.addPart('storage');
  		$translate.refresh();
  		xtmotorsCRUDService.get('Car/CarBriefView',$scope)
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
          limit: 10,
          page: 1
        };

		// $scope.totalItems = $scope.cars.length;
	 //    $scope.itemsPerPage = 10;
	 //    $scope.currentPage = 1;
	  
	 //    $scope.pageCount = function () {
	 //      return Math.ceil($scope.cars.length / $scope.itemsPerPage);
	 //    };

	 //    $scope.$watch('currentPage + itemsPerPage', function() {
	 //      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
	 //        end = begin + $scope.itemsPerPage;

	 //      $scope.filteredFriends = $scope.cars.slice(begin, end);
	 //    });

	}]);