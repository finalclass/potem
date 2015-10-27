var potem = require('../build/commonjs/potem').potem;
var fs = require('fs');

describe('it-can-pause-many-times', function () {

  it('it-can-pause-many-times', function (next) {
    var p = potem()
      .then(function () {
        fs.readdir(__dirname, p.pause(1, p.throwArg));
      })
      .then(function (files) {
        for (var i = files.length; i -= 1;) {
          fs.readFile(__dirname + '/' + files[i], p.pause(1, p.throwArg));
        }
      })
      .then([function(fileContentsArray) {
        expect(fileContentsArray.join('') !== '').toBeTruthy();
      }])
      .fin(function (err) {
      if (err) {
        console.log(err, err.stack);
      }
      next(err);
    });
  });
});
