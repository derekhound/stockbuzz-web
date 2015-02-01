'use strict';

angular.module('resource.event', ['service.notice'])

    .factory('resEvent', ['$rootScope', '$http', '$q', 'qbNotice', 'BACKEND_SITE', function($rootScope, $http, $q, qbNotice, BACKEND_SITE) {

        var service = {

			get_events_by_page: function(offset, limit) {
				var data = {
					offset: offset,
					limit: limit
				};

		        return $http.post(BACKEND_SITE + '/event/get_events_by_page', data).then(function(response) {
					return response.data;
		        }, qbNotice.errorHandler);
			}
        };

        return service;
    }]);
