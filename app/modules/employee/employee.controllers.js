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
