'use strict';

angular.module('security')

    // This http interceptor listens for authentication failures
    .factory('securityInterceptor', ['$injector', '$location', 'securityRetryQueue', function($injector, $location, queue) {
        return function(promise) {

            // Intercept failed requests
            return promise.then(null, function(response) {
                if (response.status === 401) {

                    // redirect to webroot, don't open login dialog
                    //$location.path('/');

                    // The request bounced because it was not authorized - add a
                    // new request to the retry queue
                    promise = queue.pushRetryFn('unauthorized-server', function retryRequest() {
                        // We must use $injector to get the $http service to prevent
                        // circular dependency
                        return $injector.get('$http')(response.config);
                    });
                }
                return promise;
            });
        };
    }])

    // We have to add the interceptor to the queue as a string because the interceptor
    // depends upon service instances that are not available in the config block.
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.responseInterceptors.push('securityInterceptor');
    }]);