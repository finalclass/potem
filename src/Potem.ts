class Potem {
  private pauseCounter:number = 0;
  private argsStack:any[][] = [];
  private callStack:Potem.IFunctionDefinition[] = [];
  private stackError:any;

  constructor() {
    this.run = this.run.bind(this);
  }

  public throwArg(index:number, args:any[]):number {
    var arg = args[index];
    if (arg) {
      this.stackError = arg;
    }
    return this.skipArg(index, args);
  }

  public passArg(index:number, args:any[]):number {
    return 0;
  }

  public skipArg(index:number, args:any[]):number {
    args.splice(index, 1);
    return 1;
  }

  private runFunc(fDef:Potem.IFunctionDefinition):void {
    try {
      var lastResult:any;
      if (typeof fDef.func === 'function') {
        lastResult = fDef.func.apply(this, this.argsStack[this.argsStack.length - 1]);
      } else {
        lastResult = this.argsStack.sort((a, b) => (<any>a).pauseIndex - (<any>b).pauseIndex)
        for (var i:number = 0; i < fDef.func.length; i += 1) {
          lastResult = fDef.func[i].apply(this, lastResult);
        }
      }

      if (this.pauseCounter > 0 && lastResult !== undefined) {
        this.argsStack.push(lastResult);
      } else if (lastResult && lastResult.then instanceof Function) {
        this.argsStack = [];
        lastResult.then(this.pause());
      } else {
        this.argsStack = lastResult ? [[lastResult]] : [];
      }
    } catch (e) {
      this.stackError = e;
      this.asyncThrowError();
    }
  }

  private asyncThrowError():void {
    setTimeout(() => {
      if (this.stackError
        && this.callStack.length === 0
        && console
        && console.error instanceof Function) {

        console.error('Error not catched', this.stackError, this.stackError.stack);

      }
    });
  }

  private addFunc(func:Potem.ICallback, type:string = 'then'):void {
    this.callStack.push({type: type, func: func});
  }

  private run():Potem {
    if (this.pauseCounter > 0) { //execution is paused, don't run next function
      return <any>this;
    }

    var fDef:Potem.IFunctionDefinition = this.callStack.shift(); //tak first function
    if (!fDef) { //call stack is empty. Execution is over.
      return <any>this;
    }

    if (fDef.type === 'then' && !this.stackError) {
      this.runFunc(fDef);
    } else if (fDef.type === 'error' && this.stackError) {
      this.argsStack = [[this.stackError]];
      this.stackError = null;
      this.runFunc(fDef);
    } else if (fDef.type === 'fin') {
      if (this.stackError) {
        this.argsStack = [[this.stackError]];
        this.stackError = null;
      }
      this.runFunc(fDef);
    }

    setTimeout(this.run);
    return this;
  }

  /********************************************************
   //   * Public interface
   //   ********************************************************/
  public pause(n:number = 1, ...pauseArgs:any[]):Potem.IResume {
    this.pauseCounter += n;
    var currentPause = this.pauseCounter;
    return (...callbackArgs:any[]) => {
      setTimeout(() => {
        this.pauseCounter -= 1;
        (<any>callbackArgs).pauseIndex = currentPause;
        var shift = 0;
        pauseArgs.forEach((argsConverter:(index:number, shift:number, args:any[])=>number, index:number) => {
          shift += argsConverter.call(this, index - shift, callbackArgs);
        });
        this.argsStack.push(callbackArgs);
        if (this.pauseCounter === 0) {
          this.run();
        }
      });
      return callbackArgs[0];
    }
  }

  public then(func:Potem.ICallback):Potem {
    this.addFunc(func);
    setTimeout(this.run);
    return this;
  }

  public error(func:Potem.ICallback):Potem {
    this.addFunc(func, 'error');
    setTimeout(this.run);
    return this;
  }

  public fin(func:Potem.ICallback):Potem {
    this.addFunc(func, 'fin');
    setTimeout(this.run);
    return this;
  }

}

module Potem {

  export interface ICallback {
    (...args:any[]):any;
  }

  export interface IResume {
    (...args:any[]):void;
  }

  export interface IFunctionDefinition {
    func:any;
    type:string;
  }

}

export = Potem;
