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
    	var requireLogin = toState.data.requireLogin;
      $rootScope.buttonDisable = false;
			if(localStorageService.get('oauth_token')){
				var user = localStorageService.get('oauth_token');
				$rootScope.setUserAuth(user);
				getUserProfile();
			}else{
        if (requireLogin && typeof $rootScope.currentUser === 'undefined') {
          event.preventDefault();
          $rootScope.isLoading = false;
          loginModal()
            .then(function () {
								getUserProfile();
                return $state.go('car');
            })
            .catch(function () {
            	//TODO: error handling
            });
        }
			}
    });

		function getUserProfile(){
			xtmotorsAPIService.get({section:'account/getUserProfile'}).$promise.then(function(res){
				$rootScope.profile = {
						email:res.email,
						lastName: res.lastName,
						firstName: res.firstName,
						phone:res.phone
					}
				});
		}

    $scope.$watch('selectedCar', function(newVal){
      if(newVal){
          $rootScope.editCar(newVal);
      }
    });

		$rootScope.setUserAuth = function(oauth){
				var authHeader = 'Bearer '+oauth.access_token;
				$http.defaults.headers.common.Authorization = authHeader;
		};


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
          if($rootScope.cars.length < 9){
            $state.go('car.details',{carId: "00000"+($rootScope.cars.length+1)}, {reload: true});
          }else if($rootScope.cars.length < 99){
            $state.go('car.details',{carId: "0000"+($rootScope.cars.length+1)}, {reload: true});
          }else{
            $state.go('car.details',{carId: "000"+($rootScope.cars.length+1)}, {reload: true});
          }
          
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

    // root binding for alertService
    $rootScope.closeAlert = alertService.closeAlert;

    $rootScope.logout = function(){
			localStorageService.clearAll();
      delete $rootScope.currentUser;
      loginModal().then(function () {
        return $state.go($state.current, {}, {reload: true});
      });
    };

    $rootScope.openSetting = function(){
      $state.go('appSetting');
      // $rootScope.buttonDisable = true;
    };

    $rootScope.openProfile = function(){
      // alert("a");
      $state.go('profile');
      // $rootScope.buttonDisable = true;
    };

    function directCarDetails(){
      if($state.current.name === 'car.details'){
        return $state.go('car');
      }else{
        return $state.go($state.current, {}, {reload: true});
      }
    }


  // Sidenav toggle
  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };

	$rootScope.fabDirections = ['up', 'down', 'left', 'right'];
	$rootScope.fabDirection = $rootScope.fabDirections[0];
	$rootScope.fabAnimations = ['md-fling', 'md-scale'];
	$rootScope.fabAnimation = $rootScope.fabAnimations[1];
	$rootScope.fabStatuses = [false, true];
	$rootScope.fabStatus = $rootScope.fabStatuses[0];

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


	}])
