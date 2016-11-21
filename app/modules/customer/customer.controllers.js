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

		$translatePartialLoader.addPart('customerDetails');
		$translatePartialLoader.addPart('errorMessage');
        $translate.refresh();


        $scope.totalPages = 10;
        $scope.customersPerPage  = 10;

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

		$scope.getAllCustomers = function(){
			xtmotorsAPIService.query({section:'Customer'})
			.$promise.then(function(customers){
				$rootScope.customers = customers;
				$scope.totalCustomers = $scope.customers.length;
		        $scope.paginatedCustomers = $scope.customers.slice(0, $scope.customersPerPage);
		        if($scope.pagination === undefined){	
			        $scope.pagination = {
			            currentPage:  1
			        };
		        }
		        $scope.pageChanged($scope.pagination.currentPage);
			},function(error){
				$rootScope.showError(error);
			})
			.finally(function(){
		    	$rootScope.isLoading = false;
		  	});
		};

		$scope.pageChanged = function(currentPage){
			var begin = ((currentPage - 1) * $scope.customersPerPage),
				end   = begin + $scope.customersPerPage;

			$scope.paginatedCustomers = $scope.customers.slice(begin, end);
        };
		

		$scope.changeDateFormat = function(time){
	      	return new Date(moment(time));
	    };

	    $scope.createNewCustomer = function(){
       		if($rootScope.newCustomer){
            	$scope.customer = {};
        	}
      	};

		$scope.editCustomer = function(customer){
			$scope.getCustomerById(customer.customerId);
		};	

		$scope.saveNewCustomer = function(customer){
			xtmotorsAPIService.save({section:'Customer/'},customer)
				.$promise.then(function(res){
					$rootScope.newCustomer = false;
					$rootScope.successToast('New Customer is created');
				},function(error){
				    $rootScope.newCustomer = true;
				    $rootScope.showError(error);
				}).finally(function(){

				});
		};

		$scope.updateCustomer = function(customer){
			xtmotorsAPIService.update({section:'Customer/'+customer.customerId},customer)
	            .$promise.then(function(res){
		            $rootScope.successToast('Customer has been updated.');
		        },function(error){
		            $rootScope.showError(error);
		        }).finally(function(){

		        });
		}

		$scope.getCustomerById = function(customerId){
			xtmotorsAPIService.get({ section:'Customer/'+ customerId})
				.$promise.then(function(res){
					$scope.customer = res;
					$scope.customer.dob = $scope.changeDateFormat($scope.customer.dob);
					$state.go('customer.details',{customerId: $scope.customer.customerId});
				},function(error){
					$rootScope.showError(error);
			});
		};

		$scope.getAllCustomers();
	}])

	.controller('CustomerDetailsCtrl', ['$rootScope','$scope', '$state', '$stateParams', function ($rootScope, $scope, $state, $stateParams) {
		if($rootScope.newCustomer){
			$scope.customer = {};
		}else{
	      	$scope.getCustomerById($stateParams.customerId);
	    }

		$scope.backToCustomer = function(){
			// xtmotorsCRUDService.cancelEdit($scope);
			$state.go('customer');
			$scope.getAllCustomers();
		};
		
		$scope.saveCustomer= function(customer){
	       	if($rootScope.newCustomer){
	       		$scope.saveNewCustomer(customer);
			}else{
		      	$scope.updateCustomer(customer);
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

	}]);
