'use strict';

angular.module('auth')

	.controller('autResetPasswordCtrl', ['$scope', '$state', '$translate', 'security', 'qbNotice', function($scope, $state, $translate, security, qbNotice) {

		//----------------------------------------
		// Define
		//----------------------------------------

		$scope.code = '';

		$scope.data = {
			new_password: '',
			new_password_confirm: ''
		};

		//----------------------------------------
		// Error Function
		//----------------------------------------

		$scope.newPasswordErrorStr = function(field) {
			var str = '';
			if (field.$error.required) {
				str = $translate.instant('auth.reset_password.help.I_PASSWORD');
			} else if (field.$error.pattern) {
				str = $translate.instant('auth.reset_password.help.E_PASSWORD_PATTERN');
			} else if (field.$error.minlength || field.$error.maxlength) {
				str = $translate.instant('auth.reset_password.help.E_PASSWORD_LENGTH');
			}
			return str;
		};

		$scope.newPasswordConfirmErrorStr = function(field) {
			var str = '';
			if (field.$error.unique) {
				str = $translate.instant('auth.reset_password.help.E_MATCH');
			}
			return str;
		};

		//----------------------------------------
		// Main Function
		//----------------------------------------

		$scope.verifyResetPasswordCode = function() {
			security.verifyResetPasswordCode($scope.code).then(function(data) {
				var msg;
				if (data.success) {

				} else {
					// redirect to /auth/forgot_password
					msg = 'webapi-errors.' + data.errno;
					qbNotice.pushForNextRoute(msg, 'error', {}, {}, true);
					$state.go('auth.forgot_password');
				}
			});
		};

		//----------------------------------------
		// Event Function
		//----------------------------------------

		$scope.ok = function() {
			if ($scope.form.$invalid) {
				return;
			}

			security.resetPassword($scope.code, $scope.data.new_password).then(function(data) {
				var msg;
				if (data.success) {
					// redirect to /auth/signin
					msg = 'auth.reset_password.notice.success';
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

		if ($state.params.code.length > 0) {
			$scope.code = $state.params.code;
		}

		// verify code
		$scope.verifyResetPasswordCode();

	}]);