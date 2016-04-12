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
.controller('LoginModalCtrl',['$scope',function ($scope) {

   	$scope.submit = function (email, password) {
	    var user = {'email':email,'password':password};
	    $scope.$close(user);
  	};

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
'use strict';
angular.module('app.directives', [])
	.directive('formSearchCar', [function () {
		return {
			restrict: 'E',
			templateUrl:'modules/app/formSearchCar.html'
					
		};
	}])
	.directive('cubeGridSpinner', ['$rootScope','$timeout', 'alertService', function ($rootScope, $timeout, alertService) {
	  	return {
		    restrict: 'E',
		    templateUrl: 'modules/app/cubeGridSpinner.html',
		    link:function(scope, elem, attrs){
		    	// rootScope.isLoading = false;
		    	//adding fake async loading
		    	// $rootScope.$on('$stateChangeStart', function() {    		
		    	// 		scope.isLoading = true;

		     //  	});
		     //  	$rootScope.$on('$stateChangeSuccess', function() {
			    //    $timeout(function(){
		    	// 		scope.isLoading = false;
		    	// 	},1000);
			    // });
		    }
		};
	}])
	.directive('userAvatar', [function() {
	  return {
	    replace: true,
	    template: '<svg class="user-avatar" viewBox="0 0 128 128" height="64" width="64" pointer-events="none" display="block" > <path fill="#FF8A80" d="M0 0h128v128H0z"/> <path fill="#FFE0B2" d="M36.3 94.8c6.4 7.3 16.2 12.1 27.3 12.4 10.7-.3 20.3-4.7 26.7-11.6l.2.1c-17-13.3-12.9-23.4-8.5-28.6 1.3-1.2 2.8-2.5 4.4-3.9l13.1-11c1.5-1.2 2.6-3 2.9-5.1.6-4.4-2.5-8.4-6.9-9.1-1.5-.2-3 0-4.3.6-.3-1.3-.4-2.7-1.6-3.5-1.4-.9-2.8-1.7-4.2-2.5-7.1-3.9-14.9-6.6-23-7.9-5.4-.9-11-1.2-16.1.7-3.3 1.2-6.1 3.2-8.7 5.6-1.3 1.2-2.5 2.4-3.7 3.7l-1.8 1.9c-.3.3-.5.6-.8.8-.1.1-.2 0-.4.2.1.2.1.5.1.6-1-.3-2.1-.4-3.2-.2-4.4.6-7.5 4.7-6.9 9.1.3 2.1 1.3 3.8 2.8 5.1l11 9.3c1.8 1.5 3.3 3.8 4.6 5.7 1.5 2.3 2.8 4.9 3.5 7.6 1.7 6.8-.8 13.4-5.4 18.4-.5.6-1.1 1-1.4 1.7-.2.6-.4 1.3-.6 2-.4 1.5-.5 3.1-.3 4.6.4 3.1 1.8 6.1 4.1 8.2 3.3 3 8 4 12.4 4.5 5.2.6 10.5.7 15.7.2 4.5-.4 9.1-1.2 13-3.4 5.6-3.1 9.6-8.9 10.5-15.2M76.4 46c.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6-.9 0-1.6-.7-1.6-1.6-.1-.9.7-1.6 1.6-1.6zm-25.7 0c.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6-.9 0-1.6-.7-1.6-1.6-.1-.9.7-1.6 1.6-1.6z"/> <path fill="#E0F7FA" d="M105.3 106.1c-.9-1.3-1.3-1.9-1.3-1.9l-.2-.3c-.6-.9-1.2-1.7-1.9-2.4-3.2-3.5-7.3-5.4-11.4-5.7 0 0 .1 0 .1.1l-.2-.1c-6.4 6.9-16 11.3-26.7 11.6-11.2-.3-21.1-5.1-27.5-12.6-.1.2-.2.4-.2.5-3.1.9-6 2.7-8.4 5.4l-.2.2s-.5.6-1.5 1.7c-.9 1.1-2.2 2.6-3.7 4.5-3.1 3.9-7.2 9.5-11.7 16.6-.9 1.4-1.7 2.8-2.6 4.3h109.6c-3.4-7.1-6.5-12.8-8.9-16.9-1.5-2.2-2.6-3.8-3.3-5z"/> <circle fill="#444" cx="76.3" cy="47.5" r="2"/> <circle fill="#444" cx="50.7" cy="47.6" r="2"/> <path fill="#444" d="M48.1 27.4c4.5 5.9 15.5 12.1 42.4 8.4-2.2-6.9-6.8-12.6-12.6-16.4C95.1 20.9 92 10 92 10c-1.4 5.5-11.1 4.4-11.1 4.4H62.1c-1.7-.1-3.4 0-5.2.3-12.8 1.8-22.6 11.1-25.7 22.9 10.6-1.9 15.3-7.6 16.9-10.2z"/> </svg>'
	  };
	}]);

'use strict';

/**
 * @ngdoc overview
 * @name xtmotorwebuiApp
 * @description
 * # xtmotorwebuiApp
 *
 * Main module of the application.
 */
angular
  .module('xtmotorwebuiApp', [
    //libraries
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'jm.i18next',
    'ui.router',
    'pascalprecht.translate',
    'ui.bootstrap',
    'chart.js',
    'ngMaterial',
    'ngMdIcons',
    'md.data.table',
    'google.places',
    'angularMoment',
    'ngMessages',

    //XTmotors app
    'app.controllers',
    'app.directives',
    'app.services',

    //modules
    'car',
    'consignment',
    'customer',
    'employee',
    'settlement',
    'storage'
  ])
  .config(['$urlRouterProvider', function ($urlRouterProvider) {
        $urlRouterProvider.otherwise(function($injector) {
            var $state = $injector.get("$state");
            $state.go("car");
        });     
    }])
  .config(['$translateProvider',function($translateProvider ) {
    $translateProvider.useLoader('$translatePartialLoader', {
      urlTemplate: '/locales/{lang}/{part}.json'
    });
       $translateProvider.preferredLanguage('en-AU');
    }])
  .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('appSetting', {
                url: "/setting",
                templateUrl: "modules/app/appSetting.html",
                controller: 'StorageCtrl',
                data: {
                    requireLogin: true
                }
            });
    }])
    .config(['$mdThemingProvider','$mdIconProvider',function($mdThemingProvider,$mdIconProvider) {
      var customBlueMap =     $mdThemingProvider.extendPalette('light-blue', {
        'contrastDefaultColor': 'light',
        'contrastDarkColors': ['50'],
        '50': 'ffffff'
      });
      $mdThemingProvider.definePalette('customBlue', customBlueMap);
      $mdThemingProvider.theme('default')
        .primaryPalette('customBlue', {
          'default': '500',
          'hue-1': '50'
        })
        .accentPalette('pink');
      $mdThemingProvider.theme('input', 'default')
        .primaryPalette('grey');

      $mdIconProvider
      // linking to https://github.com/google/material-design-icons/tree/master/sprites/svg-sprite
      // 
      .iconSet('action', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-action.svg', 24)
      .iconSet('alert', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-alert.svg', 24)
      .iconSet('av', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-av.svg', 24)
      .iconSet('communication', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-communication.svg', 24)
      .iconSet('content', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-content.svg', 24)
      .iconSet('device', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-device.svg', 24)
      .iconSet('editor', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-editor.svg', 24)
      .iconSet('file', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-file.svg', 24)
      .iconSet('hardware', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-hardware.svg', 24)
      .iconSet('image', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-image.svg', 24)
      .iconSet('maps', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-maps.svg', 24)
      .iconSet('navigation', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-navigation.svg', 24)
      .iconSet('notification', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-notification.svg', 24)
      .iconSet('social', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-social.svg', 24)
      .iconSet('toggle', 'https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-toggle.svg', 24)
    
      // Illustrated user icons used in the docs https://material.angularjs.org/latest/#/demo/material.components.gridList
      .iconSet('avatars', 'https://raw.githubusercontent.com/angular/material/master/docs/app/icons/avatar-icons.svg', 24)
      .defaultIconSet('https://raw.githubusercontent.com/google/material-design-icons/master/sprites/svg-sprite/svg-sprite-action.svg', 24);

  }])
  .run(['$rootScope', '$state', '$stateParams','loginModal','amMoment',
    function($rootScope, $state, $stateParams,loginModal){
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;

  }]);


'use strict';
angular.module('app.services', [])
  .factory('xtmotorsAPIService', ['$resource','$http', function($resource,$http) {
        var apiUrl = 'http://xtmotorwebapi.azurewebsites.net/api/';
        return $resource(apiUrl+':section/:id',{ id: '@_id' },{ 'update': { method: 'PUT' }});
            //   DEFAULT RESOURCE FUNTIONS
            //   'get':    {method:'GET'},
            //   'save':   {method:'POST'},
            //   'query':  {method:'GET', isArray:true},
            //   'remove': {method:'DELETE'},
            //   'delete': {method:'DELETE'}
  }])
  .service('xtmotorsCRUDService' ,['xtmotorsAPIService', 
      function(xtmotorsAPIService){
        this.get = function(functionName, $scope){
            // $activityIndicator.startAnimating();
            return xtmotorsAPIService.query({section: functionName})
                .$promise.then(function(itemList){
                    //set list data or create first item
                    if(_.size(itemList)){
                        $scope.itemList = itemList;
                        $scope.employeePagination();
                    } else {
                        $scope.itemList = [];
                        $scope.createItem();
                    }
                }, $scope.handleErrors).finally(function(){
                    // $rootScope.isLoading = false;
                });
        };

        this.update = function(functionName, $scope, item){
            // $activityIndicator.startAnimating();
            return xtmotorsAPIService.save({section: functionName}, item)
                .$promise.then(function(item){
                    if($scope.itemList) {$scope.itemList.push(item);}
                    if($scope.newItem){
                        var updateObject = {};
                        updateObject[functionName] = $scope.itemList.length;
                    }
                    resetToList($scope);
                    $scope.addAlert({
                        type: 'success',
                        message: "businessSetup:save-success",
                        name: item.name ? item.name: findName(item)
                    });
                    $scope.$broadcast('updateSuccess');
                    return item;
                }, $scope.handleErrors).finally(function(){
                    // $activityIndicator.stopAnimating();
                });
        };

        this.cancelEdit = function($scope){
            if(!$scope.newItem){
                $scope.itemList.push($scope.itemCopy);
            }
            resetToList($scope);
        };
        this.validateForm = function($scope){
            var valid = $scope.itemForm.$valid;

            if(!valid){
                var errorTypes = $scope.itemForm.$error;
                _.forEach(errorTypes, function(errorType, key){
                    _.forEach(errorType, function(error){
                        var errorMessage = error && error.$name ? error.$name : key;
                        $scope.addAlert({
                            type: 'warning',
                            message: 'businessSetup:' + errorMessage + '-invalid'
                        });
                    });
                });
            }
            return valid;
        };

        var resetToList = function($scope){
            $scope.item = null;
            // $scope.itemForm.$setPristine();
            // $scope.itemForm.$setUntouched();
            // $scope.removeAlerts();
            $scope.newItem = null;
            $scope.itemCopy = null;
        };

        var findName = function(item){
            if(item.firstName && item.lastName){
                return item.firstName + " " + item.lastName;
            } else if (item.business) {
                return item.business.name;
            }
        };
  }])
  .service('loginModal', ['$modal', '$rootScope', function ($modal, $rootScope) {

    function assignCurrentUser (user) {
      $rootScope.currentUser = user;
      return user;
    }

    return function() {
      var instance = $modal.open({
        templateUrl: 'modules/app/loginModalTemplate.html',
        controller: 'LoginModalCtrl'
      });

      return instance.result.then(assignCurrentUser);
    };

  }])
  .factory('alertService', [ '$rootScope', function($rootScope) {
    var alertService = {};

    // create an array of alerts available globally
    $rootScope.alerts = [];

    alertService.add = function(type, msg, code) {

      $rootScope.alerts.push({'type': type, 'msg': msg, 'code': code});
    };


    // alertService.add = function(alert){

  
    //   $rootScope._.assign(alert, {
    //     dismissTimeout: alert.type === 'success' ? 3000 : 5000
    //   });

    //   $rootScope.alerts.push(alert);
    // };


    alertService.closeAlert = function(index) {
      $rootScope.alerts.splice(index, 1);
    };

    return alertService;
  }]);
'use strict';
/**
 * @ngdoc overview
 * @name xtmotorwebuiApp
 * @description
 * # xtmotorwebuiApp
 *
 * car controller of the application.
 */
angular.module('car.controllers',[])
	.controller('CarCtrl', ['$rootScope','$scope','$translate','$translatePartialLoader','xtmotorsAPIService','$q','$state','$stateParams','$mdEditDialog','$timeout','$mdToast','$element',function ($rootScope,$scope, $translate, $translatePartialLoader,xtmotorsAPIService,$q,$state, $stateParams,$mdEditDialog,$timeout,$mdToast,$element) {
		$rootScope.isLoading = true;
    xtmotorsAPIService.query({section:'car/summary'})
      .$promise.then(function(cars) {
        $rootScope.cars = cars;
     
        $scope.tableHeaderName = [{title:'id'},{title:'brand'},{title:'model'},{title:'year'},{title:'odometer'},{title:'salePrice'},{title:'status'}];

        $translatePartialLoader.addPart('car');
        $translate.refresh();

        $scope.selected = [];
  
        $scope.options = {
          autoSelect: true,
          boundaryLinks: false,
          largeEditDialog: false,
          pageSelector: false,
          rowSelection: false
        };
        
        $scope.query = {
          order: 'carId',
          limit: 15,
          page: 1
        };

        $scope.checkCarStatusColor = function(carStatus){
          switch(carStatus){
            case "Sold":
              return "sold";
            case "Reserved":
              return "reserved";
            case "For Sale":
              return "sale";
            case "Inspection":
              return "inspection";  
            case "Arrived Port":
              return "arrived"; 
            case "Departed Port":
              return "departed";
          }
        };

        $rootScope.editCar = function(car){
          $q.all({
              importRecord: xtmotorsAPIService.get({section:'ImportRecords/'+car.carId}).$promise,
              // car: xtmotorsAPIService.get({ section:'car/'+car.carId}).$promise,
              contract: xtmotorsAPIService.get({ section:'Contract/'+car.carId}).$promise
            })
            .then(function(res) {
                  $scope.importRecord  = res.importRecord;
                  $scope.contract      = res.contract;
                  $scope.car           = car;
                  if($scope.importRecord){
                    $q.all({
                      maintenance: xtmotorsAPIService.query({section:'Maintenance/Car/'+$scope.car.carId}).$promise,
                      importSummary: xtmotorsAPIService.get({ section:'Import/'+$scope.importRecord.batchId}).$promise
                    })
                    .then(function(res){
                      $scope.importSummary = res.importSummary;
                      $scope.maintenanceRecords = res.maintenance;
                      $scope.importSummary.eta = changeDateFormat($scope.importSummary.eta);
                      $scope.importSummary.createTime = changeDateFormat($scope.importSummary.createTime);
                    },function(error){
                      console.log(error);
                      $mdToast.show({
                        template: '<md-toast class="md-toast md-toast-' +error.status+ '"><span flex>' + error.statusText + '</span></md-toast>',
                        position: 'top right',
                        hideDelay: 5000,
                        parent: $element
                      });
                    });
                  }
               
                $scope.car.wofTime = changeDateFormat($scope.car.wofTime);
                $scope.contract.contractDate = changeDateFormat($scope.contract.contractDate);
                $state.go('car.details',{carId: car.carId});
            },function(error){
              $mdToast.show({
                template: '<md-toast class="md-toast md-toast-' +error.status+ '"><span flex>' + error.statusText + '</span></md-toast>',
                position: 'top right',
                hideDelay: 5000,
                parent: $element
              });
            });
        };


        function changeDateFormat(date){          
          var wofTime = moment(date).startOf('day').toDate();
          return wofTime;
        } 

        $scope.backToCar = function(){
          // xtmotorsCRUDService.cancelEdit($scope);
          $state.go('car');
        };
        $scope.saveCar= function(car,importRecord,importSummary,contract){
          // var formValid = xtmotorsAPIService.validateForm($scope);
          // if(formValid){
          $q.all({
              car: xtmotorsAPIService.update({section:'car/'+car.carId}, car),
              importRecord: xtmotorsAPIService.update({ section:'ImportRecords/'+car.carId}, importRecord).$promise,
              contract: xtmotorsAPIService.update({ section:'Contract/'+car.carId}, contract).$promise,
              // maintenance: xtmotorsAPIService.update({section:'Maintenance/'}, $scope.maintenance).$promise,
              importSummary: xtmotorsAPIService.update({ section:'Import/'+importRecord.batchId}, importSummary).$promise
          })
          .then(function(res){
            console.log(res);
          },function(error){
            console.log(error);
            $mdToast.show({
              template: '<md-toast class="md-toast md-toast-' +error.status+ '"><span flex>' + error.statusText + '</span></md-toast>',
              position: 'top right',
              hideDelay: 5000,
              parent: $element
            });
          }).finally(function(){
              
          })
        };

      }, function(error) {
        $mdToast.show({
          template: '<md-toast class="md-toast md-toast-' +error.status+ '"><span flex>' + error.statusText + '</span></md-toast>',
          position: 'top right',
          hideDelay: 5000,
          parent: $element
        });
    }).finally(function(){

       $rootScope.isLoading = false;
    });
  	
	}])
  .controller('CarDetailsCtrl', ['$rootScope','$scope','xtmotorsAPIService','$q','$translate','$translatePartialLoader','$stateParams', '$mdDialog',
    function ($rootScope,$scope,xtmotorsAPIService, $q,$translate, $translatePartialLoader,$stateParams,$mdDialog) {
    $translatePartialLoader.addPart('carDetails');
    $translate.refresh();  
    $scope.doSecondaryAction = function(event) {
      $mdDialog.show(
        $mdDialog.alert()
          .title('Secondary Action')
          .textContent('Secondary actions can be used for one click actions')
          .ariaLabel('Secondary click demo')
          .ok('Neat!')
          .targetEvent(event)
      );
    };
  

  }])
  .controller('ImportInfoCtrl', ['$rootScope','$scope','xtmotorsAPIService','xtmotorsCRUDService','$translate','$translatePartialLoader','$stateParams', 
    function ($rootScope,$scope,xtmotorsAPIService,xtmotorsCRUDService,$translate, $translatePartialLoader,$stateParams) {




  }]);



'use strict';

/**
 * @ngdoc function
 * @name xtmotorwebuiApp: car config
 * @description
 * # car config of the xtmotorwebuiApp
 */
angular.module('car',
    [
        'car.controllers',
        // 'car.directives',
        'car.services'
    ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('car', {
                url: "/car",
                templateUrl: "modules/car/car.html",
                controller: 'CarCtrl',
                data: {
                    requireLogin: true
                }
            })
            .state('car.details', {
                url: "/:carId",
                // params: {item: null},
                views: {
                    "car-details-view": { 
                        templateUrl: "modules/car/car.details.html",
                        controller: 'CarDetailsCtrl'
                    }
                },
                data: {
                    requireLogin: true
                }
            });
    }]);
angular.module('car.services', [])
    .service('getImportInfo', ['xtmotorsAPIService',
    	function(xtmotorsAPIService){
	        return {
	            importSummary: xtmotorsAPIService.query({ section: 'Import' }).$promise,
	            importRecord: xtmotorsAPIService.query({ section: 'ImportRecords' }).$promise
	        };
        
    }]);
'use strict';
/**
 * @ngdoc overview
 * @name xtmotorwebuiApp
 * @description
 * # xtmotorwebuiApp
 *
 * consignment controller of the application.
 */
angular.module('consignment.controllers',[])
	.controller('ConsignmentCtrl', ['$scope', function ($scope) {
		$scope.consignment = 'consignment'; 
		$scope.countToPaid = 20408;
		$scope.countFromPaid = 0;
		$scope.countToUnpaid = 10403;
		$scope.countFromUnpaid = 0;
	}]);
'use strict';
angular.module('consignment.directives', [])
    .directive('countTo', ['$timeout', function ($timeout) {
        return {
            replace: false,
            scope: true,
            link: function (scope, element, attrs) {

                var e = element[0];
                var num, refreshInterval, duration, steps, step, countTo, value, increment;

                var calculate = function () {
                    refreshInterval = 30;
                    step = 0;
                    scope.timoutId = null;
                    countTo = parseInt(attrs.countTo) || 0;
                    scope.value = parseInt(attrs.value, 10) || 0;
                    duration = (parseFloat(attrs.duration) * 1000) || 0;

                    steps = Math.ceil(duration / refreshInterval);
                    increment = ((countTo - scope.value) / steps);
                    num = scope.value;
                };

                var tick = function () {
                    scope.timoutId = $timeout(function () {
                        num += increment;
                        step++;
                        if (step >= steps) {
                            $timeout.cancel(scope.timoutId);
                            num = countTo;
                            e.textContent = countTo;
                        } else {
                            e.textContent = Math.round(num);
                            tick();
                        }
                    }, refreshInterval);

                };

                var start = function () {
                    if (scope.timoutId) {
                        $timeout.cancel(scope.timoutId);
                    }
                    calculate();
                    tick();
                };

                attrs.$observe('countTo', function (val) {
                    if (val) {
                        start();
                    }
                });

                attrs.$observe('value', function (val) {
                    start();
                });

                return true;
            }
        };

    }]);
'use strict';

/**
 * @ngdoc function
 * @name xtmotorwebuiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the xtmotorwebuiApp
 */
angular.module('consignment',
    [
        'consignment.controllers',
        'consignment.directives',
        // 'consignment.services'
    ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('consignment', {
                url: "/consignment",
                templateUrl: "modules/consignment/consignment.html",
                controller: 'ConsignmentCtrl',
                data: {
                    requireLogin: true
                }
            });
    }]);
'use strict';
/**
 * @ngdoc overview
 * @name xtmotorwebuiApp
 * @description
 * # xtmotorwebuiApp
 *
 * customer controller of the application.
 */
angular.module('customer.controllers',[])
	.controller('CustomerCtrl', ['$rootScope','$scope','xtmotorsAPIService','$q','$state','xtmotorsCRUDService','$mdToast','$element', function ($rootScope,$scope,xtmotorsAPIService,$q,$state,xtmotorsCRUDService,$mdToast,$element) {
			$rootScope.isLoading = true;
			xtmotorsAPIService.query({section:'Customer'})
			.$promise.then(function(customers){
				$rootScope.customers = customers;

				$scope.totalCustomers = $scope.customers.length;
		        $scope.totalPages     = 10;
		        $scope.pagination = {
		            currentPage:  1
		        };        
		        $scope.customersPerPage  = 20;
		        
		        $scope.paginatedCustomers = $scope.customers.slice(0, $scope.customersPerPage);
		        $scope.pageChanged = function(){
		         // $scope.currentPage = 1;
		          var begin = (($scope.pagination.currentPage - 1) * $scope.customersPerPage),
		              end   = begin + $scope.customersPerPage;

		          $scope.paginatedCustomers = $scope.customers.slice(begin, end);

		        };
			},function(error){
				console.log(error);
			})
			.finally(function(){
		       $rootScope.isLoading = false;
		    });

		    function changeDateFormat(date){          
          	   var wofTime = moment(date).startOf('day').toDate();
          	   return wofTime;
        	} 

		    $scope.createItem = function(){
           		if(!$scope.customer){
                	$scope.customer = {};
            	}
	        };
		   	$scope.editCustomer = function(customer){

				$scope.customer = customer;
				$state.go('customer.details',{CustomerId:$scope.customer.customerId});
				$scope.customer.dob = changeDateFormat($scope.customer.dob);
			};
			$scope.backToCustomer = function(){
				// xtmotorsCRUDService.cancelEdit($scope);
				$state.go('customer');
			};
			$scope.saveCustomer= function(customer){
	           	if($rootScope.newCustomer){
	           		xtmotorsAPIService.save({section:'Customer/'},customer)
		             .$promise.then(function(res){
			            console.log(res);
			            $mdToast.show({
			              	template: '<md-toast class="md-toast md-toast-success"><span flex>' + 'New customer has been saved'  + '</span></md-toast>',
			              	position: 'top right',
			              	hideDelay: 5000,
			              	parent: $element
			            });
			            $rootScope.newCustomer = false;
			        },function(error){
			            console.log(error);
			            $mdToast.show({
			              	template: '<md-toast class="md-toast md-toast-' +error.status+ '"><span flex>' + error.statusText + '</span></md-toast>',
			              	position: 'top right',
			              	hideDelay: 5000,
			              	parent: $element
			            });
			            $rootScope.newCustomer = true;
			        }).finally(function(){
			            
			        });
			    }else{
			      	xtmotorsAPIService.update({section:'Customer/'+customer.customerId},customer)
		             .$promise.then(function(res){
			            console.log(res);
			            $mdToast.show({
			              	template: '<md-toast class="md-toast md-toast-success"><span flex>' + 'Customer has been updated'  + '</span></md-toast>',
			              	position: 'top right',
			              	hideDelay: 5000,
			              	parent: $element
			            });
			        },function(error){
			            console.log(error);
			            $mdToast.show({
			              	template: '<md-toast class="md-toast md-toast-' +error.status+ '"><span flex>' + error.statusText + '</span></md-toast>',
			              	position: 'top right',
			              	hideDelay: 5000,
			              	parent: $element
			            });
			        }).finally(function(){
			              
			        });
			    }
	            
	        };
		
		
	}])
	.controller('CustomerDetailsCtrl', ['$rootScope','$scope', function ($rootScope,$scope) {
		
		
	}]);
'use strict';

/**
 * @ngdoc function
 * @name xtmotorwebuiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the xtmotorwebuiApp
 */
angular.module('customer',
    [
        'customer.controllers',
        // 'customer.directives',
        // 'customer.services'
    ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('customer', {
                url: "/customer",
                templateUrl: "modules/customer/customer.html",
                controller: 'CustomerCtrl',
                data: {
                    requireLogin: true
                }
            })
            .state('customer.details',{
                url:"/:customerId",
                views:{
                    "customer-details-view":{
                        templateUrl:"modules/customer/customer.details.html",
                        controller: 'CustomerDetailsCtrl',
                    }
                },
                data:{
                    requireLogin: true
                }
            });
    }]);
'use strict';
/**
 * @ngdoc overview
 * @name xtmotorwebuiApp
 * @description
 * # xtmotorwebuiApp
 *
 * employee controller of the application.
 */
angular.module('employee.controllers',[])
	.controller('EmployeeCtrl', ['$rootScope','$scope','xtmotorsAPIService','xtmotorsCRUDService','$q','$state','$mdToast','$element', function ($rootScope,$scope, xtmotorsAPIService, xtmotorsCRUDService, $q ,$state, $mdToast,$element) {
		$rootScope.isLoading = true;
		xtmotorsCRUDService.get('Employee',$scope);
		
		$scope.employeePagination = function(){
			if($scope.itemList){
				$scope.totalEmployees = _.size($scope.itemList);
			    $scope.totalPages = 10;
			   	$scope.pagination = {
			        currentPage:  1
			    };        
			    $scope.employeesPerPage = 20;
				$scope.paginatedEmployees = $scope.itemList.slice(0, $scope.employeesPerPage);

			    $scope.pageChanged = function(){
			         // $scope.currentPage = 1;
			        var begin = (($scope.pagination.currentPage - 1) * $scope.employeesPerPage),
			            end   = begin + $scope.employeesPerPage;

			        $scope.paginatedEmployees = $scope.itemList.slice(begin, end);

			    };
			    $rootScope.isLoading = false;
			}
		};
	    $scope.createEmployee = function(){
            if(!$scope.employee){
                $scope.employee = {};
            }
        };
	   	$scope.editEmployee = function(employee){
			$scope.employee = employee;
			$state.go('employee.details',{EmployeeId:$scope.employee.employeeId});
		};
		$scope.backToEmployee = function(){
			// xtmotorsCRUDService.cancelEdit($scope);
			$state.go('employee');
		};

		$scope.saveEmployee= function(employee){
	        //TODO: Check whether is creating a new employee object or updateing an exist employee object
            if($rootScope.newEmployee){
            	xtmotorsAPIService.save({section:'Employee/'+employee.employeeId},employee)
	            .$promise.then(function(res){
		            console.log(res);
		            $mdToast.show({
		              	template: '<md-toast class="md-toast md-toast-success"><span flex>' + 'New employee has been saved'  + '</span></md-toast>',
		              	position: 'top right',
		              	hideDelay: 5000,
		              	parent: $element
		            });
		            $rootScope.newEmployee = false;
		        },function(error){
		            console.log(error);
		            $mdToast.show({
		              template: '<md-toast class="md-toast md-toast-' +error.status+ '"><span flex>' + error.statusText + '</span></md-toast>',
		              position: 'top right',
		              hideDelay: 5000,
		              parent: $element
	            	});
		            $rootScope.newEmployee = true;
		            
		        }).finally(function(){
		           
		        });
            
            }else{
				xtmotorsAPIService.update({section:'Employee/'+employee.employeeId},employee)
             	.$promise.then(function(res){
	            	console.log(res);
	            	$mdToast.show({
		              template: '<md-toast class="md-toast md-toast-success"><span flex>' + 'Employee hass been updated'  + '</span></md-toast>',
		              position: 'top right',
		              hideDelay: 5000,
		              parent: $element
	            	});
	          	},function(error){
	            	console.log(error);
	            	$mdToast.show({
		              template: '<md-toast class="md-toast md-toast-' +error.status+ '"><span flex>' + error.statusText + '</span></md-toast>',
		              position: 'top right',
		              hideDelay: 5000,
		              parent: $element
	            	});
	          	}).finally(function(){
	              
	         	});
            }
	        
        };

	}])
	.controller('EmployeeDetailsCtrl', ['$rootScope','$scope','$state',function ($rootScope,$scope,$state) {
		$rootScope.isLoading = false;
		
	}]);
'use strict';
/**
 * @ngdoc function
 * @name xtmotorwebuiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the xtmotorwebuiApp
 */
angular.module('employee',
    [
        'employee.controllers',
        // 'employee.directives',
        // 'employee.services'
    ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('employee', {
                url: "/employee",
                templateUrl: "modules/employee/employee.html",
                controller: 'EmployeeCtrl',
                data: {
                    requireLogin: true
                }
            })
            .state('employee.details',{
                url:"/:employeeId",
                views:{
                    "employee-details-view":{
                        templateUrl:"modules/employee/employee.details.html",
                        controller: 'EmployeeDetailsCtrl'
                    }
                },
                data:{
                    requireLogin: true
                }
            });
    }]);
'use strict';
/**
 * @ngdoc overview
 * @name xtmotorwebuiApp
 * @description
 * # xtmotorwebuiApp
 *
 * settlement controller of the application.
 */
angular.module('settlement.controllers',[])
	.controller('SettlementCtrl', ['$scope', function ($scope) {
		$scope.settlement = 'settlement'; 
	
		$scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
		$scope.series = ['Series A', 'Series B'];
		$scope.data = [
		    [65, 59, 80, 81, 56, 55, 40],
		    [28, 48, 40, 19, 86, 27, 90]
		];
		$scope.colours=[{
			fillColor: 'rgba(255, 255, 255, 0.8)',
		    strokeColor: 'rgba(255, 255, 255, 0.8)',
		    highlightFill: 'rgba(255, 255, 255, 0.8)',
		    highlightStroke: 'rgba(255, 255, 255, 0.8)'
		}];
		

		// function resizeChart() {
		//     var canvas = document.getElementById("canvas");

		//     //set new sizes                 
		//     var new_canvasWidth = Math.max((canvas.parentNode.clientWidth), 800);
		//     var new_canvasHeight = 400;

		//     //only redraw if the size  has changed
		//     if ((new_canvasWidth != canvas.width) || (new_canvasHeight != canvas.height)) {
		//         canvas.width = new_canvasWidth;
		//         canvas.height = new_canvasHeight;
		//         new Chart(canvas.getContext("2d")).Line(lineChartData(data, options));
		//     }
		// }
		// //resizeTracker, clearTimeout, and setTimeout are used to only fire the resize event after the user has finished resizing; rather than firing lots of times unnecessarily while resizing.
		// var resizeTracker;
		// window.addEventListener('resize', (function(){clearTimeout(resizeTracker);resizeTracker = setTimeout(resizeChart, 100);}), false);
	  

	}]);
'use strict';

/**
 * @ngdoc function
 * @name xtmotorwebuiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the xtmotorwebuiApp
 */
angular.module('settlement',
    [
        'settlement.controllers',
        // 'settlement.directives',
        // 'settlement.services'
    ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('settlement', {
                url: "/settlement",
                templateUrl: "modules/settlement/settlement.html",
                controller: 'SettlementCtrl',
                data: {
                    requireLogin: true
                }
            });
    }]);
'use strict';
/**
 * @ngdoc overview
 * @name xtmotorwebuiApp
 * @description
 * # xtmotorwebuiApp
 *
 * storage controller of the application.
 */
angular.module('storage.controllers',[])
	.controller('StorageCtrl',['$scope','$translate','$translatePartialLoader','xtmotorsCRUDService',function ($scope, $translate, $translatePartialLoader,xtmotorsCRUDService) {
		$translatePartialLoader.addPart('storage');
  		$translate.refresh();
  		xtmotorsCRUDService.get('Car/CarBriefView',$scope)
  		$scope.selected = [];
  
        $scope.options = {
          autoSelect: true,
          boundaryLinks: false,
          largeEditDialog: false,
          pageSelector: false,
          rowSelection: false
        };
        
        $scope.query = {
          order: 'name',
          limit: 10,
          page: 1
        };

		// $scope.totalItems = $scope.cars.length;
	 //    $scope.itemsPerPage = 10;
	 //    $scope.currentPage = 1;
	  
	 //    $scope.pageCount = function () {
	 //      return Math.ceil($scope.cars.length / $scope.itemsPerPage);
	 //    };

	 //    $scope.$watch('currentPage + itemsPerPage', function() {
	 //      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
	 //        end = begin + $scope.itemsPerPage;

	 //      $scope.filteredFriends = $scope.cars.slice(begin, end);
	 //    });

	}]);
'use strict';

/**
 * @ngdoc function
 * @name xtmotorwebuiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the xtmotorwebuiApp
 */
angular.module('storage',
    [
        'storage.controllers',
        // 'storage.directives',
        // 'storage.services'
    ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('storage', {
                url: "/storage",
                templateUrl: "modules/storage/storage.html",
                controller: 'StorageCtrl',
                data: {
                    requireLogin: true
                }
            });
    }]);