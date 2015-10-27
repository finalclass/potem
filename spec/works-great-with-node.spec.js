var potem = require('../build/commonjs/potem').potem;
var fs = require('fs');

describe('it-works-great-with-node.spec', function () {

  it('is a good idea for node style callbacks', function (next) {
    var p = potem()
      .then(function () {
        fs.writeFile('tmp.tmp', 'Test', p.pause(1, p.throwArg));
      })
      .then(function () {
        fs.exists('tmp.tmp', p.pause());
      })
      .then(function (exists) {
        expect(exists).toBeTruthy();
        fs.readFile('tmp.tmp', p.stdPause());
      })
      .then(function (file) {
        expect(file.toString()).toBe('Test');
      })
      .fin(function (err) {
        fs.unlink('tmp.tmp', p.pause());
        if (err) {
          next(err);
        }
      })
      .then(function (err) {
        next(err);
      });
  });

});
