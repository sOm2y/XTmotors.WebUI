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
	.controller('StorageCtrl', ['$scope', function ($scope) {
		$scope.storage = 'storage'; 
	}]);