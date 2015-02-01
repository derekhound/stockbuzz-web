// Based loosely around work by Witold Szczerba - https://github.com/witoldsz/angular-http-auth

'use strict';

angular.module('security', [])

    .factory('security', ['$window', '$location', '$http', 'qbNotice', 'securityRetryQueue', '$modal', 'resUser', 'BACKEND_SITE', function($window, $location, $http, qbNotice, queue, $modal, resUser, BACKEND_SITE) {

		// current user cache
		var currentUser = null;

        // Login form dialog stuff
        var openLoginDialog = function() {
	        // open modal
	        var modalInstance = $modal.open({
		        backdrop: 'static',
		        keyboard: false,
		        windowClass: 'qb-modal',
		        templateUrl:  'scripts/component/security/login-modal.html',
		        controller: 'secSigninModalCtrl'
	        });

	        // modal result
	        modalInstance.result
		        // ok
		        .then(function(reason) {

		        // cancel
		        }, function(reason) {

		        });
        };

        var onCloseLoginDialog = function(result) {
            if (result === 'cancel') {
                queue.cancelAll();
            } else if (result === 'signin') {
                //queue.retryAll();
                $window.location.reload();
            } else if (result === 'signup') {
                queue.cancelAll();
                $location.path('/auth/signup');
            } else if (result === 'forgot') {
                queue.cancelAll();
	            $location.path('/auth/forgot_password');
            }
        };

        // Register a handler for when an item is added to the retry queue
        queue.onItemAddedCallbacks.push(function(retryItem) {
            if (queue.hasMore() ) {
                service.showLogin();
            }
        });

        // The public API of the service
        var service = {

            // Get the first reason for needing a login
            getLoginReason: function() {
                return queue.retryReason();
            },

            // Show the modal login dialog
            showLogin: function() {
                openLoginDialog();
            },

            // Attempt to authenticate a user by the given email and password
            login: function(email, password, remember) {
                var data = {
                    email: email,
                    password: password,
                    remember: remember
                };
                return $http.post(BACKEND_SITE + '/auth/login', data).then(function(response) {
                    if (response.data.success) {
						var user = response.data.user;
						resUser.setCurrentUser(user);
						currentUser = user;
                    }
                    return response.data;
                }, qbNotice.errorHandler);
            },

            // Logout the current user and redirect
            logout: function() {
                $http.post(BACKEND_SITE + '/auth/logout').then(function() {
					resUser.clearCurrentUser();
                    currentUser = null;
	                $location.path('/');
                }, qbNotice.errorHandler);
            },

            // register a new account
            register: function(fullname, email, password, username, birthday, sex) {
                var data = {
                    fullname: fullname,
                    email: email,
                    password: password,
                    username: username,
	                birthday: birthday,
	                sex: sex
                };
                return $http.post(BACKEND_SITE + '/auth/register', data).then(function(response) {
                    return response.data;
                }, qbNotice.errorHandler);
            },

            // activate a new account
            activate: function(code) {
                var data = {
                    code: code
                };
                return $http.post(BACKEND_SITE + '/auth/activate', data).then(function(response) {
                    return response.data;
                }, qbNotice.errorHandler);
            },

            // send activation email again
            sendActivationEmail: function(email) {
                var data = {
                    email: email
                };
                return $http.post(BACKEND_SITE + '/auth/send_activation_email', data).then(function(response) {
                    return response.data;
                }, qbNotice.errorHandler);
            },

            // forgot password
            forgotPassword: function(email) {
                var data = {
                    email: email
                };
                return $http.post(BACKEND_SITE + '/auth/forgot_password', data).then(function(response) {
                    return response.data;
                }, qbNotice.errorHandler);
            },

            // verify reset password code
            verifyResetPasswordCode: function(code) {
                var data = {
                    code: code
                };
                return $http.post(BACKEND_SITE + '/auth/verify_reset_password_code', data).then(function(response) {
                    return response.data;
                }, qbNotice.errorHandler);
            },

            // reset password
            resetPassword: function(code, password) {
                var data = {
                    code: code,
                    password: password
                };
                return $http.post(BACKEND_SITE + '/auth/reset_password', data).then(function(response) {
                    return response.data;
                }, qbNotice.errorHandler);
            },

            // change password
            changePassword: function(password, new_password) {
                var data = {
                    password: password,
                    new_password: new_password
                };
                return $http.post(BACKEND_SITE + '/auth/change_password', data).then(function(response) {
                    return response.data;
                }, qbNotice.errorHandler);
            },

			// auto login
			autoLogin: function() {
				resUser.requestCurrentUser().then(function(user) {
					if (user) {
						currentUser = user;
					}
				});
			},

            // Is the current user authenticated?
            isAuthenticated: function(){
                return (currentUser !== null);
            },

            // Is the current user an adminstrator?
            isAdmin: function() {
                return !!(currentUser && currentUser.admin);
            },

	        //------------------------------
	        // FB
	        //------------------------------
	        fb_is_register: function(fb_id) {
		        var data = {
			        fb_id: fb_id
		        };
		        return $http.post(BACKEND_SITE + '/auth/fb_is_register', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        fb_login: function(fb_id) {
		        var data = {
			        fb_id: fb_id
		        };
		        return $http.post(BACKEND_SITE + '/auth/fb_login', data).then(function(response) {
			        if (response.data.success) {
				        var user = response.data.user;
				        resUser.setCurrentUser(user);
				        currentUser = user;
			        }
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        fb_register: function(fb_id, fullname, email, birthday, sex) {
		        var data = {
			        fb_id: fb_id,
			        fullname: fullname,
			        email: email,
			        birthday: birthday,
			        sex: sex
		        };
		        return $http.post(BACKEND_SITE + '/auth/fb_register', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        }
        };

        return service;
    }]);
