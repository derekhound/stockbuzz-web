'use strict';

angular.module('timeline', [])

	.factory('qbTimelineService', ['$rootScope', 'resTimeline', function($rootScope, resTimeline) {

		//----------------------------------------
		// Define
		//----------------------------------------

		var POST_PAGE_SIZE          = 20;
		var COMMENT_PAGE_SIZE       = 20;
		var COMMENT_FIRST_PAGE_SIZE = 4;

		//----------------------------------------
		// Helper Function
		//----------------------------------------

		// find the post whose rank_id is specific
		var getTargetPostByRankId = function(feed, rank_id) {
			var i, post;
			var found = false;

			for (i = 0; i < feed.posts.length; i++) {
				post = feed.posts[i];
				if (post.rank_id === rank_id) {
					found = post;
					break;
				}
			}

			return found;
		};

		// find the posts whose tweet_id is specific
		var getTargetPosts = function(feed, tweet_id) {
			var i, post;
			var found = [];

			for (i = 0; i < feed.posts.length; i++) {
				post = feed.posts[i];
				if (post.tweet_id === tweet_id) {
					found.push(post);
				}
			}

			return found;
		};

		// find the tweets (post or comment) whose tweet_id is specific
		var getTargetTweets = function(feed, tweet_id) {
			var i, j, post, comment;
			var found = [];

			for (i = 0; i < feed.posts.length; i++) {
				post = feed.posts[i];
				if (post.tweet_id === tweet_id) {
					found.push(post);
				}
				for (j = 0; j < post.comments.length; j++) {
					comment = post.comments[j];
					if (comment.tweet_id === tweet_id) {
						found.push(comment);
					}
				}
			}

			return found;
		};

		var deleteTargetPosts = function(feed, tweet_id) {
			var i, post;

			for (i = 0; i < feed.posts.length; i++) {
				post = feed.posts[i];
				if (post.tweet_id === tweet_id) {
					feed.posts.splice(i,1);
				}
			}
		};

		var deleteTargetComments = function(feed, tweet_id) {
			var i, j, post, comment;
			var found = false;

			for (i = 0; i < feed.posts.length; i++) {
				post = feed.posts[i];

				for (j = 0; j < post.comments.length; j++) {
					comment = post.comments[j];
					if (comment.tweet_id === tweet_id) {
						// delete comment
						feed.posts[i].comments.splice(j,1);
						// reply_count - 1 for post
						feed.posts[i].reply_count--;
					}
				}
			}
		};

		//----------------------------------------
		// Public Function
		//----------------------------------------

		var service = {

			getSystemFeedPost: function(feed) {
				return resTimeline.get_system_feed_posts(feed.category, feed.sidx, feed.since_id, POST_PAGE_SIZE, feed.target_id).then(function(data) {
					if (data.success && data.posts.length > 0) {
						// add posts to the end of post array
						data.posts.forEach(function(elem, index) {
							feed.posts.push(elem);
						});
						// update since_id
						var last = data.posts.length - 1;
						if (feed.sidx === 'time') {
							feed.since_id = data.posts[last].rank_id;
						} else if (feed.sidx === 'hot') {
							feed.since_id = data.posts[last].karma;
						}
					}
					return data.posts.length > 0;
				});
			},

			getNewsFeedPost: function(feed) {
				return resTimeline.get_news_feed_posts(feed.category, feed.sidx, feed.since_id, POST_PAGE_SIZE).then(function(data) {
					if (data.success && data.posts.length > 0) {
						// add posts to the end of post array
						data.posts.forEach(function(elem, index) {
							feed.posts.push(elem);
						});
						// update since_id
						var last = data.posts.length - 1;
						if (feed.sidx === 'time') {
							feed.since_id = data.posts[last].rank_id;
						} else if (feed.sidx === 'hot') {
							feed.since_id = data.posts[last].karma;
						}
					}
					return data.posts.length > 0;
				});
			},

			getFavoriteFeedPost: function(feed) {
				return resTimeline.get_favorite_feed_posts(feed.category, feed.sidx, feed.since_id, POST_PAGE_SIZE).then(function(data) {
					if (data.success && data.posts.length > 0) {
						// add posts to the end of post array
						data.posts.forEach(function(elem, index) {
							feed.posts.push(elem);
						});
						// update since_id
						var last = data.posts.length - 1;
						if (feed.sidx === 'time') {
							feed.since_id = data.posts[last].rank_id;
						} else if (feed.sidx === 'hot') {
							feed.since_id = data.posts[last].karma;
						}
					}
					return data.posts.length > 0;
				});
			},

			getWallFeedPost: function(feed) {
				return resTimeline.get_wall_feed_posts(feed.category, feed.sidx, feed.since_id, POST_PAGE_SIZE, feed.target_id).then(function(data) {
					if (data.success && data.posts.length > 0) {
						// add posts to the end of post array
						data.posts.forEach(function(elem, index) {
							feed.posts.push(elem);
						});
						// update since_id
						var last = data.posts.length - 1;
						if (feed.sidx === 'time') {
							feed.since_id = data.posts[last].rank_id;
						} else if (feed.sidx === 'hot') {
							feed.since_id = data.posts[last].karma;
						}
					}
					return data.posts.length > 0;
				});
			},

			getFeedPostsById: function(feed) {
				return resTimeline.get_feed_posts_by_id(feed.post_id).then(function(data) {
					if (data.success && data.posts.length > 0) {
						// add posts to the end of post array
						data.posts.forEach(function(elem, index) {
							feed.posts.push(elem);
						});
					}
					return data.posts.length > 0;
				});
			},

			submitPost: function(feed, title, text, photos) {
				return resTimeline.add_post(feed.target_type, feed.target_id, title, text, photos).then(function(data) {
					if (data.success) {
						// add new post to the begin of post array
						feed.posts.unshift(data.post);
						// no need to update since_id
					}

					return data;
				});
			},

			submitComment: function(feed, text, rank_id) {
				// search target post
				var post = getTargetPostByRankId(feed, rank_id);

				// fire
				return resTimeline.add_comment(text, post.tweet_id).then(function(data) {
					if (data.success) {
						// add new comment to the end of comment array
						post.comments.push(data.comment);
						// no need to update since_id

						// reply_count + 1 for post
						post.reply_count++;
					}

					return data;
				});
			},

			showComment: function(feed, rank_id) {
				// search target post
				var post = getTargetPostByRankId(feed, rank_id);

				// if comments has shown, skip this action
				if (post.show_comment) {
					return;
				}
				post.show_comment = true;

				// fire
				resTimeline.get_feed_comments_by_id(post.tweet_id, post.since_id, COMMENT_FIRST_PAGE_SIZE).then(function(data){
					if (data.comments.length > 0) {
						// add comments to the begin of comment array
						data.comments.forEach(function(elem, index) {
							post.comments.unshift(elem);
						});
						// update since_id
						var last = data.comments.length - 1;
						post.since_id = data.comments[last].tweet_id;
					}
				});
			},

			getUnreadComment: function(feed, rank_id) {
				// search target post
				var post = getTargetPostByRankId(feed, rank_id);

				// fire
				resTimeline.get_feed_comments_by_id(post.tweet_id, post.since_id, COMMENT_PAGE_SIZE).then(function(data){
					if (data.comments.length > 0) {
						// add comments to the begin of comment array
						data.comments.forEach(function(elem, index) {
							post.comments.unshift(elem);
						});
						// update since_id
						var last = data.comments.length - 1;
						post.since_id = data.comments[last].tweet_id;
					}
				});
			},

			deletePost: function(feed, tweet_id) {
				resTimeline.delete_post(tweet_id).then(function(data){
					if (data.success) {
						deleteTargetPosts(feed, tweet_id);
					}
				});
			},

			deleteComment: function(feed, tweet_id) {
				resTimeline.delete_comment(tweet_id).then(function(data){
					if (data.success) {
						deleteTargetComments(feed, tweet_id);
					}
				});
			},

			toggleLike: function(feed, tweet_id) {
				// search target tweets
				var tweets = getTargetTweets(feed, tweet_id);

				// determine is_like
				var is_like = tweets[0].is_like;

				// delete like
				if (is_like) {
					resTimeline.delete_like(tweet_id).then(function(data){
						if (data.success) {
							tweets.forEach(function(elem) {
								elem.is_like = false;
								elem.like_count--;
							});
						}
					});
				// add like
				} else {
					resTimeline.add_like(tweet_id).then(function(data){
						if (data.success) {
							tweets.forEach(function(elem) {
								elem.is_like = true;
								elem.like_count++;
							});
						}
					});
				}
			},

			toggleRetweet: function(feed, tweet_id, text, method) {
				// search target posts
				var posts = getTargetPosts(feed, tweet_id);

				// can't delete retweet

				// add retweet
				resTimeline.add_retweet(tweet_id, text, method).then(function(data){
					if (data.success) {
						if (method === 'wall') {
							posts.forEach(function(elem) {
								elem.is_retweet = true;
								elem.retweet_count++;
							});
						}
					}
				});
			},

			toggleFavorite: function(feed, tweet_id) {
				// search target posts
				var posts = getTargetPosts(feed, tweet_id);

				// determine is_favorite
				var is_favorite = posts[0].is_favorite;

				// delete favorite
				if (is_favorite) {
					resTimeline.delete_favorite(tweet_id).then(function(data){
						if (data.success) {
							posts.forEach(function(elem) {
								elem.is_favorite = false;
								elem.favorite_count--;
							});
						}
					});
					// add favorite
				} else {
					resTimeline.add_favorite(tweet_id).then(function(data){
						if (data.success) {
							posts.forEach(function(elem) {
								elem.is_favorite = true;
								elem.favorite_count++;
							});
						}
					});
				}
			}
		};

		return service;
	}]);
