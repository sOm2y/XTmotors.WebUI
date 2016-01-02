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
	.controller('appCtrl', ['$rootScope','$scope',  '$state', '$stateParams', 'loginModal','$location','alertService','xtmotorsAPIService', '$q', function ($rootScope, $scope, $state, $stateParams, loginModal,$location,alertService,xtmotorsAPIService,$q) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {        
        // alertService.add('success','state change', '200');
        // alertService.add('warning','state change', '400');
        var requireLogin = toState.data.requireLogin;

        if (requireLogin && typeof $rootScope.currentUser === 'undefined') {
          event.preventDefault();

          loginModal()
            .then(function () {
              return $state.go(toState.name, toParams);
            })
            .catch(function () {
              return $state.go('car');
            });
        }
    });
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
 

    $rootScope.logout = function(){
      delete $rootScope.currentUser;
      loginModal().then(function () {
        // $rootScope.removeAlerts();
        return $state.go($state.current, {}, {reload: true});
      });   
    };


    $rootScope.checkCurrentPage = function(){
      switch($state.current.name){
        case 'customer': 
          $state.go('customer.details',{}, {reload: true});
          break;
        case 'employee':
          $state.go('employee.details',{}, {reload: true});
          break;
        case 'car':
          $state.go('car.details',{}, {reload: true});
          break;
        default:
          $state.go('car.details',{}, {reload: true});
      }
    };
		$scope.listGalleryView = false;

	}])
.controller('LoginModalCtrl', function ($scope) {

   	$scope.submit = function (email, password) {
	    var user = {'email':email,'password':password};
	    $scope.$close(user);
  	};

});