'use strict';

angular.module('event')

	.directive('qbEvents', ['$compile', '$parse', '$translate', function($compile, $parse, $translate) {

        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'scripts/component/event/event-dropdown.html',
	        scope: {
				'events': '='
	        },

            link: function(scope, element, attrs) {

				//scope.events = events;

				console.log(scope.events);
			}
		};
    }]);
