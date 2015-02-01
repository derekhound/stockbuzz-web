'use strict';

angular.module('home')

	.controller('hotSidebarCtrl', ['$scope', '$state', function($scope, $state) {

		$scope.isActive = function(state) {
			return $state.is(state);
		};

	}]);
