var Potem = require('../build/commonjs/Potem.js');
var fs = require('fs');

describe('it-increment-file-content.spec', function () {

  it('it-increment-file-content.spec', function (next) {
    var p = new Potem()
      .then(function () {
        fs.readdir(__dirname, p.pause());
      })
      .then(Potem.throwFirstArgument)
      .then(function (files) {
        var next = p.pause(files.length);
        files.forEach(function (file) {
          fs.readFile(__dirname + '/' + file, next);
        });
      })
      .then([Potem.throwFirstArgumentInArray, function () {
        return Array.prototype.join.call(arguments, '');
      }])
      .then(function (result) {
        expect(result !== '').toBeTruthy();
      })
      .fin(next);
  });

});
