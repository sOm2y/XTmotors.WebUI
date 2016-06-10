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
	.controller('appCtrl', ['$rootScope','$scope',  '$state', '$stateParams', 'loginModal','$location','alertService','xtmotorsAPIService', '$q', '$mdBottomSheet','$mdSidenav', '$mdDialog','$http','localStorageService',
    function ($rootScope, $scope, $state, $stateParams, loginModal,$location,alertService,xtmotorsAPIService,$q,$mdBottomSheet, $mdSidenav, $mdDialog,$http,localStorageService) {
    $rootScope._ = _;


    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
        // $rootScope.isLoading = true;
				if(localStorageService.get('oauth_token')){
					var user = localStorageService.get('oauth_token');
					$rootScope.setUserAuth(user);
					xtmotorsAPIService.get({section:'account/getUserProfile'}).$promise.then(function(res){
						$rootScope.profile = {
							email:res.email,
							lastName: res.lastName,
							firstName: res.firstName,
							phone:res.phone
						}
					});
					$rootScope.close(user);
				}
        var requireLogin = toState.data.requireLogin;
        $rootScope.buttonDisable = false;

        if (requireLogin && typeof $rootScope.currentUser === 'undefined') {
          event.preventDefault();
          $rootScope.isLoading = false;
          loginModal()
            .then(function () {
                return $state.go('car');
            })
            .catch(function () {
              return $state.go('car');
            });
        }
    });

    $scope.$watch('selectedCar', function(newVal){
      if(newVal){
          $rootScope.editCar(newVal);
      }
    });
		$rootScope.setUserAuth = function(oauth){
				var authHeader = 'Bearer '+oauth.access_token;
				$http.defaults.headers.common.Authorization = authHeader;
		};
    $rootScope.fabDirections = ['up', 'down', 'left', 'right'];
    $rootScope.fabDirection = $rootScope.fabDirections[0];
    $rootScope.fabAnimations = ['md-fling', 'md-scale'];
    $rootScope.fabAnimation = $rootScope.fabAnimations[1];
    $rootScope.fabStatuses = [false, true];
    $rootScope.fabStatus = $rootScope.fabStatuses[0];

    $rootScope.createSeletedObject = function (selectedObject) {
      switch(selectedObject){
        case 'customer':
          $state.go('customer.details',{}, {reload: true});
          $rootScope.buttonDisable = true;
          $rootScope.newCustomer = true;
          break;
        case 'employee':
          $state.go('employee.details',{}, {reload: true});
          $rootScope.buttonDisable = true;
          $rootScope.newEmployee = true;
          break;
        case 'car':
          $state.go('car.details',{}, {reload: true});
          $rootScope.buttonDisable = true;
          $rootScope.newCar = true;
          $rootScope.isVehicleModelListLoaded = false;
          break;
      }
    };
    $rootScope.createItem = function(){
      if(!$scope.item){
          $scope.newItem = true;
          $scope.item = {};
      }
    };
    $rootScope.changeView = function(view) {
      $location.path(view);
    };
    // root binding for alertService
    $rootScope.closeAlert = alertService.closeAlert;


    $rootScope.logout = function(){
			localStorageService.clearAll();
      delete $rootScope.currentUser;
      loginModal().then(function () {
        // $rootScope.removeAlerts();
        return $state.go($state.current, {}, {reload: true});
      });
    };

    $rootScope.openSetting = function(){
      $state.go('appSetting',{}, {reload: true});
      // $rootScope.buttonDisable = true;
    };

    $rootScope.openProfile = function(){
      // alert("a");
      $state.go('profile',{}, {reload: true});
      // $rootScope.buttonDisable = true;
    };

    function directCarDetails(){
      if($state.current.name === 'car.details'){
        return $state.go('car');
      }else{
        return $state.go($state.current, {}, {reload: true});
      }
    }


		$scope.listGalleryView = false;

  // Sidenav toggle
  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };

  // Menu items
  $scope.menu = [
    {
      link : 'car',
      title: 'Car',
      icon: 'directions_car' // we have to use Google's naming convention for the IDs of the SVGs in the spritesheet
    },
    {
      link : 'settlement',
      title: 'Settlement',
      icon: 'equalizer'
    },
    {
      link : 'storage',
      title: 'Storage',
      icon: 'store'
    },
    {
      link : 'consignment',
      title: 'Consignments',
      icon: 'directions_ferry'
    },
    {
      link : 'sales',
      title: 'Sales',
      icon: 'trending_up'
    }
  ];
  $scope.admin = [
    {
      link : 'customer',
      title: 'Customer',
      icon: 'supervisor_account'
    },
    {
      link : 'employee',
      title: 'Employee',
      icon: 'perm_contact_cal'
    }
  ];


    // Bottomsheet & Modal Dialogs
    $scope.alert = '';
    $scope.showListBottomSheet = function($event) {
      $scope.alert = '';
      $mdBottomSheet.show({
        template: '<md-bottom-sheet class="md-list md-has-header"><md-list><md-list-item class="md-2-line" ng-repeat="item in items" role="link" md-ink-ripple><md-icon md-svg-icon="{{item.icon}}" aria-label="{{item.name}}"></md-icon><div class="md-list-item-text"><h3>{{item.name}}</h3></div></md-list-item> </md-list></md-bottom-sheet>',
        controller: 'ListBottomSheetCtrl',
        targetEvent: $event
      }).then(function(clickedItem) {
        $scope.alert = clickedItem.name + ' clicked!';
      });
    };

	}])
