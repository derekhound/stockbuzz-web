'use strict';

angular.module('tweet')

	.controller('twePostCtrl', ['$scope', '$state', '$translate', 'resUser', 'qbTimelineService', function($scope, $state, $translate, resUser, qbTimelineService) {

		//----------------------------------------
		// Define
		//----------------------------------------

		$scope.currentUser = resUser.getDefaultUser();

		$scope.feed = {
			post_id: null,
			posts: [],
			permission: {
				post_box: true,
				comment_box: true
			}
		};

		//----------------------------------------
		// Main Function
		//----------------------------------------

		$scope.getCurrentUser = function() {
			resUser.getCurrentUser().then(function(data){
				$scope.currentUser = data;
				$scope.feed.target_id = data.user_id;
			});
		};

		$scope.getFeedPosts = function() {
			return qbTimelineService.getFeedPostsById($scope.feed);
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

		// get post_id
		if ($state.params.post_id.length > 0) {
			$scope.feed.post_id = $state.params.post_id;
		}

		// get current user
		$scope.getCurrentUser();

		// get feed posts
		$scope.getFeedPosts().then(function() {
			$scope.showComment($scope.feed.post_id);
		});

	}]);
