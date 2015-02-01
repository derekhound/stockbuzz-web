'use strict';

angular.module('timeline')

	.directive('qbComments', ['$compile', '$parse', '$translate', '$modal', function($compile, $parse, $translate, $modal) {

		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'scripts/component/timeline/comments.html',
			scope: {
				'currentUser': '=',
				'post': '=',
				'onDeleteComment': '&',
				'onToggleLike': '&',
				'onGetUnreadComment': '&',
				'onSubmitComment': '&'
			},

			link: function(scope, element, attrs) {

				//----------------------------------------
				// Main Functions
				//----------------------------------------

				scope.getContent = function(comment) {
					var str;

					if (comment.is_expand) {
						str = comment.text;
					} else {
						str = comment.summary;
					}

					return str;
				};

				scope.readmore = function(comment) {
					comment.is_expand = true;
				};

				scope.showUnreadComment = function() {
					return scope.post.comments.length < scope.post.reply_count;
				};

				scope.getUnreadCount = function() {
					return scope.post.reply_count - scope.post.comments.length;
				};

				scope.getUnreadComment = function() {
					scope.onGetUnreadComment({
						rank_id: scope.post.rank_id
					});
				};

				scope.deleteComment = function(tweet_id) {
					// open a confirm modal, and then delete tweet
					var modalInstance = $modal.open({
						backdrop: true,
						keyboard: true,
						windowClass: 'qb-modal',
						templateUrl:  'scripts/component/timeline/delete-tweet-modal.html',
						controller: 'qbDeleteTweetModalCtrl',
						resolve: {
							target: function () {
								return 'comment';
							}
						}
					});

					// modal result
					modalInstance.result.then(function(data) {
						// ok
						scope.onDeleteComment({
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

				//----------------------------------------
				// bypass functions
				//----------------------------------------

				scope.submitComment = function(text, rank_id) {
					return scope.onSubmitComment({
						text: text,
						rank_id: rank_id
					});
				};
			}
		};
	}]);
