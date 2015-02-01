'use strict';

angular.module('setting')

	.controller('setProfileCtrl', ['$scope', '$translate', 'resUser', 'qbNotice', function($scope, $translate, resUser, qbNotice) {

		//----------------------------------------
		// Define
		//----------------------------------------

		$scope.data = {
			photo: '',
			fullname: '',
			website: '',
			biographic: '',
			year: '',
			month: '',
			day: '',
			sex: ''
		};

		$scope.years   = [];
		$scope.monthes = [];
		$scope.days    = [];

		//----------------------------------------
		// Error Function
		//----------------------------------------

		$scope.fullnameErrorStr = function(field) {
			var str = '';
			if (field.$error.required) {
				str = $translate.instant('setting.profile.help.I_FULLNAME');
			}
			return str;
		};

		$scope.biographicErrorStr = function(field) {
			var str = '';
			if (field.$error.maxlength) {
				str = $translate.instant('setting.profile.help.E_BIOGRAPHIC_LENGTH');
			}
			return str;
		};

		//----------------------------------------
		// Main
		//----------------------------------------

		$scope.getCurrentUser = function() {
			resUser.getCurrentUser().then(function(data){
				$scope.data.photo      = data.avatar;
				$scope.data.fullname   = data.fullname;
				$scope.data.website    = data.website;
				$scope.data.biographic = data.biographic;
				$scope.data.sex        = data.sex;

				// birthday
				var res = data.birthday.split('-');
				$scope.data.year       = parseInt(res[0]);
				$scope.data.month      = parseInt(res[1]);
				$scope.data.day        = parseInt(res[2]);
			});
		};

		$scope.ok = function() {
			if ($scope.form.$invalid) {
				return;
			}

			// birthday
			var birthday = $scope.data.year + '-' + $scope.data.month + '-' + $scope.data.day;

			resUser.updateProfile($scope.data.fullname, $scope.data.website, $scope.data.biographic, birthday, $scope.data.sex).then(function(data) {
				var msg;

				if (data.success) {
					msg = 'setting.profile.notice.success';
					qbNotice.pushForCurrentRoute(msg, 'success', {}, {}, true);
				} else {
					msg = 'webapi-errors.' + data.errno;
					qbNotice.pushForCurrentRoute(msg, 'error', {}, {}, true);
				}

				// clear user cache
				resUser.clearCache();
			});
		};

		//----------------------------------------
		// Init
		//----------------------------------------

		var i;

		// year
		var thisYear = new Date().getFullYear();
		for (i = thisYear; i > 1900; i--) {
			$scope.years.push({value: i, name: i});
		}

		// month
		for (i = 1; i <= 12; i++) {
			var name = i + ' ' + $translate.instant('setting.profile.text.month');
			$scope.monthes.push({value: i, name: name});
		}

		// day
		for (i = 1; i <= 31; i++) {
			$scope.days.push({value: i, name: i});
		}

		// get current user
		$scope.getCurrentUser();
	}]);
