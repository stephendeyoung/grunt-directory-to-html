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

var html;

exports.project_homepage = {
  setUp: function(done) {


    done();
  },
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
  }
};
