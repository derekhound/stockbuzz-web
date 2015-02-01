'use strict';

angular.module('filter.moment', [])

    .filter('date_moment', ['$translate', '$filter', function($translate, $filter) {
        return function(utime) {
            var time = $filter('date')(utime, 'M'+$translate('filter.moment.month')+'d'+$translate('filter.moment.day'));
            return time;
        };
    }])

    .filter('time_moment', ['$filter', function($filter) {
        return function(utime) {
            var time = $filter('date')(utime, 'HH:mm');
            return time;
        };
    }])

    .filter('moment', ['$translate', '$filter', function($translate, $filter) {

		var now     = $translate.instant('filter.moment.now');
		var month   = $translate.instant('filter.moment.month');
		var day     = $translate.instant('filter.moment.day');
		var seconds = $translate.instant('filter.moment.seconds');
		var minutes = $translate.instant('filter.moment.minutes');
		var hours   = $translate.instant('filter.moment.hours');

        return function(utime) {

            // current unix timestamps (microseconds)
            var now_utime = (new Date()).getTime();

            // transform timestamps from microseconds to seconds
            var interval = Math.ceil((now_utime - utime) / 1000);

            //
            var time;

            // negative value
            if (interval < -60) {
                time = '';

            // now
            } else if (interval < 5) {
                time = now;

            // less than 60 seconds
            } else if (interval < 60) {
                interval = Math.ceil(interval);
                time = interval + seconds;

            // less than 60 minutes
            } else if (interval < 3600) {
                interval = Math.ceil(interval / 60);
                time = interval + minutes;

            // less than 1 day
            } else if (interval < 86400) {
                interval = Math.ceil(interval / 3600);
                time = interval + hours;

            } else {
	            time = $filter('date')(utime, 'M'+month+'d'+day+' HH:mm');
            }

            return time;
        };
    }]);
