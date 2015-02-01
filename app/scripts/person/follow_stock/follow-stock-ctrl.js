'use strict';

angular.module('person')

	.controller('perFollowStockCtrl', ['$scope', '$state', '$location', '$translate', 'resUser', 'resSocial', function($scope, $state, $location, $translate, resUser, resSocial) {

		//----------------------------------------
		// Define
		//----------------------------------------

		$scope.currentUser = resUser.getDefaultUser();

		$scope.username = null;
		$scope.user     = resUser.getDefaultUser();

		$scope.list = {
			target_type: 'stock',       // 'person', 'stock', 'community'
			target_id: -1,
			since_id: false,
			count: 20,
			items: []
		};

		$scope.busy = true;

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
					$scope.list.target_id = data.user_id;
				}
			});
		};

		$scope.getList = function() {
			// if busy, skip request
			if ($scope.busy) {
				return;
			}
			$scope.busy = true;

			// fire
			var follow_type = 'stock';
			var user_id     = $scope.list.target_id;
			resSocial.get_followings_by_page(follow_type, $scope.list.since_id, $scope.list.count, user_id).then(function(data) {
				if (data.success && data.follows.length > 0) {
					// add cards to the end of card array
					data.follows.forEach(function(elem, index) {
						$scope.list.items.push(elem);
					});
					// update since_id
					var last = data.follows.length - 1;
					$scope.list.since_id = data.follows[last].user_id;
					// update busy
					$scope.busy = false;
				}
			});
		};

		//----------------------------------------
		// Follow Functions
		//----------------------------------------

		$scope.toggleFollow = function(item) {
			var follow_id;

			if (item.user_id === $scope.currentUser.user_id) {
				$location.path('/setting/profile');

			} else if (item.is_follow) {
				follow_id = item.user_id;
				resSocial.delete_follow(follow_id).then(function(data){
					if (data.success) {
						item.is_follow = false;
					}
				});

			}  else if (!item.is_follow) {
				follow_id = item.user_id;
				resSocial.add_follow(follow_id).then(function(data){
					if (data.success) {
						item.is_follow = true;
					}
				});
			}
		};

		$scope.getFollowBtnString = function(item) {
			var str;

			if (item.user_id === $scope.currentUser.user_id) {
				str = $translate.instant('person.btn_follow.edit');

			} else if (item.is_follow) {
				str = $translate.instant('person.btn_follow.follow');

			}  else if (!item.is_follow) {
				str = $translate.instant('person.btn_follow.unfollow');
			}

			return str;
		};

		$scope.getFollowBtnStyle = function(item) {
			var str;

			if (item.user_id === $scope.currentUser.user_id) {
				str = 'btn-default hide';

			} else if (item.is_follow) {
				str = 'btn-primary';

			}  else if (!item.is_follow) {
				str = 'btn-default';
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

		// get user and get post from feed
		$scope.getUser().then(function(){
			if ($scope.user.user_id !== '') {
				$scope.busy = false;
				$scope.getList();
			}
		});
	}]);
