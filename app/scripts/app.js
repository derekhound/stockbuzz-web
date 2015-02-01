'use strict';

angular.module('app', [
		'ngSanitize',
		'ui.router',
		'ui.bootstrap',                 // angular-bootstrap
		'pascalprecht.translate',       // angular-translate
		'ezfb',                         // angular-easyfb
		'checklist-model',              // checklist model
		'monospaced.elastic',           // textarea autogrow
		'infinite-scroll',              // infinite scroll
		'component',
		'root',
		'auth',

		'home',
		'photo',
		'invest',

		'hot',
		'quote',
		'search',
		'setting',
		'person',
		'stock',
		'tweet'
	])

	// translate config
	.config(['$translateProvider', function ($translateProvider) {

		// static file loader
		$translateProvider.useStaticFilesLoader({
		    prefix: 'language/locale_',
		    suffix: '.json'
		});

		// prefer and fallback language
		$translateProvider.preferredLanguage('zh-TW');

		// log missing translations
		$translateProvider.useMissingTranslationHandlerLog();
	}])

	// easyfb config
	.config(['ezfbProvider', function (ezfbProvider) {
		ezfbProvider.setInitParams({
			appId: 'FB_APP_ID'
		});
	}])

	// Image url white list. This app uses image blob url. If we don't modify white list,
	// angular will add a 'unsafe' prefix and lead to error.
	.config(['$compileProvider', function($compileProvider) {
		var oldWhiteList = $compileProvider.imgSrcSanitizationWhitelist();
		$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//);
	}])

	// security
    .run(['security', function(security) {
        security.autoLogin();
    }])

	.config(function($stateProvider, $urlRouterProvider) {

		// For any unmatched url, redirect to /state1
		//$urlRouterProvider.otherwise("/guest/index");

		// Now set up the states
		$stateProvider
			// root
			.state('empty', {
				url: '',
				views: {
					'viewA': { templateUrl: 'scripts/root/viewA.html' },
					'viewB': { templateUrl: 'scripts/root/viewB.html' }
				}
			})
			.state('root', {
				url: '/',
				views: {
					'viewA': { templateUrl: 'scripts/root/viewA.html' },
					'viewB': { templateUrl: 'scripts/root/viewB.html' }
				}
			})

			// auth
			.state('auth', {
				url: '/auth',
				views: {
					'viewA': { templateUrl: 'scripts/auth/viewA.html' },
					'viewB': { templateUrl: 'scripts/auth/viewB.html' }
				}
			})
			.state('auth.signin', {
				url: '/signin',
				templateUrl: 'scripts/auth/signin/view.html'
			})
			.state('auth.signup', {
				url: '/signup',
				templateUrl: 'scripts/auth/signup/view.html'
			})
			.state('auth.activate', {
				url: '/activate/:code',
				templateUrl: 'scripts/auth/activate/view.html'
			})
			.state('auth.forgot_password', {
				url: '/forgot_password',
				templateUrl: 'scripts/auth/forgot_password/view.html'
			})
			.state('auth.reset_password', {
				url: '/reset_password/:code',
				templateUrl: 'scripts/auth/reset_password/view.html'
			})
			.state('auth.send_activation_email', {
				url: '/send_activation_email',
				templateUrl: 'scripts/auth/send_activation_email/view.html'
			})

			//------------------------------
			// home
			//------------------------------
			.state('home', {
				url: '/home',
				views: {
					'viewA': { templateUrl: 'scripts/home/viewA.html' },
					'viewB': { templateUrl: 'scripts/home/viewB.html' }
				}
			})
			// portal
			.state('home.portal', {
				url: '/portal',
				templateUrl: 'scripts/home/portal/view.html'
			})
			.state('home.portal.news', {
				url: '/news',
				templateUrl: 'scripts/home/portal/news/news.html'
			})
			.state('home.portal.favorite', {
				url: '/favorite',
				templateUrl: 'scripts/home/portal/favorite/favorite.html'
			})
			// photo
			.state('home.photo', {
				url: '/photo',
				templateUrl: 'scripts/home/photo/view.html'
			})
			.state('home.photo.album', {
				url: '/album/:username',
				templateUrl: 'scripts/home/photo/album/album.html'
			})
			.state('home.photo.album_photos', {
				url: '/album_photos/:username/:album_id',
				templateUrl: 'scripts/home/photo/album_photos/album-photos.html'
			})
			// invest
			.state('home.invest', {
				url: '/invest',
				templateUrl: 'scripts/home/invest/view.html'
			})
			.state('home.invest.watch', {
				url: '/watch',
				templateUrl: 'scripts/home/invest/watch/watch.html'
			})
			.state('home.invest.now_profit', {
				url: '/now_profit',
				templateUrl: 'scripts/home/invest/now_profit/now-profit.html'
			})
			.state('home.invest.past_profit', {
				url: '/past_profit',
				templateUrl: 'scripts/home/invest/past_profit/past-profit.html'
			})
			.state('home.invest.transaction', {
				url: '/transaction/:symbol_id/:state',
				templateUrl: 'scripts/home/invest/transaction/transaction.html'
			})

			//------------------------------
			// hot
			//------------------------------
			.state('hot', {
				url: '/hot',
				views: {
					'viewA': { templateUrl: 'scripts/hot/viewA.html' },
					'viewB': { templateUrl: 'scripts/hot/viewB.html' }
				}
			})
			.state('hot.hot_discuss', {
				url: '/hot_discuss',
				templateUrl: 'scripts/hot/hot_discuss/view.html'
			})
			.state('hot.hot_news', {
				url: '/hot_news',
				templateUrl: 'scripts/hot/hot_news/view.html'
			})
			.state('hot.hot_announce', {
				url: '/hot_announce',
				templateUrl: 'scripts/hot/hot_announce/view.html'
			})
			.state('hot.new_post', {
				url: '/new_post',
				templateUrl: 'scripts/hot/new_post/view.html'
			})

			//------------------------------
			// quote
			//------------------------------
			.state('quote', {
				url: '/quote',
				views: {
					'viewA': { templateUrl: 'scripts/quote/viewA.html' },
					'viewB': { templateUrl: 'scripts/quote/viewB.html' }
				}
			})
			.state('quote.rank', {
				url: '/rank',
				templateUrl: 'scripts/quote/rank/view.html'
			})
			.state('quote.category', {
				url: '/category',
				templateUrl: 'scripts/quote/category/view.html'
			})

			//------------------------------
			// search
			//------------------------------
			.state('search', {
				url: '/search',
				views: {
					'viewA': { templateUrl: 'scripts/search/viewA.html' },
					'viewB': { templateUrl: 'scripts/search/viewB.html' }
				}
			})
			.state('search.person', {
				url: '/person',
				templateUrl: 'scripts/search/person/view.html'
			})
			.state('search.stock', {
				url: '/stock',
				templateUrl: 'scripts//search/stock/view.html'
			})

			//------------------------------
			// setting
			//------------------------------
			.state('setting', {
				url: '/setting',
				views: {
					'viewA': { templateUrl: 'scripts/setting/viewA.html' },
					'viewB': { templateUrl: 'scripts/setting/viewB.html' }
				}
			})
			.state('setting.profile', {
				url: '/profile',
				templateUrl: 'scripts/setting/profile/profile.html'
			})
			.state('setting.account', {
				url: '/account',
				templateUrl: 'scripts/setting/account/account.html'
			})
			.state('setting.password', {
				url: '/password',
				templateUrl: 'scripts/setting/password/password.html'
			})

			//------------------------------
			// user
			//------------------------------
			.state('home.user', {
				url: '/user/:username',
				template: '',
				controller: function($state, resUser) {
					resUser.getUserByUsername($state.params.username).then(function(data){
						var user = data;
						// redirect to person page
						if (user.type === 'person') {
							$state.go('person.post', {username: user.username}, {location: 'replace'});
						// redirect to stock page
						} else if (user.type === 'stock') {
							$state.go('stock.portal.post', {username: user.username}, {location: 'replace'});
						}
					});
				}
			})

			//------------------------------
			// person
			//------------------------------
			.state('person', {
				url: '/person/:username',
				views: {
					'viewA': { templateUrl: 'scripts/person/viewA.html' },
					'viewB': { templateUrl: 'scripts/person/viewB.html' }
				},
				resolve: {
					preload: function($stateParams, resUser) {
						var username = $stateParams.username;
						return resUser.getUserByUsername(username);
					}
				}
			})
			.state('person.post', {
				url: '/post',
				templateUrl: 'scripts/person/post/post.html'
			})
			.state('person.follow_person', {
				url: '/follow_person',
				templateUrl: 'scripts/person/follow_person/follow-person.html'
			})
			.state('person.follower', {
				url: '/follower',
				templateUrl: 'scripts/person/follower/follower.html'
			})
			.state('person.follow_stock', {
				url: '/follow_stock',
				templateUrl: 'scripts/person/follow_stock/follow-stock.html'
			})
			.state('person.running', {
				url: '/running',
				templateUrl: 'scripts/person/running/running.html'
			})

			//------------------------------
			// stock
			//------------------------------
			.state('stock', {
				url: '/stock/:username',
				views: {
					'viewA': { templateUrl: 'scripts/stock/viewA.html' },
					'viewB': { templateUrl: 'scripts/stock/viewB.html' }
				}
			})
			// portal
			.state('stock.portal', {
				url: '/portal',
				templateUrl: 'scripts/stock/portal/view.html'
			})
			.state('stock.portal.post', {
				url: '/post',
				templateUrl: 'scripts/stock/portal/post/post.html'
			})
			.state('stock.portal.follower', {
				url: '/follower',
				templateUrl: 'scripts/stock/portal/follower/follower.html'
			})
			// technique
			.state('stock.technique', {
				url: '/technique',
				templateUrl: 'scripts/stock/technique/view.html'
			})

			//------------------------------
			// tweet
			//------------------------------
			.state('tweet', {
				url: '/tweet',
				views: {
					'viewA': { templateUrl: 'scripts/tweet/viewA.html' },
					'viewB': { templateUrl: 'scripts/tweet/viewB.html' }
				}
			})
			.state('tweet.post', {
				url: '/post/:post_id',
				templateUrl: 'scripts/tweet/post/view.html'
			})
		;
	});
