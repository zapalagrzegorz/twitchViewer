module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		watch: {
			scripts: {
				files: ['scss/*.scss', 'js/*.js'],
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
		sass: {
			options: {
				sourceMap: true
			},
			dist: {
				files: {
					'css\main.css': 'main.scss'
				}
			}
		}

	});
	// Load the plugins tasks 
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-browser-sync');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-sass');


	// Default task(s).
	grunt.registerTask('default', ['browserSync', 'watch', 'babel']);

};