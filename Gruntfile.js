// Generated on 2013-12-06 using generator-angularexpress 0.0.5
'use strict';
var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;
var terminal = require('child_process').spawn('bash');
var exec = require('child_process').exec;


// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);
  // configurable paths
  
  var nodemonIgnoredFiles = [
      'README.md',
      'Gruntfile.js',
      'node-inspector.js',
      '/.git/',
      '/node_modules/',
      '/app/',
      '/dist/',
      '/build/public/',
      '/test/',
      '/coverage/',
      '/.tmp',
      '/.sass-cache',
      '*.txt',
      '*.jade',
  ];
  
  grunt.initConfig({
    yeoman: {
      // configurable paths
      app: require('./bower.json').appPath || 'app',
      dist: './build/public'
    },
    watch: {
      coffee: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.coffee'],
        tasks: ['coffee:dist']
      },
      coffeeTest: {
        files: ['test/spec/{,*/}*.coffee'],
        tasks: ['coffee:test']
      },
      styles: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
        tasks: ['copy:styles', 'autoprefixer']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '<%= yeoman.app %>/views/quotes/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },
    autoprefixer: {
      options: ['last 1 version'],
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      proxies: [ // Local
        {
            context: '/api',
            host: '52.24.231.121'
        }
      ],
      livereload: {
        options: {
          middleware: function (connect, options) {
            var middlewares = [];
            middlewares.push(proxySnippet);
            options.base.forEach(function(base) {
                // Serve static files.
                middlewares.push(connect.static(base));
              });
            return middlewares;
          },
          open: true,
          base: [
            '.tmp',
            '<%= yeoman.app %>'
          ]
        }
      },
      test: {
        options: {
          middleware: function (connect, options) {
            var middlewares = [];
            middlewares.push(proxySnippet);
            options.base.forEach(function(base) {
                // Serve static files.
                middlewares.push(connect.static(base));
              });
            return middlewares;
          },
          port: 9001,
          base: [
            '.tmp',
            'test',
            '<%= yeoman.app %>'
          ]
        }
      },
      dist: {
        options: {
          middleware: function (connect, options) {
            var middlewares = [];
            middlewares.push(proxySnippet);
            options.base.forEach(function(base) {
                // Serve static files.
                middlewares.push(connect.static(base));
              });
            return middlewares;
          },
          base: '<%= yeoman.dist %>'
        }
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp',
      build: ['build/'],
      release: ['release/'],
    },
    jshint: {
      options: {
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js'
      ]
    },
    coffee: {
      options: {
        sourceMap: true,
        sourceRoot: ''
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/scripts',
          src: '{,*/}*.coffee',
          dest: '.tmp/scripts',
          ext: '.js'
        }]
      },
      test: {
        files: [{
          expand: true,
          cwd: 'test/spec',
          src: '{,*/}*.coffee',
          dest: '.tmp/spec',
          ext: '.js'
        }]
      }
    },
    // not used since Uglify task does concat,
    // but still available if needed
    /*concat: {
      dist: {}
    },*/
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/**/*.js',
            '<%= yeoman.dist %>/styles/{,*/}*.css',
            '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.dist %>/styles/fonts/*'
          ]
        }
      }
    },
    useminPrepare: {
      html: '<%= yeoman.app %>/**/*.html',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },
    usemin: {
      html: ['<%= yeoman.dist %>/**/*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>', '<%= yeoman.dist %>/images'],
        basedir: '<%= yeoman.dist %>',
        dirs: ['<%= yeoman.dist %>']
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    cssmin: {
      // By default, your `index.html` <!-- Usemin Block --> will take care of
      // minification. This option is pre-configured if you do not wish to use
      // Usemin blocks.
      // dist: {
      //   files: {
      //     '<%= yeoman.dist %>/styles/main.css': [
      //       '.tmp/styles/{,*/}*.css',
      //       '<%= yeoman.app %>/styles/{,*/}*.css'
      //     ]
      //   }
      // }
    },
    htmlmin: {
      dist: {
        options: {
          /*removeCommentsFromCDATA: true,
          // https://github.com/yeoman/grunt-usemin/issues/44
          //collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true*/
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: ['*.html', 'views/**/*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    // Put files not handled in other tasks here
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'bower_components/**/*',
            'images/{,*/}*.{gif,webp}',
            'img/**/*',
            'fonts/*',
            'styles/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: [
            'generated/*'
          ]
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      },
      prodConfig:{
        src: '<%= yeoman.app %>/scripts/config/prod.js',
        dest: '<%= yeoman.dist %>/scripts/config.js',
      },
      localConfig:{
        src: '<%= yeoman.app %>/scripts/config/local.js',
        dest: '<%= yeoman.dist %>/scripts/config.js',
      }                            
    },
    compress: {
      all: {
        options: {
          archive: 'release/app.zip'
        },
        files: [
          {
            mode: 'zip',
            expand: true,
            cwd: 'build',
            src: ['**'],
            dest: 'app'
          }
        ]
      }
    },
    concurrent: {
      nodemon: {
          options: {
              logConcurrentOutput: true,
          },
          tasks: [
              'nodemon:nodeInspector',
              'nodemon:dev',
              'watch',
          ],
      },
      server: [
        'coffee:dist',
        'copy:styles'
      ],
      test: [
        'coffee',
        'copy:styles'
      ],
      dist: [
        'coffee',
        'copy:styles',
        'imagemin',
        'svgmin',
        'htmlmin'
      ]
    },
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>/scripts',
          src: '*.js',
          dest: '<%= yeoman.dist %>/scripts'
        }]
      }
    },
    uglify: {
      dist: {
        files: {
          '<%= yeoman.dist %>/scripts/scripts.js': ['<%= yeoman.dist %>/scripts/scripts.js']
        }
      }
    },
    nodemon: {
        dev: {
            options: {
                file: './build/server.js',
                args: ['development'],
                watchedExtensions: [
                    'js',
                    // This might cause an issue starting the server
                    // See: https://github.com/appleYaks/grunt-express-workflow/issues/2
                    // 'coffee'
                ],
                // nodemon watches the current directory recursively by default
                // watchedFolders: ['.'],
                debug: true,
                delayTime: 1,
                ignoredFiles: nodemonIgnoredFiles,
            }
        },
        nodeInspector: {
            options: {
                file: 'node-inspector.js',
                watchedExtensions: [
                    'js',
                    // This might cause an issue starting the server
                    // See: https://github.com/appleYaks/grunt-express-workflow/issues/2
                    // 'coffee'
                ],
                exec: 'node-inspector',
                ignoredFiles: nodemonIgnoredFiles,
            },
        },
    },
    express: {
      custom: {
        options: {
          hostname: 'localhost',
          port: 9002,
          server: require('path').resolve('./build/server')
        }
      }
    }
  });

  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'configureProxies',
 //     'express',
 //     'concurrent:nodemon',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });
  
  grunt.registerTask('NOTWORKING_server', [
      'concurrent:server',

      'concurrent:nodemon',
  ]);

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test'
  ]);
  
  grunt.registerTask('config',function(environment){
    //call our copy task, to copy the environment config file to the app/build folder
    grunt.task.run("copy:" + environment + "Config");

  });
  
  grunt.registerTask('zip',function(withConfig){
    grunt.task.run("clean:release");
    grunt.task.run("compress");
  });  
  
  grunt.registerTask('scp_deploy', '', function(serverHost) {
    
    var done = grunt.task.current.async();
    var execStr = 'scp release/app.zip ubuntu@' + serverHost + ':/home/ubuntu/adminapp.zip\n';
    grunt.log.writeln(execStr);    
    var child = exec(execStr,
      function(error, stdout, stderr) {
        if (error !== null) {
          grunt.log.writeln(error);
        } else {
          grunt.log.writeln(stdout);  
        }        
        done(error);
      });
  });
  
  grunt.registerTask('ssh_deploy','', function(serverHost) {
    
    var done = grunt.task.current.async();
    var execStr = 'ssh ubuntu@' + serverHost + ' sudo unzip -o /home/ubuntu/adminapp.zip -d /home/ubuntu/apps/adminapp/ \n';

    grunt.log.writeln(execStr);
    var child = exec(execStr,
      function(error, stdout, stderr) {        
        grunt.log.writeln(stderr);
        if (error !== null) {
          grunt.log.writeln(error);
        } else {
          grunt.log.writeln(stdout);  
        }        
        done(error);
      });

  });


  grunt.registerTask('deploy','', function(serverHost) {
    grunt.task.run('build');
    grunt.task.run('zip');

    //shortcuts so so that we don't have to type in the fully qualified domain name but still can if we want
    var serverHosts = [
      //'52.35.158.241' // webmini,
      '52.10.194.211', // web1,
      '52.35.105.39', // web2
      '52.24.246.109' // web3
    ];

    for (var i in serverHosts)
    {
      var serverHost = serverHosts[i];
      var task = ['scp_deploy:' + serverHost, 'ssh_deploy:' + serverHost];  
      grunt.log.writeln("Deploy task: " + task);
      grunt.task.run(task);
    }

  });

  grunt.registerTask('build', [
    'clean:dist',
    'clean:build',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'copy:dist',
    'cdnify',
    'ngmin',
    'cssmin',
    'uglify',
    'rev',
    'usemin',
    'copy:prodConfig',
  ]);

  grunt.registerTask('default', [
    'test',
    'build'
  ]);
};
