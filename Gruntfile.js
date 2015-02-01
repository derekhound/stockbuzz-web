'use strict';

module.exports = function(grunt) {

	// load all grunt tasks
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// configurable paths
	var yeomanConfig = {
		app: 'app',
		dist: 'dist'
	};

	// config
	grunt.initConfig({
		yeoman: yeomanConfig,

		clean: {
			disp: {
				files: [{
					dot: true,
					src: [
						'.tmp',
						'<%= yeoman.dist %>/*'
					]
				}]
			}
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			app: [
				'Gruntfile.js',
				'<%= yeoman.app %>/scripts/**/*.js'
			]
		},

		// compile less files
		less: {
			app: {
				options: {
					strictMath: true
				},
				files: {
					'<%= yeoman.app %>/styles/main.css': ['<%= yeoman.app %>/styles/less/main.less']
				}
			}
		},
		// concat json files
		'merge-json': {
			'zh-TW': {
				files: {
					'<%= yeoman.app %>/language/locale_zh-TW.json': ['<%= yeoman.app %>/language/zh-TW/*.json']
				}
			}
		},

		// copy html
		htmlmin: {
			dist: {
				options: {

				},
				files: [{
					expand: true,
					cwd: '<%= yeoman.app %>',
					src: ['*.html', 'views/*.html', 'scripts/**/*.html'],
					dest: '<%= yeoman.dist %>'
				}]
			}
		},
		// copy others (images, language, and etc.)
		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= yeoman.app %>',
					dest: '<%= yeoman.dist %>',
					src: [
						'.htaccess',
						'robots.txt',
						'sitemap.xml',
						'bower_components/**/*',
						'images/**/*.{gif,png,jpg}',
						'styles/font-awesome/fonts/*',
						'styles/font-awesome/css/*',
						'language/*'
					]
				}]
			}
		},

		// the following five tasks is a combination
		useminPrepare: {
			html: '<%= yeoman.app %>/index.html',
			options: {
				dest: '<%= yeoman.dist %>'
			}
		},
		concat: {

		},
		cssmin: {

		},
		uglify: {
			options: {
				mangle: false
			}
		},
		usemin: {
			html: ['<%= yeoman.dist %>/{,*/}*.html'],
			css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
			options: {
				dirs: ['<%= yeoman.dist %>']
			}
		}
	});

	// task
	grunt.registerTask('app', [
		'less',
		'merge-json',
	]);

	grunt.registerTask('disp', [
		'htmlmin',
		'copy',
		'useminPrepare',
		'concat',
		'cssmin',
		'uglify',
		'usemin'
	]);

	grunt.registerTask('default', [
		'clean',
		'app',
		'disp'
	]);

};