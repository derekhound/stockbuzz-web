 'use strict';

angular.module('service.tweet', [])

    .factory('qbTweet', ['$rootScope', '$translate', 'qbPhoto', 'momentFilter', function($rootScope, $translate, qbPhoto, momentFilter) {

		var TEXT_CONTROL_CHARACTER = String.fromCharCode(0x01);

        var htmlspecialchars = function(str) {
            return str.
                replace(/&/g, '&amp;').
                replace(/"/g, '&quot;').
                replace(/'/g, '&apos;').
                replace(/</g, '&lt;').
                replace(/>/g, '&gt;');
        };

        var at_tag_decode = function(str) {
            var pattern = TEXT_CONTROL_CHARACTER + 'at_@(.*?)_' + TEXT_CONTROL_CHARACTER;
            var regexp  = new RegExp(pattern, 'g');
            str = str.replace(regexp, '<a href="#/home/user/$1">@$1</a>');

            return str;
        };

        var dollarsign_decode = function(str) {
            var pattern = TEXT_CONTROL_CHARACTER + 'do_\\$(.*?)_' + TEXT_CONTROL_CHARACTER;
            var regexp  = new RegExp(pattern, 'g');
            str = str.replace(regexp, '<a href="#/stock/$1/portal/post">$$$1</a>'); // replacement text syntax: $$ => $

            return str;
        };

		var link_decode = function(str) {
            var pattern = TEXT_CONTROL_CHARACTER + 'li_(.*?)_' + TEXT_CONTROL_CHARACTER;
            var regexp  = new RegExp(pattern, 'g');
            str = str.replace(regexp, '<a href="$1" target="_blank" rel="nofollow">$1</a>');

            return str;
        };

		var paragraph_decode = function(str) {
			// check params
			if (str === null) {
				return str;
			}

			//
			str = '<p>' + str + '</p>';
			// \n\n  => </p><p>
			str = str.replace(/(\n){2,}/ig, '</p><p>');
			// \n    => <br/>
			str = str.replace(/\n/ig, '<br/>');

			return str;
		};

        var remove_control_word = function(str) {
	        var pattern, regexp;

            // the first part
            pattern = TEXT_CONTROL_CHARACTER + '(\\w+?)_';
            regexp  = new RegExp(pattern, 'g');
            str = str.replace(regexp, '');

            // the second part
            pattern = '_' + TEXT_CONTROL_CHARACTER;
            regexp  = new RegExp(pattern, 'g');
            str = str.replace(regexp, '');

            return str;
        };

		var summary_extract = function(str) {

			var summary = '';
			var i, pos;

			var br_str = '<br/>',
				br_pos = 0,
				br_len = br_str.length;

			var p_str = '</p>',
				p_pos = 0,
				p_len = p_str.length;

			// find the 4th <br/>
			for (i = 0; i < 4 && br_pos !== -1; i++) {
				if (i === 0) {
					br_pos = str.indexOf(br_str, br_pos);
				} else {
					br_pos = str.indexOf(br_str, br_pos + br_len);
				}
			}

			// find the 2th </p>
			for (i = 0; i < 2 && p_pos !== -1; i++) {
				if (i === 0) {
					p_pos = str.indexOf(p_str, p_pos);
				} else {
					p_pos = str.indexOf(p_str, p_pos + p_len);
				}
			}

			// summary
			if (br_pos > 0 && p_pos > 0) {
				pos = Math.min(br_pos, p_pos);
			} else if (br_pos > 0) {
				pos = br_pos;
			} else if (p_pos > 0) {
				pos = p_pos;
			} else {
				pos = -1;
			}
			if (pos !== -1) {
				summary = str.substr(0, pos) + '</p>';
			}

			// check again
			if (str.length === summary.length) {
				summary = '';
			}

			return summary;
		};

		var process_utime = function(item) {
			if (item === null) {
				return;
			}

			// convert to microseconds
			item.create_utime = item.create_utime * 1000;
			item.moment = momentFilter(item.create_utime);
		};

		var checkText = function(tweet) {
			if (tweet === null) {
				return;
			}

			// Process title
			var title = tweet.title || '';
			title = htmlspecialchars(title);

			// process text
			var text = tweet.text || '';
			text = htmlspecialchars(text);
			text = at_tag_decode(text);
			text = dollarsign_decode(text);
			text = link_decode(text);
			text = paragraph_decode(text);

			// process summary
			tweet.title 	= title;
			tweet.text 		= text;
			tweet.summary 	= summary_extract(tweet.text);
			tweet.is_expand = tweet.summary.length === 0;
		};

        var service = {
	        checkPosts: function(posts) {
		        posts.forEach(function(elem, index) {
			        service.checkPost(elem);
		        });
	        },
	        checkPost: function(post) {
		        // post
		        process_utime(post);
		        checkText(post);
		        qbPhoto.checkAvatar(post);
		        qbPhoto.checkPhotos(post.photos);

		        // post's quote
		        if (post.quote) {
			        process_utime(post.quote);
			        checkText(post.quote);
			        qbPhoto.checkAvatar(post.quote);
			        qbPhoto.checkPhotos(post.quote.photos);
		        }

		        // post's comment
		        post.show_comment   = false;
		        post.since_id       = false;
		        post.comments       = [];
	        },
	        checkComments: function(comments) {
		        comments.forEach(function(elem, index) {
			        service.checkPost(elem);
		        });
	        },
	        checkComment: function(comment) {
		        // convert to microseconds
		        comment.create_utime = comment.create_utime * 1000;
				comment.moment = momentFilter(comment.create_utime);

		        // avatar
		        qbPhoto.checkAvatar(comment);

		        // check text
		        checkText(comment);
	        }
        };

        return service;
    }]);
