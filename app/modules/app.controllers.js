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
	.controller('appCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'loginModal','$location','alertService','xtmotorsAPIService', '$q', function ($scope, $rootScope, $state, $stateParams, loginModal,$location,alertService,xtmotorsAPIService,$q) {
    xtmotorsAPIService.get({})
    .$promise.then(function(data) {
      $scope.data = data;
    }, function(error) {
      console.log(error);
    });


    $rootScope.changeView = function(view) {
      $location.path(view);
    };
    // root binding for alertService
    $rootScope.closeAlert = alertService.closeAlert; 
    $rootScope.$on('$stateChangeStart', function() {        
        alertService.add('success','state change', '200');
        alertService.add('warning','state change', '400');
    });

    $rootScope.logout = function(){
      delete $rootScope.currentUser;
      loginModal().then(function () {
        // $rootScope.removeAlerts();
        return $state.go($state.current, {}, {reload: true});
      });   
    };
		$scope.listGalleryView = false;

    //dummy data for cars
		$scope.cars=[
  			{id:'000-100',brand:'BMW',model:'M3',year:'2012',odometer:'23000',salePrice:'73000',status:'shipping'},
  			{id:'000-101',brand:'Mazda',model:'Mazda 2',year:'2013',odometer:'23000',salePrice:'73000',status:'shipping'},
  			{id:'000-102',brand:'Honda',model:'CR-V',year:'2003',odometer:'23000',salePrice:'73000',status:'shipping'},
  			{id:'000-103',brand:'Toyota',model:'Puris',year:'2009',odometer:'23000',salePrice:'73000',status:'shipping'},
  			{id:'000-104',brand:'Nissian',model:'GTR',year:'2010',odometer:'23000',salePrice:'73000',status:'shipping'},
  			{id:'000-105',brand:'Mercedes Benz',model:'S400',year:'2015',odometer:'23000',salePrice:'73000',status:'shipping'},
  			{id:'000-106',brand:'Audi',model:'M3',year:'2008',odometer:'23000',salePrice:'73000',status:'shipping'},
  			{id:'000-107',brand:'Tesla',model:'M3',year:'2012',odometer:'23000',salePrice:'73000',status:'shipping'},
  			{id:'000-108',brand:'Ford',model:'M3',year:'2002',odometer:'23000',salePrice:'73000',status:'shipping'},
  			{id:'000-109',brand:'Suzuki',model:'M3',year:'2006',odometer:'23000',salePrice:'73000',status:'shipping'},
  			{id:'000-110',brand:'Subaru',model:'M3',year:'2007',odometer:'23000',salePrice:'73000',status:'shipping'},
  			{id:'000-111',brand:'Vovlo',model:'M3',year:'2005',odometer:'23000',salePrice:'73000',status:'shipping'},
  			{id:'000-112',brand:'Toyota',model:'M3',year:'2008',odometer:'23000',salePrice:'73000',status:'shipping'},
  			{id:'000-113',brand:'Lexus',model:'M3',year:'2006',odometer:'23000',salePrice:'73000',status:'shipping'},
  			{id:'000-114',brand:'Honda',model:'M3',year:'2011',odometer:'23000',salePrice:'73000',status:'in store'},
  			{id:'000-115',brand:'Nissian',model:'M3',year:'2004',odometer:'23000',salePrice:'73000',status:'shipping'},
        {id:'000-116',brand:'Mazda',model:'M3',year:'2003',odometer:'23000',salePrice:'73000',status:'arrived'},
        {id:'000-116',brand:'Mazda',model:'M3',year:'2003',odometer:'23000',salePrice:'73000',status:'arrived'},
        {id:'000-116',brand:'Mazda',model:'M3',year:'2003',odometer:'23000',salePrice:'73000',status:'arrived'},
        {id:'000-116',brand:'Mazda',model:'M3',year:'2003',odometer:'23000',salePrice:'73000',status:'arrived'},
        {id:'000-116',brand:'Mazda',model:'M3',year:'2003',odometer:'23000',salePrice:'73000',status:'arrived'},
        {id:'000-116',brand:'Mazda',model:'M3',year:'2003',odometer:'23000',salePrice:'73000',status:'arrived'},
        {id:'000-116',brand:'Mazda',model:'M3',year:'2003',odometer:'23000',salePrice:'73000',status:'arrived'},
        {id:'000-116',brand:'Mazda',model:'M3',year:'2003',odometer:'23000',salePrice:'73000',status:'arrived'},
        {id:'000-116',brand:'Mazda',model:'M3',year:'2003',odometer:'23000',salePrice:'73000',status:'arrived'},
        {id:'000-116',brand:'Mazda',model:'M3',year:'2003',odometer:'23000',salePrice:'73000',status:'arrived'},
        {id:'000-116',brand:'Mazda',model:'M3',year:'2003',odometer:'23000',salePrice:'73000',status:'arrived'},
        {id:'000-116',brand:'Mazda',model:'M3',year:'2003',odometer:'23000',salePrice:'73000',status:'arrived'},
        {id:'000-116',brand:'Mazda',model:'M3',year:'2003',odometer:'23000',salePrice:'73000',status:'arrived'},
        {id:'000-116',brand:'Mazda',model:'M3',year:'2003',odometer:'23000',salePrice:'73000',status:'arrived'},
        {id:'000-116',brand:'Mazda',model:'M3',year:'2003',odometer:'23000',salePrice:'73000',status:'arrived'},
        {id:'000-116',brand:'Mazda',model:'M3',year:'2003',odometer:'23000',salePrice:'73000',status:'arrived'},
        {id:'000-116',brand:'Mazda',model:'M3',year:'2003',odometer:'23000',salePrice:'73000',status:'arrived'},
        {id:'000-116',brand:'Mazda',model:'M3',year:'2003',odometer:'23000',salePrice:'73000',status:'arrived'},
  			{id:'000-116',brand:'Mazda',model:'M3',year:'2003',odometer:'23000',salePrice:'73000',status:'arrived'}
  		];




      
	}])
.controller('LoginModalCtrl', function ($scope) {

   $scope.submit = function (email, password) {
      var user = {'email':email,'password':password};
      $scope.$close(user);
  };

});