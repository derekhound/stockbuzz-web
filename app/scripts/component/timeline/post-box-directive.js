'use strict';

angular.module('timeline')

	.directive('qbPostBox', ['$compile', '$timeout', '$modal', '$translate', 'BACKEND_SITE', 'fileUploader', 'qbUuid', function($compile, $timeout, $modal, $translate, BACKEND_SITE, fileUploader, qbUuid) {

        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'scripts/component/timeline/post-box.html',
            scope: {
	            currentUser: '=',
	            onSubmitPost: '&'
            },

            link: function(scope, element, attrs) {

	            //------------------------------
	            // Main
	            //------------------------------

	            scope.title = '';
	            scope.text  = '';
	            scope.busy  = false;

	            scope.expand = function() {
		            element.addClass('open');
	            };

	            scope.toggleTitleInput = function() {
		            if (element.hasClass('title')) {
			            element.removeClass('title');
			            scope.title = '';
		            } else {
			            element.addClass('title');
		            }
	            };

	            scope.submit = function() {
		            // if busy, skip request
		            if (scope.busy) {
			            return;
		            }
		            scope.busy = true;

		            // check parameter
		            if (scope.text.length === 0 && scope.photos.length === 0) {
			            return;
		            }

		            // photo
		            var photos = [];
		            scope.photos.forEach(function(elem) {
			            if (elem.status === 'completed') {
				            photos.push({
					            bucket: elem.bucket,
					            key: elem.key
				            });
			            }
		            });

		            // do it
		            var data = {
			            title: scope.title,
			            text: scope.text,
			            photos: photos
		            };
		            scope.onSubmitPost(data).then(function(data) {
			            if (data.success) {
				            scope.title = '';
				            scope.text = '';
				            reset_photo();
			            }
			            scope.busy = false;
		            });
	            };

	            //------------------------------
	            // Photo
	            //------------------------------

	            // config
	            var maxFiles = 3;
	            var maxFileSizeMb = 3 * 1048576;        // 3M

	            // status
	            scope.photos        = [];
	            var num_processing  = 0;
	            var num_completed   = 0;
	            var num_failed      = 0;

	            // reset photo variables
	            var reset_photo = function() {
		            scope.photos    = [];
		            num_processing  = 0;
		            num_completed   = 0;
		            num_failed      = 0;
	            };

	           	// photo_pick change
	            element.bind('change', function(e) {

		            // only accept photo_pick change
		            if (e.target.name !== 'photo_pick') {
			            return;
		            }

		            // no any files
		            if (e.target.files.length === 0) {
			            return;
		            }

		            // foreach file
		            var files = e.target.files;
		            for (var i = 0; i < files.length; i++) {

			            // check max files
			            var total = num_completed + num_processing;
			            if (total >= maxFiles) {
				            openFailModal();
				            break;
			            }

			            // check max file size
			            if (files[i].size > maxFileSizeMb) {
				            openFailModal();
				            continue;
			            }

			            // check extension
			            if (!isImage(files[i].type)) {
				            openFailModal();
				            continue;
			            }

			            // photo info
			            var photo = {
				            file: files[i],
				            url: URL.createObjectURL(files[i]),
				            status: 'processing',
				            progress: 0,
				            show_photo: true,
				            show_progress: true,
				            bucket: '',
				            key: ''
			            };
			            scope.photos.push(photo);
			            num_processing++;

			            // upload photo
			            upload(photo);

			            // trigger render
			            scope.$apply();
		            }
	            });

	            // upload a photo
	            var upload = function(photo) {
		            var data = null;
		            var url = BACKEND_SITE + '/photo/add_oneshot_photo';
		            var files = [photo.file];

		            fileUploader
			            .post(files, data)
			            .to(url)
			            .then(function(ret) {
				            var data = ret.data;

				            if (data.success) {
					            // store result
					            photo.status = 'completed';
					            photo.bucket = data.files[0].bucket;
					            photo.key    = data.files[0].key;

					            // update status
					            num_processing--;
					            num_completed++;

					            // show control
					            $timeout(function() {
						            photo.show_photo    = true;
						            photo.show_progress = false;
					            } , 1000);

				            } else {
					            openFailModal();

					            // store result
					            photo.status = 'failed';

					            // update status
					            num_processing--;
					            num_failed++;

					            // show control
					            $timeout(function() {
						            photo.show_photo    = false;
						            photo.show_progress = false;
					            } , 1000);
				            }

			            }, function(error) {
				            openFailModal();

				            // store result
				            photo.status = 'failed';

				            // update status
				            num_processing--;
				            num_failed++;

				            // show control
				            $timeout(function() {
					            photo.show_photo    = false;
					            photo.show_progress = false;
				            } , 1000);

			            }, function(progress) {
				            photo.progress = progress;
			            });
	            };

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