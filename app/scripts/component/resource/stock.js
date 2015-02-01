'use strict';

angular.module('resource.stock', ['service.notice'])

    .factory('resStock', ['$http', '$q', 'qbNotice', 'qbPhoto', 'BACKEND_SITE', function($http, $q, qbNotice, qbPhoto, BACKEND_SITE) {

        var service = {

	        //------------------------------
	        // Symbol
	        //------------------------------

	        search: function(query, filter, since_id, count) {
		        var data = {
			        query: query,
			        filter: filter,
			        since_id: since_id,
			        count: count
		        };
		        return $http.post(BACKEND_SITE + '/stock/search', data).then(function(response) {
			        // check avatar
			        if (response.data.success) {
				        qbPhoto.checkAvatars(response.data.users);
			        }
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        //------------------------------
	        // Quote
	        //------------------------------

	        get_quotes: function(symbol_ids) {
		        var data = {
			        symbol_ids: symbol_ids
		        };
		        return $http.post(BACKEND_SITE + '/stock/get_quotes', data).then(function(response) {
			        if (response.data.success && response.data.quotes.length > 0) {
				        // convert to microseconds
				        response.data.quotes.forEach(function(elem) {
					        elem.last_trade_utime = elem.last_trade_utime * 1000;
				        });
			        }
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        get_quote_prices: function(symbol_ids) {
		        var data = {
			        symbol_ids: symbol_ids
		        };
		        return $http.post(BACKEND_SITE + '/stock/get_quote_prices', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        get_quotes_by_page: function(country, market, type, group_id, sidx, sord, offset, limit) {
		        var data = {
			        country: country,
			        market: market,
			        type: type,
			        group_id: group_id,
			        sidx: sidx,
			        sord: sord,
			        offset: offset,
			        limit: limit
		        };
		        return $http.post(BACKEND_SITE + '/stock/get_quotes_by_page', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        //------------------------------
	        // History Price
	        //------------------------------

	        get_recent_daily_prices: function(symbol_id, year, month) {
		        var data = {
			        'symbol_id': symbol_id,
			        'year': year,
			        'month': month
		        };
		        return $http.post(BACKEND_SITE + '/stock/get_recent_daily_prices', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        get_recent_weekly_prices: function(symbol_id, year, month) {
		        var data = {
			        'symbol_id': symbol_id,
			        'year': year,
			        'month': month
		        };
		        return $http.post(BACKEND_SITE + '/stock/get_recent_weekly_prices', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        get_recent_monthly_prices: function(symbol_id, year, month) {
		        var data = {
			        'symbol_id': symbol_id,
			        'year': year,
			        'month': month
		        };
		        return $http.post(BACKEND_SITE + '/stock/get_recent_monthly_prices', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        }
        };

        return service;
    }]);
