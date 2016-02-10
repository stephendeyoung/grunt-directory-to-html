/*
 * grunt-directory-to-html
 * https://github.com/stephendeyoung/grunt-directory-to-html
 *
 * Copyright (c) 2013 Stephen Young
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var jade = require('jade');
var handlebars = require('handlebars');

module.exports = function(grunt) {

  grunt.registerMultiTask('to_html', 'Generate a project homepage from a directory structure', function() {
    // Merge task-specific and/or target-specific options with these defaults
    var options = this.options({
      rootDirectory: 'modules',
      relativeURLPath: '',
      generatePage: false,
      template: false,
      templatingLanguage: 'jade',
      title: 'Project homepage',
      stylesheet: false,
      useFileNameAsTitle: false
    });

    var template;
    var compiledTemplate;

    if (options.template) {
      template = options.template;
    } else if (!options.generatePage) {
      template = grunt.file.read(__dirname + '/templates/html-structure.jade');
    } else {
      template = grunt.file.read(__dirname + '/templates/header.jade');
    }

    if (options.templatingLanguage === 'handlebars') {
      compiledTemplate = handlebars.compile(template);
      handlebars.registerHelper('recurse', function(children) {
        return compiledTemplate({modules: children});
      });
    } else {
      compiledTemplate = jade.compile(template, {
        pretty: true,
        filename: __dirname + '/templates/*'
      });
    }

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {

      var directoryStructure = {
        modules: [],
        title: options.title,
        stylesheet: options.stylesheet
      };

      f.src.forEach(buildDataStructure.bind(this, options, directoryStructure.modules));

      // Write the destination file.
      grunt.file.write(f.dest, compiledTemplate(directoryStructure));

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });


  function buildDataStructure(options, directoryStructure, filepath) {
    var splitPaths = getDirectoryInFilepath(options.rootDirectory, filepath, true).split('/');
    var filenameIndex = splitPaths.length - 1;
    var directories;

    if (options.useFileNameAsTitle) {
      var filename = splitPaths[filenameIndex];
      var findDot = filename.indexOf('.');
      var filenameWithoutExtension = filename.slice(0, findDot);
      directories = splitPaths.slice(0, filenameIndex).concat(filenameWithoutExtension);
    } else {
      directories = splitPaths.slice(0, filenameIndex);
    }

    addFileLocationToDirectoryStructure(options, directoryStructure, directories, filepath, 0);
  }

  function getDirectoryInFilepath(name, filepath, sliceFromNameToEnd) {
    var searchForName = filepath.search(new RegExp(name));
    var indexOfLastCharInName = searchForName + name.length;
    var directoryPath;

    if (sliceFromNameToEnd) {
      directoryPath = filepath.slice(indexOfLastCharInName + 1);
    } else {
      directoryPath = filepath.slice(0, indexOfLastCharInName + 1);
    }

    return directoryPath;
  }

  function addFileLocationToDirectoryStructure(options, directoryStructure, directories, filepath, level) {
    var directoryLocation = getDirectoryInFilepath(directories[0], filepath, false);
    var pathToJSON = directoryLocation + '/data.json';
    var fileLocationData = {
      id: directories[0],
      title: getTitle(directories[0]),
      level: level
    };

    if (fs.existsSync(pathToJSON)) {
      fileLocationData = grunt.util._.extend(fileLocationData, grunt.file.readJSON(pathToJSON));
    }

    if(options.relativeURLPath && options.relativeURLPath.length) {
      filepath = filepath.split("/").pop();
      filepath = options.relativeURLPath + filepath;
    }

    if (directories.length === 1) {
      directoryStructure.push(grunt.util._.extend(fileLocationData, {
        path: filepath
      }));
    } else {
      // does this folder already exist in our directoryStructure
      var folder = findMatchingFolderInDirectoryStructure(directoryStructure, directories[0]);

      // if not then create a placeholder for it
      if (!folder) {
        directoryStructure.push(fileLocationData);

        folder = fileLocationData;
      }

      if (!folder.children) {
        folder.children = [];
      }

      addFileLocationToDirectoryStructure(options, folder.children, directories.slice(1), filepath, level + 1);
    }
  }

  function findMatchingFolderInDirectoryStructure(structure, directoryName) {
    if (!structure || !structure[0]) {
      return null;
    } else if (structure[0].id === directoryName) {
      return structure[0];
    } else {
      return findMatchingFolderInDirectoryStructure(structure.slice(1), directoryName);
    }
  }

  function getTitle(directoryName) {
    var splitParent = directoryName.split('_');
    var splitParentFinal = splitParent.length > 1 ? splitParent : directoryName.split('-');

    var title = splitParentFinal.join(' ');
    var finalTitle = title.charAt(0).toUpperCase() + title.slice(1);

    return finalTitle;
  }
};
