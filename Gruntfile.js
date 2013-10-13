/*
 * grunt-directory-to-html
 * https://github.com/stephendeyoung/grunt-directory-to-html
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
    to_html: {
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
          rootDirectory: 'components'
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
      },
      template_option: {
        options: {
          template: grunt.file.read('test/fixtures/templates/test_template.jade')
        },
        files: {
          'tmp/index6.html': 'test/fixtures/template_option/**/index.html'
        }
      },
      json_data: {
        options: {
          template: grunt.file.read('test/fixtures/templates/template_with_random_data.jade')
        },
        files: {
          'tmp/index7.html': 'test/fixtures/json_data/**/index.html',
          'tmp/index8.html': 'test/fixtures/json_data_extra/**/index.html'
        }
      },
      handlebars_option: {
        options: {
          template: grunt.file.read('tasks/templates/html-structure.hbs'),
          templatingLanguage: 'handlebars'
        },
        files: {
          'tmp/index9.html': 'test/fixtures/handlebars_option/**/index.html'
        }
      },
      title_option: {
        options: {
          generatePage: true,
          title: 'A different title'
        },
        files: {
          'tmp/index10.html': 'test/fixtures/generate_page_option/**/index.html'
        }
      },
      stylesheet_option: {
        options: {
          generatePage: true,
          stylesheet: '/path/to/stylesheet.css'
        },
        files: {
          'tmp/index11.html': 'test/fixtures/generate_page_option/**/index.html'
        }
      },
      dashes_for_folder_name: {
        files: {
          'tmp/index12.html': 'test/fixtures/dashes-in-folder-name/**/index.html'
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*-test.js'],
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
  grunt.registerTask('test', ['clean', 'jshint', 'to_html', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