.controller('LoginModalCtrl',['$rootScope','$scope','xtmotorsAPIService','$http','$mdDialog','$mdToast','localStorageService','loginModal','$modalInstance','$state',
function ($rootScope,$scope,xtmotorsAPIService,$http,$mdDialog,$mdToast,localStorageService,loginModal,$modalInstance,$state) {
	$rootScope.close = function (user) {
			$modalInstance.close(user);
	};

  $scope.email = "zhangysd@hotmail.com";
  $scope.password = "ac,bD,12";

   $scope.attemptLogin = function (email, passWord) {
      
		  var data ="userName=" + email + "&password=" + passWord +"&grant_type=password";
      console.log(data);
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
    // 'ngSanitize',
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
    'ngMaterialDatePicker',
    'azureBlobUpload',
    'ngFileUpload',
    'LocalStorageModule',
    'textAngular',

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
    'storage',
    'sales'
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
                controller: 'SettingCtrl',
                data: {
                    requireLogin: true
                }
            })
            .state('profile', {
                url: "/profile",
                templateUrl: "modules/app/userProfile.html",
                controller: 'ProfileCtrl',
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
  .run(['$rootScope', '$state', '$stateParams','loginModal','localStorageService',
    function($rootScope, $state, $stateParams,loginModal,localStorageService){
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
  }]);

'use strict';
angular.module('app.services', [])
  .factory('xtmotorsAPIService', ['$resource','$http', function($resource,$http) {
        var apiUrl = "http://lucasapi.azurewebsites.net/api/";
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

/**!
 * AngularJS Azure blob upload service with http post and progress.
 * @author  Stephen Brannan - twitter: @kinstephen
 * @version 1.0.1
 */
(function () {

    var azureBlobUpload = angular.module('azureBlobUpload', []);

    azureBlobUpload.factory('azureBlob',
        ['$log', '$http', azureBlob]);

    function azureBlob($log, $http) {

        var DefaultBlockSize = 1024 * 32 // Default to 32KB

        /* config: {
          baseUrl: // baseUrl for blob file uri (i.e. http://<accountName>.blob.core.windows.net/<container>/<blobname>),
          sasToken: // Shared access signature querystring key/value prefixed with ?,
          file: // File object using the HTML5 File API,
          progress: // progress callback function,
          complete: // complete callback function,
          error: // error callback function,
          blockSize: // Use this to override the DefaultBlockSize
        } */
        var upload = function (config) {
            var state = initializeState(config);

            var reader = new FileReader();
            reader.onloadend = function (evt) {
                if (evt.target.readyState == FileReader.DONE && !state.cancelled) { // DONE == 2
                    var uri = state.fileUrl + '&comp=block&blockid=' + state.blockIds[state.blockIds.length - 1];
                    var requestData = new Uint8Array(evt.target.result);

                    $log.log(uri);
                    $http.put(uri, requestData,
                        {
                            headers: {
                                'x-ms-blob-type': 'BlockBlob',
                                'Content-Type': state.file.type,
                            },
                            transformRequest: [],
                        }).success(function (data, status, headers, config) {
                            $log.log(data);
                            $log.log(status);
                            state.bytesUploaded += requestData.length;

                            var percentComplete = ((parseFloat(state.bytesUploaded) / parseFloat(state.file.size)) * 100).toFixed(2);
                            if (state.progress) state.progress(percentComplete, data, status, headers, config);

                            uploadFileInBlocks(reader, state);
                        })
                        .error(function (data, status, headers, config) {
                            $log.log(data);
                            $log.log(status);

                            if (state.error) state.error(data, status, headers, config);
                        });
                }
            };

            uploadFileInBlocks(reader, state);

            return {
                cancel: function() {
                    state.cancelled = true;
                }
            };
        };

        var initializeState = function (config) {
            var blockSize = DefaultBlockSize;
            if (config.blockSize) blockSize = config.blockSize;

            var maxBlockSize = blockSize; // Default Block Size
            var numberOfBlocks = 1;

            var file = config.file;

            var fileSize = file.size;
            if (fileSize < blockSize) {
                maxBlockSize = fileSize;
                $log.log("max block size = " + maxBlockSize);
            }

            if (fileSize % maxBlockSize == 0) {
                numberOfBlocks = fileSize / maxBlockSize;
            } else {
                numberOfBlocks = parseInt(fileSize / maxBlockSize, 10) + 1;
            }

            $log.log("total blocks = " + numberOfBlocks);

            return {
                maxBlockSize: maxBlockSize, //Each file will be split in 256 KB.
                numberOfBlocks: numberOfBlocks,
                totalBytesRemaining: fileSize,
                currentFilePointer: 0,
                blockIds: new Array(),
                blockIdPrefix: 'block-',
                bytesUploaded: 0,
                submitUri: null,
                file: file,
                baseUrl: config.baseUrl,
                sasToken: config.sasToken,
                fileUrl: config.baseUrl + config.sasToken,
                progress: config.progress,
                complete: config.complete,
                error: config.error,
                cancelled: false
            };
        };

        var uploadFileInBlocks = function (reader, state) {
            if (!state.cancelled) {
                if (state.totalBytesRemaining > 0) {
                    $log.log("current file pointer = " + state.currentFilePointer + " bytes read = " + state.maxBlockSize);

                    var fileContent = state.file.slice(state.currentFilePointer, state.currentFilePointer + state.maxBlockSize);
                    var blockId = state.blockIdPrefix + pad(state.blockIds.length, 6);
                    $log.log("block id = " + blockId);

                    state.blockIds.push(btoa(blockId));
                    reader.readAsArrayBuffer(fileContent);

                    state.currentFilePointer += state.maxBlockSize;
                    state.totalBytesRemaining -= state.maxBlockSize;
                    if (state.totalBytesRemaining < state.maxBlockSize) {
                        state.maxBlockSize = state.totalBytesRemaining;
                    }
                } else {
                    commitBlockList(state);
                }
            }
        };

        var commitBlockList = function (state) {
            var uri = state.fileUrl + '&comp=blocklist';
            $log.log(uri);

            var requestBody = '<?xml version="1.0" encoding="utf-8"?><BlockList>';
            for (var i = 0; i < state.blockIds.length; i++) {
                requestBody += '<Latest>' + state.blockIds[i] + '</Latest>';
            }
            requestBody += '</BlockList>';
            $log.log(requestBody);

            $http.put(uri, requestBody,
            {
                headers: {
                    'x-ms-blob-content-type': state.file.type,
                }
            }).success(function (data, status, headers, config) {
                $log.log(data);
                $log.log(status);
                if (state.complete) state.complete(data, status, headers, config);
            })
            .error(function (data, status, headers, config) {
                $log.log(data);
                $log.log(status);
                if (state.error) state.error(data, status, headers, config);
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        };

        var pad = function (number, length) {
            var str = '' + number;
            while (str.length < length) {
                str = '0' + str;
            }
            return str;
        };

        return {
            upload: upload,
        };
    };

})();
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
    $scope.selected = [];
    $scope.selectedcarStatus = '';

    $translatePartialLoader.addPart('car');
    $translatePartialLoader.addPart('carDetails');
    $translatePartialLoader.addPart('contractSummary');
    $translatePartialLoader.addPart('importSummary');
    $translatePartialLoader.addPart('vehicleSummary');
    $translatePartialLoader.addPart('maintenanceRecordDetails');
    $translatePartialLoader.addPart('maintenanceRecordList');
    $translatePartialLoader.addPart('uploadCarPhotos');
    $translatePartialLoader.addPart('errorMessage');
    $translate.refresh();


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

    $scope.getCarSummary = function(){
      xtmotorsAPIService.query({section:'car/summary'})
      .$promise.then(function(cars) {
        $rootScope.cars = cars;
        $rootScope.isLoading = false;
        _.forEach(cars, function(car){ 
          $scope.getCarImportRecord(car);
        })
        //$scope.tableHeaderName = [{title:'id'},{title:'brand'},{title:'model'},{title:'year'},{title:'odometer'},{title:'salePrice'},{title:'status'}];
      },function(error){
        $rootScope.showError(error);
      });
    };

    $rootScope.showError = function(error){
      $mdToast.show({
        template: '<md-toast class="md-toast md-toast-' +error.status+ '"><span flex>' + error.statusText + '</span></md-toast>',
        position: 'top right',
        hideDelay: 5000,
        parent: $element
      });
    };

    $rootScope.successToast = function(message){
      $mdToast.show({
        template: '<md-toast class="md-toast md-toast-success"><span flex>' + message  + '</span></md-toast>',
        position: 'top right',
        hideDelay: 5000,
        parent: $element
      });
    };

    $rootScope.carStatusList = ["Sold", "Reserved", "For Sale", "Inspection", "Arrived Port", "Departed Port"];
    $rootScope.carBodyType = ["Convertible", "Couple", "Hatchback", "Sedan", "Station Wagon", "RV/SUV", "Ute", "Van"];
    $rootScope.carCurrency = ["NZD", "JPY", "CNY"];

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
        default:
          return "departed";
      }
    };

    $scope.getVehicleModelList = function(){
      xtmotorsAPIService.query({ section:'VehicleModels/'})
      .$promise.then(function(res){
        $rootScope.vehicleModelList  = res;
        $rootScope.isVehicleModelListLoaded = true;
      },function(error){
        $rootScope.showError(error);
      });
    };

    $scope.getCarById = function(carId){
      xtmotorsAPIService.get({ section:'car/'+carId})
      .$promise.then(function(res){
        $scope.car = res;
        $scope.getModelById(res.vehicleModelId);
        $scope.getCarImages(res.carId);
        //$scope.getImportSummary();
        $scope.selectedcarStatus = $scope.car.carStatus;
        $scope.selectedcarCurrency = $scope.car.currency;
        $scope.car.wofTime = $scope.changeDateFormat($scope.car.wofTime);
        $scope.getCarMaintenanceList(carId);
        $state.go('car.details',{carId: carId});
      },function(error){
        $rootScope.showError(error);
      });
    };

    $scope.changeDateFormat = function(time){
      return moment(time).format('MM/DD/YYYY');
    }

    $scope.getCarMaintenanceList = function(carId){
      xtmotorsAPIService.query({section:'Maintenance/Car/'+carId})
      .$promise.then(function(res){
        $scope.maintenanceRecords = res;
      },function(error){
        $rootScope.showError(error);
      });
    };

    $scope.getCarBatch = function(car, batchId){
      xtmotorsAPIService.get({section:'Imports/' + batchId})
      .$promise.then(function(batch) {   
        car.arriveTime = batch.eta;
        $rootScope.isLoading = false;
      },function(error){
        $rootScope.showError(error);
      });
    };

    $scope.getImportSummary = function(){
      xtmotorsAPIService.query({section:'Imports/'})
      .$promise.then(function(imports){
        $scope.imports = imports;
      },function(error){
        $scope.showError(error);
      });
    };

    $scope.getCarImportRecord = function(car){
      xtmotorsAPIService.get({ section:'ImportRecords/'+car.carId})
      .$promise.then(function(res){
        $scope.importSummary = res;
        $scope.getCarBatch(car, res.batchId);
      },function(error){
        //console.log("no import info " + car.carId);
        car.arriveTime = "HAS NOT BEEN FINALIZED";
        //$rootScope.showError(error);
      });
    };

    $scope.getCarImages = function(carId){
      xtmotorsAPIService.query({section:'images/car/'+carId})
      .$promise.then(function(res){
        $scope.images = res;
      },function(error){
        $rootScope.showError(error);
      });
    };

    $scope.getModelById = function(vehicleModelId){
      xtmotorsAPIService.get({ section:'VehicleModels/'+vehicleModelId})
      .$promise.then(function(res){
        $scope.vehicleModel = res;
        $scope.selectedcarBodyType = $scope.vehicleModel.bodyType;
      },function(error){
        $rootScope.showError(error);
      });
    };

    $rootScope.editCar = function(car){
      $scope.getCarById(car.carId);
      $rootScope.isCarEdited = true;
    };

    $scope.backToCar = function(){
      // xtmotorsCRUDService.cancelEdit($scope);
      $state.go('car');
      $scope.getCarSummary();
      $rootScope.newCar = false;
      $rootScope.isCarEdited = false;
    };

    $scope.backToStorgaePage = function(){
      $state.go('storage');
      $rootScope.isFromStorage = false;
    };

    $scope.backToConsigmentPage = function(){
      xtmotorsAPIService.get({ section:'ImportRecords/'+$scope.car.carId})
      .$promise.then(function(res){
        $state.go('consignment.details',{batchId:res.batchId});
        $rootScope.isFromConsignment = false;
      },function(error){
        $rootScope.showError(error);
      });
    };

    $scope.getVehicleModelList();
    $scope.getCarSummary();

    // function updateContract(contract){
    //   xtmotorsAPIService.update({ section:'Contracts/'+contract.carId}, contract)
    //     .$promise.then(function(res){
    //       $mdToast.show({
    //           template: '<md-toast class="md-toast md-toast-success"><span flex>' + 'Contract record has been updated'  + '</span></md-toast>',
    //           position: 'top right',
    //           hideDelay: 5000,
    //           parent: $element
    //       });
    //     },function(error){
    //       $mdToast.show({
    //           template: '<md-toast class="md-toast md-toast-' +error.status+ '"><span flex>' + error.statusText + '</span></md-toast>',
    //           position: 'top right',
    //           hideDelay: 5000,
    //           parent: $element
    //       });
    //     }).finally(function(){

    //     });
    // }

    // $scope.saveContract= function(contract){
    //   if(contract.paymentStatus){
    //     updateContract(contract);
    //   }else{
    //     //Wait for ID

    //     //console.log("empty");
    //     // contract.carId = "";
    //     // contract.customerId = "";
    //     // contract.employeeId = "";
    //     // contract.contractNum = "";
    //     // contract.currency = "";
    //     // updateContract(contract);
    //   }
    // };


	}])

  .controller('CarDetailsCtrl', ['$rootScope','$scope','xtmotorsAPIService','$q','$translate','$translatePartialLoader','$stateParams', '$mdDialog','Upload','$timeout','$mdToast','$element',
    function ($rootScope,$scope,xtmotorsAPIService, $q,$translate, $translatePartialLoader,$stateParams,$mdDialog,Upload,$timeout,$mdToast,$element) {

    $translatePartialLoader.addPart('carDetails');
    $translate.refresh();
    $scope.showMaintenanceReordDetails = false;
    $scope.uploading = false;

    if($rootScope.newCar){
      $scope.car = {};
      $scope.car.carId = $stateParams.carId;
      $scope.getImportSummary();
      //$scope.car.vehicleModelId = '';
    }else{
      $scope.getCarById($stateParams.carId);
    }

    $scope.saveCar = function(){
      $scope.checkModelStatus();
    };

    $scope.statusChanged = function(selectedcarStatus){
      if(selectedcarStatus !== null){
        $scope.car.carStatus = selectedcarStatus;
      }
    };

    $scope.currencyChanged = function(selectedcarCurrency){
      if(selectedcarCurrency !== null){
        $scope.car.currency = selectedcarCurrency;
      }
    };

    $scope.bodyTypeChanged = function(selectedcarBodyType){
      if(selectedcarBodyType !== null){
        $scope.vehicleModel.bodyType = selectedcarBodyType;
      }
    };

    $scope.selectedItemChange = function(selectVehicle){
      if(selectVehicle !== null){
        $scope.vehicleModel = selectVehicle;
        $rootScope.newVehicleModel = false;
      }
    };

    $scope.selectedImportChange = function(selectImport){
      if(selectImport !== null){
        $scope.creatImportCarRecrod(selectImport.batchId);
      }
    };

    $scope.creatImportCarRecrod = function(batchId){
      $scope.importCarRecord = {
        "carId": $scope.car.carId,
        "batchId": batchId,
        "quantity": 1,
        "amount": 1,
        "gst": $scope.car.gst,
        "total": $scope.car.total,
        "paymentStatus": $scope.car.paymentStatus,
        "currency": $scope.car.currency,
        "description": $scope.car.description
      }
      //$scope.saveImportRecord($scope.importCarRecord);
    };

    $scope.createBatch = function(){
      $scope.batch = {
        "batchId": $scope.imports.length+1,
        "transportCompany": "string",
        "checkLocation": "string"
      }
      xtmotorsAPIService.save({section:'Imports'}, $scope.batch)
      .$promise.then(function(res){
        $scope.successToast('New batch is created');
        $scope.creatImportCarRecrod($scope.batch.batchId);
      },function(error){
        $scope.showError(error);
      });
      
      //console.log($scope.importCarRecord);
    };

    $scope.saveImportRecord = function(importCarRecord){
      xtmotorsAPIService.save({section:'ImportRecords'}, importCarRecord)
      .$promise.then(function(res){
      },function(error){
        $scope.showError(error);
      });
    };

    $scope.createNewVehicleModel = function(){
      $rootScope.newVehicleModel = true;
    };

    $scope.checkCarStatus = function(){
      if($rootScope.newCar){
        $scope.saveCarRecord();
      }else{
        $scope.updateCarRecord();
      }
    };

    $scope.checkModelStatus =function(){
      if($rootScope.newVehicleModel){
        $scope.saveModelRecord();
      }else{
        $scope.updateModelRecord();
      }
    };

    //Reminder: need to set Vehicle Model first, then save the car record.
    $scope.saveModelRecord = function(){
      xtmotorsAPIService.save({ section:'VehicleModels/'},$scope.vehicleModel)
      .$promise.then(function(res){
        $rootScope.newVehicleModel = false;
        $scope.car.vehicleModelId = res.vehicleModelId;
        $scope.getVehicleModelList();
        $scope.checkCarStatus();
      },function(error){
        $rootScope.newVehicleModel = true;
        $rootScope.showError(error);
      });
    };

    $scope.updateModelRecord = function(){
      xtmotorsAPIService.update({ section:'VehicleModels/' +$scope.vehicleModel.vehicleModelId},$scope.vehicleModel)
      .$promise.then(function(res){
        $scope.car.vehicleModelId = res.vehicleModelId;
        $scope.checkCarStatus();
      },function(error){
        $rootScope.showError(error);
      });
    };

    $scope.saveCarRecord = function(){
      xtmotorsAPIService.save({section:'car/'}, $scope.car)
      .$promise.then(function(res){
        $rootScope.newCar = false;
        $scope.successToast("New car saved.");
        //$scope.saveImportRecord($scope.importCarRecord);
        $scope.getCarSummary();
      },function(error){
        $rootScope.newCar = true;
        $rootScope.showError(error);
      });
    };

    $scope.updateCarRecord = function(){
      xtmotorsAPIService.update({section:'car/'+$scope.car.carId}, $scope.car)
      .$promise.then(function(res){
        $scope.successToast("Update was successful.");
      },function(error){
        $rootScope.showError(error);
      });
    };

    $scope.uploadFiles = function (files) {
       $scope.files = files;
        if (files && files.length) {
            Upload.upload({
              url: 'http://lucasapi.azurewebsites.net/api/images/upload/'+$scope.car.carId,
              data: {
                file: files
              }
            }).then(function (response) {
                $timeout(function () {
                    $scope.result = response.data;
                });
                $scope.getCarImages($scope.car.carId);
                $rootScope.successToast("Photos has been saved");
            }, function (error) {
                if (error.status > 0) {
                  $rootScope.showError(error);
                  $scope.uploading = false;
                }
            }, function (evt) {
                $scope.uploading = true;
                $scope.progress =
                    Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            }).finally(function(){
              $scope.uploading = false;
            });
        }
    };

    $scope.deleteImage = function(imageId){
      xtmotorsAPIService.remove({section:'Images/'+imageId})
      .$promise.then(function(res){
        $scope.successToast('Image has been deleted');
        $scope.getCarImages($scope.car.carId);
      },function(error){
        $rootScope.showError(error);
      });
    };

    $scope.maintenanceCurrencyChanged = function(selectedMaintenanceCurrency){
      if(selectedMaintenanceCurrency !== null){
        $scope.maintenanceRecord.currency = selectedMaintenanceCurrency;
      }
    };

    $scope.addMaintenanceRecord = function(){
        $scope.showMaintenanceReordDetails = true;
        $scope.newMaintenanceRecord = true;
        $scope.maintenanceRecord = {
          carId: $scope.car.carId
        };
        $scope.selectedMaintenanceCurrency = $scope.maintenanceRecord.currency;
    };

    $scope.backToMaintenanceRecordList = function(){
      $scope.showMaintenanceReordDetails = false;
      $scope.getCarMaintenanceList($scope.car.carId);
    };


    $scope.editMaintenanceRecord = function(record){
      if(!_.isUndefined(record)){
        $scope.newMaintenanceRecord = false;
        $scope.maintenanceRecord = record;
        $scope.selectedMaintenanceCurrency = $scope.maintenanceRecord.currency;
        $scope.showMaintenanceReordDetails = true;
      }
    };

    $scope.saveMaintenanceRecord = function(record){
      xtmotorsAPIService.save({section:'Maintenance'}, record)
      .$promise.then(function(res){
        $scope.successToast('New maintenance has been saved');
        $scope.newMaintenanceRecord = false;
      },function(error){
        $scope.newMaintenanceRecord = true;
        $rootScope.showError(error);
      });
    };

    $scope.updateMaintenanceRecord = function(record){
      xtmotorsAPIService.update({section:'Maintenance/'+record.recordId}, record)
      .$promise.then(function(res){
        $scope.successToast('Update was successful');
      },function(error){
        $rootScope.showError(error);
      });
    };

    $scope.saveMaintenance = function(record){
      //TODO: check is an edit maintenance object or create new maintenance object
      //then use xtmotorsAPIService.update for updateing edit object
      //use xtmotorsAPIService.save for saving new object
        if($scope.newMaintenanceRecord){
          $scope.saveMaintenanceRecord(record);
        }else{
          $scope.updateMaintenanceRecord(record);
        }

    };

  }]);

'use strict';
angular.module('car.directives', [])
	.directive('vehicleSummary', [function () {
		return {
			restrict: 'E',
			templateUrl:'modules/car/vehicleSummary.html'
		};
	}])
	.directive('importSummary', [function () {
		return {
			restrict: 'E',
			templateUrl:'modules/car/importSummary.html'
		};
	}])
	.directive('maintenanceRecordList', [function () {
		return {
			restrict: 'E',
			templateUrl:'modules/car/maintenanceRecordList.html'
		};
	}])
	.directive('maintenanceRecordDetails', [function () {
		return {
			restrict: 'E',
			templateUrl:'modules/car/maintenanceRecordDetails.html'
		};
	}])
	.directive('contractSummary', [function () {
		return {
			restrict: 'E',
			templateUrl:'modules/car/contractSummary.html'
		};
	}])

	.directive('warrantySuffix', function() {
	    return {
	        restrict: 'A',
	        require: 'ngModel',
	        link: function(scope, element, attrs, controller) {
	            function addWarrantySuffix(value) {
	                    return value + ' Months';
	            }
	            controller.$formatters.push(addWarrantySuffix);
	            controller.$parsers.splice(0, 0, addWarrantySuffix);
	        }
	    };
	});
	

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
        'car.directives',
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
	.controller('ConsignmentCtrl', ['$rootScope','$scope','xtmotorsAPIService','$state', '$mdToast', '$element','$translate','$translatePartialLoader',
		function ($rootScope,$scope,xtmotorsAPIService,$state,$mdToast,$element,$translate,$translatePartialLoader) {
		
		$translatePartialLoader.addPart('consignments');
		$translatePartialLoader.addPart('errorMessage');
    	$translate.refresh();

		$rootScope.isLoading = true;
		$scope.consignment = 'consignment';
		$scope.countToPaid = 20408;
		$scope.countFromPaid = 0;
		$scope.countToUnpaid = 10403;
		$scope.countFromUnpaid = 0;
		// $rootScope.newBatch = false;

		$scope.options = {
	      autoSelect: true,
	      boundaryLinks: false,
	      largeEditDialog: false,
	      pageSelector: false,
	      rowSelection: false
	    };

	    $scope.query = {
	      order: 'batchId',
	      limit: 15,
	      page: 1
	    };

		xtmotorsAPIService.query({section:'Imports/'})
		.$promise.then(function(imports){
			$scope.imports = imports;
			$rootScope.isLoading = false;
		},function(error){
            $scope.showError(error);
        });

        xtmotorsAPIService.query({section:'car/summary'})
		.$promise.then(function(cars){
			$scope.cars = cars;
		},function(error){
            $scope.showError(error);
        });

		$scope.createImport = function(){
			$rootScope.newBatch = true;
			$state.go('consignment.details', {batchId:$scope.imports.length+1}, {reload: true});
		};

		$scope.editImport = function(importDetail){
			//$scope.import = importDetail;
			$rootScope.newBatch = false;
			$state.go('consignment.details',{batchId:importDetail.batchId});
			// $scope.customer.dob = changeDateFormat(customer.dob);
		};

		$scope.backToConsignment = function(){
			$rootScope.newBatch = false;
			$state.go('consignment', {}, {reload: true});
		};

		$scope.showError = function(error){
        	$mdToast.show({
                template: '<md-toast class="md-toast md-toast-' +error.status+ '"><span flex>' + error.statusText + '</span></md-toast>',
                position: 'top right',
                hideDelay: 5000,
                parent: $element
            });
        };

        $scope.successToast = function(message){
			$mdToast.show({
                template: '<md-toast class="md-toast md-toast-success"><span flex>' + message  + '</span></md-toast>',
                position: 'top right',
                hideDelay: 5000,
                parent: $element
            });
		};

	}])
	.controller('ConsignmentDetailsCtrl', ['$rootScope','$scope','xtmotorsAPIService','$stateParams', '$state',
		function ($rootScope,$scope,xtmotorsAPIService,$stateParams,$state) {
			if($rootScope.newBatch){
				$scope.batch = {};
				$scope.batch.batchId = $stateParams.batchId;
			}else{
				getBatchRecords();
				getImportRecord();
			}

		function getImportRecord(){
			xtmotorsAPIService.query({section:'ImportRecords/batch/'+$stateParams.batchId})
			.$promise.then(function(importRecords){
				$scope.importRecords = importRecords;
			},function(error){
            	$scope.showError(error);
        	});
		}

		function getBatchRecords(){
			xtmotorsAPIService.get({section:'Imports/'+$stateParams.batchId})
			.$promise.then(function(batch){
				$scope.batch = batch;
			},function(error){
            	$scope.showError(error);
        	});
		}

		function updateBatchRecord(){
			xtmotorsAPIService.update({section:'Imports/'+$scope.batch.batchId}, $scope.batch)
			.$promise.then(function(batch){
				$scope.successToast("Batch updates saved.");
			},function(error){
            	$scope.showError(error);
        	});
		}

		function saveBatchRecord(batch){
			xtmotorsAPIService.save({section:'Imports'}, batch)
			.$promise.then(function(res){
				$scope.successToast("New batch saved.");
				$rootScope.newBatch = false;
			},function(error){
            	$scope.showError(error);
        	});
		}

		function saveImportRecord(importCarRecord){
			xtmotorsAPIService.save({section:'ImportRecords'}, importCarRecord)
			.$promise.then(function(res){
				$scope.successToast("Add was successful.");
				getImportRecord();
			},function(error){
				error.statusText = "The car has alreday been added";
            	$scope.showError(error);
        	});
		}

		$scope.deleteImportRecord = function(carId){
			xtmotorsAPIService.remove({section:'ImportRecords/'+carId})
			.$promise.then(function(res){
				$scope.successToast("Delete was successful.");
				getImportRecord();
			},function(error){
            	$scope.showError(error);
        	});
		}

		// function getCar(carId){
		// 	xtmotorsAPIService.get({ section:'car/'+carId})
		// 	.$promise.then(function(car){
		// 		$scope.car = car;
		// 	},function(error){
  //           	$scope.showError(error);
  //       	});
		// }
		
		$scope.selectedItemChange = function(selectedCar){
			if(selectedCar !== null){
            	$scope.carToAdd = selectedCar;
          	}		
		};

		$scope.saveCarToBatch = function(car){
			//Need to chck if the car has been added.
			$scope.importCarRecord = {
				"carId": car.carId,
				"batchId": $scope.batch.batchId,
				"quantity": 1,
				"amount": 1,
				"gst": car.gst,
				"total": car.total,
				"paymentStatus": car.paymentStatus,
				"currency": car.currency,
				"description": car.description
			}
			saveImportRecord($scope.importCarRecord);
		};

		$scope.editImportRecord = function(importRecord){
			// getCar(importRecord.carId);
			// $rootScope.editCar($scope.car);
			$state.go('car.details',{carId: importRecord.carId}, {reload: true});
			$rootScope.isFromConsignment = true;
		};

		$scope.saveBatch = function(batch){
			if($rootScope.newBatch){
				saveBatchRecord(batch);
			}else{
				updateBatchRecord();
			}	
		};
		

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
            })
             .state('consignment.details', {
                url:"/:batchId",
                views:{
                    "consignment-details-view":{
                        templateUrl:"modules/consignment/consignment.details.html",
                        controller: 'ConsignmentDetailsCtrl',
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
 * customer controller of the application.
 */
angular.module('customer.controllers',[])
	.controller('CustomerCtrl', ['$rootScope','$scope','$translate','$translatePartialLoader','xtmotorsAPIService','$q','$state','xtmotorsCRUDService','$mdToast','$element', function ($rootScope,$scope,$translate, $translatePartialLoader,xtmotorsAPIService,$q,$state,xtmotorsCRUDService,$mdToast,$element) {
			$rootScope.isLoading = true;
			xtmotorsAPIService.query({section:'Customer'})
			.$promise.then(function(customers){
				$translatePartialLoader.addPart('customerDetails');
				$translatePartialLoader.addPart('errorMessage');
        $translate.refresh();
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

	    $scope.createNewCustomer = function(){
       		if($rootScope.newCustomer){
            	$scope.customer = {};
        	}
      };
		  $scope.editCustomer = function(customer){
				$scope.customer = customer;
				$state.go('customer.details',{customerId:customer.customerId});
				$scope.customer.dob = changeDateFormat(customer.dob);
			};
			$scope.backToCustomer = function(){
				// xtmotorsCRUDService.cancelEdit($scope);
				$state.go('customer');
			};
			$scope.saveCustomer= function(customer){
       	if($rootScope.newCustomer){
       		xtmotorsAPIService.save({section:'Customer/'},customer)
           .$promise.then(function(res){
            //console.log(res);
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
			            //console.log(res);
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

	      $scope.$on('g-places-autocomplete:select', function (event, param) {
	      		$scope.customer.streetNum = null;
	      		$scope.customer.route = null;
				$scope.customer.street = null;
				$scope.customer.suburb = null;
				$scope.customer.city = null;
				$scope.customer.state = null;
				$scope.customer.country = null;

				(param.address_components).forEach(function(value) {
					switch(value.types[0]){
						case "street_number":
	        				$scope.customer.streetNum = value.long_name;
	        				break;
	    				case "route":
	    					$scope.customer.route = value.long_name;
	    					$scope.customer.street = $scope.customer.streetNum + " " + $scope.customer.route;
	        				break;
	        			case "sublocality_level_1":
	        				$scope.customer.suburb = value.long_name;
	        				break;
	        			case "locality":
	        				$scope.customer.city = value.long_name;
	        				break;
	        			case "administrative_area_level_1":
	        				$scope.customer.state = value.long_name;
	        				break;
	        			case "country":
	        				$scope.customer.country = value.long_name;
	        				break;
	        			default:
	        				break;
					}
				});

			});

			if($rootScope.newCustomer){
				$scope.createNewCustomer();
			}

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
	.controller('EmployeeCtrl', ['$rootScope','$scope','$translate','$translatePartialLoader','xtmotorsAPIService','xtmotorsCRUDService','$q','$state','$mdToast','$element',
	 function ($rootScope,$scope,$translate,$translatePartialLoader,xtmotorsAPIService, xtmotorsCRUDService, $q ,$state, $mdToast,$element) {
		$rootScope.isLoading = true;

		xtmotorsAPIService.query({section:'Employee'})
			.$promise.then(function(employees){
				$translatePartialLoader.addPart('employeeDetails');
				$translatePartialLoader.addPart('errorMessage');
		    $translate.refresh();
				var isLoaded = false;
				$scope.employees = employees;

				$scope.totalEmployees = $scope.employees.length;
        $scope.totalPages     = 10;
        $scope.pagination = {
            currentPage:  1
        };
        $scope.employeesPerPage  = 20;

        $scope.paginatedEmployees = $scope.employees.slice(0, $scope.employeesPerPage);
        $scope.pageChanged = function(){
         // $scope.currentPage = 1;
          var begin = (($scope.pagination.currentPage - 1) * $scope.employeesPerPage),
              end   = begin + $scope.employeesPerPage;

          $scope.paginatedEmployees = $scope.employees.slice(begin, end);

        };

				$scope.$on('g-places-autocomplete:select', function (event, param) {
					$scope.employee.street = null;
					$scope.employee.city = null;
					$scope.employee.state = null;
					$scope.employee.country = null;
					(param.address_components).forEach(function(value) {
						switch(value.types[0]){
							case "street_number":
		        				$scope.employee.street = value.long_name;
		        				break;
		    				case "route":
		    					$scope.employee.street += " " + value.long_name;
		        				break;
		        			case "locality":
		        				$scope.employee.city = value.long_name;
		        				break;
		        			case "administrative_area_level_1":
		        				$scope.employee.state = value.long_name;
		        				break;
		        			case "country":
		        				$scope.employee.country = value.long_name;
		        				break;
		        			default:
		        				break;
						}
					});
				});



			},function(){

			})
			.finally(function(){
	       $rootScope.isLoading = false;
	    });

			$scope.createNewEmployee = function(){
				if($rootScope.newEmployee){
								$scope.employee = {};
					}
			};
			$scope.editEmployee = function(employee){
				$scope.employee = employee;
				$state.go('employee.details',{employeeId:employee.employeeId});
			};
			$scope.backToEmployee = function(){
				// xtmotorsCRUDService.cancelEdit($scope);
				$state.go('employee');
			};

			if($rootScope.newEmployee){
				$scope.createNewEmployee();
			}

			$scope.saveEmployee= function(employee){
					//TODO: Check whether is creating a new employee object or updateing an exist employee object
				if($rootScope.newEmployee){
					xtmotorsAPIService.save({section:'Employee/'},employee)
					.$promise.then(function(res){
						//console.log(res);
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
						//console.log(res);
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
	.controller('EmployeeDetailsCtrl', ['$rootScope','$scope','$state','$stateParams', function ($rootScope,$scope,$state,$stateParams) {
		$rootScope.isLoading = false;
		//console.log($stateParams.employeeId);

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
 * consignment controller of the application.
 */
angular.module('sales.controllers',[])
	.controller('SalesCtrl', ['$rootScope','$scope','xtmotorsAPIService','$state', '$mdToast', '$element','$translate','$translatePartialLoader',
    function ($rootScope,$scope,xtmotorsAPIService,$state,$mdToast,$element,$translate,$translatePartialLoader) {

    $rootScope.isLoading = true;
    $translatePartialLoader.addPart('sales');
    $translatePartialLoader.addPart('errorMessage');
    $translate.refresh();
		xtmotorsAPIService.query({ section:'contracts/'})
		.$promise.then(function(contracts){
			$scope.contracts = contracts;
      $rootScope.isLoading = false;
		},function(error){
      $scope.showError(error);
    });

    xtmotorsAPIService.query({section:'Employee'})
    .$promise.then(function(employees){
      $scope.employees = employees;
    },function(error){
      $scope.showError(error);
    });

    xtmotorsAPIService.query({section:'Customer'})
    .$promise.then(function(customers){
      $scope.customers = customers;
    },function(error){
      $scope.showError(error);
    });

    xtmotorsAPIService.query({section:'car/summary'})
    .$promise.then(function(cars){
      $scope.cars = cars;
    },function(error){
      $scope.showError(error);
    });

    $rootScope.salesCurrency = ["NZD", "JPY", "CNY"];

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

    $scope.createNewContract = function(){
      $rootScope.newContact = true;
      $state.go('sales.details', {}, {reload: true});
    };

    $scope.editContact = function(contract){
      $rootScope.newContact = false;
      $state.go('sales.details',{carId:contract.carId}, {reload: true});
    };

    $scope.showError = function(error){
      $mdToast.show({
        template: '<md-toast class="md-toast md-toast-' +error.status+ '"><span flex>' + error.statusText + '</span></md-toast>',
        position: 'top right',
        hideDelay: 5000,
        parent: $element
      });
    };

    $scope.successToast = function(message){
      $mdToast.show({
        template: '<md-toast class="md-toast md-toast-success"><span flex>' + message  + '</span></md-toast>',
        position: 'top right',
        hideDelay: 5000,
        parent: $element
      });
    };
    
	}])

  .controller('SalesDetailsCtrl', ['$rootScope','$scope','xtmotorsAPIService','$stateParams', '$state',
    function ($rootScope,$scope,xtmotorsAPIService,$stateParams,$state) {

      if($rootScope.newContact){
        $scope.contract = {};
        $scope.selectedCurrency = $scope.contract.currency;
      }else{
        getContract();
      }

      $scope.saveContract = function(contract){
        if($rootScope.newContact){
          saveContractRecord();
        }else{
          updateContractRecord();
        } 
      };

      $scope.selectedEmployeeChange = function(selectedEmployee){
        if(selectedEmployee !== null){
          $scope.contract.employeeId = selectedEmployee.employeeId;
        }   
      };

      $scope.selectedCustomerChange = function(selectedCustomer){
        if(selectedCustomer !== null){
          $scope.contract.customerId = selectedCustomer.customerId;
        }   
      };

      $scope.selectedCarChange = function(selectedCar){
        if(selectedCar !== null){
          $scope.contract.carId = selectedCar.carId;
        }   
      };

      $scope.currencyChanged = function(selectedCurrency){
        if(selectedCurrency !== null){
          $scope.contract.currency = selectedCurrency;
        }
      };

      function getContract(){
        xtmotorsAPIService.get({section:'Contracts/'+$stateParams.carId})
        .$promise.then(function(contract){
          $scope.contract = contract;
          $scope.selectedCurrency = $scope.contract.currency;
        },function(error){
          $scope.showError(error);
        });
      }

      function updateContractRecord(contract){
        xtmotorsAPIService.update({section:'Contracts/'+$scope.contract.carId}, $scope.contract)
        .$promise.then(function(res){
          $scope.successToast("Contract updates saved.");
        },function(error){
          $scope.showError(error);
        });
      }

      function saveContractRecord(){
        xtmotorsAPIService.save({section:'Contracts'}, $scope.contract)
        .$promise.then(function(res){
          $scope.successToast("New contract saved.");
        },function(error){
          if(error.status === 409){
            error.statusText = "The car has alreday been added";     
          }
          $scope.showError(error);   
        });
      }

      $scope.backToContract = function(){
        $rootScope.newContact = false;
        $state.go('sales', {}, {reload: true});
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
angular.module('sales',
    [
        'sales.controllers',
        // 'customer.directives',
        // 'customer.services'
    ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('sales', {
                url: "/sales",
                templateUrl: "modules/sales/sales.html",
                controller: 'SalesCtrl',
                data: {
                    requireLogin: true
                }
            })
            .state('sales.details',{
                url:"/:carId",
                views:{
                    "sales-details-view":{
                        templateUrl:"modules/sales/sales.details.html",
                        controller: 'SalesDetailsCtrl',
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
	.controller('SettlementCtrl', ['$rootScope', '$scope','xtmotorsAPIService', '$translate','$translatePartialLoader',function ($rootScope,$scope,xtmotorsAPIService,$translate,$translatePartialLoader) {
		$translatePartialLoader.addPart('settlement');
		// $translatePartialLoader.addPart('errorMessage');
    	$translate.refresh();
		$scope.settlement = 'settlement';
		$scope.labels = ["January", "February", "March", "April", "May", "June", "July", "August", "Sepetember", "October", "November", "December"];
		$scope.series = ['Series A'];
		$scope.isCarSummaryLoading = true;
		$scope.isVehicleModelLoading = true;
		$scope.isImportSummaryLoading = true;
		
		var contractTemp = [];
		var importTemp = [];

		$scope.contractData = [];
		$scope.importData = [];

		$scope.modelLabels = [];
		$scope.modelData = [];

		function Dates(){
			this.January = [];
			this.February = [];
			this.March = [];
			this.April = [];
			this.May = [];
			this.June = [];
			this.July = [];
			this.August = [];
			this.Sepetember = [];
			this.October = [];
			this.November = [];
			this.December = [];
		}

		$scope.contractDates = new Dates();
		$scope.importDates = new Dates();

		drawGraphs();

		function drawGraphs(){
			getContracts();
			getImports();
			getVehicleModels();
		}

		var count = 0;
		function getImports(){
			xtmotorsAPIService.query({section:'ImportRecords'})
			.$promise.then(function(importRecords) {
				_.forEach(importRecords, function(item){
					xtmotorsAPIService.get({section:'Imports/' + item.batchId})
					.$promise.then(function(batch) {
						var date = getMonthName(batch, 'eta');
						addToDates($scope.importDates, date, batch);
						count++;
						if(count === importRecords.length){
							getCountNumber(importTemp, $scope.importDates, $scope.importData);
						}
						$scope.isImportSummaryLoading = false;
						$rootScope.isLoading = $scope.isCarSummaryLoading || $scope.isVehicleModelLoading || $scope.isImportSummaryLoading;
					})
				})
			});
		}

		function getContracts(){
			xtmotorsAPIService.query({section:'contracts'})
			.$promise.then(function(contracts){
				$scope.contracts = contracts;
				_.forEach(contracts, function(contract){
					var date = getMonthName(contract, 'contractDate');
					addToDates($scope.contractDates, date, contract);
				})
				getCountNumber(contractTemp, $scope.contractDates, $scope.contractData);
				$scope.isCarSummaryLoading = false;
				$rootScope.isLoading = $scope.isCarSummaryLoading || $scope.isVehicleModelLoading || $scope.isImportSummaryLoading;
			},function(error){

			});
		}

		function getVehicleModels(){
			xtmotorsAPIService.query({section:'car/summary'})
			.$promise.then(function(cars) {
				
				_.forEach(cars, function(item){
					$scope.modelLabels.push(item.makerName);
				})
				
				$scope.modelLabels = _.uniq($scope.modelLabels);
				_.forEach($scope.modelLabels, function(item){
					var count = 0;
					_.forEach(cars, function(car){
						if(car.makerName === item){
							count++;
						}
					})
					$scope.modelData.push(count);
				})
				$scope.isVehicleModelLoading = false;
				$rootScope.isLoading = $scope.isCarSummaryLoading || $scope.isVehicleModelLoading || $scope.isImportSummaryLoading;
			});
		}

		function addToDates(dateObj, date, item){
			switch (date) {
				case 'January':
					dateObj.January.push(item);
					return;
				case 'February':
					dateObj.February.push(item);
					return;
				case 'March':
					dateObj.March.push(item);
					return;
				case 'April':
					dateObj.April.push(item);
					return;
				case 'May':
					dateObj.May.push(item);
					return;
				case 'June':
					dateObj.June.push(item);
					return;
				case 'July':
					dateObj.July.push(item);
					return;
				case 'August':
					dateObj.August.push(item);
					return;
				case 'Sepetember':
					dateObj.Sepetember.push(item);
					return;
				case 'October':
					dateObj.October.push(item);
					return;									
				case 'November':
					dateObj.November.push(item);
					return;
				case 'December':
					dateObj.December.push(item);
					return;
				default:
					return;
			}
		}

		function getCountNumber(temp, dateObj, data){
			for(var i = 0; i<$scope.labels.length; i++){
				temp.push((dateObj[Object.keys(dateObj)[i]].length));
			}
			data.push(temp);
		}

		function getMonthName(item, description){
			var date = moment(item[description]).format('MMMM');
			return date;
		}
		
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
	.controller('StorageCtrl',['$rootScope','$scope','$translate','$translatePartialLoader','xtmotorsCRUDService','xtmotorsAPIService','$q','$state', function ($rootScope,$scope, $translate, $translatePartialLoader,xtmotorsCRUDService,xtmotorsAPIService,$q,$state) {

		$rootScope.isLoading = true;

		$scope.getCarBatch = function(car, batchId){
	      xtmotorsAPIService.get({section:'Imports/' + batchId})
	      .$promise.then(function(batch) {   
	        car.arriveTime = batch.eta;
	        $rootScope.isLoading = false;
	      },function(error){
	        $rootScope.showError(error);
	      });
	    };

	    $scope.getCarImportRecord = function(car){
	      xtmotorsAPIService.get({ section:'ImportRecords/'+car.carId})
	      .$promise.then(function(res){
	        $scope.importSummary = res;
	        $scope.getCarBatch(car, res.batchId);
	      },function(error){
	        car.arriveTime = "HAS NOT BEEN FINALIZED";
	      });
	    };

		xtmotorsAPIService.query({section:'car/summary'})
  			.$promise.then(function(itemList) {

				$translatePartialLoader.addPart('storage');
  			$translate.refresh();

				$scope.inStore=[];
				$scope.onTheWay=[];
				$scope.selected = [];
				$rootScope.isLoading = false;

				_.forEach(itemList, function(car){ 
          			$scope.getCarImportRecord(car);
        		})

				angular.forEach(itemList, function(item,key){
					if(item.carStatus == 'For Sale' || item.carStatus == 'Sold' || item.carStatus == 'Reserved'){
						$scope.inStore.push(item);
					}else {
						$scope.onTheWay.push(item);
					}
				});

    		$scope.inStoreList = $scope.inStore;
      	$scope.onTheWayList = $scope.onTheWay;

        $scope.editCar = function(car){
          $state.go('car.details',{carId: car.carId}, {reload: true});
          $rootScope.isFromStorage = true;
        };


         $scope.selectedItemChange = function(selectVehicle) {
          if(selectVehicle !== null){
            $scope.vehicleModel = selectVehicle;
          }
        };


        function changeDateFormat(date){
          var wofTime = moment(date).startOf('day').toDate();
          return wofTime;
        }

        $scope.backToCar = function(){
          // xtmotorsCRUDService.cancelEdit($scope);
          $state.go('car');
        };
        $scope.saveCar= function(car,vehicleModel,importRecord,contract,importSummary){
          // var formValid = xtmotorsAPIService.validateForm($scope);
          // if(formValid){
          $q.all({
              car: xtmotorsAPIService.update({section:'car/'+car.carId}, car).$promise,
              vehicleModel: xtmotorsAPIService.update({ section:'VehicleModel/'},vehicleModel).$promise,
              importRecord: xtmotorsAPIService.update({ section:'ImportRecords/'+car.carId}, importRecord).$promise,
              contract: xtmotorsAPIService.update({ section:'Contract/'+car.carId}, contract).$promise,
              // maintenance: xtmotorsAPIService.update({section:'Maintenance/'+$scope.maintenance.recordId}, $scope.maintenance).$promise,
              importSummary: xtmotorsAPIService.update({ section:'Import/'+ importRecord.batchId}, importSummary).$promise
          })
          .then(function(res){
            // console.log(res);
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

    		}).finally(function(){
       			//$rootScope.isLoading = false;
    		});

		$scope.options = {
			autoSelect: true,
	        boundaryLinks: false,
	        largeEditDialog: false,
	        pageSelector: false,
	        rowSelection: false
        };

		$scope.query = {
			order: 'carId',
	        limitForInStore: 5,
	        limitForOnTheWay: 5,
	        pageForInStore: 1,
	        pageForOnTheWay: 1
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
			// xtmotorsCRUDService.get('Car',$scope)
			// console.log($scope.itemList[0]);
			// angular.forEach($scope.itemList, function(item,key){
			// 		if(item.carStatus == 'For Sale' || item.carStatus == 'Sold'){
			// 			$scope.inStore.push(item);
			// 			console.log(item);
			// 		}else {
			// 			$scope.onTheWay.push(item);
			// 		}
			// 	});

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