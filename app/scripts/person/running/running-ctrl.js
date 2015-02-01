'use strict';

angular.module('person')

	.controller('perRunningChartCtrl', ['$scope', '$state', 'resUser', 'resInvest', function($scope, $state, resUser, resInvest) {

		//------------------------------
		// Define
		//------------------------------

		$scope.username = null;
		$scope.user     = resUser.getDefaultUser();

		$scope.list = {
			target_id: -1,
			limit: 10
		};

		var chart = null;

		//------------------------------
		// Main Function
		//------------------------------

		var initChart = function() {
			// options
			var options = {
				chart: {
					renderTo: 'running-chart',
					plotBackgroundColor: null,
					plotBorderWidth: null,
					plotShadow: false
				},
				title: {
					text: ''
				},
				tooltip: {
					enabled: false,
					pointFormat: '<b>{point.percentage:.2f}%</b>'
				},
				plotOptions: {
					pie: {
						allowPointSelect: true,
						cursor: 'pointer',
						dataLabels: {
							enabled: true,
							color: '#000000',
							connectorColor: '#000000',
							formatter: function () {
								return '<b>' + this.point.name + '</b>: ' + Highcharts.numberFormat(this.percentage, 2) + ' %';
							}
						}
					}
				},
				series: [{
					type: 'pie',
					data: []
				}]
			};

			// chart
			chart = new Highcharts.Chart(options);
		};

		var setChart = function(pies)		{
			// convert format
			var items = [];
			for (var key in pies){
				items.push([key, pies[key]*100]);
			}
			// set data for chart
			chart.series[0].setData(items, true);
		};

		$scope.getUser = function() {
			return resUser.getUserByUsername($scope.username).then(function(data){
				if (data) {
					$scope.user = data;
					$scope.list.target_id = data.user_id;
				}
			});
		};

		$scope.getRunningPies = function() {
			resInvest.get_running_pies($scope.list.target_id, $scope.list.limit).then(function(data) {
				if (data.success) {
					setChart(data.pies);
				}
			});
		};

		//------------------------------
		// Init
		//------------------------------

		// get target username
		if ($state.params.username.length > 0) {
			$scope.username = $state.params.username;
		}

		// init chart
		initChart();

		// get user and get running pies
		$scope.getUser().then(function() {
			if ($scope.user.user_id !== '') {
				$scope.getRunningPies();
			}
		});

	}]);
