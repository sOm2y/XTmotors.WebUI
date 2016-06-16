'use strict';
/**
 * @ngdoc overview
 * @name xtmotorwebuiApp
 * @description
 * # xtmotorwebuiApp
 *
 * settlement controller of the application.
 */
angular.module('settlement.controllers',[])
	.controller('SettlementCtrl', ['$scope','xtmotorsAPIService', function ($scope,xtmotorsAPIService) {
		$scope.settlement = 'settlement';
		$scope.dates = {
				'January':[],
				'February':[],
				'March':[],
				'April':[],
				'May':[],
				'June':[],
				'July':[],
				'August':[],
				'Sepetember':[],
				'October':[],
				'November':[],
				'December':[]
		};
		xtmotorsAPIService.query({section:'contracts'}).$promise.then(function(contracts){
			$scope.contracts = contracts;
			_.forEach(contracts,function(contract){
				var date = moment(contract.contractDate).format('MMMM');
				switch (date) {
					case 'June':
						$scope.dates.June.push(contract);
						return;
					default:
						return;
				}
			})
		},function(error){

		});

		$scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
		$scope.series = ['Series A'];
		$scope.data = [
		    [65, 59, 80, 81, 56, 55, 40]
		];
		$scope.colours=[{
			fillColor: 'rgba(255, 255, 255, 0.8)',
		    strokeColor: 'rgba(255, 255, 255, 0.8)',
		    highlightFill: 'rgba(255, 255, 255, 0.8)',
		    highlightStroke: 'rgba(255, 255, 255, 0.8)'
		}];


		// function resizeChart() {
		//     var canvas = document.getElementById("canvas");

		//     //set new sizes
		//     var new_canvasWidth = Math.max((canvas.parentNode.clientWidth), 800);
		//     var new_canvasHeight = 400;

		//     //only redraw if the size  has changed
		//     if ((new_canvasWidth != canvas.width) || (new_canvasHeight != canvas.height)) {
		//         canvas.width = new_canvasWidth;
		//         canvas.height = new_canvasHeight;
		//         new Chart(canvas.getContext("2d")).Line(lineChartData(data, options));
		//     }
		// }
		// //resizeTracker, clearTimeout, and setTimeout are used to only fire the resize event after the user has finished resizing; rather than firing lots of times unnecessarily while resizing.
		// var resizeTracker;
		// window.addEventListener('resize', (function(){clearTimeout(resizeTracker);resizeTracker = setTimeout(resizeChart, 100);}), false);


	}]);
