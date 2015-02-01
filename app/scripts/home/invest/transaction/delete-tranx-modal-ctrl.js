'use strict';

angular.module('invest')

	.controller('invDeleteTranxModalCtrl', ['$scope', '$modalInstance', 'resInvest', 'record', function($scope, $modalInstance, resInvest, record) {

		//----------------------------------------
		// Define
		//----------------------------------------

		$scope.tranx_id = record.tranx_id;

		//----------------------------------------
		// Event Callback
		//----------------------------------------

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};

		$scope.ok = function() {
			resInvest.delete_transaction($scope.tranx_id).then(function(data) {
				if (data.success) {
					// close dialog
					$modalInstance.close('ok');
				}
			});
		};
	}]);
