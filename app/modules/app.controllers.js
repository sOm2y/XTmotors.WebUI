'use strict';
/**
 * @ngdoc overview
 * @name xtmotorwebuiApp
 * @description
 * # xtmotorwebuiApp
 *
 * Main controller of the application.
 */
angular.module('app.controllers',[])
	.controller('appCtrl', ['$scope', function ($scope) {
		$scope.listGalleryView = false;
	}]);