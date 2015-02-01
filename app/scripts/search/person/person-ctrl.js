'use strict';

angular.module('search')

	.controller('seaPersonCtrl', ['$scope', '$state', 'resUser', function($scope, $state, resUser) {

		//----------------------------------------
		// Define
		//----------------------------------------

		$scope.target_type = 'person';
		$scope.data = {
			query: ''
		};

		$scope.filter = {
			from_age: '',
			to_age: '',
			sex: 'any',
			with_photo: true
		};

		$scope.list = {
			since_id: false,
			count: 20,
			items: []
		};
		$scope.busy = true;

		$scope.from_ages = [];
		$scope.to_ages = [];

		//----------------------------------------
		// Query Panel
		//----------------------------------------

		$scope.isActive = function(state) {
			return $state.is(state);
		};

		$scope.ok = function() {
			// reset
			$scope.reset();
			// get list
			$scope.busy = false;
			$scope.getList();
		};

		//----------------------------------------
		// Filter Panel
		//----------------------------------------

		$scope.$watch('filter', function(newValue, oldValue) {
			if (newValue !== oldValue) {
				// reset
				$scope.reset();
				// get list
				$scope.busy = false;
				$scope.getList();
			}

		}, true);

		//----------------------------------------
		// Result Panel
		//----------------------------------------

		$scope.reset = function() {
			$scope.list.since_id = false;
			$scope.list.items = [];
		};

		$scope.getList = function() {
			// if busy, skip request
			if ($scope.busy) {
				return;
			}
			$scope.busy = true;

			// fire
			resUser.search($scope.target_type, $scope.data.query, $scope.filter, $scope.list.since_id, $scope.list.count).then(function(data) {
				if (data.success && data.users.length > 0) {
					// add cards to the end of card array
					data.users.forEach(function(elem) {
						$scope.list.items.push(elem);
					});
					// update since_id
					var last = data.users.length - 1;
					$scope.list.since_id = data.users[last].user_id;
					// update busy
					$scope.busy = false;
				}
			});
		};

		//----------------------------------------
		// Init
		//----------------------------------------

		// age_from & age_to
		for (var i = 15; i <= 80; i++) {
			$scope.from_ages.push({value: i, name: i});
			$scope.to_ages.push({value: i, name: i});
		}

		// get list
		$scope.busy = false;
		$scope.getList();

	}]);