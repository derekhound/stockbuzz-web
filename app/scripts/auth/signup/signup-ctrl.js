'use strict';

angular.module('auth')

	.controller('autSignupCtrl', ['$scope', '$state', '$timeout', '$translate', 'ezfb', 'security', 'qbBase64', 'qbNotice', function($scope, $state, $timeout, $translate, ezfb, security, qbBase64, qbNotice) {

		//----------------------------------------
		// Define
		//----------------------------------------

		$scope.fb = {
			loginStatus: null,
			apiMe: null
		};

		$scope.data = {
			fullname: '',
			email: '',
			password: '',
			password_confirm: '',
			username: '',
			year: '',
			month: '',
			day: '',
			sex: 'male'
		};

		$scope.years   = [];
		$scope.monthes = [];
		$scope.days    = [];

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
		// Error Function
		//----------------------------------------

		$scope.fullnameErrorStr = function(field) {
			var str = '';
			if (field.$error.required) {
				str = $translate.instant('auth.signup.help.I_FULLNAME');
			}
			return str;
		};

		$scope.emailErrorStr = function(field) {
			var str = '';
			if (field.$error.required) {
				str = $translate.instant('auth.signup.help.I_EMAIL');
			} else if (field.$error.email) {
				str = $translate.instant('auth.signup.help.E_EMAIL');
			} else if (field.$error.unique) {
				str = $translate.instant('auth.signup.help.E_EMAIL_ALREADY_USE');
			}
			return str;
		};

		$scope.passwordErrorStr = function(field) {
			var str = '';
			if (field.$error.required) {
				str = $translate.instant('auth.signup.help.I_PASSWORD');
			} else if (field.$error.pattern) {
				str = $translate.instant('auth.signup.help.E_PASSWORD_PATTERN');
			} else if (field.$error.minlength || field.$error.maxlength) {
				str = $translate.instant('auth.signup.help.E_PASSWORD_LENGTH');
			}
			return str;
		};

		$scope.passwordConfirmErrorStr = function(field) {
			var str = '';
			if (field.$error.unique) {
				str = $translate.instant('auth.signup.help.E_MATCH');
			}
			return str;
		};

		$scope.usernameErrorStr = function(field) {
			var str = '';
			if (field.$error.required) {
				str = $translate.instant('auth.signup.help.I_USERNAME');
			} else if (field.$error.pattern) {
				str = $translate.instant('auth.signup.help.E_USERNAME_PATTERN');
			} else if (field.$error.minlength || field.$error.maxlength) {
				str = $translate.instant('auth.signup.help.E_USERNAME_LENGTH');
			} else if (field.$error.unique) {
				str = $translate.instant('auth.signup.help.E_USERNAME_ALREADY_USE');
			}
			return str;
		};

		$scope.birthdaySuccessShow = function(year, month, day) {

			if ((year.$dirty && year.$valid) &&
				(month.$dirty && month.$valid) &&
				(day.$dirty && day.$valid)) {
				return true;
			}
			return false;
		};

		//----------------------------------------
		// Event Function
		//----------------------------------------

		$scope.ok = function() {
			if ($scope.form.$invalid) {
				return;
			}

			// birthday
			var birthday = $scope.data.year + '-' + $scope.data.month + '-' + $scope.data.day;

			security.register($scope.data.fullname, $scope.data.email, $scope.data.password, $scope.data.username, birthday, $scope.data.sex).then(function(data) {
				var msg;
			   	if (data.success) {
				    // redirect to /auth/signin
				    msg = 'auth.signup.notice.success';
				    qbNotice.pushForNextRoute(msg, 'success', {}, {}, true);
				    $state.go('auth.signin');
			    } else {
				    msg = 'webapi-errors.' + data.errno;
				    qbNotice.pushForCurrentRoute(msg, 'error', {}, {}, true);
			    }
			});
		};

		//----------------------------------------
		// Init
		//----------------------------------------

		var i;

		// year
		var thisYear = new Date().getFullYear();
		for (i = thisYear; i > 1900; i--) {
			$scope.years.push({value: i, name: i});
		}

		// month
		for (i = 1; i <= 12; i++) {
			var name = i + ' ' + $translate.instant('auth.signup.text.month');
			$scope.monthes.push({value: i, name: name});
		}

		// day
		for (i = 1; i <= 31; i++) {
			$scope.days.push({value: i, name: i});
		}

		/*
		// overwrite form data from route params
		if (angular.isDefined($routeParams.fullname)) {
			$scope.data.fullname = $routeParams.fullname;
		}
		if (angular.isDefined($routeParams.email)) {
			$scope.data.email = $routeParams.email;
		}
		if (angular.isDefined($routeParams.password)) {
			$scope.data.password = qbBase64.decode($routeParams.password);
		}

		// workaround: after form gets ready, change state of fields
		$timeout(function(){
			if (angular.isDefined($routeParams.fullname)) {
				$scope.form.fullname.$pristine  = false;
				$scope.form.fullname.$dirty     = true;
			}
			if (angular.isDefined($routeParams.email)) {
				$scope.form.email.$pristine     = false;
				$scope.form.email.$dirty        = true;
			}
			if (angular.isDefined($routeParams.password)) {
				$scope.form.password.$pristine  = false;
				$scope.form.password.$dirty     = true;
			}
		}, 500);
		*/
	}]);