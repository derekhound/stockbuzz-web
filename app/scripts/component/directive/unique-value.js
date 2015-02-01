// Reference: http://weblogs.asp.net/dwahlin/archive/2013/09/24/building-a-custom-angularjs-unique-value-directive.aspx

'use strict';

angular.module('directive.unique-value', [])

	.directive('uniqueValue', ['$http', 'BACKEND_SITE', function($http, BACKEND_SITE) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function (scope, element, attrs, ngModel) {
				element.bind('blur', function () {

					if (!ngModel || !element.val()) {
						return;
					}

					var currentValue = element.val();
					var data = {
						key: attrs.uniqueValue,     // only support email or username
						value: currentValue
					};
					return $http.post(BACKEND_SITE + '/user/is_unique_value', data).then(function(response) {
						var unique = response.data.unique;
						//Ensure value that being checked hasn't changed
						//since the Ajax call was made
						if (currentValue === element.val()) {
							ngModel.$setValidity('unique', unique);
						}
					}, function() {
						//Probably want a more robust way to handle an error
						//For this demo we'll set unique to true though
						ngModel.$setValidity('unique', true);
					});
				});
			}
		};
	}]);