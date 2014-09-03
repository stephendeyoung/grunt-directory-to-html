'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

var handlebars = require('handlebars');

exports.to_html = {
  default_options: function(test) {
    test.expect(3);

    var actual = grunt.file.read('tmp/index.html');
    var expected = grunt.file.read('test/expected/index.html');
    test.equal(actual, expected, 'should create a basic html template from a simple directory structure');

    var actual2 = grunt.file.read('tmp/index2.html');
    var expected2 = grunt.file.read('test/expected/index2.html');
    test.equal(actual2, expected2, 'should create a nested html structure corresponding to the directory structure');

    var actual3 = grunt.file.read('tmp/index3.html');
    var expected3 = grunt.file.read('test/expected/index3.html');
    test.equal(actual3, expected3, 'should be able to handle deep nestings');

    test.done();
  },
  module_directory_option: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/index4.html');
    var expected = grunt.file.read('test/expected/index4.html');
    test.equal(actual, expected, 'should be able to handle a different module directory option');

    test.done();
  },
  generate_page_option: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/index5.html');
    var expected = grunt.file.read('test/expected/index5.html');
    test.equal(actual, expected, 'should generate a full html page if the "generatePage" option is set to true');

    test.done();
  },
  template_option: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/index6.html');
    var expected = grunt.file.read('test/expected/index6.html');
    test.equal(actual, expected, 'should use the template provided in the "options" object');

    test.done();
  },
  json_data: function(test) {
    test.expect(2);

    var actual = grunt.file.read('tmp/index7.html');
    var expected = grunt.file.read('test/expected/index7.html');
    test.equal(actual, expected, 'should read a "data.json" file if it exists in the folder and render that data into the template');

    var actual2 = grunt.file.read('tmp/index8.html');
    var expected2 = grunt.file.read('test/expected/index8.html');
    test.equal(actual2, expected2, 'should expose additional data to the template if it exists in the json data');

    test.done();
  },
  handlebars_option: function(test) {
    test.expect(1);

    var template = handlebars.compile(grunt.file.read('tasks/templates/html-structure.hbs'));
    var directoryStructure = {
      modules: [
        {
          title: 'Data title',
          description: 'This is a folder that contains some json data for the folder location',
          path: 'test/fixtures/handlebars_option/modules/another_test_link/index.html'
        },
        {
          title: 'Test link',
          children: [
            {
              title: 'Nested test link',
              path: 'test/fixtures/handlebars_option/modules/test_link/nested_test_link/index.html'
            }
          ]
        }
      ]
    };

    var actual = grunt.file.read('tmp/index9.html');
    var expected = template(directoryStructure);
    test.equal(actual, expected, 'should use handlebars as the templating language if specified in the options');

    test.done();
  },
  title_option: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/index10.html');
    var expected = grunt.file.read('test/expected/index10.html');
    test.equal(actual, expected, 'should use a different title if the "title" option is set');

    test.done();
  },
  stylesheet_option: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/index11.html');
    var expected = grunt.file.read('test/expected/index11.html');
    test.equal(actual, expected, 'should use a stylesheet if the "stylesheet" option is set');

    test.done();
  },
  use_filename_as_title_option: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/index13.html');
    var expected = grunt.file.read('test/expected/index13.html');
    test.equal(actual, expected, 'should be able to use filename as a title instead');

    test.done();
  },
  dashes_for_folder_name: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/index12.html');
    var expected = grunt.file.read('test/expected/index12.html');
    test.equal(actual, expected, 'should be able to handle dashes in folder name');

    test.done();
  }
};
