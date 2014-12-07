define(["require", "exports"], function (require, exports) {
    var Potem = (function () {
        function Potem() {
            this.pauseCounter = 0;
            this.argsStack = [];
            this.callStack = [];
            this.run = this.run.bind(this);
        }
        Potem.throwFirstArgument = function () {
            if (arguments[0]) {
                throw arguments[0];
            }
            return arguments[1];
        };
        Potem.throwFirstArgumentInArray = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            return args.map(function (args) {
                if (args[0]) {
                    throw args[0];
                }
                return args.slice(1);
            });
        };
        Potem.prototype.runFunc = function (fDef) {
            try {
                var lastResult;
                if (typeof fDef.func === 'function') {
                    lastResult = fDef.func.apply(this, this.argsStack[this.argsStack.length - 1]);
                }
                else {
                    lastResult = this.argsStack;
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
            this.pauseCounter += n;
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                setTimeout(function () {
                    _this.pauseCounter -= 1;
                    _this.argsStack.push(args);
                    if (_this.pauseCounter === 0) {
                        _this.run();
                    }
                });
                return args[0];
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