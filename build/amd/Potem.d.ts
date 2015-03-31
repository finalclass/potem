declare class Potem {
    private pauseCounter;
    private argsStack;
    private callStack;
    private stackError;
    constructor();
    static THROW_ARG(): void;
    private runFunc(fDef);
    private asyncThrowError();
    private addFunc(func, type?);
    private run();
    /********************************************************
     //   * Public interface
     //   ********************************************************/
    pause(n?: number): Potem.IResume;
    then(func: Potem.ICallback): Potem;
    error(func: Potem.ICallback): Potem;
    fin(func: Potem.ICallback): Potem;
}
declare module Potem {
    interface ICallback {
        (...args: any[]): any;
    }
    interface IResume {
        (...args: any[]): void;
    }
    interface IFunctionDefinition {
        func: any;
        type: string;
    }
}
export = Potem;
