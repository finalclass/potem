potem
=========

## Modern, very fast, lightweight, async, promise-like class

Learn from the examples:) You can find many of them in the `spec/` directory.

## Version 3

Version 3 is not compatible with version 1.x nor with 2.x.
Potem class has been converted to "potem" function.
Now you are able to `then` functions without "then" keyword because `potem` function
returns itself.

## install

```bash
npm install potem
```

## sync usage

```js
var potem = require('potem').potem;
var result = 0;

potem(function () {
    return 1;
})
(function (n) {
    return n + 1;
})
(function (n) {
    return n * 2;
})
(function (n) {
    result = n;
})
.fin(function (n) {
    expect(result).toBe(4);
});
```

## Basic async example

```js
var potem = require('potem').potem
var fs = require('fs');

var p = potem()
    .then(function () {
        //p.pause() method returns a "resume" callback and pauses current execution.
        fs.readdir('./spec', p.pause());
    })
    .then(function (err, files) {
        if (err) { throw err; }
        //we've got files array
    })
    .error(function(err) {
      //do something with the (thrown) error
    });
```

## Basic async example using argument converters

```js
var potem = require('potem').potem;
var fs = require('fs');

var p = potem()
    .then(function () {
        //p.pause() method returns a "resume" callback and pauses current execution.
        fs.readdir('./spec', p.pause(1, throwArg));
    })
    .then(function (err, files) {
        //we've got files array
    })
    .error(function(err) {
      //do something with the (thrown) error
    });
```

## async usage (read directory content)

```js
var potem = require('potem').potem;
var fs = require('fs');

var p = potem
    .then(function () {
        //p.pause() method returns a "resume" callback and pauses current execution.
        fs.readdir('./spec', p.pause());
    })
    .then(function (err, files) {
        if (err) { throw err; }
        var next = p.pause(files.length, p.throwArg);

        files.forEach(function (file) {
            console.log('file', file);
            fs.readFile('./spec/' + file, next);
        });
    })
    .then([function () {
        return Array.prototype.join.call(arguments, '');
    }])
    .then(function (result) {
        dirContent = result;
    })
    .error(function (err) {
        console.log('catch', err.stack);
    });
```

## more examples

For more examples check out the spec/ directory

## API

### .then(callback:(...args))

add `callback` function to the call stack. Take last returned argument as an input. Or if the execution was paused take last `resume()` (resume is returned from .pause()) function arguments as its own arguments.

### .then([...callbacks:(..arrOfArgs)[]])

In this case (if array of callbacks are arguments) every callback will be called with all the arguments that ware passed to `resume()` function (or last return statement)

for example:

```js
var potem = require('potem').potem;
var fs = require('fs');

var p = potem
  .then(function () {
    fs.exists('file.txt', p.pause());
    fs.readFile('file2.txt', p.pause(1, p.throwArg));
  })
  .then([function (existsArgs, readFileArgs) {
    //existsArgs[0] => boolean (true if file.txt exists)
    //readFileArgs[0] => Buffer (the content of a file)
  }])
  .error(function (err) {
    //err => Error (if readFile has an error as a first argument
  });
```

### .error(errCallback:(err))

Set the error handler. If any of "then" functions thew an error then this function will be called.
If an error will be called in this function then it can be cought in the next `.error()` of `.fin()` function.

### .fin(callback:(...args))

It's like `.then()` but will be called even if an error was thrown.

### .pause(pauseCounter:number, ...argumentConverters)

Returns the `resume()` function and pauses the execution. If you specify the `pauseCounter` parameter then the execution will be paused for `pauseCounter` number of times (`resume()` function would have to be called `pauseCounter` times for the next `.then()` to be called).

You can specify any number of argument converters. Argument converters do something with the arguments and after the conversion they pass the result to the next `.then()` function.

### .stdPause(pauseCounter:number)

Shorthand for `.pause(pauseCounter, p.throwArg);` for callbacks with standard (usually node) call signature.

### .passArg argument converter

This argument converter does nothing. It's usefull if you want to do something with arguments that are passed on the later positions.

```js
var potem = require('potem').potem;

var func = function (callback) {
  callback(1, 2, 3);
}

var p = potem
  .then(function () {
    func(p.pause(1, p.passArg, p.skipArg);
  })
  .then(function (arg1, arg2) {
    //arg1 => 1
    //arg2 => 3 (because value "2" is skipped)
  });
```

### .skipArg argument converter

Removes the argument on the current position from the argument set

```js
var potem = require('potem').potem;

var func = function (callback) {
  callback(1, 2, 3);
}

var p = potem()
  .then(function () {
    func(p.pause(1, p.skipArg);
  })
  .then(function (arg1, arg2) {
    //arg1 => 2 (because value "1" is skipped)
    //arg2 => 3
  });
```

### .throwArg argument converter

Throws an error if a argument if truthy.

```js

var potem = require('potem').potem;

var func = function (callback) {
  callback(new Error('an error'), 'success');
}

var p = potem()
  .then(function () {
    func(p.pause(1, p.throwArg);
  })
  .then(function (message) {
    //this function is never called
  })
  .error(function (err) {
    //err is thrown. err.message === 'an error'
  });
```

This argument converter is especially useful when working with nodejs.

```js
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
```

In nodejs it is very common that we have this callback signature:

```ts
interface INodejsCallback {
    (err:Error, arg:any):void;
}
```

So we usually would use `pause` like this: `p.pause(1, p.throwArg)`.
For this reason there is a helper method added: `p.stdPause()` that
is equivalent with `p.pause(1, p.throwArg)`.

## Plans for a next version???

```js
var files = [];
var seq = potem();
seq(() => fs.readdir('./', seq.pause(1, throwArg));
seq.each((dirItem, index) => {
    var i = potem();
    i(() => fs.stat('./' + dirItem, i.pause(1, i.throwArg)));
    i.if((stat) => stat.isFile, (stat) => fs.readFile(stat.path, i.pause(1, i.throwArg)));
    i((fileContent) => {
        files.push(fileContent);
    });
    i.finally(seq.pause(1, seq.throwArg));
});
```
