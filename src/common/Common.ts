////////////////////////////////////////////////////////////////////////////////
// Common.ts
// 2021. 11. 26. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

export const SVGNS = 'http://www.w3.org/2000/svg';
export const isObject = function (v: any): boolean { return v && typeof v === 'object' && !Array.isArray(v); }
export const isArray = Array.isArray;
export const isFunc = function (v: any): v is Function { return typeof v === 'function'; }
export const isString = function (v: any): v is string { return typeof v === 'string'; }
export const isNone = function (v: any): boolean { return v == null || isNaN(v); }
export const pickNum = function(v1: any, v2: any): number {
    v1 = parseFloat(v1);
    return !isNaN(v1) ? v1 : parseFloat(v2);
}
export const pickProp = function(v1: any, v2: any): any {
    return v1 !== void 0 ? v1 : v2;
}

export class RtLog {

    //-------------------------------------------------------------------------
    // static members
    //-------------------------------------------------------------------------
    private static _logging = false;
    static setLogging(enabled = true) {
        this._logging = enabled;
    }
    static log(...messages: any[]): void {
        this._logging && console.log.apply(console, messages);
    }
}

export class RtDebug {
    //-------------------------------------------------------------------------
    // static members
    //-------------------------------------------------------------------------
    private static _debugging = false;
    static setDebugging(enabled = true) {
        this._debugging = enabled;
    }
    static debugging(): void {
        if (this._debugging) {
            debugger;
        }
    }
}
export const NOT_IMPLEMENT = new Error("Not Implemented.");
