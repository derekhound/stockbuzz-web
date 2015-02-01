'use strict';

angular.module('invest')

	.controller('invEditTranxModalCtrl', ['$scope', '$filter', '$translate', '$modalInstance', 'resStock', 'resInvest', 'mode', 'record', function($scope, $filter, $translate, $modalInstance, resStock, resInvest, mode, record) {

		//----------------------------------------
		// Translate
		//----------------------------------------

		var str_add_tranx   = $translate.instant('invest.transaction.edit_tranx_modal.add_tranx');
		var str_edit_tranx  = $translate.instant('invest.transaction.edit_tranx_modal.edit_tranx');

		//----------------------------------------
		// Define
		//----------------------------------------

		$scope.mode = mode;

		// default data value
		$scope.data = {
			tranx_id: '',
			tranx_date: new Date(),
			type_id: 0,
			symbol_id: '',
			share: 1000,
			price: '',
			comm_fee: '',
			tranx_fee: '',
			total: '',
			running: 1
		};

		// default show value
		$scope.show = {
			share: true,
			price: true,
			comm_fee: true,
			tranx_fee: false,
			total: true
		};

		//----------------------------------------
		// title
		//----------------------------------------

		$scope.getTitleStr = function() {
			var str = (mode === 'add') ? str_add_tranx : str_edit_tranx;
			return str;
		};

		//----------------------------------------
		// tranx_date
		//----------------------------------------

		// workaround: we must pust opened property in a object
		$scope.timepicker = {
			opened: false
		};

		$scope.openTimepicker = function($event) {
			$event.preventDefault();
			$event.stopPropagation();

			$scope.timepicker.opened = true;
		};

		$scope.getToday = function() {
			var t = new Date();
			var y = t.getFullYear();
			var m = t.getMonth() + 1;
			var d = t.getDate();
			var str = y + '-' + m + '-' + d;
			return str;
		};

		//----------------------------------------
		// type
		//----------------------------------------

		$scope.$watch('data.type_id', function(newVal, oldVal) {
			var type_id = parseInt(newVal, 10);

			for (var prop in $scope.show) {
				$scope.show[prop] = true;
			}

			switch (type_id) {
			case 0:
				$scope.data.tranx_fee   = '';
				$scope.show.tranx_fee   = false;
				break;
			case 1:
				break;
			case 2:
				$scope.data.price       = '';
				$scope.data.comm_fee    = '';
				$scope.data.tranx_fee   = '';
				$scope.data.total       = '';
				$scope.show.price       = false;
				$scope.show.comm_fee    = false;
				$scope.show.tranx_fee   = false;
				$scope.show.total       = false;
				break;
			case 3:
				$scope.data.share       = '';
				$scope.data.price       = '';
				$scope.data.comm_fee    = '';
				$scope.data.tranx_fee   = '';
				$scope.show.price       = false;
				$scope.show.share       = false;
				$scope.show.comm_fee    = false;
				$scope.show.tranx_fee   = false;
				break;
			}
		});

		//----------------------------------------
		// symbol
		//----------------------------------------

		$scope.searchSymbol = function(query) {
			var filter = {
				country: 'tw'
			};
			var since_id = false;
			var count 	 = 10;

			return resStock.search(query, filter, since_id, count).then(function(data) {
				var users = [];
				if (data.success) {
					users = data.users;
				}
				return users;
			});
		};

		//----------------------------------------
		// share
		//----------------------------------------

		$scope.addShare = function(value) {
			var share = isNaN(parseInt($scope.data.share, 10)) ? 0 : parseInt($scope.data.share, 10);
			$scope.data.share = share + value * 1000;
		};

		//----------------------------------------
		// Price
		//----------------------------------------

		$scope.currentPrice = function(symbol_id) {
			// check
			if (symbol_id === '') {
				return;
			}
			// parse symbol_id token
			var tokens = symbol_id.split(' ');
			symbol_id = tokens[0];
			// fire request
			return resStock.get_quote_prices(symbol_id).then(function(data) {
				if (data.success) {
					$scope.data.price = data.prices[0].last_trade_price;
				}
			});
		};

		$scope.autoCalculate = function() {
			// get values
			var type_id     = parseInt($scope.data.type_id, 10);
			var share       = isNaN(parseInt($scope.data.share, 10))      ? 0 : parseInt($scope.data.share, 10);
			var price       = isNaN(parseFloat($scope.data.price, 10))    ? 0 : parseFloat($scope.data.price, 10);
			var comm_fee    = isNaN(parseInt($scope.data.comm_fee, 10))   ? 0 : parseInt($scope.data.comm_fee, 10);
			var tranx_fee   = isNaN(parseInt($scope.data.tranx_fee, 10))  ? 0 : parseInt($scope.data.tranx_fee, 10);
			var total       = isNaN(parseInt($scope.data.total, 10))      ? 0 : parseInt($scope.data.total, 10);
			// calculate
			var sum         = share * price;
			if (type_id === 0) {
				comm_fee    = Math.round(sum * 0.001425);
				tranx_fee   = 0;
				total       = Math.round(sum) + comm_fee + tranx_fee;
			} else if (type_id === 1) {
				comm_fee    = Math.round(sum * 0.001425);
				tranx_fee   = Math.round(sum * 0.003);
				total       = Math.round(sum) - comm_fee - tranx_fee;
			}
			// set values
			$scope.data.comm_fee  = comm_fee;
			$scope.data.tranx_fee = tranx_fee;
			$scope.data.total     = total;
		};

		//----------------------------------------
		// Event Callback
		//----------------------------------------

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};

		$scope.ok = function() {
			var fn = ($scope.mode === 'add') ? resInvest.add_transaction : resInvest.update_transaction;
			// copy data
			var data = angular.copy($scope.data);
			// convert trans_date format
			data.tranx_date = $filter('date')(data.tranx_date, 'yyyy-MM-dd');
			// parse symbol_id token
			var tokens = data.symbol_id.split(' ');
			data.symbol_id = tokens[0];
			// fire request
			return fn(data).then(function(data) {
				if (data.success) {
					// close dialog
					$modalInstance.close('ok');
				}
			});
		};

		//----------------------------------------
		// Init
		//----------------------------------------

		if (mode === 'add') {
			if (angular.isDefined(record.symbol_id) && angular.isDefined(record.name)) {
				$scope.data.symbol_id = record.symbol_id + ' ' + record.name;
			}
		}

		if (mode === 'edit') {
			// overwrite data value
			angular.extend($scope.data, record);
			$scope.data.symbol_id = record.symbol_id + ' ' + record.name;
		}
	}]);
