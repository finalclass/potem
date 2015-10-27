var potem = require('../build/commonjs/potem').potem;
var fs = require('fs');
var domain = require('domain');

describe('it-can-be-parallel.spec', function () {

  it('is parallel', function (next) {
    var p = potem()
      .then(function () {
        fs.writeFile('tmp.tmp', 'a', p.pause(1, p.throwArg));
        fs.writeFile('tmp2.tmp', 'b', p.pause(1, p.throwArg));
      })
      .then([function (write1, write2) {
        fs.readFile('tmp.tmp', p.pause(1, p.throwArg));
        fs.readFile('tmp2.tmp', p.pause(1, p.throwArg));
      }])
      .then([function (read1, read2) {
        return read1 + read2;
      }])
      .then(function (concatenation) {
        expect(concatenation === 'ab' || concatenation === 'ba').toBeTruthy();
      })
      .error(function (e) {
        console.log('e', e);
        next(e);
      })
      .fin(function () {
        fs.unlink('tmp.tmp', p.pause());
        fs.unlink('tmp2.tmp', p.pause());
      })
      .then(next);
  });

});
