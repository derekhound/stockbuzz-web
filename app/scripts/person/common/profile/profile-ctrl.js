'use strict';

angular.module('person')

	.controller('perProfileCtrl', ['$scope', '$state', '$location', '$translate', 'resUser', 'resSocial', 'resInvest', function($scope, $state, $location, $translate, resUser, resSocial, resInvest) {

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

		$scope.analysis = null;

		$scope.data = {
			website: '',
			biographic: ''
		};

		//----------------------------------------
		// Main Function
		//----------------------------------------

		$scope.getCurrentUser = function() {
			resUser.getCurrentUser().then(function(data){
				$scope.currentUser = data;
			});
		};

		$scope.getUser = function() {
			return resUser.getUserByUsername($scope.username).then(function(data){
				if (data) {
					$scope.user = data;

					// update status
					if ($scope.user.user_id === $scope.currentUser.user_id) {
						$scope.status.is_self = true;
					}
				}
			});
		};

		//----------------------------------------
		// Follow Function
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
				$location.path('/setting/profile');

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
				str = $translate.instant('person.btn_follow.edit');

			} else if ($scope.status.is_follow) {
				str = $translate.instant('person.btn_follow.follow');

			}  else if (!$scope.status.is_follow) {
				str = $translate.instant('person.btn_follow.unfollow');
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
		// Analysis Function
		//----------------------------------------

		$scope.getAnalyses = function() {
			return resInvest.get_analyses($scope.user.user_id).then(function(data){
				if (data.success && data.analyses.length > 0) {
					$scope.analysis = data.analyses[0];
				}
			});
		};

		$scope.showProfit = function() {
			if ($scope.analysis) {
				if ($scope.analysis.profit_30 === 0 &&
					$scope.analysis.profit_90 === 0 &&
					$scope.analysis.profit_365 === 0) {
					return false;
				}
				return true;
			}
			return false;
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
			if ($scope.user.user_id !== '') {
				$scope.isFollowStatus();
				$scope.getAnalyses();
			}
		});
	}]);
