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
		    	scope.isLoading = false;
		    	//adding fake async loading
		    	$rootScope.$on('$stateChangeStart', function() {    		
		    			scope.isLoading = true;

		      	});
		      	$rootScope.$on('$stateChangeSuccess', function() {
			       $timeout(function(){
		    			scope.isLoading = false;
		    		},1000);
			    });
		    }
		};
	}]);