.controller('LoginModalCtrl',['$rootScope','$scope','xtmotorsAPIService','$http','$mdDialog','$mdToast','localStorageService','loginModal','$modalInstance',
function ($rootScope,$scope,xtmotorsAPIService,$http,$mdDialog,$mdToast,localStorageService,loginModal,$modalInstance) {
	$rootScope.close = function (user) {
			$modalInstance.close(user);
	};
   $scope.attemptLogin = function (email, passWord) {
		 var data ="userName=" + email + "&password=" + passWord +"&grant_type=password";
		//  $http.defaults.headers.post['Content-Type'] =  'application/x-www-form-urlencoded';
			xtmotorsAPIService.save({section:'token'},data).$promise.then(function(res){
					$rootScope.setUserAuth(res);

					if($scope.rememberPassword){
						localStorageService.set('oauth_token',res);
					}

					var user = {'email':email,'password':passWord};
					$rootScope.close(user);
			},function(error){
				$mdToast.show({
					template: '<md-toast class="md-toast md-toast-500"><span flex>' + 'Login Failed'  + '</span></md-toast>',
					position: 'top right',
					hideDelay: 5000
				});
			});

	 };

}])

.controller('SettingCtrl',['$scope','xtmotorsAPIService','$mdToast','$state',function ($scope,xtmotorsAPIService,$mdToast,$state) {
	$scope.updatePassword = function(password){
		xtmotorsAPIService.save({section:'account/changePassword'},password).$promise.then(function(res){
			$mdToast.show({
				template: '<md-toast class="md-toast md-toast-success"><span flex>' + 'Password has been updated.'  + '</span></md-toast>',
				position: 'top right',
				hideDelay: 5000
			});
		},function(err){
			$mdToast.show({
				template: '<md-toast class="md-toast md-toast-500"><span flex>' + 'Password does not match.'  + '</span></md-toast>',
				position: 'top right',
				hideDelay: 5000
			});
		});
	};
	$scope.backToHome = function(){
		$state.go('car');
	}


}])

.controller('ProfileCtrl',['$scope','xtmotorsAPIService','$mdToast','$state',function ($scope,xtmotorsAPIService,$mdToast,$state) {
		$scope.updateProfile = function(profile){
			xtmotorsAPIService.save({section:'account/changeProfile'},profile).$promise.then(function(res){
				$mdToast.show({
					template: '<md-toast class="md-toast md-toast-success"><span flex>' + 'Profile has been updated.'  + '</span></md-toast>',
					position: 'top right',
					hideDelay: 5000
				});
			},function(err){
				$mdToast.show({
					template: '<md-toast class="md-toast md-toast-500"><span flex>' + 'Update Profile Failed.'  + '</span></md-toast>',
					position: 'top right',
					hideDelay: 5000
				});
			});
		};
  	$scope.backToHome = function(){
			$state.go('car');
		}

}])

.controller('ListBottomSheetCtrl',['$scope','$mdBottomSheet',function($scope, $mdBottomSheet) {
  $scope.items = [
    { name: 'Share', icon: 'social:ic_share_24px' },
    { name: 'Upload', icon: 'file:ic_cloud_upload_24px' },
    { name: 'Copy', icon: 'content:ic_content_copy_24px' },
    { name: 'Print this page', icon: 'action:ic_print_24px' },
  ];

  $scope.listItemClick = function($index) {
    var clickedItem = $scope.items[$index];
    $mdBottomSheet.hide(clickedItem);
  };
}]);
