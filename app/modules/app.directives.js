angular.module('app.directives', [])
	.directive('formSearchCar', [function () {
		return {
			restrict: 'E',
			templateUrl:'views/app/form-search-car.html',
			link: function (scope, iElement, iAttrs) {
				
			}
		};
	}])