var Potem = require('../build/commonjs/Potem.js');

describe('fin-catches-errors.spec', function () {

  it('uses fin to catch errors', function (next) {
    new Potem()
      .then(function () {
        throw new Error('abc');
      })
      .fin(function (err) {
        expect(err.message).toBe('abc');
        next();
      });
  });

});
