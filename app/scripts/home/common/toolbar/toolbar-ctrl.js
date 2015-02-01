'use strict';

angular.module('home')

	.controller('homToolbarCtrl', ['$scope', 'security', function($scope, security) {

		$scope.isAuthenticated = function() {
			return security.isAuthenticated();
		};

	}]);
