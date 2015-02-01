'use strict';

angular.module('stock')

	.controller('stoTechniqueCtrl', ['$scope', '$state', '$translate', 'resUser', 'resStock', function($scope, $state, $translate, resUser, resStock) {

		//----------------------------------------
		// Define
		//----------------------------------------

		// user
		$scope.username = null;
		$scope.user     = resUser.getDefaultUser();

        // chart
		$scope.line  			= 'daily';
        $scope.range 			= 0;
        $scope.items 			= [];
        $scope.daily_prices   	= [];
        $scope.weekly_prices  	= [];
        $scope.monthly_prices 	= [];

		var chart = null;
		var ohlc, volume;
		var sma5, sma20, sma60, sma240;

		//----------------------------------------
		// Main Function
		//----------------------------------------

		$scope.getUser = function() {
			return resUser.getUserByUsername($scope.username).then(function(data){
				$scope.user = data;
			});
		};

		var initChart = function() {

			// options
			var options = {
				chart: {
					renderTo: 'technique-chart',
					animation: false,
					backgroundColor: '#F5F5F5'
				},

				credits: {
					enabled: false
				},

				exporting: {
					enabled: false
				},

				legend: {
					enabled: true,
					align: 'center',
					verticalAlign: 'top',
					borderWidth: 0
				},

				navigator: {
					baseSeries: 'close',
					series: {
						//color: 'green'
					},
					xAxis: {
						tickPixelInterval: 200,
						dateTimeLabelFormats: {
							day: '%Y/%m',
							week: '%Y/%m',
							month: '%Y/%m',
							year: '%Y'
						}
					}
				},

				plotOptions: {

					// for sma
					spline: {
						animation: false,
						lineWidth: 1,
						dataGrouping: {
							enabled: false
						},
						enableMouseTracking: false
					},

					// for ohlc
					candlestick: {
						animation: false,
						color: '#00A800',
						upColor: '#FC0404',
						lineColor: '#00A800',
						upLineColor: '#FC0404',
						dataGrouping: {
							enabled: false
						},
						enableMouseTracking: true,
						tooltip: {
							headerFormat:
								'<span style="font-size: 12px; font-weight: bold;">{point.key}</span><br/>',
							pointFormat:
								$translate.instant('stock.technique.tooltip.open')  + '{point.open}<br/>' +
								$translate.instant('stock.technique.tooltip.high')  + '{point.high}<br/>' +
								$translate.instant('stock.technique.tooltip.low')   + '{point.low}<br/>' +
								$translate.instant('stock.technique.tooltip.close') + '{point.close}<br/>',
							valueDecimals: 2,
							xDateFormat: '%Y/%m/%d'
						}
					},

					// for volume
					column: {
						animation: false,
						dataGrouping: {
							enabled: false
						},
						enableMouseTracking: true,
						tooltip: {
							pointFormat:
								$translate.instant('stock.technique.tooltip.volume') + '{point.y}<br/>'
						}
					},

					series: {
						point: {

						}
					}
				},

				rangeSelector: {
					enabled: false
				},

				scrollbar: {
					enabled: false
				},

				title: {
					text: ''
				},

				tooltip: {
					animation: false,
					shadow: false,
					crosshairs: [{
						width: 1,
						color: '#AAA'
					}],
					borderColor: '#999',
					positioner: function(labelWidth, labelHeight, point) {
						var width = chart.plotWidth;
						if (point.plotX < width/2) {
							return {x: width - 140, y: 40};
						} else {
							return {x: 10, y: 40};
						}
					}
				},

				xAxis: {
					offset: -150,
					lineWidth: 0,
					tickWidth: 0,
					tickPixelInterval: 200,
					gridLineWidth: 1,
					gridLineColor: '#ccc',
					gridLineDashStyle: 'dash',
					dateTimeLabelFormats: {
						day: '%Y/%m',
						week: '%Y/%m',
						month: '%Y/%m',
						year: '%Y'
					},
					labels: {
						style: {
							color: '#555',
							'font-weight': 'bold'
						}
					}
				},

				yAxis: [{
					opposite: true,
					height: 300,
					offset: 0,
					lineWidth: 1,
					gridLineWidth: 1,
					gridLineColor: '#ccc',
					gridLineDashStyle: 'dash',
					labels: {
						align: 'left',
						x: 6,
						y: 6,
						formatter: function() {
							return this.value.toFixed(1);
						}
					},
					showFirstLabel: true,
					showLastLabel: true
				}, {
					opposite: true,
					top: 385,
					height: 120,
					offset: 0,
					lineWidth: 1,
					gridLineWidth: 1,
					gridLineColor: '#ccc',
					gridLineDashStyle: 'dash',
					labels: {
						align: 'left',
						x: 6,
						y: 6
					},
					showFirstLabel: true,
					showLastLabel: true
				}],

				series: [{
					type: 'candlestick',
					name: 'Stock',
					id: 'primary',
					showInLegend: false
				}, {
					type: 'column',
					name: 'Volume',
					yAxis: 1,
					showInLegend: false
				},{
					type: 'spline',
					name: 'MA5',
					yAxis: 0,
					color: '#00477D'
				},{
					type: 'spline',
					name: 'MA20',
					yAxis: 0,
					color: '#12BDD9'
				},{
					type: 'spline',
					name: 'MA60',
					yAxis: 0,
					color: '#F26093'
				},{
					type: 'spline',
					name: 'MA240',
					yAxis: 0,
					color: '#A2C83C'
				}]
			};

			// chart
			chart = new Highcharts.StockChart(options);
		};

		var setSeries = function() {
			// ohlc and volume
			calculateOhlc();

			// moving average
			sma5   = calculateSMA(ohlc, 5);
			sma20  = calculateSMA(ohlc, 20);
			sma60  = calculateSMA(ohlc, 60);
			sma240 = calculateSMA(ohlc, 240);

			// set ohlc and volume
			chart.series[0].setData(ohlc,   true);
			chart.series[1].setData(volume, true);

			// set simple moving average
			chart.series[2].setData(sma5,   true);
			chart.series[3].setData(sma20,  true);
			chart.series[4].setData(sma60,  true);
			chart.series[5].setData(sma240, true);
		};

		var setRange = function() {
			var today = new Date();
			var max = today.getTime();
			var min = max - $scope.range;
			chart.xAxis[0].setExtremes(min, max);

			/*
			chart.xAxis[0].update({
				range: $scope.range
			});
			*/
		};

		//------------------------------------
		//
		//------------------------------------

		var calculateOhlc = function() {
			ohlc = [];
			volume = [];
			$scope.items.forEach(function(item) {
				var utime = new Date(item[0]).getTime();
				var color = (item[5] >= 0) ? '#FC0404': '#00A800';
				// ohlc
				ohlc.push([
					utime,    // the date
					item[1],    // open
					item[2],    // high
					item[3],    // low
					item[4]     // close
				]);
				// volume
				volume.push({
					x: utime,
					y: item[6],
					color: color
				});
			});
		};

		var arrayAvg = function (arr) {
			var sum = 0,
				arrLength = arr.length,
				i = arrLength;

			while (i--) {
				sum = sum + arr[i];
			}

			var avg = sum / arrLength;
			avg = Math.round(avg*100, 0) / 100;

			return avg;
		};

		var calculateSMA = function(ohlc, periods) {
			var periodArr = [],
				smLine = [],
				length = ohlc.length;

			// Loop through the entire array.
			for (var i = 0; i < length; i++) {

				var utime = ohlc[i][0];
				var close = ohlc[i][4];

				// add points to the array.
				periodArr.push(close);

				// 1: Check if array is "filled" else create null point in line.
				// 2: Calculate average.
				// 3: Remove first value.
				if (periods === periodArr.length) {

					smLine.push([utime, arrayAvg(periodArr)]);
					periodArr.splice(0,1);

				}  else {
					smLine.push([utime, null]);
				}
			}
			return smLine;
		};

		//------------------------------------
		// Event Functions
		//------------------------------------

        // get range value
        var getRangeValue = function(year, month) {
            // today
            var today = new Date();
            // begin date
            var begin = angular.copy(today);
            begin.setFullYear(begin.getFullYear() - year);
            begin.setMonth(begin.getMonth() - month);
            // diff (milliseconds)
            var diff = (today.getTime() - begin.getTime());

            return diff;
        };

		$scope.onClickDailyLine = function() {
            var range_year  	= 0;
            var range_month 	= 6;

            var request_year	= 2;
            var request_month	= 0;

            // update UI
            $scope.line = 'daily';

            // get cached data
            if ($scope.daily_prices.length > 0) {
                // update chart data
                $scope.range = getRangeValue(range_year, range_month);
                $scope.items = $scope.daily_prices;
	            // update series and range
	            setSeries();
				setRange();
                return;
            }

            // load data
            resStock.get_recent_daily_prices($scope.username, request_year, request_month).then(function(data) {
                if (data.success) {
                    // save cached data
                    $scope.daily_prices = data.prices;
                    // update chart data
                    $scope.range = getRangeValue(range_year, range_month);
                    $scope.items = $scope.daily_prices;
	                // update series and range
		            setSeries();
					setRange();
                }
            });
		};

		$scope.onClickWeeklyLine = function() {
            var range_year  	= 2;
            var range_month 	= 0;

            var request_year	= 6;
            var request_month	= 0;

            // update UI
            $scope.line = 'weekly';

            // get cached data
            if ($scope.weekly_prices.length > 0) {
                // update chart data
                $scope.range = getRangeValue(range_year, range_month);
                $scope.items = $scope.weekly_prices;
	            // update series and range
	            setSeries();
				setRange();
                return;
            }

            // load data
            resStock.get_recent_weekly_prices($scope.username, request_year, request_month).then(function(data) {
                if (data.success) {
                    // save cached data
                    $scope.weekly_prices = data.prices;
                    // update chart data
                    $scope.range = getRangeValue(range_year, range_month);
                    $scope.items = $scope.weekly_prices;
	                // update series and range
		            setSeries();
					setRange();
                }
            });
		};

		$scope.onClickMonthlyLine = function() {
            var range_year  	= 10;
            var range_month 	= 0;

            var request_year	= 20;
            var request_month	= 0;

            // update UI
            $scope.line = 'monthly';

            // get cached data
            if ($scope.monthly_prices.length > 0) {
                // update chart data
                $scope.range = getRangeValue(range_year, range_month);
                $scope.items = $scope.monthly_prices;
	            // update series and range
	            setSeries();
				setRange();
                return;
            }

            // load data
            resStock.get_recent_monthly_prices($scope.username, request_year, request_month).then(function(data) {
                if (data.success) {
                    // save cached data
                    $scope.monthly_prices = data.prices;
                    // update chart data
                    $scope.range = getRangeValue(range_year, range_month);
                    $scope.items = $scope.monthly_prices;
	                // update series and range
		            setSeries();
					setRange();
                }
            });
		};

		$scope.onClickRange = function(year, month) {
			// update chart data
			$scope.range = getRangeValue(year, month);
			// update range
			setRange();
		};

		//----------------------------------------
		// Appearance Functions
		//----------------------------------------

		$scope.isLineActive = function(line) {
			return $scope.line === line;
		};

		$scope.isRangeActive = function(year, month) {
			var range = getRangeValue(year, month);
			return $scope.range === range;
		};

		//----------------------------------------
		// Init
		//----------------------------------------

		// get state params
		if ($state.params.username.length > 0) {
			$scope.username = $state.params.username;
		}

		// init chart
		initChart();

		// after getting user
		$scope.getUser().then(function() {
			$scope.onClickDailyLine();
		});

	}]);
