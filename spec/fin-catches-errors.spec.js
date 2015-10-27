var potem = require('../build/commonjs/potem').potem;

describe('fin-catches-errors.spec', function () {

  it('uses fin to catch errors', function (next) {
    potem()
      .then(function () {
        throw new Error('abc');
      })
      .fin(function (err) {
        expect(err.message).toBe('abc');
        next();
      });
  });

});
