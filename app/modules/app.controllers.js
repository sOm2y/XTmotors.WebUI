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
        var requireLogin = toState.data.requireLogin;
         $rootScope.buttonDisable = false;
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


    $scope.toggleSidenav = function(menuId) {
        $mdSidenav(menuId).toggle();
      };
      $scope.menu = [
        {
          link : 'car',
          title: 'Cars',
          icon: 'car'
        },
        {
          link : 'settlement',
          title: 'Settlement',
          icon: 'group'
        },
        {
          link : 'storage',
          title: 'Storage',
          icon: 'message'
        },
        {
          link : 'consignment',
          title: 'Consignments',
          icon: 'message'
        }
      ];
      $scope.admin = [
        {
          link : 'customer',
          title: 'Customer',
          icon: 'delete'
        },
        {
          link : 'employee',
          title: 'Employee',
          icon: 'settings'
        }
      ];
      $scope.activity = [
          {
            what: 'Brunch this weekend?',
            who: 'Ali Conners',
            when: '3:08PM',
            notes: " I'll be in your neighborhood doing errands"
          },
          {
            what: 'Summer BBQ',
            who: 'to Alex, Scott, Jennifer',
            when: '3:08PM',
            notes: "Wish I could come out but I'm out of town this weekend"
          },
          {
            what: 'Oui Oui',
            who: 'Sandra Adams',
            when: '3:08PM',
            notes: "Do you have Paris recommendations? Have you ever been?"
          },
          {
            what: 'Birthday Gift',
            who: 'Trevor Hansen',
            when: '3:08PM',
            notes: "Have any ideas of what we should get Heidi for her birthday?"
          },
          {
            what: 'Recipe to try',
            who: 'Brian Holt',
            when: '3:08PM',
            notes: "We should eat this: Grapefruit, Squash, Corn, and Tomatillo tacos"
          },
        ];
      $scope.alert = '';
      $scope.showListBottomSheet = function($event) {
        $scope.alert = '';
        $mdBottomSheet.show({
          template: '<md-bottom-sheet class="md-list md-has-header"> <md-subheader>Settings</md-subheader> <md-list> <md-item ng-repeat="item in items"><md-item-content md-ink-ripple flex class="inset"> <a flex aria-label="{{item.name}}" ng-click="listItemClick($index)"> <span class="md-inline-list-icon-label">{{ item.name }}</span> </a></md-item-content> </md-item> </md-list></md-bottom-sheet>',
          controller: 'ListBottomSheetCtrl',
          targetEvent: $event
        }).then(function(clickedItem) {
          $scope.alert = clickedItem.name + ' clicked!';
        });
      };
      
      // $scope.showAdd = function(ev) {
      //   $mdDialog.show({
      //     controller: DialogController,
      //     template: '<md-dialog aria-label="Mango (Fruit)"> <md-content class="md-padding"> <form name="userForm"> <div layout layout-sm="column"> <md-input-container flex> <label>First Name</label> <input ng-model="user.firstName" placeholder="Placeholder text"> </md-input-container> <md-input-container flex> <label>Last Name</label> <input ng-model="theMax"> </md-input-container> </div> <md-input-container flex> <label>Address</label> <input ng-model="user.address"> </md-input-container> <div layout layout-sm="column"> <md-input-container flex> <label>City</label> <input ng-model="user.city"> </md-input-container> <md-input-container flex> <label>State</label> <input ng-model="user.state"> </md-input-container> <md-input-container flex> <label>Postal Code</label> <input ng-model="user.postalCode"> </md-input-container> </div> <md-input-container flex> <label>Biography</label> <textarea ng-model="user.biography" columns="1" md-maxlength="150"></textarea> </md-input-container> </form> </md-content> <div class="md-actions" layout="row"> <span flex></span> <md-button ng-click="answer(\'not useful\')"> Cancel </md-button> <md-button ng-click="answer(\'useful\')" class="md-primary"> Save </md-button> </div></md-dialog>',
      //     targetEvent: ev,
      //   })
      //   .then(function(answer) {
      //     $scope.alert = 'You said the information was "' + answer + '".';
      //   }, function() {
      //     $scope.alert = 'You cancelled the dialog.';
      //   });
      // };

	}])
.controller('LoginModalCtrl', function ($scope) {

   	$scope.submit = function (email, password) {
	    var user = {'email':email,'password':password};
	    $scope.$close(user);
  	};

})
.controller('ListBottomSheetCtrl', function($scope, $mdBottomSheet) {
  $scope.items = [
    { name: 'Share', icon: 'share' },
    { name: 'Upload', icon: 'upload' },
    { name: 'Copy', icon: 'copy' },
    { name: 'Print this page', icon: 'print' },
  ];
  
  $scope.listItemClick = function($index) {
    var clickedItem = $scope.items[$index];
    $mdBottomSheet.hide(clickedItem);
  };
});

function DialogController($scope, $mdDialog) {
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
}