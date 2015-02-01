'use strict';

angular.module('timeline')

	.controller('qbRetweetModalCtrl', ['$scope', '$modalInstance', function($scope, $modalInstance) {

		$scope.data = {
			text: '',
			method: 'wall'       // [wall, community, message]
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};

		$scope.ok = function() {
			$modalInstance.close($scope.data);
		};
	}]);
