/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
    build_dir: 'build',
    compile_dir: 'release',

    app_files: {
        js: [ 'app/**/*.js', '!app/**/*.spec.js' ]
    }
};
