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
	.controller('appCtrl', ['$rootScope','$scope',  '$state', '$stateParams', 'loginModal','$location','alertService','xtmotorsAPIService', '$q', '$mdBottomSheet','$mdSidenav', '$mdDialog','$http',
    function ($rootScope, $scope, $state, $stateParams, loginModal,$location,alertService,xtmotorsAPIService,$q,$mdBottomSheet, $mdSidenav, $mdDialog,$http) {
    $rootScope._ = _;


    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
        // alertService.add('success','state change', '200');
        // alertService.add('warning','state change', '400');
        // $rootScope.isLoading = true;

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
.controller('LoginModalCtrl',['$rootScope','$scope','xtmotorsAPIService','$http','$mdDialog','$mdToast',function ($rootScope,$scope,xtmotorsAPIService,$http,$mdDialog,$mdToast) {

   $scope.attemptLogin = function (email, passWord) {
		 var data ="userName=" + email + "&password=" + passWord +"&grant_type=password";
		//  $http.defaults.headers.post['Content-Type'] =  'application/x-www-form-urlencoded';
			xtmotorsAPIService.save({section:'token'},data).$promise.then(function(res){
					$rootScope.setUserAuth(res);
					var user = {'email':email,'password':passWord};
					$scope.$close(user);
			},function(error){
				$mdToast.show($mdToast.simple().textContent('Hello!'));
			});

	 };

}])

.controller('SettingCtrl',['$scope',function ($scope) {

    // alert("setting");

}])

.controller('ProfileCtrl',['$scope',function ($scope) {

    // alert("profile");

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
