module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        watch: {
            scripts: {
                files: ['scss/*.scss'],
            }
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src: [
                        'css/*.css',
                        '*.html'
                    ]
                },
                options: {
                    watchTask: true,
                    server: {
                        baseDir: "./"
                    }
                }
            }
        }
    });
    // Load the plugins tasks 
	grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browser-sync');
    // Default task(s).
    grunt.registerTask('default', ['browserSync', 'watch']);

};