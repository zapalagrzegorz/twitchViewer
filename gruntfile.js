module.exports = function (grunt) {


// Tablica zawierająca zewnętrzne javascripty, które chcemy konkatenować do vendor.js
var vendorJs = [
	'bower_components/jquery/dist/jquery.min.js',
	'bower_components/tether/dist/js/tether.min.js',
	'bower_components/bootstrap/dist/js/bootstrap.min.js'
];
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
					'css/src/style.scss': 
						['bower_components/bootstrap/scss/bootstrap.scss', 
						'css/src/normalize.css', 
						'css/src/main.scss'],
					'js/vendor.js': [vendorJs],
					'js/main.js' : ['js/src/engine.js', 'js/src/main.js', 'js/src/plugins'],
				}
			}
		},
		sass: {
			options: {
				sourceMap: true
			},
			dist: {
				files: {
					'css/bootstrap.css': ['bower_components/bootstrap/scss/bootstrap.scss'],
					'css/main.css': ['css/src/main.scss']
				}
			}
		},
		cssmin: {
			dist: {
				options: {
					mergeIntoShorthands: false,
					roundingPrecision: -1
				},
				files: {
					'css/main.min.css': ['css/normalize.css', 'css/main.css'],
					'css/bootstrap.min.css': ['css/bootstrap.css']
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