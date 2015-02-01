'use strict';

angular.module('person')

	.controller('perPhotoCtrl', ['$scope', '$state', '$modal', 'resUser', 'resPhoto', 'qbPhoto', function($scope, $state, $modal, resUser, resPhoto, qbPhoto) {

		//----------------------------------------
		// Define
		//----------------------------------------

		$scope.currentUser = resUser.getDefaultUser();

		$scope.username = null;
		$scope.user     = resUser.getDefaultUser();

		$scope.photo_gallery = {
			width: 82,              // 83px
			since_id: false,
			limit: 6,
			photos: []
		};

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
				if (data) {
					$scope.user = data;
				}
			});
		};

		$scope.getLatestPhotos = function() {
			resPhoto.get_album_photos($scope.user.user_id, false, $scope.photo_gallery.since_id, $scope.photo_gallery.limit).then(function(data){
				if (data.success && data.photos.length > 0) {
					// add photos
					data.photos.forEach(function(elem) {
						qbPhoto.pickPhoto(elem, $scope.photo_gallery.width);
						$scope.photo_gallery.photos.push(elem);
					});
				}
			});
		};

		$scope.openPhotoModal = function(photo) {

			// open modal
			var modalInstance = $modal.open({
				backdrop: true,
				keyboard: true,
				windowClass: 'qb-modal',
				size: 'lg',
				templateUrl:  'scripts/home/photo/photo_modal/photo-modal.html',
				controller: 'phoPhotoModalCtrl',
				resolve: {
					source: function() {
						return {
							user: $scope.user,
							album_id: false,
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

		// get current user
		$scope.getCurrentUser();

		// after getting user
		$scope.getUser().then(function() {
			if ($scope.user.user_id !== '') {
				// latest photos
				$scope.getLatestPhotos();
			}
		});

	}]);
