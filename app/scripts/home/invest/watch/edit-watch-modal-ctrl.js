'use strict';

angular.module('invest')

	.controller('invEditWatchModalCtrl', ['$scope', '$filter', '$translate', '$modalInstance', 'resStock', 'resInvest', 'mode', 'groups', 'record', function($scope, $filter, $translate, $modalInstance, resStock, resInvest, mode, groups, record) {

		//----------------------------------------
		// Translate
		//----------------------------------------

		var str_add_watch   = $translate.instant('invest.watch.edit_watch_modal.add_watch');
		var str_edit_watch  = $translate.instant('invest.watch.edit_watch_modal.edit_watch');

		//----------------------------------------
		// Define
		//----------------------------------------

		$scope.mode = mode;
		$scope.groups = [];

		// form data
		$scope.data = {
			symbol_id: '',
			buy_price: '',
			sell_price: '',
			group_ids: []
		};

		//----------------------------------------
		// Main Function
		//----------------------------------------

		var setGroup = function() {
			// system watch groups: [0, 99]
			// user watch groups: [100, -]
			groups.forEach(function(elem) {
				if (elem.group_id >= 100) {
					$scope.groups.push(elem);
				}
			});
		};

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

		$scope.belongWhichWatchGroup = function() {
			// parse symbol_id token
			var tokens = $scope.data.symbol_id.split(' ');
			var symbol_id = tokens[0];

			resInvest.belong_which_watch_groups(symbol_id).then(function(data) {
				if (data.success) {
					$scope.data.group_ids = [];
					data.groups.forEach(function(elem) {
						if (elem.group_id >= 100) {
							$scope.data.group_ids.push(elem.group_id);
						}
					});
				}
			});
		};

		//----------------------------------------
		// Appearance Function
		//----------------------------------------

		$scope.getTitleStr = function() {
			var str = (mode === 'add') ? str_add_watch : str_edit_watch;
			return str;
		};

		//----------------------------------------
		// Event Callback
		//----------------------------------------

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};

		$scope.ok = function() {
			var fn = ($scope.mode === 'add') ? resInvest.add_watch : resInvest.update_watch;
			// symbol_id
			var tokens = $scope.data.symbol_id.split(' ');
			var symbol_id = tokens[0];
			//  other params
			var buy_price  = $scope.data.buy_price;
			var sell_price = $scope.data.sell_price;
			var group_ids  = $scope.data.group_ids;
			// fire request
			return fn(symbol_id, buy_price, sell_price, group_ids).then(function(data) {
				if (data.success) {
					// close dialog
					$modalInstance.close('ok');
				}
			});
		};

		//----------------------------------------
		// Init
		//----------------------------------------

		// set group
		setGroup();

		// edit
		if (mode === 'edit') {
			// overwrite form data
			$scope.data.symbol_id  = record.symbol_id + ' ' + record.name;
			$scope.data.buy_price  = record.buy_price;
			$scope.data.sell_price = record.sell_price;

			// get this symbol_id that belongs to which watch groups
			$scope.belongWhichWatchGroup();
		}
	}]);
