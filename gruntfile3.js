module.exports = function (grunt) { // npm install --save-dev load-grunt-tasks

grunt.initConfig({
  "babel": {
    options: {
      sourceMap: true
    },
    dist: {
      files: {
        "dist/app.js": "src/app.js"
      }
    }
  }
});

grunt.loadNpmTasks('grunt-babel');
grunt.registerTask("default", ["babel"]);
};