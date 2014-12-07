var Potem = require('../build/commonjs/Potem.js');

describe('it-can-be-async.spec', function () {

  it('is async', function (next) {
    var result = 0;

    var p = new Potem()
      .then(function () {
        result += 1;
        setTimeout(p.pause());
      })
      .then(function () {
        result += 1;
        setTimeout(p.pause());
      })
      .then(function () {
        result += 1;
        setTimeout(p.pause());
      })
      .fin(function (err) {
        expect(result).toBe(3);
        next();
      });
  });

});
