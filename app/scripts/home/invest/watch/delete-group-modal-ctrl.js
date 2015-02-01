'use strict';

angular.module('invest')

	.controller('invDeleteGroupModalCtrl', ['$scope', '$modalInstance', 'resInvest', 'group', function($scope, $modalInstance, resInvest, group) {

		//----------------------------------------
		// Define
		//----------------------------------------

		$scope.group_id = group.group_id;

		//----------------------------------------
		// Event Callback
		//----------------------------------------

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};

		$scope.ok = function() {
			resInvest.delete_watch_group($scope.group_id).then(function(data) {
				if (data.success) {
					// close dialog
					$modalInstance.close('ok');
				}
			});
		};

		//----------------------------------------
		// Init
		//----------------------------------------

	}]);
