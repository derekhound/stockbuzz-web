'use strict';

angular.module('timeline')

	.directive('qbPosts', ['$compile', '$parse', '$translate', '$modal', function($compile, $parse, $translate, $modal) {

        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'scripts/component/timeline/posts.html',
	        scope: {
		        'currentUser': '=',
		        'feed': '=',
		        'onSubmitComment': '&',
		        'onShowComment': '&',
		        'onGetUnreadComment': '&',
		        'onDeletePost': '&',
		        'onDeleteComment': '&',
		        'onToggleLike': '&',
				'onToggleFavorite': '&',
		        'onToggleRetweet': '&'
	        },

            link: function(scope, element, attrs) {

	            //----------------------------------------
	            // Main Functions
	            //----------------------------------------

				scope.getContent = function(post) {
					var str;

					if (post.is_expand) {
						str = post.text;
					} else {
						str = post.summary;
					}

					return str;
				};

				scope.expand = function(post) {
					post.is_expand = true;
				};

	            scope.showComment = function(rank_id) {
		            scope.onShowComment({
			            rank_id: rank_id
		            });
	            };

	            scope.deletePost = function(tweet_id) {
		            // open a confirm modal, and then delete tweet
		            var modalInstance = $modal.open({
			            backdrop: true,
			            keyboard: true,
			            windowClass: 'qb-modal',
			            templateUrl:  'scripts/component/timeline/delete-tweet-modal.html',
			            controller: 'qbDeleteTweetModalCtrl',
			            resolve: {
				            target: function () {
					            return 'post';
				            }
			            }
		            });

		            // modal result
		            modalInstance.result.then(function(data) {
			            // ok
			            scope.onDeletePost({
				            tweet_id: tweet_id
			            });
		            }, function() {
			            // cancel
		            });
	            };

	            scope.toggleLike = function(tweet_id) {
		            scope.onToggleLike({
			            tweet_id: tweet_id
		            });
	            };

	            scope.toggleFavorite = function(tweet_id) {
		            scope.onToggleFavorite({
			            tweet_id: tweet_id
		            });
	            };

	            scope.toggleRetweet = function(post) {

		            // open a retweet modal, and then add retweet
		            var modalInstance = $modal.open({
			            backdrop: true,
			            keyboard: true,
			            windowClass: 'qb-modal',
			            templateUrl:  'scripts/component/timeline/retweet-modal.html',
			            controller: 'qbRetweetModalCtrl'
		            });

		            // modal result
		            modalInstance.result.then(function(data) {
			            // ok
			            scope.onToggleRetweet({
				            tweet_id: post.tweet_id,
							text: data.text,
							method: data.method
			            });
		            }, function() {
			            // cancel
		            });
	            };

	            //----------------------------------------
	            // Bypass Functions
	            //----------------------------------------

	            scope.submitComment = function(text, rank_id) {
		            return scope.onSubmitComment({
			            text: text,
			            rank_id: rank_id
		            });
	            };

	            scope.getUnreadComment = function(rank_id) {
		            scope.onGetUnreadComment({
			            rank_id: rank_id
		            });
	            };

	            scope.deleteComment = function(tweet_id) {
		            scope.onDeleteComment({
			            tweet_id: tweet_id
		            });
	            };
			}
		};
    }]);