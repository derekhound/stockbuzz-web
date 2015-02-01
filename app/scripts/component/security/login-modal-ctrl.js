'use strict';

angular.module('security')

    // The LoginFormController provides the behaviour behind a reusable form
    // to allow users to authenticate. This controller and its template
    // (login/form.tpl.html) are used in a modal dialog box by the security service.
    .controller('secSigninModalCtrl', ['$scope', '$state', '$modalInstance', '$translate', 'security', function($scope, $state, $modalInstance, $translate, security) {

        $scope.data = {
            email: '',
            password: '',
            remember: true
        };

        // Any error message from failing to login
        $scope.error = '';

        //----------------------------------------
        // Event Callback
        //----------------------------------------

        $scope.cancel = function() {
	        $modalInstance.dismiss('cancel');
        };

        $scope.forgot = function() {
	        $modalInstance.dismiss('cancel');
	        $state.go('auth.forgot_password');
        };

		$scope.signin = function() {
			security.login($scope.data.email, $scope.data.password, $scope.data.remember).then(function(data) {
				if (security.isAuthenticated()) {
					$modalInstance.close('ok');
					$state.go('root');
				} else {
					var msg = 'webapi-errors.' + data.errno;
					$scope.error = $translate.instant(msg);
				}
			});
		};

        $scope.signup = function() {
	        $modalInstance.dismiss('cancel');
	        $state.go('auth.signup');
        };
    }]);
