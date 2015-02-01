// Reference: http://blog.jdriven.com/2013/09/how-angularjs-directives-renders-model-value-and-parses-user-input/
'use strict';

angular.module('directive.invalid-model-value-fix', [])

	.directive('input', function() {
		return {
			require: '?ngModel',
			restrict: 'E',
			link: function($scope, $element, $attrs, ngModelController) {
				var inputType = angular.lowercase($attrs.type);

				if (!ngModelController || inputType === 'radio' || inputType === 'checkbox') {
					return;
				}

				ngModelController.$formatters.unshift(function(value) {
					if (ngModelController.$invalid && angular.isUndefined(value) && typeof ngModelController.$modelValue === 'string') {
						return ngModelController.$modelValue;
					} else {
						return value;
					}
				});
			}
		};
	});