'use strict';

angular.module('invest')

	.controller('invNowProfitCtrl', ['$scope', '$location', 'resInvest', function($scope, $location, resInvest) {

		//----------------------------------------
		// Define
		//----------------------------------------

		$scope.running = 1;

		$scope.records = [];

		$scope.pagingOptions = {
			totalServerItems: 0,
			totalDisplayItems: 0,
			pageSizes: [20, 40],
			pageSize: 20,
			numPages: 0,
			currentPage: 1
		};

		$scope.sortInfo = {
			fields: ['symbol_id'],
			directions: ['asc']
		};

		$scope.summary = {
			keep_total: 0,
			current_total: 0,
			profit: 0,
			percent_profit: 0
		};

		//----------------------------------------
		// Main Function
		//----------------------------------------

		// get grid data
		$scope.getGridData = function() {
			var running     = $scope.running;
			var sidx        = $scope.sortInfo.fields[0];
			var sord        = $scope.sortInfo.directions[0];
			var offset      = ($scope.pagingOptions.currentPage - 1) * $scope.pagingOptions.pageSize;
			var limit       = $scope.pagingOptions.pageSize;

			return resInvest.get_profits(running, sidx, sord, offset, limit).then(function(data) {
				// set grid data
				$scope.pagingOptions.totalServerItems   = data.totalRecords;
				$scope.pagingOptions.totalDisplayItems  = data.totalDisplayRecords;
				$scope.pagingOptions.numPages           = Math.ceil(data.totalDisplayRecords / $scope.pagingOptions.pageSize);
				$scope.records                          = data.records;
			});
		};

		// page changed
		$scope.pageChanged = function() {
			$scope.getGridData();
		};

		// get summary
		$scope.getSummary = function() {
			var running = $scope.running;
			return resInvest.get_profit_summary(running).then(function(data) {
				if (data.success) {
					$scope.summary = data.summary;
				}
			});
		};

		//----------------------------------------
		// Action Function
		//----------------------------------------

		$scope.lookup = function(record) {
			var url = '/home/invest/transaction/' + record.symbol_id + '/' + $scope.running;
			$location.path(url);
		};

		//----------------------------------------
		// Appearance Function
		//----------------------------------------

		$scope.upDown = function(value) {
			var str = (value >= 0) ? 'price-up' : 'price-down';
			return str;
		};

		$scope.positiveSign = function(value) {
			var str = (value > 0) ? '+' : '';
			return str;
		};

		//----------------------------------------
		// Init
		//----------------------------------------

		// get grid data, and then get summary data
		$scope.getGridData()
			.then($scope.getSummary);
	}]);