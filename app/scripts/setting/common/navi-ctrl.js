'use strict';

angular.module('setting')

	.controller('setNaviCtrl', ['$scope', '$state', function($scope, $state) {

		$scope.isActive = function(state) {
			return $state.is(state);
		};

	}]);
