var Potem = require('../build/commonjs/Potem.js');

describe('resume-is-sorted', function () {

  it('sorts after resume', function () {
    function delay(msg, done, delay) {
      setTimeout(function () {
        done(msg);
      }, delay)
    }


    var p = new Potem()
      .then(function () {
        delay('a', p.pause(), 30);
        delay('b', p.pause(), 20);
        delay('c', p.pause(), 50);
        delay('d', p.pause(), 10);
        delay('e', p.pause(), 10);
        delay('f', p.pause(), 10);
        delay('g', p.pause(), 10);
      })
      .then([function () {
        var result = Array.prototype.slice.call(arguments, 0)
          .map(function (a) {
            return a[0];
          })
          .join('');
        expect(result).toBe('abcdefg');
      }]);
  });

});
