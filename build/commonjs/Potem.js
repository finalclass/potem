function potem(func) {
    var p = function (func) {
        addFunc(p, func);
        setTimeout(run.bind(null, p));
        return p;
    };
    p.pauseCounter = 0;
    p.argsStack = [];
    p.callStack = [];
    Object.keys(potemPublicPrototype).forEach(function (key) { p[key] = potemPublicPrototype[key]; });
    return func ? p(func) : p;
}
exports.potem = potem;
function runFunc(p, fDef) {
    try {
        var lastResult;
        if (typeof fDef.func === 'function') {
            lastResult = fDef.func.apply(p, p.argsStack[p.argsStack.length - 1]);
        }
        else {
            lastResult = p.argsStack.sort(function (a, b) { return a.pauseIndex - b.pauseIndex; });
            for (var i = 0; i < fDef.func.length; i += 1) {
                lastResult = fDef.func[i].apply(p, lastResult);
            }
        }
        if (p.pauseCounter > 0 && lastResult !== undefined) {
            p.argsStack.push(lastResult);
        }
        else if (lastResult && lastResult.then instanceof Function) {
            p.argsStack = [];
            lastResult.then(p.pause());
        }
        else {
            p.argsStack = lastResult ? [[lastResult]] : [];
        }
    }
    catch (e) {
        p.stackError = e;
        asyncThrowError(p);
    }
}
function asyncThrowError(p) {
    setTimeout(function () {
        if (p.stackError &&
            p.callStack.length === 0 &&
            console &&
            console.error instanceof Function) {
            console.error('Error not catched', p.stackError, p.stackError.stack);
        }
    });
}
function addFunc(p, func, type) {
    if (type === void 0) { type = 'then'; }
    p.callStack.push({ type: type, func: func });
}
function run(p) {
    if (p.pauseCounter > 0) {
        return p;
    }
    var fDef = p.callStack.shift(); //tak first function
    if (!fDef) {
        return p;
    }
    if (fDef.type === 'then' && !p.stackError) {
        runFunc(p, fDef);
    }
    else if (fDef.type === 'error' && p.stackError) {
        p.argsStack = [[p.stackError]];
        p.stackError = null;
        runFunc(p, fDef);
    }
    else if (fDef.type === 'fin') {
        if (p.stackError) {
            p.argsStack = [[p.stackError]];
            p.stackError = null;
        }
        runFunc(p, fDef);
    }
    setTimeout(run.bind(null, p));
    return p;
}
var potemPublicPrototype;
(function (potemPublicPrototype) {
    function throwArg(index, args) {
        var arg = args[index];
        if (arg) {
            this.stackError = arg;
        }
        return this.skipArg(index, args);
    }
    potemPublicPrototype.throwArg = throwArg;
    function passArg(index, args) {
        return 0;
    }
    potemPublicPrototype.passArg = passArg;
    function skipArg(index, args) {
        args.splice(index, 1);
        return 1;
    }
    potemPublicPrototype.skipArg = skipArg;
    function pause(n) {
        var _this = this;
        if (n === void 0) { n = 1; }
        var pauseArgs = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            pauseArgs[_i - 1] = arguments[_i];
        }
        this.pauseCounter += n;
        var currentPause = this.pauseCounter;
        return function () {
            var callbackArgs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                callbackArgs[_i - 0] = arguments[_i];
            }
            setTimeout(function () {
                _this.pauseCounter -= 1;
                callbackArgs.pauseIndex = currentPause;
                var shift = 0;
                pauseArgs.forEach(function (argsConverter, index) {
                    shift += argsConverter.call(_this, index - shift, callbackArgs);
                });
                _this.argsStack.push(callbackArgs);
                if (_this.pauseCounter === 0) {
                    run(_this);
                }
            });
            return callbackArgs[0];
        };
    }
    potemPublicPrototype.pause = pause;
    function stdPause(n) {
        if (n === void 0) { n = 1; }
        return this.pause(n, this.throwArg);
    }
    potemPublicPrototype.stdPause = stdPause;
    function then(func) {
        addFunc(this, func);
        setTimeout(run.bind(null, this));
        return this;
    }
    potemPublicPrototype.then = then;
    function error(func) {
        addFunc(this, func, 'error');
        setTimeout(run.bind(null, this));
        return this;
    }
    potemPublicPrototype.error = error;
    function fin(func) {
        addFunc(this, func, 'fin');
        setTimeout(run.bind(null, this));
        return this;
    }
    potemPublicPrototype.fin = fin;
})(potemPublicPrototype = exports.potemPublicPrototype || (exports.potemPublicPrototype = {}));
