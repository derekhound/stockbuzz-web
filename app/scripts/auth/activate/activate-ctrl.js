'use strict';

angular.module('auth')

	.controller('autActivateCtrl', ['$scope', '$state', 'security', 'qbNotice', function($scope, $state, security, qbNotice) {

		//----------------------------------------
		// Define
		//----------------------------------------

		$scope.code = '';

		//----------------------------------------
		// Init
		//----------------------------------------

		if ($state.params.code.length > 0) {
			$scope.code = $state.params.code;
		}

		security.activate($scope.code).then(function(data) {
			var msg;
			if (data.success) {
				// redirect to /auth/signin
				msg = 'auth.activate.notice.activate_success';
				qbNotice.pushForNextRoute(msg, 'success', {}, {}, true);
				$state.go('auth.signin');
			} else {
				msg = 'webapi-errors.' + data.errno;
				qbNotice.pushForCurrentRoute(msg, 'error', {}, {}, true);
			}
		});

	}]);