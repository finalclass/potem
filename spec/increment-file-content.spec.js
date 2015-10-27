var potem = require('../build/commonjs/potem').potem;
var fs = require('fs');

describe('it-increment-file-content.spec', function () {

  it('it-increment-file-content.spec', function (next) {
    var p = potem()
      .then(function () {
        fs.readdir(__dirname, p.pause(1, p.throwArg));
      })
      .then(function (files) {
        var next = p.pause(files.length, p.throwArg);
        files.forEach(function (file) {
          fs.readFile(__dirname + '/' + file, next);
        });
      })
      .then([function () {
        return Array.prototype.join.call(arguments, '');
      }])
      .then(function (result) {
        expect(result !== '').toBeTruthy();
      })
      .fin(next);
  });

});
