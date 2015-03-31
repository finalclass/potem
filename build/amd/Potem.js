define(["require", "exports"], function (require, exports) {
    var Potem = (function () {
        function Potem() {
            this.pauseCounter = 0;
            this.argsStack = [];
            this.callStack = [];
            this.run = this.run.bind(this);
        }
        Potem.prototype.throwArg = function (index, args) {
            var arg = args[index];
            if (arg) {
                this.stackError = arg;
            }
            return this.skipArg(index, args);
        };
        Potem.prototype.passArg = function (index, args) {
            return 0;
        };
        Potem.prototype.skipArg = function (index, args) {
            args.splice(index, 1);
            return 1;
        };
        Potem.prototype.runFunc = function (fDef) {
            try {
                var lastResult;
                if (typeof fDef.func === 'function') {
                    lastResult = fDef.func.apply(this, this.argsStack[this.argsStack.length - 1]);
                }
                else {
                    lastResult = this.argsStack.sort(function (a, b) { return a.pauseIndex - b.pauseIndex; });
                    for (var i = 0; i < fDef.func.length; i += 1) {
                        lastResult = fDef.func[i].apply(this, lastResult);
                    }
                }
                if (this.pauseCounter > 0 && lastResult !== undefined) {
                    this.argsStack.push(lastResult);
                }
                else if (lastResult && lastResult.then instanceof Function) {
                    this.argsStack = [];
                    lastResult.then(this.pause());
                }
                else {
                    this.argsStack = lastResult ? [[lastResult]] : [];
                }
            }
            catch (e) {
                this.stackError = e;
                this.asyncThrowError();
            }
        };
        Potem.prototype.asyncThrowError = function () {
            var _this = this;
            setTimeout(function () {
                if (_this.stackError && _this.callStack.length === 0 && console && console.error instanceof Function) {
                    console.error('Error not catched', _this.stackError, _this.stackError.stack);
                }
            });
        };
        Potem.prototype.addFunc = function (func, type) {
            if (type === void 0) { type = 'then'; }
            this.callStack.push({ type: type, func: func });
        };
        Potem.prototype.run = function () {
            if (this.pauseCounter > 0) {
                return this;
            }
            var fDef = this.callStack.shift(); //tak first function
            if (!fDef) {
                return this;
            }
            if (fDef.type === 'then' && !this.stackError) {
                this.runFunc(fDef);
            }
            else if (fDef.type === 'error' && this.stackError) {
                this.argsStack = [[this.stackError]];
                this.stackError = null;
                this.runFunc(fDef);
            }
            else if (fDef.type === 'fin') {
                if (this.stackError) {
                    this.argsStack = [[this.stackError]];
                    this.stackError = null;
                }
                this.runFunc(fDef);
            }
            setTimeout(this.run);
            return this;
        };
        /********************************************************
         //   * Public interface
         //   ********************************************************/
        Potem.prototype.pause = function (n) {
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
                        _this.run();
                    }
                });
                return callbackArgs[0];
            };
        };
        Potem.prototype.then = function (func) {
            this.addFunc(func);
            setTimeout(this.run);
            return this;
        };
        Potem.prototype.error = function (func) {
            this.addFunc(func, 'error');
            setTimeout(this.run);
            return this;
        };
        Potem.prototype.fin = function (func) {
            this.addFunc(func, 'fin');
            setTimeout(this.run);
            return this;
        };
        return Potem;
    })();
    return Potem;
});
//# sourceMappingURL=Potem.js.map