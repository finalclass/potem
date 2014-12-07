var Potem = require('../build/commonjs/Potem.js');
var fs = require('fs');
var domain = require('domain');

describe('it-can-be-parallel.spec', function () {

  it('is parallel', function (next) {
    var p = new Potem()
      .then(function () {
        fs.writeFile('tmp.tmp', 'a', p.pause());
        fs.writeFile('tmp2.tmp', 'b', p.pause());
      })
      .then([Potem.throwFirstArgumentInArray, function (write1, write2) {
        fs.readFile('tmp.tmp', p.pause());
        fs.readFile('tmp2.tmp', p.pause());
      }])
      .then([Potem.throwFirstArgumentInArray, function (read1, read2) {
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
