'use strict';

angular.module('invest')

	.controller('invTransactionCtrl', ['$scope', '$state', '$modal', '$translate', 'resInvest', function($scope, $state, $modal, $translate, resInvest) {

		//----------------------------------------
		// Translate
		//----------------------------------------

		var str_running = $translate.instant('invest.text.running');
		var str_finish  = $translate.instant('invest.text.finish');

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
			fields: ['tranx_date'],
			directions: ['desc']
		};

		$scope.data = {
			symbol_id: '-1',
			state: '-1'
		};

		$scope.symbols = [];

		//----------------------------------------
		// Main Function
		//----------------------------------------

		// get grid data
		$scope.getGridData = function() {
			var symbol_id   = ($scope.data.symbol_id === '-1') ? null : $scope.data.symbol_id;
			var running     = ($scope.data.state === '-1') ? null : $scope.data.state;
			var filter      = null;
			var sidx        = $scope.sortInfo.fields[0];
			var sord        = $scope.sortInfo.directions[0];
			var offset      = ($scope.pagingOptions.currentPage - 1) * $scope.pagingOptions.pageSize;
			var limit       = $scope.pagingOptions.pageSize;

			resInvest.get_transactions(symbol_id, running, filter, sidx, sord, offset, limit).then(function(data) {
				// set grid data
				$scope.pagingOptions.totalServerItems   = data.totalRecords;
				$scope.pagingOptions.totalDisplayItems  = data.totalDisplayRecords;
				$scope.pagingOptions.numPages           = Math.ceil(data.totalDisplayRecords / $scope.pagingOptions.pageSize);
				$scope.records                          = data.records;
			});
		};

		// get symbols
		$scope.getSymbols = function() {
			resInvest.get_symbols_in_transactions().then(function(data) {
				$scope.symbols = data.symbols;
			});
		};

		// detect symbol change
		$scope.$watch('data.symbol_id', function(newValue, oldValue){
			if (newValue === oldValue) {
				return;
			}
			$scope.getGridData();
		});

		// detect state change
		$scope.$watch('data.state', function(newValue, oldValue){
			if (newValue === oldValue) {
				return;
			}
			$scope.getGridData();
		});

		// page changed
		$scope.pageChanged = function() {
			$scope.getGridData();
		};

		//----------------------------------------
		// Action Functions
		//----------------------------------------

		$scope.add = function() {
			// open modal
			var modalInstance = $modal.open({
				backdrop: true,
				keyboard: true,
				windowClass: 'qb-modal',
				templateUrl:  'scripts/home/invest/transaction/edit-tranx-modal.html',
				controller: 'invEditTranxModalCtrl',
				resolve: {
					mode: function () {
						return 'add';
					},
					record: function() {
						return {};
					}
				}
			});

			// modal result
			modalInstance.result
				// ok
				.then(function(reason) {
					$scope.getGridData();
				// cancel
				}, function(reason) {

				});
		};

		$scope.edit = function(record) {
			// open modal
			var modalInstance = $modal.open({
				backdrop: true,
				keyboard: true,
				windowClass: 'qb-modal',
				templateUrl:  'scripts/home/invest/transaction/edit-tranx-modal.html',
				controller: 'invEditTranxModalCtrl',
				resolve: {
					mode: function () {
						return 'edit';
					},
					record: function() {
						return record;
					}
				}
			});

			// modal result
			modalInstance.result
				// ok
				.then(function(reason) {
					$scope.getGridData();
				// cancel
				}, function(reason) {

				});
		};

		$scope.delete = function(record) {
			// open modal
			var modalInstance = $modal.open({
				backdrop: true,
				keyboard: true,
				windowClass: 'qb-modal',
				templateUrl:  'scripts/home/invest/transaction/delete-tranx-modal.html',
				controller: 'invDeleteTranxModalCtrl',
				resolve: {
					record: function() {
						return record;
					}
				}
			});

			// modal result
			modalInstance.result
				// ok
				.then(function(reason) {
					$scope.getGridData();
				// cancel
				}, function(reason) {

				});
		};

		// detect
		$scope.detect = function() {
			resInvest.detect_running_state().then(function(data) {
				if (data.success) {
					$scope.getGridData();
				}
				});
		};

		// toggle running
		$scope.toggleRunning = function(record) {
			if (record.running) {
				resInvest.delete_running_state(record.tranx_id).then(function(data) {
					record.running = 0;
				});
			} else {
				resInvest.add_running_state(record.tranx_id).then(function(data) {
					record.running = 1;
				});
			}
		};

		//----------------------------------------
		// Appearance Function
		//----------------------------------------

		// get state string
		$scope.getStateStr = function(running) {
			var str = running ? str_running : str_finish;
			return str;
		};

		//----------------------------------------
		// Init
		//----------------------------------------

		// assign state params
		if ($state.params.symbol_id.length > 0) {
			$scope.data.symbol_id = $state.params.symbol_id;
		}
		if ($state.params.state.length > 0) {
			$scope.data.state = $state.params.state;
		}

		// get grid data
		$scope.getGridData();

		// get symbols
		$scope.getSymbols();
	}]);
