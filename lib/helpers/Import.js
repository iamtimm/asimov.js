var TemplateHelper = require('../render/TemplateHelper');
var _ = require('lodash');
var _super = TemplateHelper.prototype;

module.exports = TemplateHelper.extend({

  'run': function (name, data) {

    var self = this;
    var options = self.opts(arguments);
    var hash = _.merge({}, data, options.hash);
    var attributes = _.merge({}, self.currentPage.attributes, hash);

    var template = self.options.templates.findWhere({
      'name': name
    });

    self.assert('object', template, 'Failed to import partial template "' + name  + '" @ ' + self.currentUrl);

    return template.attributes.compiled(attributes);
  }
});