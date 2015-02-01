'use strict';

angular.module('timeline')

	.directive('qbPhotoWall', ['$compile', '$window', function($compile, $window) {

		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'scripts/component/timeline/photo-wall.html',
			scope: {
				'photos': '='
			},

			link: function(scope, element, attrs) {

				var options = {
					margin: 6,
					border: 1,
					maxHeight: 310
				};

				// We can calculate height from width
				// height = width / (w1/h1 + w2/h2 + w3/h3 + ...)
				var getHeight = function(photos, width) {
					width = width - options.margin * photos.length - options.border * 2 * photos.length;

					var h = 0;
					for (var i = 0; i < photos.length; i++) {
						h += photos[i].width / photos[i].height;
					}

					return width / h;
				};

				// When we determine the height of row, we know how to calculate width of each photo
				var setHeight = function(photos, height) {
					for (var i = 0; i < photos.length; i++) {
						var width = height * photos[i].width / photos[i].height;
						// apply width and height to photo wall (pw)
						photos[i].pw = {
							width: Math.floor(width),
							height: Math.floor(height)
						};
						// find a suitable thumbnail
						for (var j = 0; j < photos[i].thumb.length; j++) {
							if (photos[i].pw.width < photos[i].thumb[j].width) {
								photos[i].pw.img = photos[i].thumb[j].img;
								break;
							}
						}
						// if we didn't find the suitable thumbnail, use origin photo
						if (!angular.isDefined(photos[i].pw.img)) {
							photos[i].pw.img = photos[i].url;
						}
					}
				};

				// recalculate width and height for each photo
				var run = function() {
					// the width of photo wall
					var width = element.width();
					var n = 0;
					var items = scope.photos;
					var slice, height;

					if (items.length === 0) {
						return;
					}

					next:
					for (var i = 1; i < items.length + 1; i++) {
						slice = items.slice(0, i);
						height = getHeight(slice, width);

						if (height < options.maxHeight) {
							setHeight(slice, height);
							n++;
							items = items.slice(i);

							i = 0;
							continue next;
						}
					}
					if (slice.length > 0) {
						height = getHeight(slice, width);
						setHeight(slice, Math.min(options.maxHeight, height));
						n++;
						items = [];
					}
				};

				scope.getResolution = function(photo) {
					var style = {
						width: photo.pw.width + 'px',
						height: photo.pw.height + 'px'
					};
					return style;
				};

				// when window resize, recalculate
				angular.element($window).bind('resize', function() {
					scope.$apply(
						run()
					);
				});

				//------------------------------
				// Init
				//------------------------------
				run();
			}
		};
	}]);

