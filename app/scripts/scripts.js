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
      title: 'Car',
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
.controller('DemoCtrl', ['$scope', 'xtmotorsAPIService',function ($scope,xtmotorsAPIService) {
  
    var self = this;
      // list of `state` value/display objects
    self.states        = loadAll();
    self.selectedItem  = null;
    self.searchText    = null;
    self.querySearch   = querySearch;
    // ******************************
    // Internal methods
    // ******************************
    /**
     * Search for states... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch (query) {
      var results = query ?  createFilterFor(query) : [];
      return results;
    }
    /**
     * Build `states` list of key/value pairs
     */
    
    function loadAll() {
      xtmotorsAPIService.query({section:'Car/CarBriefView'})
      .$promise.then(function(cars) {
         var allStates = cars;
          return allStates.map( function (state) {
            return {
              value: state.CarId.toLowerCase(),
              display: state
            };
          });
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
			templateUrl:'views/app/formSearchCar.html'
					
		};
	}])
	.directive('cubeGridSpinner', ['$rootScope','$timeout', 'alertService', function ($rootScope, $timeout, alertService) {
	  	return {
		    restrict: 'E',
		    templateUrl: 'views/app/cubeGridSpinner.html',
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
                templateUrl: "views/app/appSetting.html",
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
  .run(['$rootScope', '$state', '$stateParams','loginModal',
    function($rootScope, $state, $stateParams,loginModal){
   
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;

  }]);


'use strict';
angular.module('app.services', [])
  .factory('xtmotorsAPIService', ['$resource','$http', function($resource,$http) {
        $http.defaults.headers.post["Content-Type"] = "text/plain";
        var apiUrl = 'http://xtmotorapi.azurewebsites.net/api/';
        return $resource(apiUrl+':section/:id',null,{ 'update': { method: 'PUT' }});
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
            return xtmotorsAPIService.update({section: functionName}, item)
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
        templateUrl: 'views/app/loginModalTemplate.html',
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
	.controller('CarCtrl', ['$rootScope','$scope','$translate','$translatePartialLoader','xtmotorsAPIService','$q','$state','$mdEditDialog','$timeout',function ($rootScope,$scope, $translate, $translatePartialLoader,xtmotorsAPIService,$q,$state,$mdEditDialog,$timeout) {
		if($scope.cars){$rootScope.isLoading = false;}
    xtmotorsAPIService.query({section:'Car/CarBriefView'})
      .$promise.then(function(cars) {
        $scope.cars = cars;
     
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
          order: 'name',
          limit: 15,
          page: 1
        };
        
        $scope.getTypes = function () {
          return ['Candy', 'Ice cream', 'Other', 'Pastry'];
        };
        
        $scope.loadStuff = function () {
          $scope.promise = $timeout(function () {
            // loading
          }, 2000);
        };
        
        $scope.logItem = function (item) {
          console.log(item.name, 'was selected');
        };
        
        $scope.logOrder = function (order) {
          console.log('order: ', order);
        };
        
        $scope.logPagination = function (page, limit) {
          console.log('page: ', page);
          console.log('limit: ', limit);
        };

        $scope.editCar = function(car){
          $state.go('car.details',{myParam:car});
        };
  
      }, function(error) {
        console.log(error);
    }).finally(function(){
       $rootScope.isLoading = false;
    });

  	
	}])
  .controller('CarDetailsCtrl', ['$rootScope','$scope','xtmotorsAPIService','$translate','$translatePartialLoader','$stateParams', function ($rootScope,$scope,xtmotorsAPIService, $translate, $translatePartialLoader,$stateParams) {
    $translatePartialLoader.addPart('carDetails');
    $translate.refresh();  
    if($stateParams.myParam){
      // xtmotorsAPIService.query({section:'Car/CarBriefView/'+$stateParams.myParam.CarId})
      // .$promise.then(function(cars) {
         $scope.editCar = $stateParams.myParam;
        
      // })
      // .finally(function(){
       $rootScope.isLoading = false;
    // });
    }
      this.userState = '';
        this.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
            'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
            'WY').split(' ').map(function (state) { return { abbrev: state }; });
    // _.pull($rootScope.cars, $scope.editCar);
    $scope.carCopy = angular.copy($scope.editCar);
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
        'car.controllers'
        // 'car.directives',
        // 'car.services'
    ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('car', {
                url: "/car",
                templateUrl: "views/car/car.html",
                controller: 'CarCtrl',
                data: {
                    requireLogin: true
                }
            })
            .state('car.details', {
                url: "/details",
                params: {myParam: null},
                views: {
                    "car-details-view": { 
                        templateUrl: "views/car/car.details.html",
                        controller: 'CarDetailsCtrl'
                    }
                },
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
                templateUrl: "views/consignment/consignment.html",
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
	.controller('CustomerCtrl', ['$rootScope','$scope','xtmotorsAPIService','$q', function ($rootScope,$scope,xtmotorsAPIService,$q) {
			$rootScope.isLoading = true;
			xtmotorsAPIService.query({section:'Customer'})
			.$promise.then(function(customer){
				$rootScope.customers = customer;

				$scope.totalCustomers = $scope.customers.length;
		        $scope.totalPages     = 10;
		        $scope.pagination = {
		            currentPage:  1
		        };        
		        $scope.customersPerPage    = 20;
		        
		        
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
                templateUrl: "views/customer/customer.html",
                controller: 'CustomerCtrl',
                data: {
                    requireLogin: true
                }
            })
            .state('customer.details',{
                url:"/details",
                views:{
                    "customer-details-view":{
                        templateUrl:"views/customer/customer.details.html",
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
	.controller('EmployeeCtrl', ['$rootScope','$scope','xtmotorsAPIService','xtmotorsCRUDService','$q','$state', function ($rootScope,$scope, xtmotorsAPIService, xtmotorsCRUDService, $q ,$state) {
		// $scope.employee = 'employee'; 
		// var _ = _ || {};
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
	    $scope.createItem = function(){
            if(!$scope.item){
                $scope.newItem = true;
                $scope.item = {};
            }
        };
	   	$scope.editEmployee = function(employee){
			_.pull($scope.itemList,employee);
			$scope.itemCopy = angular.copy(employee);
			$scope.item = employee;
			$state.go('employee.details');
		};
		$scope.backToEmployee = function(){
			xtmotorsCRUDService.cancelEdit($scope);
			$state.go('employee');
		};
		$scope.saveEmployee= function(employee){
            // var formValid = xtmotorsAPIService.validateForm($scope);
            // if(formValid){
            xtmotorsCRUDService.update('Employee', $scope, employee);
            // }
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
                templateUrl: "views/employee/employee.html",
                controller: 'EmployeeCtrl',
                data: {
                    requireLogin: true
                }
            })
            .state('employee.details',{
                url:"/details",
                views:{
                    "employee-details-view":{
                        templateUrl:"views/employee/employee.details.html",
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
		$scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales", "Tele Sales", "Corporate Sales"];
        $scope.data = [300, 500, 100, 40, 120];
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
                templateUrl: "views/settlement/settlement.html",
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
	.controller('StorageCtrl',['$scope','$translate','$translatePartialLoader',function ($scope, $translate, $translatePartialLoader) {
		$translatePartialLoader.addPart('storage');
  		$translate.refresh();

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
                templateUrl: "views/storage/storage.html",
                controller: 'StorageCtrl',
                data: {
                    requireLogin: true
                }
            });
    }]);