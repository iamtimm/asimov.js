var FilesystemModel = require('../core/FilesystemModel');
var _ = require('lodash');
var npath = require('path');
var _super = FilesystemModel.prototype;

module.exports = FilesystemModel.extend({

  'idAttribute': 'url',

  'defaults': {
    'type': 'styleSheet',
    'contentType': 'text/css',
    'name': null,
    'raw': null,
    'path': null,
    'url': null
  },

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.bindTo(self, 'change:name', 'parseName');
    self.attributes.name && self.parseName();
  },

  'parseName': function () {

    var self = this;
    var attributes = self.attributes;

    attributes.path = self.filesystem.findFirstMatch(attributes.name, self.options.paths.styles);

    if (attributes.path.indexOf(process.cwd()) < 0) {
      attributes.path = npath.join(process.cwd(), attributes.path);
    }

    attributes.url = attributes.path.replace('.styl', '.css').replace(process.cwd(), '');

    self.set(attributes);
  }
});