module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    packagejson: grunt.file.readJSON('package.json'),

    paths: {
      app: '.tmp',
      dist: 'dist',
      assets: 'assets',
    },

    watch: {  
      options: {
        livereload: true
      },
      js: {
        files: ['<%= paths.assets %>/scripts/*.js'],
        options: {
          livereload: true
        }
      },
      sass: {
        files: '<%= paths.assets %>/styles/**/**/*.scss',
        tasks: ['sass:app']
      },
      browserify: {
        files: [
          '<%= paths.assets %>/scripts/*.jsx'
        ],
        tasks: ['browserify:app'],
        options: {
          livereload: true
        }
      }
    },

    processhtml: {
      options: {
        data: {
          message: 'Hello world!'
        }
      },
      dist: {
        files: {
        '<%= paths.dist %>/index.html': ['<%= paths.assets %>/views/index.html']
        }
      }
    },

    bump: {
      options: {
        files: ['package.json'],
        commit: true,
        commitMessage: 'Release %VERSION%',
        commitFiles: ['-a'],
        createTag: true,
        tagName: '%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
        globalReplace: false
      }
    },

    sass: { 
      app: {
        files: [{
          expand: true,
          cwd: '<%= paths.assets %>/styles',
          src: ['**/*.scss'],
          dest: '<%= paths.app %>/assets/styles',
          ext: '.css'
        }],
        options: {
          sourceMap: true,
          outFile: '<%= paths.app %>/assets/styles',
          outputStyle: 'nested'
        }
      }
    },

    browserify: {
      options:      {
        transform:  [ require('grunt-react').browserify ]
      },
      app:          {
        files: [
          {
            src: ['<%= paths.assets %>/scripts/main.jsx'],
            dest: '<%= paths.app %>/assets/scripts/bundle.js'
          }
        ]
      }
    },

    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: '<%= paths.app %>/assets/styles',
          src: ['*.css', '!*.min.css'],
          dest: '<%= paths.dist %>/assets/styles',
          ext: '.css'
        }]
      }
    },

    uglify: {
      options: {
        preserveComments: false,
        compress: true,
      },
      my_target: {
        files: {
          '<%= paths.dist %>/assets/scripts/bundle.js': '<%= paths.app %>/assets/scripts/bundle.js'
        }
      }
    },

    clean: {
      app: ['<%= paths.app %>'],
      dist: ['<%= paths.dist %>']
    },

    htmlmin: {
      target: {
        options: {
          removeComments:true,
          collapseWhitespace:true
        },
        files: [{
          expand: true,
          // cwd: '<%= paths.dist %>',
          src: '<%= paths.dist %>/*.html',
          // dest: '<%= paths.dist %>'
        }]
      }
    },

    copy: {
      app: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= paths.assets %>/images',
          dest: '<%= paths.app %>/assets/images',
          src: ['*.*']
        }]
      },

      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= paths.app %>/assets',
          dest: '<%= paths.dist %>/assets',
          src:[
            'images/*.*',
          ]
        }]
      }
    },

    connect: {
      app: {
        options: {
          debug: true,
          open: true,
          base: [
            '<%= paths.assets %>/views', 
            '<%= paths.app %>'
          ]
        }
      }
    },

  });

  grunt.registerTask('dev', [
    'clean:app',
    'copy:app',
    'sass:app',
    'browserify:app',
  ]);
 
  grunt.registerTask('server', [
    'dev',
    'connect:app',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'cssmin',
    'uglify',
    'copy:dist',
    'processhtml:dist',
    'htmlmin',
  ]);

  grunt.registerTask('release', 'Release a new version of the project', function(type) {
    var taskList = new Array();

    if(arguments.length !== 0) {

      switch(type){
        case 'patch':
          taskList.push('bump-only:patch');
          break;
        case 'minor':
          taskList.push('bump-only:minor');
          break;
        case 'major':
          taskList.push('bump-only:major');
          break;
        default:
          throw new TypeError('This type of release dos not exist');
          break;
      };

      taskList.push('changelog');

      grunt.task.run(taskList);
    
    }else{
      throw new TypeError('You need to specify a type of release');
    }
    
  });
};