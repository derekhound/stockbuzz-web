 'use strict';

angular.module('service.photo', [])

    .factory('qbPhoto', ['$rootScope', '$translate', function($rootScope, $translate) {

        var service = {

	        checkAvatars: function(items) {
		        if (!angular.isArray(items)) {
			        return;
		        }
		        items.forEach(function(elem, index) {
			        service.checkAvatar(elem);
		        });
	        },

            checkAvatar: function(item) {
	            if (item === null) {
		            return;
	            }

	            if (item.avatar) {
		            var url = item.avatar;
		            var ext = url.substr(-4);
		            item.avatarM = url.replace(ext, '_M'+ext);
		            item.avatarS = url.replace(ext, '_S'+ext);
	            } else {
		            var seed = parseInt(item.user_id) % 10;
		            item.avatar  = 'images/avatar/' + seed + '/avatar.jpg';
		            item.avatarM = 'images/avatar/' + seed + '/avatar_M.jpg';
		            item.avatarS = 'images/avatar/' + seed + '/avatar_S.jpg';
	            }
            },

	        checkPhotos: function(items) {
		        if (!angular.isArray(items)) {
			        return;
		        }
		        items.forEach(function(elem, index) {
			        service.checkPhoto(elem);
		        });
	        },

	        checkPhoto: function(item) {
		        // check params
		        if (item === null) {
			        return;
		        }

		        // convert to microseconds
		        item.create_utime = item.create_utime * 1000;

		        // thumb
		        item.thumb = [];
		        if (item.th_xs_factor !== 0) {
			        item.thumb.push({
				        img: item.app_dir + '/THUMB_XS.jpg',
				        width: Math.round(item.width  * item.th_xs_factor),
				        height: Math.round(item.height  * item.th_xs_factor)
			        });
	            }
		        if (item.th_s_factor !== 0) {
			        item.thumb.push({
				        img: item.app_dir + '/THUMB_S.jpg',
				        width: Math.round(item.width  * item.th_s_factor),
				        height: Math.round(item.height  * item.th_s_factor)
			        });
		        }
		        if (item.th_m_factor !== 0) {
			        item.thumb.push({
				        img: item.app_dir + '/THUMB_M.jpg',
				        width: Math.round(item.width  * item.th_m_factor),
				        height: Math.round(item.height  * item.th_m_factor)
			        });
		        }
		        if (item.th_l_factor !== 0) {
			        item.thumb.push({
				        img: item.app_dir + '/THUMB_L.jpg',
				        width: Math.round(item.width  * item.th_l_factor),
				        height: Math.round(item.height  * item.th_l_factor)
			        });
		        }
	        },

	        pickPhoto: function(item, width) {
		        // check params
		        if (item === null) {
			        return;
		        }
		        // find a suitable thumbnail
		        for (var i = 0; i < item.thumb.length; i++) {
			        if (item.thumb[i].width > width) {
				        item.bestImg = item.thumb[i].img;
				        break;
			        }
		        }
		        // if we didn't find the suitable thumbnail, use origin photo
		        if (!angular.isDefined(item.bestImg)) {
			        item.bestImg = item.url;
		        }
	        },

	        checkAlbums: function(items) {
		        if (!angular.isArray(items)) {
			        return;
		        }
		        items.forEach(function(elem, index) {
			        service.checkAlbum(elem);
		        });
	        },

	        checkAlbum: function(item) {
		        // check params
		        if (item === null) {
			        return;
		        }
		        // translate default album name
		        if (item.album_id === 0) {
			        item.name = $translate.instant('photo.default_album.profile_album');
		        } else if (item.album_id === 1) {
			        item.name = $translate.instant('photo.default_album.wall_album');
		        }
			}
		};

        return service;
    }]);
