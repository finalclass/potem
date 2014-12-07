var Potem = require('../build/commonjs/Potem.js');
var fs = require('fs');

describe('multiplie tries', function () {

  it('can merge tries sync', function (next) {
    var p = new Potem()
      .then(function () {
        return new Potem()
          .then(function () {
            return 'works';
          });
      })
      .then(function (works) {
        expect(works).toBe('works');
      })
      .then(function () {
        next();
      })
      .error(next);
  });

  it('can merge tries async', function (next) {
    var p1 = new Potem()
      .then(function () {
        return p2 = new Potem()
          .then(function () {
            var resume = p2.pause();
            setTimeout(function () {
              resume('works');
            }, 200);
          });
      })
      .then(function (works) {
        expect(works).toBe('works');
      })
      .then(function () {
        next();
      });
  });

  it('can merge by return statement', function (next) {
    var p1 = new Potem()
      .then(function () {
        return p2 = new Potem()
          .then(function () {
            var resume = p2.pause();
            setTimeout(function () {
              resume('works');
            });
          });
      })
      .then(function (works) {
        expect(works).toBe('works');
        next();
      });
  });

  it('can merge by return in real life situation', function (next) {
    var p1 = new Potem()
      .then(function () {
        return p2 = new Potem()
          .then(function () {
            fs.writeFile('tmp.tmp', 'ABC', p2.pause());
          })
          .then(function () {
            fs.unlink('tmp.tmp', p1.pause());
          });
      })
      .then(function () {
        fs.exists('tmp.tmp', p1.pause());
      })
      .then(function (doesExists) {
        expect(doesExists === false).toBeTruthy();
        next();
      });
  });


});
