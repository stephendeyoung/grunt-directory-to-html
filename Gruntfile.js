/*
 * grunt-project-homepage
 * https://github.com/youngst/grunt-project-homepage
 *
 * Copyright (c) 2013 Stephen Young
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    project_homepage: {
      default_options: {
        options: {
        },
        files: {
          'tmp/index.html': 'test/fixtures/basic/**/index.html',
          'tmp/index2.html': 'test/fixtures/nested_directories/**/index.html',
          'tmp/index3.html': 'test/fixtures/crazy_nested/**/index.html'
        }
      },
      module_directory_option: {
        options: {
          modulesDirectory: 'components'
        },
        files: {
          'tmp/index4.html': 'test/fixtures/module_directory_option/**/index.html'
        }
      },
      generate_page_option: {
        options: {
          generatePage: true
        },
        files: {
          'tmp/index5.html': 'test/fixtures/generate_page_option/**/index.html'
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'jshint', 'project_homepage', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
