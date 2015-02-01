'use strict';

angular.module('resource.photo', ['service.notice'])

    .factory('resPhoto', ['$http', '$q', 'qbNotice', 'qbPhoto', 'BACKEND_SITE', function($http, $q, qbNotice, qbPhoto, BACKEND_SITE) {

        var service = {

	        count_album_photos: function(user_id, album_id) {
		        var data = {
					user_id: user_id,
			        album_id: album_id
		        };
		        return $http.post(BACKEND_SITE + '/photo/count_album_photos', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        get_albums: function(user_id, album_ids) {
		        var data = {
					user_id: user_id,
			        album_ids: album_ids
		        };
		        return $http.post(BACKEND_SITE + '/photo/get_albums', data).then(function(response) {
					if (response.data.success) {
				        qbPhoto.checkAlbums(response.data.albums);
					}
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        get_albums_with_cover: function(user_id, album_ids) {
		        var data = {
					user_id: user_id,
			        album_ids: album_ids
		        };
		        return $http.post(BACKEND_SITE + '/photo/get_albums_with_cover', data).then(function(response) {
					if (response.data.success) {
				        response.data.albums.forEach(function(elem) {
					        qbPhoto.checkPhoto(elem.cover);
							qbPhoto.checkAlbum(elem);
				        });
					}
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        get_album_photos: function(user_id, album_id, since_id, limit) {
		        var data = {
					user_id: user_id,
			        album_id: album_id,
			        since_id: since_id,
			        limit: limit
		        };
		        return $http.post(BACKEND_SITE + '/photo/get_album_photos', data).then(function(response) {
					if (response.data.success) {
				        qbPhoto.checkPhotos(response.data.photos);
					}
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        get_single_photo: function(user_id, album_id, direction, since_id) {
		        var data = {
					user_id: user_id,
			        album_id: album_id,
			        direction: direction,
			        since_id: since_id
		        };
		        return $http.post(BACKEND_SITE + '/photo/get_single_photo', data).then(function(response) {
					if (response.data.success) {
				        qbPhoto.checkPhoto(response.data.photo);
				        qbPhoto.checkAlbum(response.data.photo.album);
					}
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        delete_photo: function(album_id, photo_id) {
		        var data = {
			        album_id: album_id,
			        photo_id: photo_id
		        };
		        return $http.post(BACKEND_SITE + '/photo/delete_photo', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        //--------------------------------------------------
	        // Action
	        //--------------------------------------------------

	        add_like: function(photo_id) {
		        var data = {
			        photo_id: photo_id
		        };
		        return $http.post(BACKEND_SITE + '/photo/add_like', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        delete_like: function(photo_id) {
		        var data = {
			        photo_id: photo_id
		        };
		        return $http.post(BACKEND_SITE + '/photo/delete_like', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        },
        };

        return service;
    }]);
