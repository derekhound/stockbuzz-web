'use strict';

angular.module('setting')

	.controller('qbPreviewAvatarModalCtrl', ['$scope', '$window', '$modalInstance', 'fileUploader', 'BACKEND_SITE', 'photo', function($scope, $window, $modalInstance, fileUploader, BACKEND_SITE, photo) {

		$scope.photo = photo;

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};

		$scope.ok = function() {
			var data = null;
			var url = BACKEND_SITE + '/user/update_avatar';
			var files = [$scope.photo.file];

			fileUploader
				.post(files, data)
				.to(url)
				.then(function(ret) {
					// Other components may also have this avatar. We reload
					// the whole page to force ng-src to refresh image source
					$window.location.reload();

				}, function(error) {

				}, function(progress) {

				});
		};
	}]);
