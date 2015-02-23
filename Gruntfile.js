module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      build: {
        src: 'script/app.js',
        dest: 'script/app.min.js'
      }
    },

    cssmin: {
      minify: {
        expand: true,
        cwd: 'css/',
        src: ['style.css'],
        dest: 'css/',
        ext: '.min.css'
      }
    },

    jshint: {
      all: ['script/app.js']
    },

    sass: {                              
      dist: {                           
        options: {                      
          style: 'expanded'
        },
        files: {                         
          'css/style.css': 'sass/style.sass',       
        }
      }
    },

    watch: {
        options:{
          livereload: true
        },
        sass: {
          files: ['sass/*.sass'],
          tasks: ['sass']
        },
        css: {
          files: ['css/style.css'],
          tasks: ['cssmin']
        },
        js: {
          files: ['script/*.js'],
          tasks: ['uglify', 'jshint']
        }
    },

    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('karma');
  
  // Default task(s).
  grunt.registerTask('default', ['uglify', 'cssmin', 'sass', 'watch']);
};