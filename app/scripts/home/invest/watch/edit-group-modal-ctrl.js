'use strict';

angular.module('invest')

	.controller('invEditGroupModalCtrl', ['$scope', '$translate', '$modalInstance', 'resInvest', 'mode', 'group', function($scope, $translate, $modalInstance, resInvest, mode, group) {

		//----------------------------------------
		// Translate
		//----------------------------------------

		var str_add_group   = $translate.instant('invest.watch.edit_group_modal.add_group');
		var str_edit_group  = $translate.instant('invest.watch.edit_group_modal.edit_group');

		//----------------------------------------
		// Define
		//----------------------------------------

		$scope.mode = mode;
		$scope.group_id = group.group_id;

		// form data
		$scope.data = {
			group_name: ''
		};

		//----------------------------------------
		// Appearance Function
		//----------------------------------------

		$scope.getTitleStr = function() {
			var str = (mode === 'add') ? str_add_group : str_edit_group;
			return str;
		};

		//----------------------------------------
		// Event Callback
		//----------------------------------------

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};

		$scope.ok = function() {
			var name;
			// add group
			if (mode === 'add') {
				name = $scope.data.group_name;
				resInvest.add_watch_group(name).then(function(data) {
					if (data.success) {
						// close dialog
						$modalInstance.close('ok');
					}
				});

			// edit group
			} else {
				name = $scope.data.group_name;
				resInvest.update_watch_group($scope.group_id, name).then(function(data) {
					if (data.success) {
						// close dialog
						$modalInstance.close('ok');
					}
				});
			}
		};

		//----------------------------------------
		// Init
		//----------------------------------------

		if (mode === 'edit') {
			// overwrite data value
			$scope.data.group_name = group.name;
		}

	}]);
