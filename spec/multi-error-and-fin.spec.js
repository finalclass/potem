var potem = require('../build/commonjs/potem').potem;

describe('multi-catch-and-finally', function () {

  it('can have many finally stmts', function (next) {
    var spy1 = jasmine.createSpy();
    var spy2 = jasmine.createSpy();

    potem()
      .then(function () {

      })
      .fin(spy1)
      .fin(spy2);

    setTimeout(function () {
      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
      next();
    }, 50);
  });

  it('can have many catch stmts', function (next) {
    var spy1 = jasmine.createSpy();
    var spy2 = jasmine.createSpy();

    potem()
      .then(function () {
        throw new Error();
      })
      .error(function () {
        spy1();
        throw new Error();
      })
      .error(function () {
        spy2();
      });

    setTimeout(function () {
      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
      next();
    }, 50);
  });

});
