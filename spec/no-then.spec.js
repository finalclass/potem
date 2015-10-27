var potem = require('../build/commonjs/potem').potem;

describe('it-can-be-async.spec', function () {

  it('is async', function (next) {
    var result = 0;

    var p = potem(function () {
        result += 1;
        setTimeout(p.pause());
      })
      (function () {
        result += 1;
        setTimeout(p.pause());
      })
      (function () {
        result += 1;
        setTimeout(p.pause());
      })
      .fin(function (err) {
        expect(result).toBe(3);
        next();
      });
  });

});
