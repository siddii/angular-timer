/*
 * Increase version number
 *
 * grunt bump
 * grunt bump:patch
 * grunt bump:minor
 * grunt bump:major
 *
 * @author Vojta Jina <vojta.jina@gmail.com>
 * @author Mathias Paumgarten <mail@mathias-paumgarten.com>
 */
var semver = require('semver');
var exec = require('child_process').exec;

module.exports = function(grunt) {
  grunt.registerTask('bump', 'Increment the version number.', function(versionType) {
    var opts = this.options({
      files: ['package.json'],
      updateConfigs: [], // array of config properties to update (with files)
      commit: true,
      commitMessage: 'Release v%VERSION%',
      commitFiles: ['package.json'], // '-a' for all files
      createTag: true,
      tagName: 'v%VERSION%',
      tagMessage: 'Version %VERSION%',
      push: true,
      pushTo: 'origin'
    });

    var done = this.async();
    var queue = [];
    var next = function() {
      if (!queue.length) {
        return done();
      }

      queue.shift()();
    };
    var runIf = function(condition, behavior) {
      if (condition) {
        queue.push(behavior);
      }
    };

    var globalVersion; // when bumping multiple files
    var VERSION_REGEXP = /([\'|\"]version[\'|\"][ ]*:[ ]*[\'|\"])([\d|.]*)([\'|\"])/i;

    // BUMP ALL FILES
    opts.files.forEach(function(file, idx) {
      var version = null;
      var content = grunt.file.read(file).replace(VERSION_REGEXP, function(match, prefix, parsedVersion, suffix) {
        version = semver.inc(parsedVersion, versionType || 'patch');
        return prefix + version + suffix;
      });

      if (!version) {
        grunt.fatal('Can not find a version to bump in ' + file);
      }

      grunt.file.write(file, content);
      grunt.log.ok('Version bumped to ' + version + (opts.files.length > 1 ? ' (in ' + file + ')' : ''));

      if (!globalVersion) {
        globalVersion = version;
      } else if (globalVersion !== version) {
        grunt.warn('Bumping multiple files with different versions!');
      }

      var configProperty = opts.updateConfigs[idx];
      if (!configProperty) {
        return;
      }

      var cfg = grunt.config(configProperty);
      if (!cfg) {
        return grunt.warn('Can not update "' + configProperty + '" config, it does not exist!');
      }

      cfg.version = version;
      grunt.config(configProperty, cfg);
      grunt.log.ok(configProperty + '\'s version updated');
    });


    var template = grunt.util._.template;

    // COMMIT
    runIf(opts.commit, function() {
      var commitMessage = opts.commitMessage.replace('%VERSION%', globalVersion);

      exec('git commit ' + opts.commitFiles.join(' ') + ' -m "' + commitMessage + '"', function(err, stdout, stderr) {
        if (err) {
          grunt.fatal('Can not create the commit:\n  ' + stderr);
        }
        grunt.log.ok('Committed as "' + commitMessage + '"');
        next();
      });
    });


    // CREATE TAG
    runIf(opts.createTag, function() {
      var tagName = opts.tagName.replace('%VERSION%', globalVersion);
      var tagMessage = opts.tagMessage.replace('%VERSION%', globalVersion);

      exec('git tag -a ' + tagName + ' -m "' + tagMessage + '"' , function(err, stdout, stderr) {
        if (err) {
          grunt.fatal('Can not create the tag:\n  ' + stderr);
        }
        grunt.log.ok('Tagged as "' + tagName + '"');
        next();
      });
    });


    // PUSH CHANGES
    runIf(opts.push, function() {
      exec('git push ' + opts.pushTo + ' --tags', function(err, stdout, stderr) {
        if (err) {
          grunt.fatal('Can not push to ' + opts.pushTo + ':\n  ' + stderr);
        }
        grunt.log.ok('Pushed to ' + opts.pushTo);
        next();
      });
    });

    next();
  });
};

