var Potem = require('../build/commonjs/Potem.js');

describe('basic-use-case', function () {

  it('can pass arguments sync', function () {
    new Potem()
      .then(function () {
        return 'test';
      })
      .then(function (result) {
        expect(result).toBe('test');
      });
  });

  it('can pass arguments async', function (next) {
    var p = new Potem()
      .then(function () {
        var resume = p.pause();
        setTimeout(function () {
          resume('works'); //pass argument to the next function
        });
      })
      .then(function (result) {
        expect(result).toBe('works');
        next();
      });

  });
});
