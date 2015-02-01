'use strict';

angular.module('stock')

	.controller('stoProfileCtrl', ['$scope', '$state', '$location', '$translate', '$modal', 'resUser', 'resStock', 'resSocial', function($scope, $state, $location, $translate, $modal, resUser, resStock, resSocial) {

		//----------------------------------------
		// Define
		//----------------------------------------

		$scope.currentUser = resUser.getDefaultUser();

		$scope.username = null;
		$scope.user     = resUser.getDefaultUser();

		$scope.status = {
			is_self: false,
			is_follow: false
		};

		$scope.quote = null;

		//----------------------------------------
		// Main
		//----------------------------------------

		$scope.getCurrentUser = function() {
			resUser.getCurrentUser().then(function(data){
				$scope.currentUser = data;
			});
		};

		$scope.getUser = function() {
			return resUser.getUserByUsername($scope.username).then(function(data){
				$scope.user = data;

				// update status
				if ($scope.user.user_id === $scope.currentUser.user_id) {
					$scope.status.is_self = true;
				}
			});
		};

		//----------------------------------------
		// Quote
		//----------------------------------------

		$scope.getQuotes = function() {
			var symbol_id = $scope.user.username;
			resStock.get_quotes(symbol_id).then(function(data) {
				if (data.success) {
					$scope.quote = data.quotes[0];
				}
			});
		};

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

		$scope.getLastTradeTime = function() {
			var date = new Date();
			var gmt  = date.getTimezoneOffset() / 60 * (-1);
			var gmt_str = (gmt >= 0) ? '+' + gmt : gmt;
			return $scope.quote.last_trade_time + ' (GMT' + gmt_str + ')';
		};

		//----------------------------------------
		// Follow
		//----------------------------------------

		$scope.isFollowStatus = function() {
			if ($scope.status.is_self) {
				return;
			}

			var follow_id = $scope.user.user_id;
			return resSocial.is_follow_status(follow_id).then(function(data){
				if (data.success) {
					$scope.status.is_follow = data.is_follow;
				}
			});
		};

		$scope.toggleFollow = function() {
			var follow_id;

			if ($scope.status.is_self) {
				$location.path('/home/setting/profile');

			} else if ($scope.status.is_follow) {
				follow_id = $scope.user.user_id;
				resSocial.delete_follow(follow_id).then(function(data){
					if (data.success) {
						$scope.status.is_follow = false;
					}
				});

			}  else if (!$scope.status.is_follow) {
				follow_id = $scope.user.user_id;
				resSocial.add_follow(follow_id).then(function(data){
					if (data.success) {
						$scope.status.is_follow = true;
					}
				});
			}
		};

		$scope.getFollowBtnString = function() {
			var str;

			if ($scope.status.is_self) {
				str = $translate.instant('stock.btn_follow.edit');

			} else if ($scope.status.is_follow) {
				str = $translate.instant('stock.btn_follow.follow');

			}  else if (!$scope.status.is_follow) {
				str = $translate.instant('stock.btn_follow.unfollow');
			}

			return str;
		};

		$scope.getFollowBtnStyle = function() {
			var str;

			if ($scope.status.is_self) {
				str = 'btn-primary';

			} else if ($scope.status.is_follow) {
				str = 'btn-primary';

			}  else if (!$scope.status.is_follow) {
				str = 'btn-default';
			}

			return str;
		};

		//----------------------------------------
		// Trade
		//----------------------------------------

		$scope.trade = function() {
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
						return {
							symbol_id: $scope.user.username,
							name: $scope.user.fullname
						};
					}
				}
			});

			// modal result
			modalInstance.result
				// ok
				.then(function(reason) {

				// cancel
				}, function(reason) {

				});
		};

		//----------------------------------------
		// Init
		//----------------------------------------

		// get target username
		if ($state.params.username.length > 0) {
			$scope.username = $state.params.username;
		}

		// get current user
		$scope.getCurrentUser();

		// get user
		$scope.getUser().then(function() {
			$scope.getQuotes();
			$scope.isFollowStatus();
		});
	}]);
