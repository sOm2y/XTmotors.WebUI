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
    xtmotorsAPIService.get({section:''})
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
        // alertService.add('success','state change', '200');
        // alertService.add('warning','state change', '400');
    });

    $rootScope.logout = function(){
      delete $rootScope.currentUser;
      loginModal().then(function () {
        // $rootScope.removeAlerts();
        return $state.go($state.current, {}, {reload: true});
      });   
    };
		$scope.listGalleryView = false;
	}])
.controller('LoginModalCtrl', function ($scope) {

   	$scope.submit = function (email, password) {
	    var user = {'email':email,'password':password};
	    $scope.$close(user);
  	};

});