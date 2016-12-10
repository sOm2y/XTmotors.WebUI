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
	.controller('SettlementCtrl', ['$rootScope', '$scope','xtmotorsAPIService', '$translate','$translatePartialLoader',function ($rootScope,$scope,xtmotorsAPIService,$translate,$translatePartialLoader) {
		$translatePartialLoader.addPart('settlement');
		// $translatePartialLoader.addPart('errorMessage');
    	$translate.refresh();
		$scope.settlement = 'settlement';
		$scope.labels = ["January", "February", "March", "April", "May", "June", "July", "August", "Sepetember", "October", "November", "December"];
		$scope.series = ['Series A'];
		$scope.isCarSummaryLoading = true;
		$scope.isVehicleModelLoading = true;
		$scope.isImportSummaryLoading = true;

		$scope.modelClicked = false;
		
		var contractTemp = [];
		var importTemp = [];

		$scope.contractData = [];
		$scope.importData = [];

		$scope.modelLabels = [];
		$scope.modelList = [];
		$scope.modelData = [];

		function Dates(){
			this.January = [];
			this.February = [];
			this.March = [];
			this.April = [];
			this.May = [];
			this.June = [];
			this.July = [];
			this.August = [];
			this.Sepetember = [];
			this.October = [];
			this.November = [];
			this.December = [];
		}

		$scope.contractDates = new Dates();
		$scope.importDates = new Dates();

		drawGraphs();
		

		function drawGraphs(){
			getContracts();
			getImports();
			getVehicleModels();
		}

		//#region Display car model when click marker name in pie chart
		$scope.modelChartClick = function(points, evt){
			if(points.length !== 0){
				$scope.modelClicked = true;
				$scope.modelClickedLabelsUniq = [];
				$scope.modelClickedData = [[]];
				$scope.modelClickedLabels = [];

				var $chart;
				$scope.$on("create", function (event, chart) {
					if (typeof $chart !== "undefined") {
						$chart.destroy();
					}
					$chart = chart;
				});

				var lableName = points[0].label;

				$scope.modelsClicked = _.filter($scope.modelList, function(o) { 
					return (o.maker == lableName);
					// return !o.active; 
				});

				_.forEach($scope.modelsClicked, function(item){
					$scope.modelClickedLabels.push(item.model);
				})


				$scope.modelClickedLabelsUniq = _.uniq($scope.modelClickedLabels);

				// console.log($scope.modelClickedLabelsUniq);
				_.forEach($scope.modelClickedLabelsUniq, function(item){
					// console.log(item);
					var count = 0;
					_.forEach($scope.modelClickedLabels, function(model){
						if(model === item){
								count++;
						}	
					})
					$scope.modelClickedData[0].push(count);
					
				})
				// console.log($scope.modelClickedData);
			}
			

		};

		//endregion

		var count = 0;
		function getImports(){
			var iteration = 0;
			xtmotorsAPIService.query({section:'ImportRecords'})
			.$promise.then(function(importRecords) {
				_.forEach(importRecords, function(item){
					xtmotorsAPIService.get({section:'Imports/' + item.batchId})
					.$promise.then(function(batch) {
						var date = getMonthName(batch, 'eta');
						addToDates($scope.importDates, date, batch);
						count++;
						iteration++;
						if(count === importRecords.length){
							getCountNumber(importTemp, $scope.importDates, $scope.importData);
						}
						if(iteration == importRecords.length){
							$scope.isImportSummaryLoading = false;
							$rootScope.isLoading = $scope.isCarSummaryLoading || $scope.isVehicleModelLoading || $scope.isImportSummaryLoading;
						}
					})
				})
			});
			
		}

		function getContracts(){
			xtmotorsAPIService.query({section:'contracts'})
			.$promise.then(function(contracts){
				$scope.contracts = contracts;
				_.forEach(contracts, function(contract){
					var date = getMonthName(contract, 'contractDate');
					addToDates($scope.contractDates, date, contract);
				})
				getCountNumber(contractTemp, $scope.contractDates, $scope.contractData);
			},function(error){

			});
			$scope.isCarSummaryLoading = false;
			$rootScope.isLoading = $scope.isCarSummaryLoading || $scope.isVehicleModelLoading || $scope.isImportSummaryLoading;
		}

		function getVehicleModels(){
			xtmotorsAPIService.query({section:'car/summary'})
			.$promise.then(function(cars) {
				_.forEach(cars, function(item){
					$scope.modelList.push({"maker": item.makerName, "model": item.model});
					$scope.modelLabels.push(item.makerName);
				})
				
				$scope.modelLabelsUniq = _.uniq($scope.modelLabels);
				_.forEach($scope.modelLabelsUniq, function(item){
					var count = 0;
					_.forEach(cars, function(car){
						if(car.makerName === item){
							count++;
						}
					})
					$scope.modelData.push(count);
				})
			});
			$scope.isVehicleModelLoading = false;
			$rootScope.isLoading = $scope.isCarSummaryLoading || $scope.isVehicleModelLoading || $scope.isImportSummaryLoading;
		}

		function addToDates(dateObj, date, item){
			switch (date) {
				case 'January':
					dateObj.January.push(item);
					return;
				case 'February':
					dateObj.February.push(item);
					return;
				case 'March':
					dateObj.March.push(item);
					return;
				case 'April':
					dateObj.April.push(item);
					return;
				case 'May':
					dateObj.May.push(item);
					return;
				case 'June':
					dateObj.June.push(item);
					return;
				case 'July':
					dateObj.July.push(item);
					return;
				case 'August':
					dateObj.August.push(item);
					return;
				case 'Sepetember':
					dateObj.Sepetember.push(item);
					return;
				case 'October':
					dateObj.October.push(item);
					return;									
				case 'November':
					dateObj.November.push(item);
					return;
				case 'December':
					dateObj.December.push(item);
					return;
				default:
					return;
			}
		}

		function getCountNumber(temp, dateObj, data){
			for(var i = 0; i<$scope.labels.length; i++){
				temp.push((dateObj[Object.keys(dateObj)[i]].length));
			}
			data.push(temp);
		}

		function getMonthName(item, description){
			var date = moment(item[description]).format('MMMM');
			return date;
		}
		
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
