'use strict';

angular.module('setting')

	.directive('qbUploadAvatar', ['$timeout', '$modal', '$translate', 'BACKEND_SITE', 'fileUploader', function($timeout, $modal, $translate, BACKEND_SITE, fileUploader) {

		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'scripts/setting/profile/upload-avatar.html',
			scope: {
			},

			link: function(scope, element, attrs) {

				// config
				var maxFiles = 3;
				var maxFileSizeMb = 3 * 1048576;        // 3M

				// photo_pick change
				element.bind('change', function(e) {

					// only accept photo_pick change
					if (e.target.name !== 'photo_pick') {
						return;
					}

					// no any files
					if (e.target.files.length !== 1) {
						return;
					}

					var file = e.target.files[0];
					if (file.size > maxFileSizeMb || !isImage(file.type)) {
						openFailModal();

					} else {
						// photo info
						var photo = {
							file: file,
							url: URL.createObjectURL(file)
						};

						// open preview modal
						openPreviewModal(photo);
					}
				});

				// steal from timeline component
				var openFailModal = function() {
					// open a confirm modal, and then delete tweet
					var modalInstance = $modal.open({
						backdrop: true,
						keyboard: true,
						windowClass: 'qb-modal',
						templateUrl:  'scripts/component/timeline/upload-fail-modal.html',
						controller: 'qbUploadFailModalCtrl'
					});

					// modal result
					modalInstance.result.then(function(data) {
						// ok
					}, function() {
						// cancel
					});
				};

				var openPreviewModal = function(photo) {
					// open a confirm modal, and then delete tweet
					var modalInstance = $modal.open({
						backdrop: true,
						keyboard: true,
						windowClass: 'qb-modal',
						templateUrl:  'scripts/setting/profile/preview-avatar-modal.html',
						controller: 'qbPreviewAvatarModalCtrl',
						resolve: {
							photo: function () {
								return photo;
							}
						}
					});

					// modal result
					modalInstance.result.then(function(data) {
						// ok
					}, function() {
						// cancel
					});
				};

				var isImage = function(file_type) {
					var png_mimes = ['image/x-png'];
					var jpeg_mimes = ['image/jpg', 'image/jpe', 'image/jpeg', 'image/pjpeg'];
					var img_mimes = ['image/gif', 'image/jpeg', 'image/png'];

					// normalize png
					if (png_mimes.indexOf(file_type) !== -1) {
						file_type = 'image/png';
					}
					// normalize jpg
					if (jpeg_mimes.indexOf(file_type) !== -1) {
						file_type = 'image/jpeg';
					}

					return img_mimes.indexOf(file_type) !== -1;
				};
			}
		};
	}]);