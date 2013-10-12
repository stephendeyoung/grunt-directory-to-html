/*
 * grunt-project-homepage
 * https://github.com/youngst/grunt-project-homepage
 *
 * Copyright (c) 2013 Stephen Young
 * Licensed under the MIT license.
 */

'use strict';

var jade = require('jade');

module.exports = function(grunt) {

  // creates a data structure that reflects the folder structure on the
  // file system
  var createDataStructure = function(folderStructure, directoryArray, filepath) {
    if (directoryArray.length === 1) {
      folderStructure.push({
        id: directoryArray[0],
        title: getTitle(directoryArray[0]),
        path: filepath
      });
    } else {
      // does this folder already exist in our folderStructure
      var folder = findMatchingFolderInDataStructure(folderStructure, directoryArray[0]);

      if (!folder) {
        var newFolder = {
          id: directoryArray[0]
        };

        folderStructure.push(newFolder);

        folder = newFolder;
      }

      if (!folder.children) {
        folder.children = [];
      }

      createDataStructure(folder.children, directoryArray.slice(1));
    }
  };

  var findMatchingFolderInDataStructure = function(structure, directoryName) {
    if (!structure || !structure[0]) {
      return null;
    } else if (structure[0].id === directoryName) {
      return structure[0];
    } else {
      return findMatchingFolderInDataStructure(structure.slice(1), directoryName);
    }
  };

  var findParentFolder = function(directories, directoryName) {
    if (directories[0] === directoryName) {
      return directories[0];
    } else if (directories.length > 1) {
      return findParentFolder(directories.slice(1), directoryName);
    } else {
      throw new Error('failed to find parent folder');
    }
  };

  var findParentFolderInDataStructure = function(structure, directories) {

    if (!structure) {
      return false;
    } else {
      var inArray = findMatchingFolderInDataStructure(structure, directories[0]);

      if (directories.length === 1) {
        return inArray;
      } else {
        return findParentFolderInDataStructure(inArray.children, directories.slice(1));
      }
    }
  };

  var getFilePathDirectories = function(options, filepath) {
    var searchForModulesDirectory = filepath.search(new RegExp(options.modulesDirectory));
    var newFilePath = filepath.slice(searchForModulesDirectory + (options.modulesDirectory.length + 1));
    var directories = newFilePath.split('/');

    return directories;
  };

  var getTitle = function(directoryName) {
    var splitParent = directoryName.split('_');
    var splitParentFinal = splitParent.length > 1 ? splitParent : directoryName.split('-');

    var title = splitParentFinal.join(' ');
    var finalTitle = title.charAt(0).toUpperCase() + title.slice(1);

    return finalTitle;
  };

  var getFileData = function(options, directoryStructure, filepath) {
    var splitPaths = getFilePathDirectories(options, filepath);
    var parentDirectory = splitPaths[splitPaths.length - 2];
    var directories = splitPaths.slice(0, splitPaths.length - 1);

    createDataStructure(directoryStructure, directories, filepath);

  };

  grunt.registerMultiTask('project_homepage', 'Generate a project homepage from a directory structure', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      modulesDirectory: 'modules',
      generatePage: false
    });

    var template;

    if (!options.generatePage) {
      template = grunt.file.read(__dirname + '/templates/homepage.jade');
    } else {
      template = grunt.file.read(__dirname + '/templates/header.jade');
    }

    var tpl = jade.compile(template, {
      pretty: true,
      filename: __dirname + '/templates/*'
    });

    var moduleData = {
      modules: null
    };
    // Iterate over all specified file groups.
    this.files.forEach(function(f) {

      var directoryStructure = {
        modules: []
      };

      f.src.forEach(getFileData.bind(this, options, directoryStructure.modules));

      // Write the destination file.
      grunt.file.write(f.dest, tpl(directoryStructure));

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });

};
