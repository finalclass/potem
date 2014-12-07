var Potem = require('../build/commonjs/Potem.js');

describe('it-can-catch.spec', function () {

  it('can catch', function (next) {
    var cb = jasmine.createSpy('errorHandler');
    var nextPotem = jasmine.createSpy('nextPotem');
    var throwError = function () {
      throw new Error('error thrown');
    };
    var noop = jasmine.createSpy('noop');

    new Potem()
      .then(noop)
      .then(noop)
      .then(noop)
      .then(throwError)
      .then(nextPotem)
      .error(cb);

    setTimeout(function () {
      expect(nextPotem).not.toHaveBeenCalled();
      expect(cb).toHaveBeenCalled();
      expect(noop.calls.length).toBe(3);
      next();
    }, 100);
  });

});
