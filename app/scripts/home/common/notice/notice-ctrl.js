'use strict';

angular.module('home')

	.controller('homNoticeCtrl', ['$scope', 'qbNotice', function($scope, qbNotice) {

		$scope.get= function() {
			return qbNotice.getCurrent();
		};

		$scope.remove = function(item) {
			qbNotice.remove(item);
		};

	}]);