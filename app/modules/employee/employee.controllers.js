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
	    $scope.createItem = function(){
            if(!$scope.item){
                $scope.newItem = true;
                $scope.item = {};
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