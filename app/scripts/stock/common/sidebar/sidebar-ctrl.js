'use strict';

angular.module('stock')

	.controller('stoSidebarCtrl', ['$scope', '$state', 'resUser', function($scope, $state, resUser) {

		//----------------------------------------
		// Define
		//----------------------------------------

		$scope.username = null;
		$scope.code     = null;

		//----------------------------------------
		// Main
		//----------------------------------------

		var parseCode = function(symbol_id) {
			var results = symbol_id.split('.');
			$scope.code = results[0];
		};

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

		// parse code
		parseCode($scope.username);

	}]);
