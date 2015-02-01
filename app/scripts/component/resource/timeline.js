'use strict';

angular.module('resource.timeline', ['service.notice'])

    .factory('resTimeline', ['$rootScope', '$http', '$q', 'qbNotice', 'qbTweet', 'BACKEND_SITE', function($rootScope, $http, $q, qbNotice, qbTweet, BACKEND_SITE) {

        var service = {

	        //--------------------------------------------------
	        // Feed
	        //--------------------------------------------------

	        get_system_feed_posts: function(category, sidx, since_id, count, user_id) {
		        var data = {
			        category: category,
			        sidx: sidx,
			        since_id: since_id,
			        count: count,
			        user_id: user_id
		        };
		        return $http.post(BACKEND_SITE + '/timeline/get_system_feed_posts', data).then(function(response) {
			        qbTweet.checkPosts(response.data.posts);
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        get_system_feed_short_posts: function(category, sidx, since_id, count, user_id) {
		        var data = {
			        category: category,
			        sidx: sidx,
			        since_id: since_id,
			        count: count,
			        user_id: user_id
		        };
		        return $http.post(BACKEND_SITE + '/timeline/get_system_feed_short_posts', data).then(function(response) {
			        qbTweet.checkPosts(response.data.posts);
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        get_news_feed_posts: function(category, sidx, since_id, count) {
		        var data = {
			        category: category,
			        sidx: sidx,
			        since_id: since_id,
			        count: count
		        };
		        return $http.post(BACKEND_SITE + '/timeline/get_news_feed_posts', data).then(function(response) {
			        qbTweet.checkPosts(response.data.posts);
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        get_favorite_feed_posts: function(category, sidx, since_id, count) {
		        var data = {
			        category: category,
			        sidx: sidx,
			        since_id: since_id,
			        count: count
		        };
		        return $http.post(BACKEND_SITE + '/timeline/get_favorite_feed_posts', data).then(function(response) {
			        qbTweet.checkPosts(response.data.posts);
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        get_wall_feed_posts: function(category, sidx, since_id, count, user_id) {
		        var data = {
			        category: category,
			        sidx: sidx,
			        since_id: since_id,
			        count: count,
			        user_id: user_id
		        };
		        return $http.post(BACKEND_SITE + '/timeline/get_wall_feed_posts', data).then(function(response) {
			        qbTweet.checkPosts(response.data.posts);
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        get_feed_posts_by_id: function(post_ids) {
		        var data = {
			        post_ids: post_ids
		        };
		        return $http.post(BACKEND_SITE + '/timeline/get_feed_posts_by_id', data).then(function(response) {
			        qbTweet.checkPosts(response.data.posts);
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        get_feed_comments_by_id: function(post_id, since_id, count) {
		        var data = {
			        post_id: post_id,
			        since_id: since_id,
			        count: count
		        };
		        return $http.post(BACKEND_SITE + '/timeline/get_feed_comments_by_id', data).then(function(response) {
			        qbTweet.checkComments(response.data.comments);
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        //--------------------------------------------------
	        // Post
	        //--------------------------------------------------

            add_post: function(target_type, target_id, title, text, photos) {
	            var data = {
		            target_type: target_type,
		            target_id: target_id,
		            title: title,
		            text: text,
		            photos: photos
	            };
	            return $http.post(BACKEND_SITE + '/timeline/add_post', data).then(function(response) {
					qbTweet.checkPost(response.data.post);
		            return response.data;
	            }, qbNotice.errorHandler);
            },

	        delete_post: function(tweet_id) {
		        var data = {
			        tweet_id: tweet_id
		        };
		        return $http.post(BACKEND_SITE + '/timeline/delete_post', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        delete_comment: function(tweet_id) {
		        var data = {
			        tweet_id: tweet_id
		        };
		        return $http.post(BACKEND_SITE + '/timeline/delete_comment', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        //--------------------------------------------------
	        // Comment
	        //--------------------------------------------------

	        add_comment: function(text, reply_id) {
		        var data = {
			        text: text,
			        reply_id: reply_id
		        };
		        return $http.post(BACKEND_SITE + '/timeline/add_comment', data).then(function(response) {
			        qbTweet.checkComment(response.data.comment);
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        //--------------------------------------------------
	        // Action
	        //--------------------------------------------------

	        add_like: function(tweet_id) {
		        var data = {
			        tweet_id: tweet_id
		        };
		        return $http.post(BACKEND_SITE + '/timeline/add_like', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        delete_like: function(tweet_id) {
		        var data = {
			        tweet_id: tweet_id
		        };
		        return $http.post(BACKEND_SITE + '/timeline/delete_like', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        add_retweet: function(tweet_id, text, method) {
		        var data = {
			        tweet_id: tweet_id,
					text: text,
					method: method
		        };
		        return $http.post(BACKEND_SITE + '/timeline/add_retweet', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        add_favorite: function(tweet_id) {
		        var data = {
			        tweet_id: tweet_id
		        };
		        return $http.post(BACKEND_SITE + '/timeline/add_favorite', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        delete_favorite: function(tweet_id) {
		        var data = {
			        tweet_id: tweet_id
		        };
		        return $http.post(BACKEND_SITE + '/timeline/delete_favorite', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        }
        };

        return service;
    }]);
