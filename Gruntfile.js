module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-gh-pages');

  var userConfig = {
    dist_dir: 'dist',

    app_files: {
      js: [ 'app/**/*.js', '!app/**/*.spec.js' ]
    }
  };

  var taskConfig = {
    pkg: grunt.file.readJSON("package.json"),

    meta: {
      banner: '/**\n' +
        ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd h:MM TT") %>\n' +
        ' * <%= pkg.homepage %>\n' +
        ' *\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>\n' +
        ' */\n'
    },

    /**
     * The directories to delete when `grunt clean` is executed.
     */
    clean: [
      '<%= dist_dir %>'
    ],

    /* Copy all example into dist/examples */
    copy: {
      examples: {
        src: 'examples/*',
        dest: 'dist/'
      },
      nav: {
        src: 'navbar.html',
        dest: 'dist/'
      },
      example: {
        src: 'examples.html',
        dest: 'dist/'
      }
    },

    concat: {
      compile_js: {
        options: {
          banner: '<%= meta.banner %>'
        },
        src: [
           'app/**/*.js'
        ],
        dest: '<%= dist_dir %>/<%= pkg.name %>.js'
      },
      compile_all_js: {
        src: [
          '<%= dist_dir %>/<%= pkg.name %>.min.js',
           'bower_components/momentjs/min/moment-with-locales.min.js',
           'bower_components/humanize-duration/humanize-duration.js'
      ],
        dest: '<%= dist_dir %>/assets/js/<%= pkg.name %>-all.min.js'
      },
      compile_bower_js: {
        src: [
          'bower_components/angular/angular.min.js',
          'bower_components/jquery/jquery.min.js',
          'bower_components/bootstrap/docs/assets/js/bootstrap.min.js',
          'docs/docs.js',
          'docs/prettify.js',
          'docs/application.js'
      ],
        dest: '<%= dist_dir %>/assets/js/<%= pkg.name %>-bower.js'
      },
      compile_bower_css: {
        src: [
          'bower_components/bootstrap/docs/assets/css/bootstrap.css',
          'bower_components/bootstrap/docs/assets/css/bootstrap-responsive.css',
          'docs/css/docs.css',
          'docs/css/prettify.css'
      ],
        dest: '<%= dist_dir %>/assets/css/<%= pkg.name %>-bower.css'
      }
    },

    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      files: {
        src: ['<%= concat.compile_js.dest %>'],
        dest: '<%= dist_dir %>/<%= pkg.name %>.min.js'
      }
    },

    jshint: {
      src: [
        '<%= app_files.js %>'
      ],
      gruntfile: [
        'Gruntfile.js'
      ],
      options: {
        curly: true,
        immed: true,
        newcap: true,
        noarg: true,
        sub: true,
        boss: true,
        eqnull: true
      }
    },

    /**
     * The `index` task compiles the `index.html` file as a Grunt template. CSS
     * and JS files co-exist here but they get split apart later.
     */
    index: {
      /**
       * During development, we don't want to have wait for compilation,
       * concatenation, minification, etc. So to avoid these steps, we simply
       * add all script files directly to the `<head>` of `index.html`. The
       * `src` property contains the list of included files.
       */
      build: {
        dir: '',
        src: [
          'bower_components/angular/angular.min.js',
          'app/**/*.js',
          'bower_components/momentjs/min/moment-with-locales.min.js',
          'bower_components/humanize-duration/humanize-duration.js',
          'docs/docs.js',
          'bower_components/jquery/jquery.min.js',
          'bower_components/bootstrap/docs/assets/js/bootstrap.min.js',
          'docs/prettify.js',
          'docs/application.js',
          'bower_components/bootstrap/docs/assets/css/bootstrap.css',
          'bower_components/bootstrap/docs/assets/css/bootstrap-responsive.css',
          'docs/css/docs.css',
          'docs/css/prettify.css'
        ]
      },

      /**
       * When it is time to have a completely compiled application, we can
       * alter the above to include only a single JavaScript and a single CSS
       * file. Now we're back!
       */
      compile: {
        dir: '<%= dist_dir %>/',
        src: [
          '<%= dist_dir %>/assets/js/<%= pkg.name %>-bower.js',
          '<%= dist_dir %>/assets/js/<%= pkg.name %>-all.min.js',
          '<%= dist_dir %>/assets/css/<%= pkg.name %>-bower.css'
        ]
      }
    },

    'gh-pages': {
      options: {
        base: 'dist',
        message: 'Update gh-pages'
      },
      src: ['**']
    },

    connect: {
      server: {
        options: {
          port: 3030,
          base: '.',
          keepalive: false,
          livereload:true,
          open: true
        }
      },
      testserver: {
        options: {
          port: 3030,
          base: 'dist'
        }
      }
    },

    karma: {
      unit: {
        configFile: 'config/karma.conf.js',
        singleRun: true,
        browsers: ['PhantomJS']
      },
      e2e: {
        configFile: 'config/karma-e2e.conf.js',
        singleRun: true,
        browsers: ['PhantomJS']
      }
    },

    watch: {
      scripts: {
        files: ['Gruntfile.js', '*.json', 'app/**/*.js','*.html'],
        tasks: ['build'],
        options: {
          livereload: true
        }
      }
    }
  };

  grunt.initConfig(grunt.util._.extend(taskConfig, userConfig));

  grunt.registerTask('default', [ 'connect:server', 'watch']);

  grunt.registerTask('tests', [ 'connect:testserver', 'build', 'karma:unit', 'karma:e2e']);

  grunt.registerTask('build', [
    'clean', 'jshint', 'concat:compile_js', 'uglify', 'concat:compile_all_js', 'concat:compile_bower_js', 'concat:compile_bower_css','copy:examples','copy:nav','copy:example', 'index:compile', 'index:build'
  ]);

  /**
   * A utility function to get all app JavaScript sources.
   */
  function filterForJS ( files ) {
    return files.filter( function ( file ) {
      return file.match( /\.js$/ );
    });
  }

  /**
   * A utility function to get all app CSS sources.
   */
  function filterForCSS ( files ) {
    return files.filter( function ( file ) {
      return file.match( /\.css$/ );
    });
  }

  /**
   * The index.html template includes the stylesheet and javascript sources
   * based on dynamic names calculated in this Gruntfile. This task assembles
   * the list into variables for the template to use and then runs the
   * compilation.
   */
  grunt.registerMultiTask( 'index', 'Process index.html template', function () {
    var dirRE = new RegExp( '^('+grunt.config('build_dir')+'|'+grunt.config('dist_dir')+')\/', 'g' );
    var jsFiles = filterForJS( this.filesSrc ).map( function ( file ) {
      return file.replace( dirRE, '' );
    });
    var cssFiles = filterForCSS( this.filesSrc ).map( function ( file ) {
      return file.replace( dirRE, '' );
    });

    grunt.file.copy('index.tpl.html', this.data.dir + 'index.html', {
      process: function ( contents, path ) {
        return grunt.template.process( contents, {
          data: {
            scripts: jsFiles,
            styles: cssFiles,
            version: grunt.config( 'pkg.version' )
          }
        });
      }
    });
  });
};
