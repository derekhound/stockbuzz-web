'use strict';

angular.module('resource.social', ['service.notice'])

    .factory('resSocial', ['$http', '$q', 'qbNotice', 'qbPhoto', 'BACKEND_SITE', function($http, $q, qbNotice, qbPhoto, BACKEND_SITE) {

        var service = {

	        add_follow: function(follow_id) {
                var data = {
	                follow_id: follow_id
                };
                return $http.post(BACKEND_SITE + '/social/add_follow', data).then(function(response) {
                    return response.data;
                }, qbNotice.errorHandler);
            },

	        delete_follow: function(follow_id) {
		        var data = {
			        follow_id: follow_id
		        };
		        return $http.post(BACKEND_SITE + '/social/delete_follow', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        get_followings_by_page: function(follow_type, since_id, count, user_id) {
		        var data = {
			        follow_type: follow_type,
			        since_id: since_id,
			        count: count,
			        user_id: user_id
		        };
		        return $http.post(BACKEND_SITE + '/social/get_followings_by_page', data).then(function(response) {
			        // check avatar
			        qbPhoto.checkAvatars(response.data.follows);
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        get_followers_by_page: function(since_id, count, user_id) {
		        var data = {
			        since_id: since_id,
			        count: count,
			        user_id: user_id
		        };
		        return $http.post(BACKEND_SITE + '/social/get_followers_by_page', data).then(function(response) {
			        // check avatar
			        qbPhoto.checkAvatars(response.data.followers);
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        is_follow_status: function(follow_id) {
		        var data = {
			        follow_id: follow_id
		        };
		        return $http.post(BACKEND_SITE + '/social/is_follow_status', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        }
        };

        return service;
    }]);
