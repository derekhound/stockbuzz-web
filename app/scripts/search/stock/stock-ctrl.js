'use strict';

angular.module('search')

	.controller('seaStockCtrl', ['$scope', '$state', '$translate', 'resStock', function($scope, $state, $translate, resStock) {

		//----------------------------------------
		// Define
		//----------------------------------------

		$scope.data = {
			query: ''
		};

		$scope.filter = {
			country: 'tw',
			market: '',
			type: '',
			group_id: ''
		};

		$scope.list = {
			since_id: false,
			count: 20,
			items: []
		};
		$scope.busy = true;

		$scope.groups = [];

		//----------------------------------------
		// Query Panel
		//----------------------------------------

		$scope.isActive = function(state) {
			return $state.is(state);
		};

		$scope.ok = function() {
			// reset
			$scope.reset();
			// get list
			$scope.busy = false;
			$scope.getList();
		};

		//----------------------------------------
		// Filter Panel
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

		$scope.$watch('filter', function(newValue, oldValue) {
			if (newValue !== oldValue) {
				// reset
				$scope.reset();
				// get list
				$scope.busy = false;
				$scope.getList();
			}

		}, true);

		//----------------------------------------
		// Result Panel
		//----------------------------------------

		$scope.reset = function() {
			$scope.list.since_id = false;
			$scope.list.items = [];
		};

		$scope.getList = function() {
			// if busy, skip request
			if ($scope.busy) {
				return;
			}
			$scope.busy = true;

			// fire
			resStock.search($scope.data.query, $scope.filter, $scope.list.since_id, $scope.list.count).then(function(data) {
				if (data.success && data.users.length > 0) {
					// add cards to the end of card array
					data.users.forEach(function(elem) {
						$scope.list.items.push(elem);
					});
					// update since_id
					var last = data.users.length - 1;
					$scope.list.since_id = data.users[last].user_id;
					// update busy
					$scope.busy = false;
				}
			});
		};

		//----------------------------------------
		// Init
		//----------------------------------------

		// init group
		$scope.init_groups();

		// get list
		$scope.busy = false;
		$scope.getList();

	}]);