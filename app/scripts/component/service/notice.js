'use strict';

angular.module('service.notice', [])

    .factory('qbNotice', ['$rootScope', '$timeout', '$q', '$translate', function($rootScope, $timeout, $q, $translate) {

        // STICKY notifications always shown in each route.
        // ROUTE_CURRENT notifications show in current route.
        // ROUTE_NEXT notifications show in next route.
        var notifications = {
            'STICKY' : [],
            'ROUTE_CURRENT' : [],
            'ROUTE_NEXT' : []
        };

        // when route changed successfully, move ROUTE_NEXT to ROUTE_CURRENT
        $rootScope.$on('$routeChangeSuccess', function() {
            notifications.ROUTE_CURRENT.length = 0;
            notifications.ROUTE_CURRENT = angular.copy(notifications.ROUTE_NEXT);
            notifications.ROUTE_NEXT.length = 0;
        });

		// when state changed successfully, move ROUTE_NEXT to ROUTE_CURRENT
		$rootScope.$on('$stateChangeSuccess', function() {
			notifications.ROUTE_CURRENT.length = 0;
			notifications.ROUTE_CURRENT = angular.copy(notifications.ROUTE_NEXT);
			notifications.ROUTE_NEXT.length = 0;
		});

        var generateKey = function() {
            var min = 1000000;
            var max = 9999999;
            return Math.floor(Math.random()*(max-min+1)+min);
        };

        var addNotification = function(typeArray, notification) {
            if (!angular.isObject(notification)) {
                throw new Error('Only object can be added to the notification service');
            }

            // push into type array
            typeArray.push(notification);

            // remove it after 3 seconds
            $timeout(function() {
                service.remove(notification);
            }, 3000);

            return notification;
        };

        var makeNotification = function(msg, type, interpolateParams, otherProperties, translate) {
            var id = generateKey();
	        var message = (translate) ? $translate.instant(msg) : msg;

            return angular.extend({
                id: id,
                message: message,
                type: type
            }, otherProperties);
        };

        var service = {

            getCurrent: function() {
                return [].concat(notifications.STICKY, notifications.ROUTE_CURRENT);
            },

            pushSticky: function(message, type, interpolateParams, otherProperties, translate) {
                var notification = makeNotification(message, type, interpolateParams, otherProperties, translate);
                return addNotification(notifications.STICKY, notification);
            },

            pushForCurrentRoute: function(message, type, interpolateParams, otherProperties, translate) {
                var notification = makeNotification(message, type, interpolateParams, otherProperties, translate);
                return addNotification(notifications.ROUTE_CURRENT, notification);
            },

            pushForNextRoute: function(message, type, interpolateParams, otherProperties, translate) {
                var notification = makeNotification(message, type, interpolateParams, otherProperties, translate);
                return addNotification(notifications.ROUTE_NEXT, notification);
            },

            remove: function(notification) {
                angular.forEach(notifications, function(typeArray) {
                    for (var i = 0; i < typeArray.length; i++) {
                        if (typeArray[i].id === notification.id) {
                            typeArray.splice(i, 1);
                            break;
                        }
                    }
                });
            },

            removeAll: function() {
                angular.forEach(notifications, function(typeArray) {
                    typeArray.length = 0;
                });
            },

            errorHandler: function(reason) {
                if (reason) {
                    if (reason.status === 401) {
                        if (notifications.ROUTE_CURRENT.length === 0) {
                            service.pushForCurrentRoute('notice.backend.unauthorized_error', 'error', {}, {}, true);
                        }
                    } else if (reason.status === 500) {
                        service.pushForCurrentRoute('notice.backend.internal_server_error', 'error', {}, {}, true);
                    } else {
                        service.pushForCurrentRoute('notice.backend.unknow_error', 'error', {}, {}, true);
                    }
                }
                return $q.reject(reason);
            }
        };

        return service;
    }]);
