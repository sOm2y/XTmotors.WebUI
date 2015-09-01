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
  		$scope.cars=[
  			{id:'000-100',brand:'BMW',model:'M3',year:'2013',odometer:'23000',salePrice:'73000',status:'shipping'},
  			{id:'000-101',brand:'Mazda',model:'M3',year:'2013',odometer:'23000',salePrice:'73000',status:'shipping'},
  			{id:'000-102',brand:'Honda',model:'M3',year:'2013',odometer:'23000',salePrice:'73000',status:'shipping'},
  			{id:'000-103',brand:'Toyota',model:'M3',year:'2013',odometer:'23000',salePrice:'73000',status:'shipping'},
  			{id:'000-104',brand:'Nissian',model:'M3',year:'2013',odometer:'23000',salePrice:'73000',status:'shipping'},
  			{id:'000-105',brand:'Mercedes Benz',model:'M3',year:'2013',odometer:'23000',salePrice:'73000',status:'shipping'},
  			{id:'000-106',brand:'Audi',model:'M3',year:'2013',odometer:'23000',salePrice:'73000',status:'shipping'},
  			{id:'000-107',brand:'Tesla',model:'M3',year:'2013',odometer:'23000',salePrice:'73000',status:'shipping'},
  			{id:'000-108',brand:'Ford',model:'M3',year:'2013',odometer:'23000',salePrice:'73000',status:'shipping'},
  			{id:'000-109',brand:'Suzuki',model:'M3',year:'2013',odometer:'23000',salePrice:'73000',status:'shipping'},
  			{id:'000-110',brand:'Subaru',model:'M3',year:'2013',odometer:'23000',salePrice:'73000',status:'shipping'},
  			{id:'000-111',brand:'Vovlo',model:'M3',year:'2013',odometer:'23000',salePrice:'73000',status:'shipping'},
  			{id:'000-112',brand:'Toyota',model:'M3',year:'2013',odometer:'23000',salePrice:'73000',status:'shipping'},
  			{id:'000-113',brand:'Lexus',model:'M3',year:'2013',odometer:'23000',salePrice:'73000',status:'shipping'},
  			{id:'000-114',brand:'Honda',model:'M3',year:'2013',odometer:'23000',salePrice:'73000',status:'shipping'},
  			{id:'000-115',brand:'Nissian',model:'M3',year:'2013',odometer:'23000',salePrice:'73000',status:'shipping'},
  			{id:'000-116',brand:'Mazda',model:'M3',year:'2013',odometer:'23000',salePrice:'73000',status:'shipping'}
  		];
	}]);