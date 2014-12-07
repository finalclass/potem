var Potem = require('../build/commonjs/Potem.js');
var fs = require('fs');

describe('it-can-pause-many-times', function () {

  it('it-can-pause-many-times', function (next) {
    var p = new Potem()
      .then(function () {
        fs.readdir(__dirname, p.pause());
      })
      .then(Potem.throwFirstArgument)
      .then(function (files) {
        for (var i = files.length; i -= 1;) {
          fs.readFile(__dirname + '/' + files[i], p.pause());
        }
      })
      .then([Potem.throwFirstArgumentInArray, function(fileContentsArray) {
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
