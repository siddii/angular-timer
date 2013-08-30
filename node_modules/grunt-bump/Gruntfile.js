module.exports = function(grunt) {

  grunt.initConfig({});
  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-npm');

  grunt.registerTask('release', 'Bump version, push to NPM.', function(type) {
    grunt.task.run([
      'bump:' + (type || 'patch'),
      'npm-publish'
    ]);
  });
};
