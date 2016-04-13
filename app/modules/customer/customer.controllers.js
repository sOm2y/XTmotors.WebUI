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

		    function changeDateFormat(date){          
          	   var wofTime = moment(date).startOf('day').toDate();
          	   return wofTime;
        	} 

		    $scope.createItem = function(){
            if(!$scope.item){
                $scope.newItem = true;
                $scope.item = {};
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