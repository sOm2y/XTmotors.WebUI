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

		$translatePartialLoader.addPart('employeeDetails');
		$translatePartialLoader.addPart('errorMessage');
        $translate.refresh();


        $scope.totalPages = 10;
        $scope.employeesPerPage  = 10;

		$rootScope.showError = function(error){
			$mdToast.show({
				template: '<md-toast class="md-toast md-toast-500' +error.status+ '"><span flex>' + error.statusText + '</span></md-toast>',
				position: 'top right',
				hideDelay: 5000,
				parent: $element
			});
		};

		$rootScope.showErrorMessage = function(message){
			$mdToast.show({
				template: '<md-toast class="md-toast md-toast-500"><span flex>' + message  + '</span></md-toast>',
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

		$scope.getAllEmployees = function(){
			xtmotorsAPIService.query({section:'Employee'})
			.$promise.then(function(employees){
				$rootScope.employees = employees;
				$scope.totalEmployees = $scope.employees.length;
		        $scope.paginatedEmployees = $scope.employees.slice(0, $scope.employeesPerPage);
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
			var begin = ((currentPage - 1) * $scope.employeesPerPage),
				end   = begin + $scope.employeesPerPage;

			$scope.paginatedEmployees = $scope.employees.slice(begin, end);
        };
		

		$scope.changeDateFormat = function(time){
	      	return new Date(moment(time));
	    };

	    $scope.createNewEmployee = function(){
       		if($rootScope.newEmployee){
            	$scope.employee = {};
        	}
      	};

		$scope.editEmployee = function(employee){
			$scope.getEmployeeById(employee.employeeId);
		};	

		$scope.saveNewEmployee = function(employee){
			xtmotorsAPIService.save({section:'Employee/'},employee)
				.$promise.then(function(res){
					$rootScope.newEmployee = false;
					$rootScope.successToast('New Employee is created');
				},function(error){
				    $rootScope.newEmployee = true;
				    $rootScope.showError(error);
				}).finally(function(){

				});
		};

		$scope.updateEmployee = function(employee){
			xtmotorsAPIService.update({section:'Employee/'+employee.employeeId},employee)
	            .$promise.then(function(res){
		            $rootScope.successToast('Employee has been updated.');
		        },function(error){
		            $rootScope.showError(error);
		        }).finally(function(){

		        });
		}

		$scope.getEmployeeById = function(employeeId){
			xtmotorsAPIService.get({ section:'Employee/'+ employeeId})
				.$promise.then(function(res){
					$scope.employee = res;
					$scope.employee.dob = $scope.changeDateFormat($scope.employee.dob);
					$state.go('employee.details',{employeeId: employeeId});
				},function(error){
					$rootScope.showError(error);
			});
		};

		$scope.getAllEmployees();

	}])
	.controller('EmployeeDetailsCtrl', ['$rootScope','$scope','$state','$stateParams', function ($rootScope,$scope,$state,$stateParams) {
		if($rootScope.newEmployee){
			$scope.employee = {
			  "occupation": "string",
			  "passportNumber": "Passport Number",
			  "identityNumber": "IRD Number",
			  "irdNumber": "",
			  "responsibleFor": "string",
			  "discount": 0,
			  "emailAddress": "",
			  "mobile": "",
			  "phone": "",
			  "fax": "string",
			};
		}else{
	      	$scope.getEmployeeById($stateParams.employeeId);
	    }

		$scope.backToEmployee = function(){
			$state.go('employee');
			$scope.getAllEmployees();
		};
		
		$scope.saveEmployee= function(employee){
			$scope.employeeSummary.$setSubmitted();
			$scope.employeeDetail.$setSubmitted();

			if(($scope.employeeDetail.$invalid || $scope.employeeSummary.$invalid)){
				$rootScope.showErrorMessage("Invalid fields, Please check again!");
			}else{
				if($rootScope.newEmployee){
		       		$scope.saveNewEmployee(employee);
				}else{
			      	$scope.updateEmployee(employee);
			    }
			}
	       	
	    };

        $scope.$on('g-places-autocomplete:select', function (event, param) {
      		$scope.employee.streetNum = null;
      		$scope.employee.route = null;
			$scope.employee.street = null;
			$scope.employee.suburb = null;
			$scope.employee.city = null;
			$scope.employee.state = null;
			$scope.employee.country = null;

			// console.log(param.address_components);

			(param.address_components).forEach(function(value) {
				// console.log(value.types[0]);
				switch(value.types[0]){
					case "street_number":
        				$scope.employee.streetNum = value.long_name;
        				break;
    				case "route":
    					$scope.employee.route = value.long_name;
    					$scope.employee.street = $scope.employee.streetNum + " " + $scope.employee.route;
        				break;
        			case "sublocality_level_1":
        				$scope.employee.suburb = value.long_name;
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

	}]);
