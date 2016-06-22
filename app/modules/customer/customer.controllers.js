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
				$scope.customer.street = null;
				$scope.customer.city = null;
				$scope.customer.state = null;
				$scope.customer.country = null;
				(param.address_components).forEach(function(value) {
					switch(value.types[0]){
						case "street_number":
	        				$scope.customer.street = value.long_name;
	        				break;
	    				case "route":
	    					$scope.customer.street += " " + value.long_name;
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
