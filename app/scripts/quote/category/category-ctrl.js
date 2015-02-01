'use strict';

angular.module('quote')

	.controller('quoCategoryCtrl', ['$scope', '$translate', '$state', 'resStock', 'qbNotice', function($scope, $translate, $state, resStock, qbNotice) {

		//----------------------------------------
		// Define
		//----------------------------------------

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

		$scope.data = {
			country: 'tw',
			market: 'tw_twse',
			type: 'tw_stock',
			group_id: ''
		};

		$scope.groups = [];

		//----------------------------------------
		// Main
		//----------------------------------------

		$scope.init_groups = function() {
			var group_ids = [
				1, 2, 3, 4, 5, 6, 8, 9,
				10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
				20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
				30, 31, 32
			];

			group_ids.forEach(function(elem) {
				var name = $translate.instant('search.stock.filter.group.' + elem);
				$scope.groups.push({value: elem, name: name});
			});
		};

		// watch data change
		$scope.$watch('data', function(newValue, oldValue) {
			if (newValue !== oldValue) {
				// reset
				$scope.reset();
				// get grid data
				$scope.getGridData();
			}
		}, true);

		$scope.reset = function() {
			$scope.pagingOptions.currentPage = 1;
		};

		//----------------------------------------
		// Grid
		//----------------------------------------

		$scope.getGridData = function() {
			var country     = ($scope.data.country === '') ? null : $scope.data.country;
			var market      = ($scope.data.market === '') ? null : $scope.data.market;
			var type        = ($scope.data.type === '') ? null : $scope.data.type;
			var group_id    = ($scope.data.group_id === '') ? null : $scope.data.group_id;
			var sidx        = $scope.sortInfo.fields[0];
			var sord        = $scope.sortInfo.directions[0];
			var offset      = ($scope.pagingOptions.currentPage - 1) * $scope.pagingOptions.pageSize;
			var limit       = $scope.pagingOptions.pageSize;

			resStock.get_quotes_by_page(country, market, type, group_id, sidx, sord, offset, limit).then(function(data) {
				// set grid data
				$scope.pagingOptions.totalServerItems   = data.totalRecords;
				$scope.pagingOptions.totalDisplayItems  = data.totalDisplayRecords;
				$scope.pagingOptions.numPages           = Math.ceil(data.totalDisplayRecords / $scope.pagingOptions.pageSize);
				$scope.records                          = data.records;
			});
		};

		// page changed
		$scope.pageChanged = function(page) {
			$scope.getGridData();
		};

		//----------------------------------------
		// Appearance Function
		//----------------------------------------

		$scope.upDown = function(value) {
			var str = '';
			if (value > 0) {
				str = 'price-up';
			} else if (value < 0) {
				str = 'price-down';
			}
			return str;
		};

		$scope.positiveSign = function(value) {
			if (value > 0) {
				return '+';
			}
			return '';
		};

		//----------------------------------------
		// Init
		//----------------------------------------

		// init group
		$scope.init_groups();

		// get grid data
		$scope.getGridData();

	}]);