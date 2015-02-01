'use strict';

angular.module('home')

	.controller('homSidebarCtrl', ['$scope', '$state', 'resUser', function($scope, $state, resUser) {

		//----------------------------------------
		// Define
		//----------------------------------------

		$scope.currentUser = resUser.getDefaultUser();

		//----------------------------------------
		// Main
		//----------------------------------------

		$scope.getCurrentUser = function() {
			resUser.getCurrentUser().then(function(data){
				$scope.currentUser = data;
			});
		};

		$scope.isActive = function(state) {
			return $state.is(state);
		};

		//----------------------------------------
		// Init
		//----------------------------------------

		// get current user
		$scope.getCurrentUser();

	}]);
