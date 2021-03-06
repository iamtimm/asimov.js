var Base = require('./Base');
var Config = require('./Config');
var _ = require('lodash');

var _super = Base.prototype;

module.exports = Base.extend({

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.logger.baseDir = process.cwd();
    self.logger.frameworkDir = self.options.frameworkDir;

    self.logger.pending('main', 'Loading asimov.js @ ' + self.options.pkg.version);
    self.logger.log('main', 'The time is ' + new Date());

    _.defer(self.bootstrap);
  },

  'getAllScripts': function (type, paths) {

    var self = this;
    var scripts = [];
    var source = self.config.json[type];

    if (!_.isArray(source)) {
      source = [source];
    }

    _.each(source, function (name) {

      var path = self.filesystem.findFirstMatch(name, paths);
      path && scripts.push(process.cwd() + '/' + path);
    });

    return scripts;
  },

  'runSequential': function (namespace, paths) {

    var self = this;
    var type = namespace + 's';
    paths = paths[type];
    var deferred = self.deferred();
    var scripts = self.getAllScripts(type, paths);
    var count = scripts.length;

    function next () {

      if (!scripts.length) {

        return deferred.resolve(count);
      }

      var script = scripts.shift();

      self.logger.low('init', 'Running ' + namespace + ' @ '+ script);

      var Constructor = require(script.replace(/\.js$/, ''));
      var instance = new Constructor(self.options);
      instance.run(next);
    }

    next();

    return deferred.promise();
  },

  'bootstrap': function () {

    var self = this;
    var meta = self.options.meta;

    var started = new Date();
    self.logger.pending(self.namespace, 'Starting project "' + meta.name + '" @ ' + meta.version);

    // Pass in the options to merge them with the environment config
    var config = self.config = new Config(self.options);
    config.json.outputPath = process.cwd() + '/' + config.json.paths.outputDir;

    var started = new Date();

    return self.runSequential('initializer', self.options.paths).done(function (count) {

      self.logger.since('asimov', 'Executed ' + count + ' initializer(s)', started);

      self.bindOnceTo(self.mediator, 'queue:empty', function () {
        self.logger.since(self.namespace, 'Started project "' + meta.name + '"', started);
      });

      self.mediator.trigger('queue:start');
    });
  }
});