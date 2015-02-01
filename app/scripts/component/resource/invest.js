'use strict';

angular.module('resource.invest', ['service.notice'])

    .factory('resInvest', ['$rootScope', '$http', '$q', 'qbNotice', 'BACKEND_SITE', function($rootScope, $http, $q, qbNotice, BACKEND_SITE) {

        var service = {

	        //------------------------------
	        // watch group
	        //------------------------------

	        get_watch_groups: function() {
		        var data = {};

		        return $http.post(BACKEND_SITE + '/invest/get_watch_groups', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        add_watch_group: function(name) {
		        var data = {
			        name: name
		        };

		        return $http.post(BACKEND_SITE + '/invest/add_watch_group', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        update_watch_group: function(group_id, name) {
		        var data = {
			        group_id: group_id,
			        name: name,
			        position: false
		        };

		        return $http.post(BACKEND_SITE + '/invest/update_watch_group', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        delete_watch_group: function(group_id) {
		        var data = {
			        group_id: group_id
		        };

		        return $http.post(BACKEND_SITE + '/invest/delete_watch_group', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        reorder_watch_groups: function(groups) {
		        var data = {
			        groups: groups
		        };

		        return $http.post(BACKEND_SITE + '/invest/reorder_watch_groups', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        //------------------------------
	        // watch
	        //------------------------------

	        get_watches: function(group_id, offset, limit) {
		        var data = {
			        group_id: group_id,
			        offset: offset,
			        limit: limit
		        };

		        return $http.post(BACKEND_SITE + '/invest/get_watches', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        add_watch: function(symbol_id, buy_price, sell_price, group_ids) {
		        var data = {
			        symbol_id: symbol_id,
			        buy_price: buy_price,
			        sell_price: sell_price,
			        group_ids: group_ids
		        };

		        return $http.post(BACKEND_SITE + '/invest/add_watch', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        update_watch: function(symbol_id, buy_price, sell_price, group_ids) {
		        var data = {
			        symbol_id: symbol_id,
			        buy_price: buy_price,
			        sell_price: sell_price,
			        group_ids: group_ids
		        };

		        return $http.post(BACKEND_SITE + '/invest/update_watch', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        delete_watch: function(symbol_id) {
		        var data = {
			        symbol_id: symbol_id
		        };

		        return $http.post(BACKEND_SITE + '/invest/delete_watch', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        belong_which_watch_groups: function(symbol_id) {
		        var data = {
			        symbol_id: symbol_id
		        };

		        return $http.post(BACKEND_SITE + '/invest/belong_which_watch_groups', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

            //------------------------------
	        // transaction
	        //------------------------------

	        get_transactions: function(symbol_id, running, filter, sidx, sord, offset, limit) {
                var data = {
	                sidx: sidx,
	                sord: sord,
	                offset: offset,
	                limit: limit
                };

		        if (symbol_id !== null) {
			        data.symbol_id = symbol_id;
		        }
		        if (running !== null) {
			        data.running = running;
		        }
		        if (filter !== null) {
			        data.filter = filter;
		        }

                return $http.post(BACKEND_SITE + '/invest/get_transactions', data).then(function(response) {
                    return response.data;
                }, qbNotice.errorHandler);
            },

	        add_transaction: function(data) {
		        return $http.post(BACKEND_SITE + '/invest/add_transaction', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        update_transaction: function(data) {
		        return $http.post(BACKEND_SITE + '/invest/update_transaction', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        delete_transaction: function(tranx_id) {
		        var data = {
			        tranx_id: tranx_id
		        };
		        return $http.post(BACKEND_SITE + '/invest/delete_transaction', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        get_symbols_in_transactions: function() {
		        var data = {};

		        return $http.post(BACKEND_SITE + '/invest/get_symbols_in_transactions', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        detect_running_state: function() {
		        var data = {};

		        return $http.post(BACKEND_SITE + '/invest/detect_running_state', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        add_running_state: function(tranx_id) {
		        var data = {
					tranx_id: tranx_id
				};
		        return $http.post(BACKEND_SITE + '/invest/add_running_state', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        delete_running_state: function(tranx_id) {
		        var data = {
					tranx_id: tranx_id
				};
		        return $http.post(BACKEND_SITE + '/invest/delete_running_state', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        //------------------------------
	        // profit
	        //------------------------------

	        get_profits: function(running, sidx, sord, offset, limit) {
		        var data = {
			        running: running,
			        sidx: sidx,
			        sord: sord,
			        offset: offset,
			        limit: limit
		        };

		        return $http.post(BACKEND_SITE + '/invest/get_profits', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        get_profit_summary: function(running) {
		        var data = {
			        running: running
		        };

		        return $http.post(BACKEND_SITE + '/invest/get_profit_summary', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        get_running_pies: function(user_id, limit) {
		        var data = {
			        user_id: user_id,
					limit: limit
		        };

		        return $http.post(BACKEND_SITE + '/invest/get_running_pies', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        },

	        //------------------------------
	        // analysis
	        //------------------------------

	        get_analyses: function(user_ids) {
		        var data = {
			        user_ids: user_ids
		        };

		        return $http.post(BACKEND_SITE + '/invest/get_analyses', data).then(function(response) {
			        return response.data;
		        }, qbNotice.errorHandler);
	        }
        };

        return service;
    }]);
