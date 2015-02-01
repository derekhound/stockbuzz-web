'use strict';

angular.module('stock')

	.controller('stoPostCtrl', ['$scope', '$state', '$translate', 'resUser', 'qbTimelineService', function($scope, $state, $translate, resUser, qbTimelineService) {

		//----------------------------------------
		// Define
		//----------------------------------------

		$scope.currentUser = resUser.getDefaultUser();

		$scope.username = null;
		$scope.user     = resUser.getDefaultUser();

		$scope.feed = {
			target_type: 'stock',       // 'person', 'stock', 'community'
			target_id: -1,
			category: 'all',
			sidx: 'time',
			since_id: false,
			posts: [],
			permission: {
				post_box: true,
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

		$scope.getUser = function() {
			return resUser.getUserByUsername($scope.username).then(function(data){
				$scope.user = data;
				$scope.feed.target_id = data.user_id;
			});
		};

		$scope.getFeedPosts = function() {
			// if busy, skip request
			if ($scope.busy) {
				return;
			}
			$scope.busy = true;

			// fire
			qbTimelineService.getWallFeedPost($scope.feed).then(function(more){
				if (more) {
					$scope.busy = false;
				}
			});
		};

		//----------------------------------------
		// Category Function
		//----------------------------------------

		$scope.selectCategory = function(category) {
			// set category
			$scope.feed.category = category;
			// reset
			$scope.reset();
			// get feed posts
			$scope.busy = false;
			$scope.getFeedPosts();
		};

		$scope.reset = function() {
			$scope.feed.since_id = false;
			$scope.feed.posts = [];
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

		// get target username
		if ($state.params.username.length > 0) {
			$scope.username = $state.params.username;
		}
		// get current user
		$scope.getCurrentUser();

		// get user and get post from feed
		$scope.getUser()
			.then(function() {
				$scope.busy = false;
			})
			.then($scope.getFeedPosts);

	}]);
