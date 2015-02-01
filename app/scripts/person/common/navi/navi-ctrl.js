'use strict';

angular.module('person')

	.controller('perNaviCtrl', ['$scope', '$state', function($scope, $state) {

		//----------------------------------------
		// Define
		//----------------------------------------
		$scope.username = null;

		//----------------------------------------
		// Main
		//----------------------------------------

		$scope.isActive = function(state) {
			return $state.is(state);
		};

		//----------------------------------------
		// Init
		//----------------------------------------

		// get target username
		if ($state.params.username.length > 0) {
			$scope.username = $state.params.username;
		}

	}]);
