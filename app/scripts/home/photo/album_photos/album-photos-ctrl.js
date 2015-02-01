'use strict';

angular.module('photo')

	.controller('phoAlbumPhotosCtrl', ['$scope', '$state', '$modal', '$translate', 'resUser', 'resPhoto', 'qbPhoto', function($scope, $state, $modal, $translate, resUser, resPhoto, qbPhoto) {

		//----------------------------------------
		// Define
		//----------------------------------------

		$scope.currentUser = resUser.getDefaultUser();

		$scope.username = null;
		$scope.user     = resUser.getDefaultUser();

		$scope.album_id = -1;
		$scope.album = null;

		$scope.photo_gallery = {
			width: 153,              // 153px
			since_id: false,
			limit: 20,
			photos: []
		};

		$scope.busy = true;

		//----------------------------------------
		// Main Function
		//----------------------------------------

		$scope.getCurrentUser = function() {
			resUser.getCurrentUser().then(function(data){
				$scope.currentUser = data;
			});
		};

		$scope.getUser = function() {
			return resUser.getUserByUsername($scope.username).then(function(data){
				$scope.user = data;
			});
		};

		$scope.getTitleStr = function() {
			var str;
			if ($scope.user.user_id === $scope.currentUser.user_id) {
				str = $translate.instant('photo.text.my_photos');
			} else {
				str = $translate.instant('photo.text.someone_photos', {fullname: $scope.user.fullname});
			}
			return str;
		};

		$scope.getAlbums = function() {
			resPhoto.get_albums($scope.user.user_id, $scope.album_id).then(function(data){
				if (data.success && data.albums.length > 0) {
					$scope.album = data.albums[0];
				}
			});
		};

		$scope.getAlbumPhotos = function() {
			// if busy, skip request
			if ($scope.busy) {
				return;
			}
			$scope.busy = true;

			// fire
			resPhoto.get_album_photos($scope.user.user_id, $scope.album_id, $scope.photo_gallery.since_id, $scope.photo_gallery.limit).then(function(data){
				if (data.success && data.photos.length > 0) {
					// add photos
					data.photos.forEach(function(elem) {
						qbPhoto.pickPhoto(elem, $scope.photo_gallery.width);
						$scope.photo_gallery.photos.push(elem);
					});
					// update since_id
					var last = data.photos.length - 1;
					$scope.photo_gallery.since_id = data.photos[last].photo_id;
					// update busy
					$scope.busy = false;
				}
			});
		};

		$scope.openPhotoModal = function(photo) {

			// open modal
			var modalInstance = $modal.open({
				backdrop: true,
				keyboard: true,
				windowClass: 'qb-modal',
				templateUrl:  'scripts/home/photo/photo_modal/photo-modal.html',
				size: 'lg',
				controller: 'phoPhotoModalCtrl',
				resolve: {
					source: function() {
						return {
							currentUser: $scope.currentUser,
							user: $scope.user,
							album_id: $scope.album_id,
							photo_id: photo.photo_id
						};
					}
				}
			});

			// modal result
			modalInstance.result
				// ok
				.then(function(reason) {

				// cancel
				}, function(reason) {

				});
		};

		//----------------------------------------
		// Init
		//----------------------------------------

		// get state params
		if ($state.params.username.length > 0) {
			$scope.username = $state.params.username;
		}
		if ($state.params.album_id.length > 0) {
			$scope.album_id = $state.params.album_id;
		}

		// get current user
		$scope.getCurrentUser();

		// after getting user
		$scope.getUser().then(function() {
			// get album
			$scope.getAlbums();
			// get latest photos
			$scope.busy = false;
			$scope.getAlbumPhotos();
		});

	}]);
