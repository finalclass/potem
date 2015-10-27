var potem = require('../build/commonjs/potem').potem;

describe('in place arguments', function () {

  function async(callback) {
    setTimeout(function () {
      callback(new Error('asyncMessage'));
    });
  }

  function async2(callback) {
    setTimeout(function () {
      callback(null, new Error('asyncMessage2'));
    });
  }

  function async3(callback) {
    setTimeout(function () {
      callback(1, 2, 3);
    });
  }

  it('throwArg slices from args array in place when no error', function () {
    var args = [0, 1, 2];
    var p = potem();
    p.throwArg(0, args);
    expect(args).toEqual([1, 2]);
  });

  it('throwArg slices from args array in place when error', function () {
    var args = [new Error(), 1, 2];
    var p = potem();
    p.throwArg(0, args);
    expect(args).toEqual([1, 2]);
  });

  it('throwArg throws an error when argument is an error', function () {
    var args = [new Error(), 1, 2];
    var p = potem();

    p.throwArg(0, args);
    expect(p.stackError).toBeTruthy();
  });

  it('can describe arguments', function (next) {
    var p = potem()
      .then(function () {
        async(p.pause(1, p.throwArg));
      })
      .error(function (err) {
        expect(err.message).toBe('asyncMessage');
        next();
      });
  });

  it('passArg', function () {
    var p = potem();
    expect(p.passArg(0, [1, 2, 3])).toBe(0);
  });

  it('can skipArg', function () {
    var p = potem();
    var args = [1, 2, 3];
    p.skipArg(0, args);
    expect(args).toEqual([2, 3]);
  });

  it('can throw second argument', function (next) {
    var p = potem()
      .then(function () {
        async2(p.pause(1, p.passArg, p.throwArg));
      })
      .error(function (err) {
        expect(err.message).toBe('asyncMessage2');
        next();
      });
  });

  it('can skip error, then throw right', function (next) {
    var p = potem()
      .then(function () {
        async2(p.pause(1, p.skipArg, p.throwArg))
      })
      .error(function (err) {
        expect(err.message).toBe('asyncMessage2');
        next();
      })
  });

  it('can pause many times using same argument converters', function (next) {
    var p = potem()
      .then(function () {
        var resume = p.pause(3, p.skipArg, p.passArg, p.skipArg);
        async3(resume);
        async3(resume);
        async3(resume);
      })
      .then([function (args1, args2, args3) {
        expect(args1[0]).toBe(2);
        expect(args2[0]).toBe(2);
        expect(args3[0]).toBe(2);
        expect(args1.length).toBe(1);
        expect(args2.length).toBe(1);
        expect(args3.length).toBe(1);
        next();
      }])
  });

  it('can pause many times using different argument converters', function (next) {
    var p = potem()
      .then(function () {
        async3(p.pause(1, p.skipArg, p.passArg, p.passArg));
        async3(p.pause(1, p.passArg, p.skipArg, p.passArg));
        async3(p.pause(1, p.passArg, p.passArg, p.skipArg));
      })
      .then([function (args1, args2, args3) {
        expect(args1[0]).toBe(2);
        expect(args1[1]).toBe(3);
        expect(args2[0]).toBe(1);
        expect(args2[1]).toBe(3);
        expect(args3[0]).toBe(1);
        expect(args3[1]).toBe(2);

        expect(args1.length).toBe(2);
        expect(args2.length).toBe(2);
        expect(args3.length).toBe(2);

        next();
      }])
  });

});
