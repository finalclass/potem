export declare class Potem {
    private pauseCounter;
    private argsStack;
    private callStack;
    private stackError;
    constructor();
    static New(): (next: any) => any;
    throwArg(index: number, args: any[]): number;
    passArg(index: number, args: any[]): number;
    stdPause(): IResume;
    skipArg(index: number, args: any[]): number;
    private runFunc(fDef);
    private asyncThrowError();
    private addFunc(func, type?);
    private run();
    /********************************************************
     //   * Public interface
     //   ********************************************************/
    pause(n?: number, ...pauseArgs: any[]): IResume;
    then(func: ICallback): Potem;
    error(func: ICallback): Potem;
    fin(func: ICallback): Potem;
}
export interface ICallback {
    (...args: any[]): any;
}
export interface IResume {
    (...args: any[]): void;
}
export interface IFunctionDefinition {
    func: any;
    type: string;
}
