Potem
=========

## Modern, very fast, lightweight, async, promise-like class

Learn from the examples:) You can find many of them in the `spec/` directory.

## install

```bash
npm install potem
```

## async usage (read directory content)

```js
var Potem = require('Potem')
var fs = require('fs');

var p = new Potem()
    .then(function () {
        //p.pause() method returns a "resume" callback and pauses current execution.
        fs.readdir('./spec', p.pause());
    })
    .then(function (err, files) {
        if (err) { throw err; }
        var next = p.pause(files.length);

        files.forEach(function (file) {
            console.log('file', file);
            fs.readFile('./spec/' + file, next);
        });
    })
    .then([Potem.throwFirstArgumentInArray, function () {
        return Array.prototype.join.call(arguments, '');
    }])
    .then(function (result) {
        dirContent = result;
    })
    .error(function (err) {
        console.log('catch', err.stack);
    });
```

## sync usage

```js
var Potem = require('potem');
var result = 0;

new Potem()
    .then(function () {
        return 1;
    })
    .then(function (n) {
        return n + 1;
    })
    .then(function (n) {
        return n * 2;
    })
    .then(function (n) {
        result = n;
    })
    .fin(function (n) {
        expect(result).toBe(4);
    });
```

## more examples

For more examples check out the spec/ directory
