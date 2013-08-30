'use strict';

var fs = require('fs');
var sh = require('shelljs');

module.exports = function (grunt) {

  // based on: https://github.com/angular-ui/bootstrap/commit/9a683eebccaeb6bfc742e6768562eb19ddd2216c
  grunt.registerTask('changelog', 'generate a changelog from git metadata', function () {

    var done = grunt.task.current.async();

    var options = this.options({
      // dest: 'CHANGELOG.md',
      prepend: true, // false to append
      enforce: false
    });

    var githubRepo;
    var pkg = grunt.config('pkg');
    //If github repo isn't given, try to read it from the package file
    if (!options.github && pkg) {
      if (pkg.repository) {
        githubRepo = pkg.repository.url;
      } else if (pkg.homepage) {
        //If it's a github page, but not a *.github.(io|com) page
        if (pkg.homepage.indexOf('github.com') > -1 &&
            !pkg.homepage.match(/\.github\.(com|io)/)) {
          githubRepo = pkg.homepage;
        }
      }
    } else {
      githubRepo = options.github;
    }

    // ensure commit convention, by using a commit hook
    var gitHookFile = '.git/hooks/commit-msg';
    if(options.enforce) {
      // if no commit hook is found, copy from template
      if(!grunt.file.exists(gitHookFile)) {
        grunt.file.copy(__dirname + '/../validate-commit-msg.js', gitHookFile);
        // need to ensure the hook is executable
        fs.chmodSync(gitHookFile, '0755');
      }
    }

    function fixGithubRepo(githubRepo) {
      //User could set option eg 'github: "btford/grunt-conventional-changelog'
      if (githubRepo.indexOf('github.com') === -1) {
        githubRepo = 'http://github.com/' + githubRepo;
      }
      return githubRepo
      .replace(/^git:\/\//, 'http://') //get rid of git://
        .replace(/\/$/, '') //get rid of trailing slash
      .replace(/\.git$/, ''); //get rid of trailing .git
    }
    if (githubRepo) {
      githubRepo = fixGithubRepo(githubRepo);
    }

    var template;
    if (options.templateFile) {
      template = grunt.file.read(options.templateFile);
    } else {
      template = fs.readFileSync(__dirname + '/../template/changelog.md', 'utf8');
    }

    //If args are given, generate changelog from arg commits
    var gitArgs = [ 'log', '--format=%H%n%s%n%b%n==END==' ];
    if (this.args.length > 0) {
      var changeFrom = this.args[0], changeTo = this.args[1] || 'HEAD';
      gitArgs.push(changeFrom + '..' + changeTo);

      //Else, generate changelog from last tag to HEAD
    } else {
      //Based on: https://github.com/angular/angular.js/blob/master/changelog.js#L184
      //Use tags to find the last commit
      var tagResult = sh.exec('git describe --tags --abbrev=0');
      if (tagResult.code !== 0) {
        return done(true);
      }
      var lastTag = tagResult.output.trim();
      gitArgs.push(lastTag + '..HEAD');
    }

    //Run git to get the log we need
    var logResult = sh.exec('git ' + gitArgs.join(' '));
    if (logResult.code !== 0) {
      return done(false);
    }
    var gitlog = logResult.output.split('\n==END==\n').reverse();
    makeChangelog(gitlog);

    function makeChangelog(gitlog) {

      var changelog = {};

      // based on: https://github.com/angular/angular.js/blob/master/changelog.js#L50
      // see also: https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/
      var COMMIT_MSG_REGEXP = /^(.*)\((.*)\)\:\s(.*)$/;
      var BREAKING_CHANGE_REGEXP = /BREAKING CHANGE:([\s\S]*)/;

      function addChange(changeType, changeScope, sha1, changeMessage) {
        if (!changelog[changeType]) {
          changelog[changeType] = {};
        }
        if (!changelog[changeType][changeScope]) {
          changelog[changeType][changeScope] = [];
        }
        changelog[changeType][changeScope].push({
          sha1: sha1,
          msg: changeMessage
        });
      }

      gitlog.forEach(function (logItem) {
        var lines = logItem.split('\n');
        var sha1 = lines.shift().substr(0,8); //Only need first 7 chars
        var subject = lines.shift();

        if (!subject) {
          return; //this is a bad commit message
        }

        var changeMatch,
        changeType,
        changeScope,
        changeMessage;
        if ( (changeMatch = subject.match(COMMIT_MSG_REGEXP)) ) {
          //if it conforms to the changelog style
          changeType = changeMatch[1];
          changeScope = changeMatch[2];
          changeMessage = changeMatch[3];
        } else {
          //otherwise
          changeType = changeScope = 'other';
          changeMessage = subject;
        }

        addChange(changeType, changeScope, sha1, changeMessage);

        var breakingMatch = logItem.match(BREAKING_CHANGE_REGEXP);
        if (breakingMatch) {
          var breakingMessage = breakingMatch[1];
          addChange('breaking', changeScope, sha1, breakingMessage);
        }
      });

      var newLog = grunt.template.process(template, {
        data: {
          changelog: changelog,
          today: grunt.template.today('yyyy-mm-dd'),
          version: options.version || grunt.config('pkg.version'),
          helpers: {
            //Generates a commit link if we have a repo, else it generates a plain text commit sha1
            commitLink: function(commit) {
              if (githubRepo) {
                return '[' + commit + '](' + githubRepo + '/commit/' + commit + ')';
              } else {
                return commit;
              }
            }
          }
        }
      });

      if (options.dest) {
        var log = grunt.file.exists(options.dest) ?
          grunt.file.read(options.dest) : '';
        if (options.prepend) {
          log = newLog + log;
        } else {
          log += newLog;
        }
        grunt.file.write(options.dest, log);
      } else {
        console.log(newLog);
      }
      done();
    }
  });
};
