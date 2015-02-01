'use strict';

angular.module('auth')

	.controller('autSigninCtrl', ['$scope', '$state', '$timeout', 'ezfb', 'security', 'qbBase64', 'qbNotice', function($scope, $state, $timeout, ezfb, security, qbBase64, qbNotice) {

		//----------------------------------------
		// Define
		//----------------------------------------

		$scope.fb = {
			loginStatus: null,
			apiMe: null
		};

		$scope.data = {
			email: '',
			password: '',
			remember_me: true
		};

		//----------------------------------------
		// Facebook
		//----------------------------------------

		$scope.fbLogin = function() {
			ezfb.login(function(res) {
				if (res.authResponse) {
					fbUpdateLoginStatus();
				}
			}, {scope: 'email'});
		};

		$scope.fbLogout = function() {
			ezfb.logout(function() {
				fbUpdateLoginStatus();
			});
		};

		var fbUpdateLoginStatus = function() {
			ezfb.getLoginStatus(function (res) {
				$scope.fb.loginStatus = res;
				fbUpdateApiMe();
			});
		};

		var fbUpdateApiMe = function() {
			ezfb.api('/me', function(res) {
				$scope.fb.apiMe = res;
				fbAutoLogin();
			});
		};

		var fbLogin = function() {
			var fb_id = $scope.fb.apiMe.id;

			return security.fb_login(fb_id).then(function(data) {
				if (security.isAuthenticated()) {
					// redirect to home page
					$state.go('home.portal.news');
				} else {
					var msg = 'webapi-errors.' + data.errno;
					qbNotice.pushForCurrentRoute(msg, 'error', {}, {}, true);
				}
			});
		};

		var fbRegister = function(more) {
			// fb_id
			var fb_id = $scope.fb.apiMe.id;
			// fullname
			var fullname = $scope.fb.apiMe.name;
			// email
			var email = $scope.fb.apiMe.email;
			// birthday
			//var res = $scope.fb.apiMe.birthday.split('/');
			//var birthday = res[2] + '-' + res[0] + '-' + res[1];
			var birthday = '2014-07-01';
			// sex
			var sex = $scope.fb.apiMe.gender;

			return security.fb_register(fb_id, fullname, email, birthday, sex).then(function(data) {
				if (data.success) {
					// login
					(more || angular.noop)();
				} else {
					var msg = 'webapi-errors.' + data.errno;
					qbNotice.pushForCurrentRoute(msg, 'error', {}, {}, true);
				}
			});
		};

		var fbAutoLogin = function() {
			security.fb_is_register($scope.fb.apiMe.id).then(function(data) {
				// check success
				if (!data.success) {
					return;
				}

				// login directly
				if (data.is_register) {
					fbLogin();
				// register and then login
				} else {
					fbRegister(fbLogin);
				}
			});
		};

		//----------------------------------------
		// Main Function
		//----------------------------------------

		// This is a polyfill that fires change events when browsers
		// autofill form fields without firing a change event.
		var fix_autofill_bug = function() {
			$('#aut-signin input').checkAndTriggerAutoFillEvent();
		};

		//----------------------------------------
		// Event Function
		//----------------------------------------

		$scope.ok = function() {
			if ($scope.form.$invalid) {
				return;
			}

			security.login($scope.data.email, $scope.data.password, $scope.data.remember_me).then(function(data) {
				if (security.isAuthenticated()) {
					// redirect to home page
					$state.go('home.portal.news');
				} else {
					var msg = 'webapi-errors.' + data.errno;
					qbNotice.pushForCurrentRoute(msg, 'error', {}, {}, true);
				}
			});
		};

		//----------------------------------------
		// Init
		//----------------------------------------

		$timeout(fix_autofill_bug, 500);
	}]);