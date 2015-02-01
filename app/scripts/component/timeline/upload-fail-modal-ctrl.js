'use strict';

angular.module('timeline')

	.controller('qbUploadFailModalCtrl', ['$scope', '$modalInstance', function($scope, $modalInstance) {

		$scope.data = {};

		$scope.ok = function() {
			$modalInstance.close($scope.data);
		};
	}]);
