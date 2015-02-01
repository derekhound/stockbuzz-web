'use strict';

angular.module('timeline')

	.controller('qbDeleteTweetModalCtrl', ['$scope', '$modalInstance', 'target', function($scope, $modalInstance, target) {

		$scope.target = target;

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};

		$scope.ok = function() {
			$modalInstance.close('ok');
		};
	}]);
