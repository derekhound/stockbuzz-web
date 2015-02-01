'use strict';

angular.module('timeline')

	.directive('qbCommentBox', ['$compile', function($compile) {

		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'scripts/component/timeline/comment-box.html',
			scope: {
				'currentUser': '=',
				'rankId': '@',
				'onSubmitComment': '&'
			},

			link: function(scope, element, attrs) {

				scope.text = '';
				scope.busy = false;

				scope.expand = function() {
					element.addClass('open');
				};

				scope.submit = function() {
					// if busy, skip request
					if (scope.busy) {
						return;
					}
					scope.busy = true;

					// check parameter
					if (scope.text.length === 0) {
						return;
					}

					// do it
					var data = {
						text: scope.text,
						rank_id: scope.rankId
					};
					scope.onSubmitComment(data).then(function(data) {
						if (data.success) {
							scope.text = '';
						}
						scope.busy = false;
					});
				};
			}
		};
	}]);

