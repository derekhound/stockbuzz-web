'use strict';

angular.module('photo')

	.controller('phoPhotoModalCtrl', ['$scope', '$location', '$modalInstance', 'resPhoto', 'qbPhoto', 'source', function($scope, $location, $modalInstance, resPhoto, qbPhoto, source) {

		//----------------------------------------
		// Define
		//----------------------------------------

		$scope.currentUser = source.currentUser;
		$scope.user = source.user;

		$scope.album_id = source.album_id;
		$scope.total = 0;

		$scope.lightbox = {
			width: 850,
			since_id: source.photo_id,
			photo: null
		};

		$scope.busy = true;

		//----------------------------------------
		// Main
		//----------------------------------------

		$scope.countAlbumPhotos = function() {
			resPhoto.count_album_photos($scope.user.user_id, $scope.album_id).then(function(data){
				if (data.success) {
					$scope.total = data.count;
				}
			});
		};

		$scope.getSinglePhoto = function(direction) {
			// if busy, skip request
			if ($scope.busy) {
				return;
			}
			$scope.busy = true;

			// fire
			resPhoto.get_single_photo($scope.user.user_id, $scope.album_id, direction, $scope.lightbox.since_id).then(function(data){
				if (data.success) {
					$scope.lightbox.photo    = data.photo;
					$scope.lightbox.since_id = data.photo.photo_id;
					// pick photo
					qbPhoto.pickPhoto($scope.lightbox.photo, $scope.lightbox.width);
				}
				// update busy
				$scope.busy = false;
			});
		};

		$scope.toggleLike = function() {
			// determine is_like
			var photo = $scope.lightbox.photo;
			var is_like = photo.is_like;

			// delete like
			if (is_like) {
				resPhoto.delete_like(photo.photo_id).then(function(data){
					if (data.success) {
						photo.is_like = false;
						photo.like_count--;
					}
				});
			// add like
			} else {
				resPhoto.add_like(photo.photo_id).then(function(data){
					if (data.success) {
						photo.is_like = true;
						photo.like_count++;
					}
				});
			}
		};

		$scope.gotoAlbum = function() {
			$modalInstance.dismiss('ok');
			$location.path('/photo/album_photos/' + $scope.user.username + '/' + $scope.lightbox.photo.album_id);
		};

		$scope.gotoUserPage = function() {
			$modalInstance.dismiss('ok');
			$location.path('/person/' + $scope.lightbox.photo.owner_username + '/post');
		};

		$scope.deletePhoto = function() {
			resPhoto.delete_photo($scope.lightbox.photo.album_id, $scope.lightbox.photo.photo_id).then(function(data){
				if (data.success) {
					// if total photos is 1, just close modal
					if ($scope.lightbox.count === 1) {
						$modalInstance.dismiss('ok');

					} else {
						// deleted photo is not the last photo, go to next photo
						if ($scope.lightbox.photo.rank < $scope.lightbox.count) {
							$scope.getSinglePhoto('next');
						// delete photo is the last photo, go to prev photo
						} else {
							$scope.getSinglePhoto('prev');
						}
					}

					// update new count
					$scope.lightbox.count--;
				}
			});
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};

		//----------------------------------------
		// Init
		//----------------------------------------

		// get count of photos
		$scope.countAlbumPhotos();

		// get current photo
		$scope.busy = false;
		$scope.getSinglePhoto('curr');
	}]);
