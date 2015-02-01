'use strict';

angular.module('auth')

	.controller('autNoticeCtrl', ['$scope', 'qbNotice', function($scope, qbNotice) {

		$scope.get= function() {
			return qbNotice.getCurrent();
		};

		$scope.remove = function(item) {
			qbNotice.remove(item);
		};

	}]);