'use strict';

angular.module('setting')

	.controller('setPasswordCtrl', ['$scope', '$translate', 'security', 'qbNotice', function($scope, $translate, security, qbNotice) {

		//----------------------------------------
		// Define
		//----------------------------------------

		$scope.data = {
			password: '',
			new_password: '',
			new_password_confirm: ''
		};

		//----------------------------------------
		// Error Function
		//----------------------------------------

		$scope.newPasswordErrorStr = function(field) {
			var str = '';
			if (field.$error.required) {
				str = $translate.instant('setting.password.help.I_NEW_PASSWORD');
			} else if (field.$error.pattern) {
				str = $translate.instant('setting.password.help.E_NEW_PASSWORD_PATTERN');
			} else if (field.$error.minlength || field.$error.maxlength) {
				str = $translate.instant('setting.password.help.E_NEW_PASSWORD_LENGTH');
			}
			return str;
		};

		$scope.newPasswordConfirmErrorStr = function(field) {
			var str = '';
			if (field.$error.unique) {
				str = $translate.instant('setting.password.help.E_MATCH');
			}
			return str;
		};

		//----------------------------------------
		// Main
		//----------------------------------------

		$scope.ok = function() {
			if ($scope.form.$invalid) {
				return;
			}

			security.changePassword($scope.data.password, $scope.data.new_password).then(function(data) {
				var msg;

				if (data.success) {
					msg = 'setting.password.notice.success';
					qbNotice.pushForCurrentRoute(msg, 'success', {}, {}, true);
				} else {
					msg = 'webapi-errors.' + data.errno;
					qbNotice.pushForCurrentRoute(msg, 'error', {}, {}, true);
				}
			});
		};

		//----------------------------------------
		// Init
		//----------------------------------------

	}]);
