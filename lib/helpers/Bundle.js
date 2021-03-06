var TemplateHelper = require('../render/TemplateHelper');
var ScriptNode = require('../nodes/ScriptNode');
var npath = require('path');
var _ = require('lodash');
var _super = TemplateHelper.prototype;

module.exports = TemplateHelper.extend({

  'run': function (name) {

    var self = this;
    var options = self.opts(arguments);
    var collection = self.options.scripts;
    var hash = options.hash;

    self.assert('string', name, 'Invalid name in script template helper @ ' + self.currentUrl);

    var model = collection.find(function (_model) {
      return _model.attributes.name === name;
    });

    if (!model) {

      model = collection.create({
        'name': name,
        'bundle': true
      }, self.options);

      self.defer(model.fetch);
    }

    var attributes = model.attributes;

    hash.type = attributes.contentType;
    hash.src = attributes.url;

    return self.html('script', hash) + self.html('div', {
      'class': 'bundle_' + attributes.classId
    }) + self.html('script', {
      'html': 'require(["' + name  + '"], function (Bundle) { new Bundle(); });'
    });
  }
});