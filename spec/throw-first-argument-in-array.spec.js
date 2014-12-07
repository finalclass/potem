var Potem = require('../build/commonjs/Potem.js');

describe('throw-first-argument-in-array.spec', function () {

  it('can catch many', function (next) {
    var p = new Potem()
      .then(function () {
        var resume1 = p.pause();
        var resume2 = p.pause();

        setTimeout(function () {
          resume1(new Error('err1'));
          resume2(new Error('err2'));
        });
      })
      .then([Potem.throwFirstArgumentInArray])
      .error(function (err) {
        expect(err).toBeDefined();
        next();
      });

  });

});
