var Potem = require('../build/commonjs/Potem.js');

describe('it-executes-in-sequence', function () {

  it('is sync', function (next) {
    var p = new Potem()
      .then(function () {
        return 'a';
      })
      .then(function (n) {
        return n + 'b';
      })
      .then(function (n) {
        return n + 'c';
      })
      .then(function (n) {
        return n + 'd';
      })
      .fin(function (n) {
        expect(n).toBe('abcd');
        next();
      });
  });

});
