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
export const isArrayEx = function (v: any, length: number): v is Array<any> { return Array.isArray(v) && v.length >= length; }
export const isFunc = function (v: any): v is Function { return typeof v === 'function'; }
export const isString = function (v: any): v is string { return typeof v === 'string'; }
export const isStringL = function (v: any): v is string { return typeof v === 'string' && v.length > 0; }
export const isNumber = function (v: any): v is number { return typeof v === 'number'; }
export const isBoolean = function (v: any): v is boolean { return typeof v === 'boolean'; }
export const isNone = function (v: any): boolean { return v == null || isNaN(v); }
export const assign = Object.assign;
export const floor = Math.floor;
export const ceil = Math.ceil;
export const round = Math.round;
export const cos = Math.cos;
export const sin = Math.sin;
export const pow10 = function (v: number): number { return Math.pow(10, v); };
export const log10 = Math.log10;
export const minv = Math.min;
export const maxv = Math.max;
export const absv = Math.abs;
export const distance = function (x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}
export const pickNum = function(v1: any, v2: any): number {
    v1 = parseFloat(v1);
    return !isNaN(v1) ? v1 : parseFloat(v2);
}
export const pickNum3 = function(v1: any, v2: any, v3: any): number {
    let v = parseFloat(v1);
    if (!isNaN(v)) return v;
    v = parseFloat(v2);
    return !isNaN(v) ? v : parseFloat(v3);
}
export const pickProp = function(v1: any, v2: any): any {
    return v1 !== void 0 ? v1 : v2;
}
export const pickProp3 = function(v1: any, v2: any, v3: any): any {
    return v1 !== void 0 ? v1 : v2 !== void 0 ? v2 : v3;
}
export const pickProp4 = function(v1: any, v2: any, v3: any, v4: any): any {
    return v1 !== void 0 ? v1 : v2 !== void 0 ? v2 : v3 != void 0 ? v3 : v4;
}
export const copyObj = (obj: any): any => {
    return obj && assign({}, obj);
}
export const mergeObj = (v1: any, v2: any): any => {
    const obj = assign({}, v1);

    for (const p in v2) {
        const v = v2[p];
        if (isObject(v) && isObject(v1[p])) {
            obj[p] = mergeObj(v1[p], v);
        } else {
            obj[p] = v;
        }
    }
    return obj;
}
export const incv = (prev: number, next: number, rate: number): number => {
    return prev + (next - prev) * rate;
}
export const enumValues = (type: any): any[] => {
    return Object.keys(type).map(key => type[key]);
}
export const checkEnum = (type: any, value: any, def: any): any => {
    const keys = Object.keys(type);

    for (let i = keys.length - 1; i >= 0; i--) {
        if (type[keys[i]] === value) return value;
    }
    return def;
}
export class RcDebug {
    static _debugging = false;
    static debug(): void { if (this._debugging) { debugger; } }
}

