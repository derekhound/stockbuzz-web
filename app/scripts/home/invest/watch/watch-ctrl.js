'use strict';

angular.module('invest')

	.controller('invWatchCtrl', ['$scope', '$modal', '$translate', 'resInvest', function($scope, $modal, $translate, resInvest) {

		//----------------------------------------
		// Define
		//----------------------------------------

		$scope.groups = [];
		$scope.active_group_id = 0;     // 'all' group_id

		$scope.records = [];

		$scope.pagingOptions = {
			totalServerItems: 0,
			totalDisplayItems: 0,
			pageSizes: [20, 40],
			pageSize: 20,
			numPages: 0,
			currentPage: 1
		};

		//----------------------------------------
		// Watch Group Function
		//----------------------------------------

		// get watch groups
		$scope.getWatchGroups = function() {
			return resInvest.get_watch_groups().then(function(data) {
				if (data.success && data.groups.length > 0) {
					// system watch groups: [0, 99]
					// user watch groups: [100, -]
					data.groups.forEach(function(elem) {
						if (elem.group_id < 100) {
							var str = 'invest.watch.group.default.' + elem.name;
							elem.name = $translate.instant(str);
						}
					});
					// set
					$scope.groups = data.groups;
				}
			});
		};

		$scope.addGroup = function() {
			// open modal
			var modalInstance = $modal.open({
				backdrop: true,
				keyboard: true,
				windowClass: 'qb-modal',
				templateUrl:  'scripts/home/invest/watch/edit-group-modal.html',
				controller: 'invEditGroupModalCtrl',
				resolve: {
					mode: function () {
						return 'add';
					},
					group: function() {
						return {};
					}
				}
			});

			// modal result
			modalInstance.result
				// ok
				.then(function(reason) {
					$scope.getWatchGroups();
				// cancel
				}, function(reason) {

				});
		};

		$scope.editGroup = function() {
			// find active group
			var active_group;
			$scope.groups.forEach(function(elem) {
				if (elem.group_id === $scope.active_group_id) {
					active_group = elem;
				}
			});

			// open modal
			var modalInstance = $modal.open({
				backdrop: true,
				keyboard: true,
				windowClass: 'qb-modal',
				templateUrl:  'scripts/home/invest/watch/edit-group-modal.html',
				controller: 'invEditGroupModalCtrl',
				resolve: {
					mode: function () {
						return 'edit';
					},
					group: function() {
						return active_group;
					}
				}
			});

			// modal result
			modalInstance.result
				// ok
				.then(function(reason) {
					$scope.getWatchGroups();
				// cancel
				}, function(reason) {

				});
		};

		$scope.deleteGroup = function() {
			// find active group
			var active_group;
			$scope.groups.forEach(function(elem) {
				if (elem.group_id === $scope.active_group_id) {
					active_group = elem;
				}
			});

			// open modal
			var modalInstance = $modal.open({
				backdrop: true,
				keyboard: true,
				windowClass: 'qb-modal',
				templateUrl:  'scripts/home/invest/watch/delete-group-modal.html',
				controller: 'invDeleteGroupModalCtrl',
				resolve: {
					group: function() {
						return active_group;
					}
				}
			});

			// modal result
			modalInstance.result
				// ok
				.then(function(reason) {
					$scope.getWatchGroups();
					$scope.selectDefaultGroup();
					$scope.getGridData();

				// cancel
				}, function(reason) {

				});
		};

		$scope.reorderGroup = function() {
			// open modal
			var modalInstance = $modal.open({
				backdrop: true,
				keyboard: true,
				windowClass: 'qb-modal',
				size: 'sm',
				templateUrl:  'scripts/home/invest/watch/reorder-group-modal.html',
				controller: 'invReorderGroupModalCtrl',
				resolve: {
					groups: function() {
						return $scope.groups;
					}
				}
			});

			// modal result
			modalInstance.result
				// ok
				.then(function(reason) {
					$scope.getWatchGroups();
				// cancel
				}, function(reason) {

				});
		};

		$scope.selectDefaultGroup = function() {
			$scope.active_group_id = 0;
		};

		$scope.selectGroup = function(group_id) {
			if ($scope.active_group_id !== group_id) {
				$scope.active_group_id = group_id;
				$scope.pagingOptions.currentPage = 1;
				$scope.getGridData();
			}
		};

		//----------------------------------------
		// Watch Function
		//----------------------------------------

		// get grid data
		$scope.getGridData = function() {
			var group_id = $scope.active_group_id;
			var offset   = ($scope.pagingOptions.currentPage - 1) * $scope.pagingOptions.pageSize;
			var limit    = $scope.pagingOptions.pageSize;

			return resInvest.get_watches(group_id, offset, limit).then(function(data) {
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

		$scope.add = function() {
			// open modal
			var modalInstance = $modal.open({
				backdrop: true,
				keyboard: true,
				windowClass: 'qb-modal',
				templateUrl:  'scripts/home/invest/watch/edit-watch-modal.html',
				controller: 'invEditWatchModalCtrl',
				resolve: {
					mode: function () {
						return 'add';
					},
					groups: function() {
						return $scope.groups;
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
				templateUrl:  'scripts/home/invest/watch/edit-watch-modal.html',
				controller: 'invEditWatchModalCtrl',
				resolve: {
					mode: function () {
						return 'edit';
					},
					groups: function() {
						return $scope.groups;
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
				templateUrl:  'scripts/home/invest/watch/delete-watch-modal.html',
				controller: 'invDeleteWatchModalCtrl',
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

		//----------------------------------------
		// Appearance Function
		//----------------------------------------

		$scope.getPriceStr = function(val) {
			if (val === null) {
				return '--';
			}
			return val;
		};

		$scope.getChangeStyle = function(value) {
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

		$scope.getBuyPriceStyle = function(record) {
			if (record.buy_price == null) {
				return '';
			}

			if (record.last_trade_price <= record.buy_price) {
				return 'buy-price-highlight';
			}

			var percent = (record.last_trade_price - record.buy_price) / record.buy_price;
			if (Math.abs(percent) < 0.1) {
				return 'price-up';
			}

			return '';
		};

		$scope.getSellPriceStyle = function(record) {
			if (record.sell_price == null) {
				return '';
			}

			if (record.last_trade_price >= record.sell_price) {
				return 'sell-price-highlight';
			}

			var percent = (record.last_trade_price - record.sell_price) / record.sell_price;
			if (Math.abs(percent) < 0.1) {
				return 'price-down';
			}

			return '';
		};

		//----------------------------------------
		// Init
		//----------------------------------------

		$scope.getWatchGroups()
			.then($scope.getGridData);
	}]);
