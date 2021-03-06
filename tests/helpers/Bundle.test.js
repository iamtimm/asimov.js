test([

  '../../lib/helpers/Bundle',
  '../../lib/core/Collection',
  '../../lib/nodes/ScriptNodesCollection'

], function (test) {

  var instance;

  beforeEach(function () {

    instance = new test.deps.Bundle({
      'name': 'script',
      'queue': new test.deps.Collection(),
      'scripts': new test.deps.ScriptNodesCollection(),
      'paths': {
        'scripts': 'lib'
      }
    });

    instance.currentUrl = '/blog';
  });

  test.spec('run (string name)', function () {

    test.when('name is not a string', function () {

      test.itShould.throwError(function () {
        instance.run(null);
      });
    });

    test.when('name is a string', function () {

      test.it('should return a script tag', function () {

        var result = instance.run('lib/scripts/bootstrap', {
          'hash': {}
        });
        expect(result).to.include('<script');
        expect(result).to.include('src="/lib/scripts/bootstrap.js');
      });

      test.it('should return a bootstrap element for the bundle', function () {

        var result = instance.run('lib/scripts/bootstrap', {
          'hash': {}
        });
        expect(result).to.include('div class="bundle_lib_scripts_bootstrap"');
      });

      test.it('should return a bootstrap harness for the bundle', function () {

        var result = instance.run('lib/scripts/bootstrap', {
          'hash': {}
        });

        expect(result).to.include('new Bundle();');
      });
    });
  });
});