# grunt-html-validation [![Build Status](https://travis-ci.org/praveenvijayan/grunt-html-validation.png?branch=master)](https://travis-ci.org/praveenvijayan/grunt-html-validation)

[![NPM](https://nodei.co/npm/grunt-html-validation.png?downloads=true)](https://nodei.co/npm/grunt-html-validation/)

> W3C html validaton grunt plugin. Validate all files in a directory automatically. 

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-html-validation --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-html-validation');
```

## The "html_validation" task

### Overview
In your project's Gruntfile, add a section named `html_validation` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  validation: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.reset
Type: `Boolean` <br/>
Default value: `'false'`

Resets all the validated  files status. When want to revalidate all the validated files - 
`eg: sudo grunt validate --reset=true`

#### options.path
Type: `String` <br/>
Default value: `'validation-staus.json'`

Default file for storing validation information.

#### options.reportpath
Type: `String` <br/>
Default value: `validation-report.json`

Consolidated report in JSON format. 

#### options.stoponerror
Type: `Boolean` <br/>
Default value: `false`

When hit by a validation error, html-validator continue validating next file by default and this process continues until all files in the list completes validation. If 'stoponerror' set to  `true`, validator will stop validating next file.

#### options.maxTry
Type: `Number` <br/>
Default value: `3`

Number of retries when network error occuers. Default case, after 3 reties validator will move to next file.

#### options.remotePath
Type: `String` <br/>
Default value: ``

Remote base url path. eg: "http://decodize.com/". 


#### options.remoteFiles
Type: `Array` <br/>
Default value: ``

Array of page paths to be validated. When remote files are not present validator will append file names from local folder. 'remotePath' is mandatory when this option is specified. 

eg: remoteFiles: ["html/moving-from-wordpress-to-octopress/",
                      "css/site-preloading-methods/"]

you can also provide a file contains array of pages.

remoteFiles: "validation-files.json"

```js
["html/getting-started-with-yeoman-1-dot-0-beta-on-windows",
"html/slidemote-universal-remote-control-for-html5-presentations/",
"html/simple-responsive-image-technique/"]
```

### Usage Examples

```js
validation: {
    options: {
        reset: grunt.option('reset') || false,
        stoponerror: false,
        remotePath: "http://decodize.com/",
        remoteFiles: ["html/moving-from-wordpress-to-octopress/",
                      "css/site-preloading-methods/"], //or
        remoteFiles: "validation-files.json" // JSON file contains array of page paths.  
    },
    files: {
        src: ['<%= yeoman.app %>/*.html', 
            '!<%= yeoman.app %>/index.html', 
            '!<%= yeoman.app %>/modules.html',
            '!<%= yeoman.app %>/404.html']
    }
}
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

Report issues [here](https://github.com/praveenvijayan/grunt-html-validation/issues)

## Release History
 * 2013-08-31   v0.1.5   Added remote validation support. Max network error retry count.  
 * 2013-08-19   v0.1.4   Fixed issues. Added 'stoponerror' option, validation report added. 
 * 2013-08-05   v0.1.2   Fixed issues.
 * 2013-04-20   v0.1.0   Initial release.


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/praveenvijayan/grunt-html-validation/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

