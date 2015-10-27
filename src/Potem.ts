
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

export interface IPotem {
    pauseCounter:number;
    argsStack:any[][];
    callStack:IFunctionDefinition[];
    stackError:any;
    (func: ICallback): IPotem;
    throwArg(index: number, args: any[]): number;
    passArg(index: number, args: any[]): number;
    skipArg(index: number, args: any[]): number;
    pause(n?: number, ...pauseArgs: any[]): IResume;
    stdPause(n?:numer): IResume;
    then(func: ICallback): IPotem;
    error(func: ICallback): IPotem;
    fin(func: ICallback): IPotem;
}

export function potem(func?:ICallback):IPotem {
    let p:IPotem = <IPotem>function (func:ICallback):IPotem {
        addFunc(p, func);
        setTimeout(run.bind(null, p));
        return p;
    }

    p.pauseCounter = 0;
    p.argsStack = [];
    p.callStack = [];

    Object.keys(potemPublicPrototype).forEach((key) => {p[key] = potemPublicPrototype[key]});

    return func ? p(func) : p;
}

function runFunc(p:IPotem, fDef:IFunctionDefinition):void {
  try {
    let lastResult:any;
    if (typeof fDef.func === 'function') {
      lastResult = fDef.func.apply(p, p.argsStack[p.argsStack.length - 1]);
    } else {
      lastResult = p.argsStack.sort((a, b) => (<any>a).pauseIndex - (<any>b).pauseIndex)
      for (let i:number = 0; i < fDef.func.length; i += 1) {
        lastResult = fDef.func[i].apply(p, lastResult);
      }
    }

    if (p.pauseCounter > 0 && lastResult !== undefined) {
      p.argsStack.push(lastResult);
    } else if (lastResult && lastResult.then instanceof Function) {
      p.argsStack = [];
      lastResult.then(p.pause());
    } else {
      p.argsStack = lastResult ? [[lastResult]] : [];
    }
  } catch (e) {
    p.stackError = e;
    asyncThrowError(p);
  }
}

function asyncThrowError(p:IPotem):void {
  setTimeout(() => {
    if (p.stackError &&
        p.callStack.length === 0 &&
        console &&
        console.error instanceof Function) {

      console.error('Error not catched', p.stackError, p.stackError.stack);

    }
  });
}

function addFunc(p:IPotem, func:ICallback, type:string = 'then'):void {
  p.callStack.push({type: type, func: func});
}

function run(p:IPotem):IPotem {
  if (p.pauseCounter > 0) { //execution is paused, don't run next function
    return p;
  }

  let fDef:IFunctionDefinition = p.callStack.shift(); //tak first function
  if (!fDef) { //call stack is empty. Execution is over.
    return <any>p;
  }

  if (fDef.type === 'then' && !p.stackError) {
    runFunc(p, fDef);
} else if (fDef.type === 'error' && p.stackError) {
    p.argsStack = [[p.stackError]];
    p.stackError = null;
    runFunc(p, fDef);
  } else if (fDef.type === 'fin') {
    if (p.stackError) {
      p.argsStack = [[p.stackError]];
      p.stackError = null;
    }
    runFunc(p, fDef);
  }

  setTimeout(run.bind(null, p));
  return p;
}

export module potemPublicPrototype {
    export function throwArg(index:number, args:any[]):number {
      let arg = args[index];
      if (arg) {
        this.stackError = arg;
      }
      return this.skipArg(index, args);
    }
    export function passArg(index:number, args:any[]):number {
      return 0;
    }

    export function skipArg(index:number, args:any[]):number {
      args.splice(index, 1);
      return 1;
    }

    export function pause(n:number = 1, ...pauseArgs:any[]):IResume {
      this.pauseCounter += n;
      let currentPause = this.pauseCounter;
      return (...callbackArgs:any[]) => {
        setTimeout(() => {
          this.pauseCounter -= 1;
          (<any>callbackArgs).pauseIndex = currentPause;
          let shift = 0;
          pauseArgs.forEach((argsConverter:(index:number, shift:number, args:any[])=>number, index:number) => {
            shift += argsConverter.call(this, index - shift, callbackArgs);
          });
          this.argsStack.push(callbackArgs);
          if (this.pauseCounter === 0) {
            run(this);
          }
        });
        return callbackArgs[0];
      }
    }

    export function stdPause(n?:number = 1):IResume {
        return this.pause(n, this.throwArg);
    }

    export function then(func:ICallback):IPotem {
      addFunc(this, func);
      setTimeout(run.bind(null, this));
      return this;
    }

    export function error(func:ICallback):IPotem {
      addFunc(this, func, 'error');
      setTimeout(run.bind(null, this));
      return this;
    }

    export function fin(func:ICallback):IPotem {
      addFunc(this, func, 'fin');
      setTimeout(run.bind(null, this));
      return this;
    }
}
