var Potem = require('../build/commonjs/Potem');

describe('in place arguments', function () {

  function async(callback) {
    setTimeout(function () {
      callback(new Error('asyncMessage'));
    });
  }

  it('can describe arguments', function (next) {
    var p = new Potem()
      .then(function () {
        async(p.pause(1, Potem.THROW_ARG));
      })
      .error(function (err) {
        expect(err.message).toBe('asyncMessage');
        next();
      });
  });

});