'use strict';

angular.module('home')

	.controller('homAuthToolbarCtrl', ['$rootScope', '$scope', '$location', 'security', 'resUser', 'resEvent', function($rootScope, $scope, $location, security, resUser, resEvent) {

		//----------------------------------------
		// Define
		//----------------------------------------

		$scope.currentUser = resUser.getDefaultUser();

		$scope.list = {
			since_id: false,
			count: 6
		};

		$scope.event_list = {
			offset: 0,
			limit: 10,
			events: []
		};

		//----------------------------------------
		// Navi
		//----------------------------------------

		$scope.getCurrentUser = function() {
			resUser.getCurrentUser().then(function(data){
				$scope.currentUser = data;
			});
		};

		$scope.getShortname = function() {
			var short = '';
			if (angular.isDefined($scope.currentUser.fullname)) {
				var fullname = $scope.currentUser.fullname;
				var res = fullname.split(' ');
				short = res[0];
			}
			return short;
		};

		//----------------------------------------
		// Search Bar
		//----------------------------------------

		$scope.getList = function(query) {
			return resUser.search(false, query, false, $scope.list.since_id, $scope.list.count).then(function(data) {
				var users = [];
				if (data.success && data.users.length > 0) {
					users = data.users;
				}
				return users;
			});
		};

		$scope.onSelectMatch = function($item, $model, $label) {
			$location.path('/home/user/' + $item.username);
		};

		//----------------------------------------
		// Event
		//----------------------------------------

		$scope.getEvents = function() {
			var offset = $scope.event_list.offset;
			var limit  = $scope.event_list.limit;

			return resEvent.get_events_by_page(offset, limit).then(function(data) {
				if (data.success) {
					$scope.event_list.events = data.events;
				}
				return data.events;
			});
		};

		//----------------------------------------
		// Tool
		//----------------------------------------

		$scope.logout = function() {
			security.logout();
		};

		//----------------------------------------
		// Init
		//----------------------------------------

		// get current user
		$scope.getCurrentUser();

		$scope.getEvents();
	}]);
