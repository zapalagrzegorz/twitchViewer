module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		watch: {
			scripts: {
				files: ['css/src/*.scss', 'js/src/*.js'],
			}
		},
		browserSync: {
			dev: {
				bsFiles: {
					src: [
						'css/*.css',
						'*.html',
						'*.js'
					]
				},
				options: {
					watchTask: true,
					server: {
						baseDir: './'
					}
				}
			}
		},
		concat: {
			dist: {
				files: {
					'js/main.js': ['js/src/*.js']
				}
			}
		},
		sass: {
			options: {
				sourceMap: true
			},
			dist: {
				files: {
					'css/src/main.css': 'css/src/main.scss'
				}
			}
		},
		cssmin: {
			preparation: {
				options: {
					mergeIntoShorthands: false,
					roundingPrecision: -1
				},
				files: {
					'css/style.min.css': ['css/src/normalize.css', 'css/src/main.css']
				}
			}
		}
	});
	// Load the plugins tasks 
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-browser-sync');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');


	// Default task(s).
	grunt.registerTask('default', ['browserSync', 'watch', 'babel']);
	grunt.registerTask('css', ['sass', 'cssmin']);

};