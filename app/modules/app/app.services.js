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
