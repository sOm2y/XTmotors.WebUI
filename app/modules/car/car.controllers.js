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
	.controller('CarCtrl', ['$scope','$translate','$translatePartialLoader', function ($scope,$translate, $translatePartialLoader) {
		$scope.car = 'car'; 
		$translatePartialLoader.addPart('car');
  		$translate.refresh();
	}]);