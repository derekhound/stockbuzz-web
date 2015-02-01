'use strict';

angular.module('auth')

	.controller('autSendActivateEmailCtrl', ['$scope', '$state', '$translate', 'security', 'qbNotice', function($scope, $state, $translate, security, qbNotice) {

		//----------------------------------------
		// Define
		//----------------------------------------

		$scope.data = {
			email: ''
		};

		//----------------------------------------
		// Main Function
		//----------------------------------------

		$scope.ok = function() {
			if ($scope.form.$invalid) {
				return;
			}

			security.sendActivationEmail($scope.data.email).then(function(data) {
				var msg;
				if (data.success) {
					// redirect to /auth/signin
					msg = 'auth.send_activation_email.notice.success';
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


	}]);