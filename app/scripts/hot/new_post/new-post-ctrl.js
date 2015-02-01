'use strict';

angular.module('hot')

	.controller('hotNewPostCtrl', ['$scope', '$state', 'qbTimelineService', 'resUser', function($scope, $state, qbTimelineService, resUser) {

		//----------------------------------------
		// Define
		//----------------------------------------

		$scope.currentUser = resUser.getDefaultUser();

		$scope.feed = {
			target_id: 1,			// stockbuzz user_id
			category: 'all',
			sidx: 'time',
			since_id: false,
			posts: [],
			permission: {
				post_box: false,
				comment_box: true
			}
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

		$scope.getFeedPosts = function() {
			// if busy, skip request
			if ($scope.busy) {
				return;
			}
			$scope.busy = true;

			// fire
			qbTimelineService.getSystemFeedPost($scope.feed).then(function(more){
				if (more) {
					$scope.busy = false;
				}
			});
		};

		$scope.isActive = function(state) {
			return $state.is(state);
		};

		//----------------------------------------
		// Common Function
		//----------------------------------------

		$scope.submitPost = function(title, text, photos) {
			return qbTimelineService.submitPost($scope.feed, title, text, photos);
		};

		$scope.submitComment = function(text, rank_id) {
			return qbTimelineService.submitComment($scope.feed, text, rank_id);
		};

		$scope.showComment = function(rank_id) {
			qbTimelineService.showComment($scope.feed, rank_id);
		};

		$scope.getUnreadComment = function(rank_id) {
			qbTimelineService.getUnreadComment($scope.feed, rank_id);
		};

		$scope.deletePost = function(tweet_id) {
			qbTimelineService.deletePost($scope.feed, tweet_id);
		};

		$scope.deleteComment = function(tweet_id) {
			qbTimelineService.deleteComment($scope.feed, tweet_id);
		};

		$scope.toggleLike = function(tweet_id) {
			qbTimelineService.toggleLike($scope.feed, tweet_id);
		};

		$scope.toggleRetweet = function(tweet_id, text, method) {
			qbTimelineService.toggleRetweet($scope.feed, tweet_id, text, method);
		};

		$scope.toggleFavorite = function(tweet_id) {
			qbTimelineService.toggleFavorite($scope.feed, tweet_id);
		};

		//----------------------------------------
		// Init
		//----------------------------------------

		// get current user
		$scope.getCurrentUser();

		// get post from feed
		$scope.busy = false;
		$scope.getFeedPosts();

	}]);
