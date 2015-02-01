'use strict';

angular.module('resource.user', ['service.notice'])

    .factory('resUser', ['$http', '$q', 'qbNotice', 'qbPhoto', 'BACKEND_SITE', function($http, $q, qbNotice, qbPhoto, BACKEND_SITE) {

        // user object prototype
        var default_user = {
            user_id:    '',
            type:       '',
            email:      '',
            username:   '',
            fullname:   '',
            avatar:     '',
	        avatarM:    '',
            avatarS:    '',
            url:        '',
            biographic: '',
			post_count: '',
            follow_person_count:    '',
	        follow_stock_count:     '',
	        follow_community_count: '',
            followers_count:        ''
        };

		// current user cache
		var currentUser = null;

        // This pool is used for storing user info that we already
        // ask it from the backend. It is a light cache mechanism
		// and it can reduce the total number of query times.
        var pool = {};

        // find user info by username from user pool
        var findUser = function(username) {
			// check current user
			if (currentUser && currentUser.username === username) {
				return currentUser;
			}
			// check pool
	        if (angular.isDefined(pool[username])) {
		        return pool[username];
	        }
			//
            return null;
        };

        //------------------------------

        var service = {

            getDefaultUser: function() {
                return angular.copy(default_user);
            },

			//------------------------------
			// get current user
			//------------------------------

            getCurrentUser: function() {
				if (currentUser !== null) {
					return $q.when(angular.copy(currentUser));
				} else {
                    return service.requestCurrentUser();
                }
            },

            requestCurrentUser: function() {
                var data = {};
                return $http.post(BACKEND_SITE + '/user/get_current_user', data).then(function(response) {
					var user = false;
					if (response.data.success) {
						user = response.data.user;
						// check avatar
						qbPhoto.checkAvatar(user);
						// save into cache
						currentUser = user;
					}
					return user;
                }, qbNotice.errorHandler);
            },

			setCurrentUser: function(user) {
				// check avatar
				qbPhoto.checkAvatar(user);
				// save into cache
				currentUser = user;
			},

			clearCurrentUser: function() {
				currentUser = null;
			},

			//------------------------------
			// get user
			//------------------------------

            // get user info from cache. if not found, ask the backend server
            getUserByUsername: function(username) {
                var user = findUser(username);
                if (user !== null) {
                    return $q.when(user);
                } else {
                    return service.requestUserByUsername(username);
                }
            },

            // this function always asks the backend server the user info
            requestUserByUsername: function(username) {
                var data = {
                    username: username
                };
                return $http.post(BACKEND_SITE + '/user/get_user_by_username', data).then(function(response) {
					var user = false;
					if (response.data.success) {
						user = response.data.user;
						// check avatar
						qbPhoto.checkAvatar(user);
						// save into cache
						pool[username] = user;
					} else {
						pool[username] = false;
					}
					return user;
                }, qbNotice.errorHandler);
            },

            //--------------------------------------------------

	        search: function(user_type, query, filter, since_id, count) {
		        var data = {
			        user_type: user_type,
			        query: query,
			        filter: filter,
					since_id: since_id,
			        count: count
		        };
		        return $http.post(BACKEND_SITE + '/user/search', data).then(function(response) {
			        // check avatar
			        if (response.data.success) {
				        qbPhoto.checkAvatars(response.data.users);
			        }
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

            //--------------------------------------------------

            updateAccount: function(username) {
                var data = {
                    username: username
                };
                return $http.post(BACKEND_SITE + '/user/update_account', data).then(function(response) {
                    return response.data;
                }, qbNotice.errorHandler);
            },

	        updateProfile: function(fullname, website, biographic, birthday, sex) {
		        var data = {
			        fullname: fullname,
			        website: website,
			        biographic: biographic,
			        birthday: birthday,
			        sex: sex
		        };
		        return $http.post(BACKEND_SITE + '/user/update_profile', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

            updateAvatar: function(type, data_url) {
                var data = {
                    type: type,
                    data_url: data_url
                };
                var config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    }
                };
                return $http.post(BACKEND_SITE + '/user/update_avatar', data, config).then(function(response) {
                    return response.data;
                }, qbNotice.errorHandler);
            },

	        //--------------------------------------------------

	        clearCache: function() {
		        currentUser = null;
		        pool = {};
	        }
        };

        return service;
    }]);
