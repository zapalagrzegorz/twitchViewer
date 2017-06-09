module.exports = function (grunt) {

	// Load the plugins tasks 
    require('load-grunt-tasks')(grunt);

	// Tablica zawierająca zewnętrzne javascripty, które chcemy konkatenować do vendor.js
    var vendorJs = [
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/tether/dist/js/tether.min.js',
        'bower_components/bootstrap/js/dist/util.js',
        'bower_components/bootstrap/js/dist/collapse.js'
    ];
	// Project configuration.
    grunt.initConfig({
        watch: {scripts: {files: ['css/src/*.scss', 'js/src/*.js'], }    },
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
                    server: {baseDir: './'}
                }
            }
        },
        clean : {dist: ['js/dist/*', 'js/src/scripts.js', 'js/src/scripts.js.map']},
        concat: {
            dist: {
                files: {
                    'js/vendor/vendor.js' : [vendorJs],
                    'js/src/scripts.js' : ['js/src/engine.js', 'js/src/main.js', 'js/src/plugins'],
                }
            }
        },
        babel: {
            options: {
                sourceMap: true,
                presets: ['es2015']
            },
            dist: {files: {'js/src/scripts.js': 'js/src/scripts.js'}    }
        },
        uglify: {
            options: {sourceMap: true},	
            dist: {files: {'js/dist/main.js': 'js/src/scripts.js'}    }
        },
        sass: {
            options: {sourceMap: false},
            dist: {
                files: {
                    'css/src/font-awesome.css': ['bower_components/font-awesome/scss/font-awesome.scss'],
                    'css/src/main.css': ['css/src/main.scss'],
                    'css/src/bootstrap.css': ['bower_components/bootstrap/scss/bootstrap.scss'],
                }
            }
        },
        cssmin: {
            dist: {
                options: {
                    sourceMap: false,
                    mergeIntoShorthands: false,
                    roundingPrecision: -1
                },
                files: {'css/main.min.css': ['css/src/bootstrap.css', 'css/src/main.css', 'css/src/font-awesome.css'], }
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,                  // Enable dynamic expansion 
                    cwd: 'img/src/',                   // Src matches are relative to this path 
                    src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match 
                    dest: 'img/dist/'                  // Destination path prefix 
                }]
     		}
        }
    });

	// Default task(s).
    grunt.registerTask('default', ['browserSync', 'watch']);
    grunt.registerTask('css', ['newer:sass', 'newer:cssmin']);
    grunt.registerTask('css-force', ['sass', 'cssmin']);
    grunt.registerTask('js', ['newer:concat:dist', 'newer:babel', 'newer:uglify']);
    grunt.registerTask('img', ['newer:imagemin']);
    grunt.registerTask('dist', ['css', 'js', 'img']);

};