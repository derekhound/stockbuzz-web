'use strict';

angular.module('root')

	.controller('rooIndexCtrl', ['$state', 'security', function($state, security) {

		if (security.isAuthenticated()) {
			$state.go('home.portal.news');
		}
	}]);