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
  var createDataStructure = function(folderStructure, directoryArray) {
    if (directoryArray.length === 1) {
      folderStructure.push({
        id: directoryArray[0]
      });
    } else {
      var parentFolder = findMatchingFolderInDataStructure(folderStructure, directoryArray[0]);

      if (parentFolder === null) {
        var newFolder = {
          id: directoryArray[0],
          title: getTitle(directoryArray[0])
        };

        folderStructure.push(newFolder);

        parentFolder = newFolder;
      }

      if (!parentFolder.children) {
        parentFolder.children = [];
      }

      createDataStructure(parentFolder.children, directoryArray.slice(1));
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
    var fileDirectories = getFilePathDirectories(options, filepath);
    var parentDirectory = fileDirectories[fileDirectories.length - 2];
    var parentFolder = findParentFolderInDataStructure(directoryStructure, fileDirectories.slice(0, fileDirectories.length - 1));

    parentFolder.path = filepath;

    if (!parentFolder.title) {
      parentFolder.title = getTitle(parentDirectory);
    }
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
      var fileDirectories = f.src.map(getFilePathDirectories.bind(this, options)).map(function(directoryArray) {
        return directoryArray.slice(0, directoryArray.length - 1);
      });

      var directoryStructure = {
        modules: []
      };

      fileDirectories.forEach(createDataStructure.bind(this, directoryStructure.modules));

      f.src.forEach(getFileData.bind(this, options, directoryStructure.modules));

      // Write the destination file.
      grunt.file.write(f.dest, tpl(directoryStructure));

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });

};
