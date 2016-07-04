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
