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
export interface IPotem {
    pauseCounter: number;
    argsStack: any[][];
    callStack: IFunctionDefinition[];
    stackError: any;
    (func: ICallback): IPotem;
    throwArg(index: number, args: any[]): number;
    passArg(index: number, args: any[]): number;
    skipArg(index: number, args: any[]): number;
    pause(n?: number, ...pauseArgs: any[]): IResume;
    stdPause(n?: number): IResume;
    then(func: ICallback): IPotem;
    error(func: ICallback): IPotem;
    fin(func: ICallback): IPotem;
}
export declare function potem(func?: ICallback): IPotem;
export declare module potemPublicPrototype {
    function throwArg(index: number, args: any[]): number;
    function passArg(index: number, args: any[]): number;
    function skipArg(index: number, args: any[]): number;
    function pause(n?: number, ...pauseArgs: any[]): IResume;
    function stdPause(n?: number): IResume;
    function then(func: ICallback): IPotem;
    function error(func: ICallback): IPotem;
    function fin(func: ICallback): IPotem;
}
