'use strict';

angular.module('home')

	.controller('homPortalHotNewsCtrl', ['$scope', '$state', 'resTimeline', 'resUser', function($scope, $state, resTimeline, resUser) {

		//----------------------------------------
		// Define
		//----------------------------------------

		$scope.currentUser = resUser.getDefaultUser();

		$scope.posts = [];

		//----------------------------------------
		// Main Function
		//----------------------------------------

		$scope.getCurrentUser = function() {
			resUser.getCurrentUser().then(function(data){
				$scope.currentUser = data;
			});
		};

		$scope.getFeedPosts = function() {
			var category    = 'news';
			var sidx        = 'hot';
			var since_id    = false;
			var count       = 5;
			var user_id     = 1;        // stockbuzz user_id

			resTimeline.get_system_feed_short_posts(category, sidx, since_id, count, user_id).then(function(data) {
				if (data.success) {
					$scope.posts = data.posts;
				}
			});
		};

		//----------------------------------------
		// Init
		//----------------------------------------

		// get current user
		$scope.getCurrentUser();

		// get post from feed
		$scope.getFeedPosts();
	}]);
