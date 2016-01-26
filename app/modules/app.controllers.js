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
	.controller('appCtrl', ['$rootScope','$scope',  '$state', '$stateParams', 'loginModal','$location','alertService','xtmotorsAPIService', '$q', '$mdBottomSheet','$mdSidenav', '$mdDialog', 
    function ($rootScope, $scope, $state, $stateParams, loginModal,$location,alertService,xtmotorsAPIService,$q,$mdBottomSheet, $mdSidenav, $mdDialog) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {        
        // alertService.add('success','state change', '200');
        // alertService.add('warning','state change', '400');
        $scope.isLoading = false;
        var requireLogin = toState.data.requireLogin;
         $rootScope.buttonDisable = false;
        if (requireLogin && typeof $rootScope.currentUser === 'undefined') {
          event.preventDefault();
          loginModal()
            .then(function () {
              directCarDetails();
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
      $rootScope.cars=[
        {CarId:'999-999',Brand:'Mazda',Model:'M3',Year:'2003',Odometer:'23000',SalePrice:'73000',Status:'arrived'},
        {CarId:'000-116',Brand:'Mazda',Model:'M3',Year:'2003',Odometer:'23000',SalePrice:'73000',Status:'arrived'},
        {CarId:'000-116',Brand:'Mazda',Model:'M3',Year:'2003',Odometer:'23000',SalePrice:'73000',Status:'arrived'},
        {CarId:'000-116',Brand:'Mazda',Model:'M3',Year:'2003',Odometer:'23000',SalePrice:'73000',Status:'arrived'},
        {CarId:'000-116',Brand:'Mazda',Model:'M3',Year:'2003',Odometer:'23000',SalePrice:'73000',Status:'arrived'},
        {CarId:'000-116',Brand:'Mazda',Model:'M3',Year:'2003',Odometer:'23000',SalePrice:'73000',Status:'arrived'},
        {CarId:'000-116',Brand:'Mazda',Model:'M3',Year:'2003',Odometer:'23000',SalePrice:'73000',Status:'arrived'},
        {CarId:'000-116',Brand:'Mazda',Model:'M3',Year:'2003',Odometer:'23000',SalePrice:'73000',Status:'arrived'},
        {CarId:'000-116',Brand:'Mazda',Model:'M3',Year:'2003',Odometer:'23000',SalePrice:'73000',Status:'arrived'},
        {CarId:'000-116',Brand:'Mazda',Model:'M3',Year:'2003',Odometer:'23000',SalePrice:'73000',Status:'arrived'},
        {CarId:'000-116',Brand:'Mazda',Model:'M3',Year:'2003',Odometer:'23000',SalePrice:'73000',Status:'arrived'},
        {CarId:'000-116',Brand:'Mazda',Model:'M3',Year:'2003',Odometer:'23000',SalePrice:'73000',Status:'arrived'},
        {CarId:'000-116',Brand:'Mazda',Model:'M3',Year:'2003',Odometer:'23000',SalePrice:'73000',Status:'arrived'},
        {CarId:'000-116',Brand:'Mazda',Model:'M3',Year:'2003',Odometer:'23000',SalePrice:'73000',Status:'arrived'},
        {CarId:'000-116',Brand:'Mazda',Model:'M3',Year:'2003',Odometer:'23000',SalePrice:'73000',Status:'arrived'},
        {CarId:'000-116',Brand:'Mazda',Model:'M3',Year:'2003',Odometer:'23000',SalePrice:'73000',Status:'arrived'},
        {CarId:'000-116',Brand:'Mazda',Model:'M3',Year:'2003',Odometer:'23000',SalePrice:'73000',Status:'arrived'},
        {CarId:'000-116',Brand:'Mazda',Model:'M3',Year:'2003',Odometer:'23000',SalePrice:'73000',Status:'arrived'},
        {CarId:'000-116',Brand:'Mazda',Model:'M3',Year:'2003',Odometer:'23000',SalePrice:'73000',Status:'arrived'},
        {CarId:'000-116',Brand:'Mazda',Model:'M3',Year:'2003',Odometer:'23000',SalePrice:'73000',Status:'arrived'},
        {CarId:'000-116',Brand:'Mazda',Model:'M3',Year:'2003',Odometer:'23000',SalePrice:'73000',Status:'arrived'},
        {CarId:'000-116',Brand:'Mazda',Model:'M3',Year:'2003',Odometer:'23000',SalePrice:'73000',Status:'arrived'},
        {CarId:'000-116',Brand:'Mazda',Model:'M3',Year:'2003',Odometer:'23000',SalePrice:'73000',Status:'arrived'}
      ];

    $rootScope.changeView = function(view) {
      $location.path(view);
    };
    // root binding for alertService
    $rootScope.closeAlert = alertService.closeAlert; 
 

    $rootScope.logout = function(){
      delete $rootScope.currentUser;
      loginModal().then(function () {
        // $rootScope.removeAlerts();
        directCarDetails();
      });   
    };

    function directCarDetails(){
      if($state.current.name === 'car.details'){
        return $state.go('car');
      }else{
        return $state.go($state.current, {}, {reload: true});
      }
    }


    $rootScope.checkCurrentPage = function(){
      switch($state.current.name){
        case 'customer': 
          $state.go('customer.details',{}, {reload: true});
          $rootScope.buttonDisable = true;
          break;
        case 'employee':
          $state.go('employee.details',{}, {reload: true});
          $rootScope.buttonDisable = true;
          break;
        case 'car':
          $state.go('car.details',{}, {reload: true});
          $rootScope.buttonDisable = true;
          break;
        case 'customer.details':
          $rootScope.buttonDisable = true;
          break;
        case 'employee.details':
          $rootScope.buttonDisable = true;
          break;
        case 'car.details':
          $rootScope.buttonDisable = true;
          break;
        default:
          $state.go('car.details',{}, {reload: true});
          $rootScope.buttonDisable = true;
          break;
      }
    };
		$scope.listGalleryView = false;


    
  // Toolbar search toggle
  $scope.toggleSearch = function(element) {
    $scope.showSearch = !$scope.showSearch;
  };
  
  // Sidenav toggle
  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };
  
  // Menu items
  $scope.menu = [
    {
      link : 'car',
      title: 'Cars',
      icon: 'action:ic_dashboard_24px' // we have to use Google's naming convention for the IDs of the SVGs in the spritesheet
    },
    {
      link : 'settlement',
      title: 'Settlement',
      icon: 'social:ic_group_24px'
    },
    {
      link : 'storage',
      title: 'Storage',
      icon: 'communication:ic_message_24px'
    },
    {
      link : 'consignment',
      title: 'Consignments',
      icon: 'communication:ic_message_24px'
    }
  ];
  $scope.admin = [
    {
      link : 'customer',
      title: 'Customer',
      icon: 'action:ic_delete_24px'
    },
    {
      link : 'employee',
      title: 'Employee',
      icon: 'action:ic_settings_24px'
    }
  ];
  
  // Mock activity
  $scope.activity = [
      {
        what: 'Brunch this weekend?',
        who: 'Ali Conners',
        avatar: 'svg-1',
        when: '3:08PM',
        notes: " I'll be in your neighborhood doing errands"
      },
      {
        what: 'Summer BBQ',
        who: 'to Alex, Scott, Jennifer',
        avatar: 'svg-2',
        when: '3:08PM',
        notes: "Wish I could come out but I'm out of town this weekend"
      },
      {
        what: 'Oui Oui',
        who: 'Sandra Adams',
        avatar: 'svg-3',
        when: '3:08PM',
        notes: "Do you have Paris recommendations? Have you ever been?"
      },
      {
        what: 'Birthday Gift',
        who: 'Trevor Hansen',
        avatar: 'svg-4',
        when: '3:08PM',
        notes: "Have any ideas of what we should get Heidi for her birthday?"
      },
      {
        what: 'Recipe to try',
        who: 'Brian Holt',
        avatar: 'svg-5',
        when: '3:08PM',
        notes: "We should eat this: Grapefruit, Squash, Corn, and Tomatillo tacos"
      },
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
.controller('LoginModalCtrl',['$scope',function ($scope) {

   	$scope.submit = function (email, password) {
	    var user = {'email':email,'password':password};
	    $scope.$close(user);
  	};

}])
.controller('DemoCtrl', ['$scope', function ($scope) {
  
     var self = this;
        // ******************************
    // Internal methods
    // ******************************
    /**
     * Search for states... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch (query) {
      var results = query ? self.states.filter( createFilterFor(query) ) : [];
      return results;
    }
    /**
     * Build `states` list of key/value pairs
     */
    function loadAll() {
      var allStates = 'Ali Conners, Alex, Scott, Jennifer, \ Sandra Adams, Brian Holt, \ Trevor Hansen';
      return allStates.split(/, +/g).map( function (state) {
        return {
          value: state.toLowerCase(),
          display: state
        };
      });
    }
    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };
    }
    // list of `state` value/display objects
    self.states        = loadAll();
    self.selectedItem  = null;
    self.searchText    = null;
    self.querySearch   = querySearch;
 
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