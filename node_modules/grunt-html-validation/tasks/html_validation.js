/*
 * grunt-html-validation
 * https://github.com/praveen/grunt-html-validation
 *
 * Copyright (c) 2013 Praveen Vijayan
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

	var w3cjs = require('w3cjs');
	var colors = require('colors');
	var fs = require('fs');
	var path = require('path');
	var request = require('request');
	var rval = require('../lib/remoteval');

	colors.setTheme({
		silly: 'rainbow',
		input: 'grey',
		verbose: 'cyan',
		prompt: 'grey',
		info: 'green',
		data: 'grey',
		help: 'cyan',
		warn: 'yellow',
		debug: 'blue',
		error: 'red',
		blue: 'blue'
	});

	var htmlContent = "",
		arryFile = [],
		counter = 0,
		msg = {
			error: "Something went wrong",
			ok: "Validation successful..",
			start: "Validation started for.. ".info,
			networkError: 'Network error re-validating..'.error,
			validFile: "Validated skipping..",
			nofile: ":- No file is specified in the path!",
			nextfile: "Skipping to next file..".verbose,
			eof: "End of File..".verbose,
			fileNotFound: "File not found..".error,
			remotePathError: "Remote path ".error + "(options->remotePath) ".grey + "is mandatory when remote files ".error+"(options-> remoteFiles) ".grey+"are specified!".error
		},
		len,
		fileStat = {},
		isModified,
		fileCount = 0,
		validsettings = "",
		reportArry =[],
		retryCount = 0,
		reportFilename = "";

	grunt.registerMultiTask('validation', 'HTML W3C validation.', function() {
		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			path: "validation-status.json",
			reportpath: "validation-report.json",
			reset: false,
			stoponerror: false,
			remotePath: false,
			maxTry: 3
		});

		var done = this.async(),
			files = grunt.file.expand(this.filesSrc),
			flen = files.length,
			readSettings = {},
			remoteArry = [];

		
		var makeFileList  = function (files) {
			return files.map(function(file){
				return options.remotePath + file;
			});
		}

		//Reset current validation status and start from scratch.
		if (options.reset) {
			grunt.file.write(options.path, '{}');
		}

		if (!flen) {
			var nomsg = this.data.src;
			console.log(nomsg + msg.nofile.error);
		}

		var addToReport = function(fname, status) {
			var report = {};
			report.filename = fname;
			report.error = status;
			reportArry.push(report);
		};

		var validate = function(files) {

			if (files.length) {

				if (grunt.file.exists(options.path)) {
					readSettings = grunt.file.readJSON(options.path);
				}
				var currFileStat = readSettings[files[counter]] || false;

				if (currFileStat) {
					console.log(msg.validFile.green + files[counter]);
					reportFilename = options.remoteFiles ? dummyFile[counter] : files[counter];
					addToReport(reportFilename, false);
					counter++;
					validate(files);
					return;
				}

				if (files[counter] !== undefined) {

					var filename = options.remoteFiles ? dummyFile[counter] : files[counter];

					console.log(msg.start + filename);
				}

				var results = w3cjs.validate({
					file: files[counter], // file can either be a local file or a remote file
					// file: 'http://localhost:9001/010_gul006_business_landing_o2_v11.html',
					output: 'json', // Defaults to 'json', other option includes html
					callback: function(res) {

						flen = files.length;

						if (!res.messages) {
							++retryCount;
							var netErrorMsg = msg.networkError +  " " + retryCount.toString().error +" ";
							if(retryCount === options.maxTry){
								counter++;
								if(counter !==flen){
									netErrorMsg += msg.nextfile
								}else{
									netErrorMsg += msg.eof
								}
								retryCount = 0;
							}
						
							console.log(netErrorMsg);
							validate(files);
							return;
						}

						len = res.messages.length;

						if (len) {

							for (var prop in res.messages) {
								console.log(prop + "=> ".warn + JSON.stringify(res.messages[prop].message).help +
									" Line no: " + JSON.stringify(res.messages[prop].lastLine).prompt
								);
							}

							readSettings[files[counter]] = false;
							console.log("No of errors: ".error + res.messages.length);

							reportFilename = options.remoteFiles ? dummyFile[counter] : files[counter];
							addToReport(reportFilename, res.messages);

							if (options.stoponerror) {
								done();
								return;
							}

						} else {

							readSettings[files[counter]] = true;
							grunt.log.ok(msg.ok.green);

							reportFilename = options.remoteFiles ? dummyFile[counter] : files[counter];
							addToReport(reportFilename, false);

						}

						grunt.file.write(options.path, JSON.stringify(readSettings));
						// depending on the output type, res will either be a json object or a html string
						counter++;

						if (counter === flen) {
							grunt.file.write(options.reportpath, JSON.stringify(reportArry));
							console.log("Validation report generated: ".green + options.reportpath);
							done();
						}

						if (options.remoteFiles) {
							if(counter === flen) return;

							rval(dummyFile[counter], function(){
								validate(files);
							});

						}else{
							validate(files);
						}	
					}
				});
			}
		};

		/*Remote validation 
		*Note on Remote validation.
		* W3Cjs supports remote file validation but due to some reasons it is not working as expected. Local file validation is working perfectly. To overcome this remote page is fetch using 'request' npm module and write page content in '_tempvlidation.html' file and validates as local file. 
		*/

		if(!options.remotePath && options.remoteFiles){
			console.log(msg.remotePathError)
			return;
		};

		if(options.remotePath && options.remotePath !== ""){
			files = makeFileList(files)
		}

		if(options.remoteFiles){

			if(typeof options.remoteFiles === 'object' && options.remoteFiles.length && options.remoteFiles[0] !=='' ){
				files = options.remoteFiles;
				
			}else{
				files = grunt.file.readJSON(options.remoteFiles);
			}	

			files = makeFileList(files);

			var dummyFile = files;

			files = [];

			for (var i = 0; i < dummyFile.length; i++) {
				files.push('_tempvlidation.html');
			};

			rval(dummyFile[counter], function(){
				validate(files);
			});

			return;
		}

		if(!options.remoteFiles){
			validate(files);
		}


	});

};