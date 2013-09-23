/*global module*/
'use strict';
module.exports = function (grunt) {
	var fs = require('fs');
	var tmp = require('tmp');
	var exec = require('child_process').exec;

	// Create a new multi task
	grunt.registerMultiTask('jekyll', 'This triggers the `jekyll` command.', function () {
		var done = this.async();
		var options = Object.keys(this.options()).length ? this.options() : this.data;
		var command = 'jekyll';
		var optionList = {
			'src': '--source',
			'dest': '--destination',
			'safe': '--safe',
			'plugins': '--plugins',
			'layouts': '--layouts',
			'watch': '--watch',
			'auto': '--watch',
			'config': '--config',
			'drafts': '--drafts',
			'future': '--future',
			'lsi': '--lsi',
			'limit_posts': '--limit_posts',
			'port': '--port',
			'server_port': '--port',
			'host': '--host',
			'baseurl': '--baseurl',
			'trace': '--trace',

			// Deprecated flags
			'paginate': false,
			'permalink': false,
			'markdown': false,
			'url': false
		};

		// Create temporary config file if needed
		function configContext (cb) {
			if (options.raw) {
				tmp.file({ prefix: '_config.', postfix: '.yml' }, function (err, path, fd) {
					if (err) {
						return cb(err);
					}

					fs.writeSync(fd, new Buffer(options.raw), 0, options.raw.length);

					cb(null, path);
				});
			} else {
				cb(null, null);
			}
		}

		// Run configContext with command processing and execution as a callback
		configContext(function (err, path) {
			if (err) {
				grunt.fail.warn(err);
			}

			// Build the command string
			if (options.bundleExec) {
				command = 'bundle exec ' + command;
			}

			if (options.serve) {
				command += ' serve';
			} else if (options.server) {
				command += ' server';
			} else {
				command += ' build';
			}

			// Insert temporary config path into the config option
			if (path) {
				options.config = options.config ? options.config + ',' + path : path;
			}

			// Add flags to command
			Object.keys(optionList).forEach(function (option) {
				if (options[option]) {
					command += ' ' + optionList[option];
					if (typeof options[option] !== 'boolean') {
						command += ' ' + options[option];
					}
					if (!options[option]) {
						grunt.warn('`' + option + '` has been deprecated. You may want to try this in the `raw` option in your gruntfile, or in a configuration file.');
					}
				}
			});

			// Execute command
			exec(command, function (err, stdout) {

				grunt.log.write('\n\nJekyll output:\n');
				grunt.log.write(stdout);

				if (err) {
					grunt.fail.warn(err);
					done(false);
				} else {
					done(true);
				}
			});

			grunt.log.write('`' + command + '` was initiated.');
		});
	});
};
