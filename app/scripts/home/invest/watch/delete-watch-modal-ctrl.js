'use strict';

angular.module('invest')

	.controller('invDeleteWatchModalCtrl', ['$scope', '$modalInstance', 'resInvest', 'record', function($scope, $modalInstance, resInvest, record) {

		//----------------------------------------
		// Define
		//----------------------------------------

		$scope.symbol_id = record.symbol_id;

		//----------------------------------------
		// Event Callback
		//----------------------------------------

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};

		$scope.ok = function() {
			// symbol_id
			var tokens = $scope.symbol_id.split(' ');
			var symbol_id = tokens[0];

			resInvest.delete_watch(symbol_id).then(function(data) {
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
