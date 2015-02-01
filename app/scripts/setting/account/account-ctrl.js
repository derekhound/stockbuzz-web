'use strict';

angular.module('setting')

	.controller('setAccountCtrl', ['$scope', '$translate', 'resUser', 'qbNotice', function($scope, $translate, resUser, qbNotice) {

		//----------------------------------------
		// Define
		//----------------------------------------

		$scope.data = {
			username: ''
		};

		//----------------------------------------
		// Error Function
		//----------------------------------------

		$scope.usernameErrorStr = function(field) {
			var str = '';
			if (field.$error.required) {
				str = $translate.instant('setting.account.help.E_USERNAME_REQUIRED');
			} else if (field.$error.pattern) {
				str = $translate.instant('setting.account.help.E_USERNAME_PATTERN');
			} else if (field.$error.minlength || field.$error.maxlength) {
				str = $translate.instant('setting.account.help.E_USERNAME_LENGTH');
			} else if (field.$error.unique) {
				str = $translate.instant('setting.account.help.E_USERNAME_ALREADY_USE');
			}
			return str;
		};

		//----------------------------------------
		// Main
		//----------------------------------------

		$scope.getCurrentUser = function() {
			resUser.getCurrentUser().then(function(data){
				$scope.data.username = data.username;
			});
		};

		$scope.ok = function() {
			if ($scope.form.$invalid) {
				return;
			}

			resUser.updateAccount($scope.data.username).then(function(data) {
				var msg;

				if (data.success) {
					msg = 'setting.account.notice.success';
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

		// get current user
		$scope.getCurrentUser();
	}]);
