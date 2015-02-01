'use strict';

angular.module('invest')

	.controller('invReorderGroupModalCtrl', ['$scope', '$translate', '$modalInstance', 'resInvest', 'groups', function($scope, $translate, $modalInstance, resInvest, groups) {

		//----------------------------------------
		// Define
		//----------------------------------------

		$scope.groups = [];

		$scope.data = {
			active_group_id: ''
		};

		//----------------------------------------
		// Main Function
		//----------------------------------------

		var setGroup = function() {
			// system watch groups: [0, 99]
			// user watch groups: [100, -]
			groups.forEach(function(elem) {
				if (elem.group_id >= 100) {
					$scope.groups.push(elem);
				}
			});
		};

		//----------------------------------------
		// Action Function
		//----------------------------------------

		var swapPosition = function(x, y) {
			var tmp;
			tmp = x.position;
			x.position = y.position;
			y.position = tmp;
		};

		$scope.up = function() {
			var group_id = $scope.data.active_group_id;
			var pool = [];
			var curr, next;

			for (var i = 0; i < $scope.groups.length; i++) {
				curr = $scope.groups[i];
				next = (i+1 < $scope.groups.length) ? $scope.groups[i+1] : null;

				if (next && next.group_id === group_id) {
					// swap position value
					swapPosition(curr, next);
					// swap the order in groups
					pool.push(next);
					pool.push(curr);
					// increase i
					i++;
				} else {
					pool.push(curr);
				}
			}

			$scope.groups = pool;
		};

		$scope.down = function() {
			var group_id = $scope.data.active_group_id;
			var pool = [];
			var curr, next;

			for (var i = 0; i < $scope.groups.length; i++) {
				curr = $scope.groups[i];
				next = (i+1 < $scope.groups.length) ? $scope.groups[i+1] : null;

				if (next && curr.group_id === group_id) {
					// swap position value
					swapPosition(curr, next);
					// swap the order in groups
					pool.push(next);
					pool.push(curr);
					// increase i
					i++;
				} else {
					pool.push(curr);
				}
			}

			$scope.groups = pool;
		};

		//----------------------------------------
		// Event Callback
		//----------------------------------------

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};

		$scope.ok = function() {
			var pos = [];
			$scope.groups.forEach(function(elem) {
				pos.push({
					group_id: elem.group_id,
					position: elem.position
				});
			});

			resInvest.reorder_watch_groups(pos).then(function(data) {
				if (data.success) {
					// close dialog
					$modalInstance.close('ok');
				}
			});
		};

		//----------------------------------------
		// Init
		//----------------------------------------

		// set group
		setGroup();

		// set acrive group_id
		$scope.data.active_group_id = $scope.groups[0].group_id;
	}]);
