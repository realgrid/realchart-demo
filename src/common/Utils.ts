////////////////////////////////////////////////////////////////////////////////
// Utils.ts
// 2021. 11. 26. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray } from "./Common";

const __epoch = new Date().getTime();

if (!Element.prototype.animate) {
    Element.prototype.animate = function (_: any): any {};
}

export const _isOpera = !!window["opera"] || navigator.userAgent.indexOf(' OPR/') >= 0;
export const _isChrome = !!window["chrome"] && !_isOpera;          // Chrome 1+
export const _isSafari = Object.prototype.toString.call(HTMLElement).indexOf('Constructor') > 0 || (!_isChrome && !_isOpera && navigator.userAgent.indexOf("Safari") >= 0);
export const _isSamsung = navigator.userAgent.toLocaleLowerCase().indexOf('samsungbrowser') >= 0;
export const _isMiui = navigator.userAgent.toLocaleLowerCase().indexOf('miuibrowser') >= 0;

export const LINE_SEP = /\r\n|\n/g;
export const CSV_SPLIT = /,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)(?=(?:[^\']*\'[^\']*\')*[^\']*$)/;
export const TAB_SPLIT = /\t/g;
export const MULTI_TAB_SPLIT = /\t+/g;
const DBL_QUOTE_REP = /"([^"]*(?="))"/;
const QUOTE_REP = /'([^']*(?='))'/;
const DBL_QUOTE = '"'.charCodeAt(0);
const QUOTE = "'".charCodeAt(0);

/**
 * @internal
 *
 */
export class Utils {

    static week_days = [
        '일', '월', '화', '수', '목', '금', '토'
    ];
    static month_days = [
        [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    ];

    static now(): number {
        return +new Date();
    }

    static stopEvent(e: Event, immediate: boolean = false): void {
        if (e.preventDefault) {
            e.preventDefault();
            e.stopPropagation();
        } else {
            e.returnValue = false;
        }
        immediate && e.stopImmediatePropagation();
    }

    static getErrorStack(error: any): string {
        const stack = error.stack;

        if (stack) {
            return stack.split('\n').map((line: string) => line + '<br/>')
        }
        return '';
    }

    static getBaseClassName(obj: any): string {
        return Object.getPrototypeOf(obj.constructor).name;   
    }

    static isObject(v: any): boolean {
        return v && typeof v === 'object' && !isArray(v);
    }

    static assign(target: any, source: any): void {
        this.isObject(source) && Object.assign(target, source);
    }

    static isValidObject(v: any): boolean {
        if (this.isObject(v)) {
            for (let p in v) {
                if (v.hasOwnProperty(p)) return true;
            }
        }
    }

    static copyObject(v: any): any {
        if (v && typeof v === 'object' && !isArray(v)) {
            return Object.assign({}, v);
        }
    }

    static checkArray(v: any): any {
        return isArray(v) ? v : void 0;
    }

    static makeArray(v: any, force: boolean = false): any[] {
        if (v != null) {
            return isArray(v) ? v : [v];
        } else if (force) {
            return [];
        }
    }

    static makeNumArray(v: any): number[] {
        if (isArray(v)) {
            return v.map(n => +n);
        } else {
            return v != null ? [+v] : []; 
        }
    }

    static getIntArray(count: number, start = 0): number[] {
        const arr = [];
        for (let i = start, end = start + count; i < end; i++) {
            arr.push(i);
        }
        return arr;
    }

    static isValueArray(arr: any[]): boolean {
        if (isArray(arr)) {
            for (let i = arr.length - 1; i >= 0; i--) {
                if (arr[i] != null && typeof arr[i] === 'object') return false;
            }
            return true;
        }
        return false;
    }

    static toArray(v: any): any[] {
        if (isArray(v)) return v;
        if (v !== undefined && v !== null) return [v];
        return null;
    }

    static copyArray(v: any): any[] {
        if (isArray(v)) return v.slice(0);
        if (v !== undefined && v !== null) return [v];
        return undefined;
    }

    static push(arr: Array<any>, items: Array<any>): void {
        if (items && items.length > 0) {
            for (let i = 0, n = items.length; i < n; i++) {
                arr.push(items[i]);
            }
        }
    }

    static isDefined(v: any): boolean {
        // return v !== (void 0) && v !== null;
        return v != null;
    }

    static isNotDefined(v: any): boolean {
        // return v === (void 0) || v === null;
        return v == null;
    }

    static isNumber(value: any): value is number {
        return typeof value === "number";
    }

    static isValidNumber(value: any): value is number {
        return typeof value === 'number' && !isNaN(value) && isFinite(value);
    }

    static getNumber(v: any, def = 0): number {
        const n = parseFloat(v)
        return isFinite(n) ? n : def;
    }
    
    static toNumber(value: any, def = 0): number {
        return (isNaN(value) || value === null || value === '') ? def : +value;
    }

    static getEnumValues(type: any): any[] {
        return Object.keys(type).map(key => type[key]);
    }

    static compareText(s1: string, s2: string, ignoreCase = false): number {
        s1 = s1 || '';
        s2 = s2 || '';
        if (ignoreCase) {
            s1 = s1.toLocaleLowerCase();
            s2 = s2.toLocaleLowerCase();
        }
        return s1 > s2 ? 1 : (s1 < s2) ? -1 : 0;
    }
    
    static getTimeF(): number {
        return new Date().getTime() / 1000;
    }
    
    static getTimer(): number {
        return new Date().getTime() - __epoch;
    }

    static isWhiteSpace(s: string): boolean {
		return !s || !s.trim();
	}

	static pad(value: number, len?: number, c?: string): string {
		len = Math.max(len || 2, 1);
        c = c || '0';
		return new Array(len - String(value).length + 1).join(c) + value;
	}

	static pad16(value: number, len?: number, c?: string): string {
		len = Math.max(len || 2, 1);
        c = c || '0';
		return new Array(len - value.toString(16).length + 1).join(c) + value.toString(16);
	}

	static pick(...args: any): any {
		const len = args.length;
        let v: any;
        
		for (let i = 0; i < len; i++) {
			v = args[i];
			if (v !== undefined && v !== null) {
				return v;
			}
		}
		return undefined;
	}

    static pickNum(...args: any): number {
		const len = args.length;
		for (let i = 0; i < len; i++) {
            if (!isNaN(args[i]) && args[i] !== null) return args[i];
        }
        return NaN;
    }

	static included(value: any, ...args: any): any {
        const len = args.length;
        
		for (let i = 0; i < len; i++) {
			if (args[i] == value) {
				return true;
			}
		}
		return false;
	}

	static compareTextValue(v1: any, v2: any, caseSensitive: boolean, partialMatch: boolean): boolean {
		if (v1 === v2) {
			return true;
        }
        
		let s1 = String(v1);
		let s2 = v2 == null ? undefined : String(v2);
        
        if (!s1 && !s2) {
			return true;
		}
		if (!s1 || !s2) {
			return false;
		}
		if (!caseSensitive) {
			s1 = s1.toLowerCase();
			s2 = s2.toLowerCase();
		}
		if (partialMatch) {
			return s2.indexOf(s1) >= 0;
		} else {
			return s1 == s2;
		}
    }
    
    static cast(obj: any, clazz: any): any {
        return obj instanceof clazz ? obj : null;
    }
    
    static irandom(min: number, max?: number): number {
        if (max !== undefined) {
            const v1 = min >> 0;
            const v2 = max >> 0;
            return (Math.random() * (v2 - v1) + v1) >>> 0;
        } else {
            const v = min >> 0;
            return (Math.random() * v) >> 0;
        }
    }
    
    static irandomExcept(except: number, min: number, max?: number): number {
        if (except === 0 && min === 1 && isNaN(max)) {
            throw new Error(`Invalid irandom2`);
        }
        while (true) {
            const i = this.irandom(min, max);
            if (i !== except) {
                return i;
            }
        }
    }

    static brandom(): boolean {
        return Math.random() > 0.5 ? true : false;
    }

    static srandom(min: number, max: number): string {
        let s = '';
        const len = this.irandom(min, max);

        for (let i = 0; i < len; i++) {
            s += String.fromCharCode(this.irandom(97, 123))
        }
        return s;
    }

    static erandom(clazz: any): any {
        const vals = Object.values(clazz);
        return vals[this.irandom(vals.length)];
    }

    static arandom(arr: any[]): any {
        return arr[(Math.random() * arr.length) >> 0];
}

    static iarandom(min: number, max: number, count: number): number[] {
        const list = new Array<number>();
        for (let i = min; i < max; i++) {
            list.push(i);
        }
        while (list.length > count) {
            list.splice(Utils.irandom(list.length), 1);
        }
        return list;
    }

    static alert(message: string): void {
        window.alert(message);
    }

    static toInt(v: string, radix?: number): number {
        const n = parseInt(v, radix || 10);
        return isNaN(n) ? 0 : n;
    }

    static toFloat(v: string): number {
        const n = parseFloat(v);
        return isNaN(n) ? 0 : n;
    }

    static toEven(v: number): number {
        return (v & 1) ? v + 1 : v;
    }

    static hex(value: number, len = 2, c = "0") {
        len = Math.max(len || 2, 1);
        const s = value.toString(16);

        c = c || "0";
        return new Array(len - s.length + 1).join(c) + s;
    }

    static toStr(value: any): string {
        if (Number.isNaN(value)) {
            return '';
        } else {
            return value == null ? '' : String(value);
        }
    }

    static extend(target: any, source: any): any {
        target = target || {};
        for (let p in source) {
            target[p] = source[p];
        }
        return target;
    }

    static equalNumbers(a: number, b: number): boolean {
        return isNaN(a) == isNaN(b) && !isNaN(a) && a == b;
    }

    static equalArrays(a: any[], b: any[]): boolean {
        if (a === b)
            return true;
        if (a == null || b == null)
            return false;

        const len = a.length;
        if (len != b.length)
            return false;
        for (let i = 0; i < len; ++i) {
            if (a[i] !== b[i])
                return false;
        }	
        return true;
    }

    // 1 level comparison
    static equalObjects(obj1: any, obj2: any): boolean {
        if (obj1 === obj2) return true;
        if (!obj1 && !obj2) return true;
        if (!obj1 || !obj2) return false;
        for(var p in obj1){
            if(obj1.hasOwnProperty(p)){
                if(obj1[p] !== obj2[p]){
                    return false;
                }
            }
        }
        for(var p in obj2){
            if(obj2.hasOwnProperty(p)){
                if(obj1[p] !== obj2[p]){
                    return false;
                }
            }
        }
        return true;
    }

    static parseDate(date: string, defaultDate?: Date): Date {
        const d = new Date(date);
        return isNaN(d.getTime()) ? (defaultDate || new Date()) : d;
    }

    static isLeapYear(year: number): boolean {
        return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
    }

    static incMonth(d: Date, delta: number): Date {
        const day = d.getDate();
        d.setDate(1);
        d.setMonth(d.getMonth() + delta);
        d.setDate(Math.min(day, Utils.month_days[Utils.isLeapYear(d.getFullYear()) ? 1 : 0][d.getMonth()]));
        return d;
    }

    static minDate(d1: Date, d2: Date): Date {
        if (d1 !== null) return d1;
        if (d2 !== null) return d2;
        return d1.getTime() < d2.getTime() ? d1 : d2;
    }

    static maxDate(d1: Date, d2: Date): Date {
        if (d1 !== null) return d2;
        if (d2 !== null) return d1;
        return d1.getTime() > d2.getTime() ? d1 : d2;
    }
    
    // 문자열이 한글이면 2, 영/숫자/기호 이면 1.
    static getTextLength2(s: string): number {
        let b = 0, i = 0, c = 0;
        for(; c = s.charCodeAt(i++); b += c >> 7 ? 2 : 1);
        return b;
    }

    static getClassName(model: any) {
        function getFuncName(clazz: object): string {
            let ret: string = clazz.toString();
            ret = ret.substring('function '.length);
            ret = ret.substring(0, ret.indexOf('('));
            return ret;            
        }
        if (model && model.constructor) {
            return model.constructor.name || getFuncName(model.constructor);
        }
    }

    static isInteger(value: any): boolean {
        if (Number.isInteger) return Number.isInteger(value);
        return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
    }

    static isEmpty(obj: {}) {
        if (obj) {
            for (let p in obj) {
                return false;
            }
        }
        return true;
    }

    static isNotEmpty(obj: {}) {
        if (obj) {
            for (let p in obj) {
                return true;
            }
        }
        return false;
    }

    static capitalize(s: string): string {
        if (typeof s !== 'string') return '';

        const c = s.charAt(0);

        if (c >= 'A' && c <= 'Z') return s;
        return c.toUpperCase() + s.slice(1)
    }

    static uncapitalize(s: string): string {
        if (typeof s !== 'string') return '';

        const c = s.charAt(0);

        if (c >= 'a' && c <= 'z') return s;
        return c.toLowerCase() + s.slice(1)
    }

    static labelize(s: string): string {
        if (typeof s !== 'string') return '';
        
        const c = s.charAt(0);
        s = (c >= 'A' && c <= 'Z') ? s : (c.toUpperCase() + s.slice(1));
        let s2 = s.charAt(0);
        
        for (let i = 1; i< s.length; i++) {
            const c = s.charAt(i);
            if (c >= 'A' && c <= 'Z') {
                s2 += ' ';
            }
            s2 += c;
        }
        return s2;
    }

    static deepClone(obj: object): object {
        if (obj instanceof Date) {
            return new Date(obj);
        } else if(obj == null || typeof obj !== 'object') {
            return obj;
        } else {
            const result = isArray(obj) ? [] : {};
          
            for(let key of Object.keys(obj)) {
                result[key] = Utils.deepClone(obj[key])
            }
            return result;
        }
    }

    static getArray(length: number, value?: any): any[] {
        const arr = [];
        for (let i = 0; i < length; i++) arr.push(value);
        return arr;
    }

    static getNumArray(length: number, value = 0): number[] {
        const arr = [];
        for (let i = 0; i < length; i++) arr.push(value);
        return arr;
    }

    static hasSetter(obj: any, prop: string): boolean {
        while (obj) {
            const pd = Reflect.getOwnPropertyDescriptor(obj, prop);
            if (pd) return pd.writable || !!pd.set;

            obj = Object.getPrototypeOf(obj);
        }
        return false;
    }

    static dataUriToBinary(dataUri: string): Uint8Array {
        const BASE64_MARKER = ';base64,';
        const base64Index = dataUri.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
        const base64 = dataUri.substring(base64Index);
        const raw = window.atob(base64);
        const rawLength = raw.length;
        const array = new Uint8Array(new ArrayBuffer(rawLength));

        for(let i = 0; i < rawLength; i++) {
            array[i] = raw.charCodeAt(i);
        }
        return array;
    }

    static assignProps(target: any, source: any): boolean {
        let changed = false;

        if (source) {
            for (let p in source) {
                // if (target.hasOwnProperty(p)) {
                    if (source[p] !== target[p]) {
                        target[p] = source[p];
                        changed = true;
                    }
                //}
            }
        }
        return changed;
    }

    static assignStyleAndProps(target: any, source: any): boolean {
        let changed = false;

        if (source) {
            for (let p in source) {
                if (p === 'style') {
                    target[p] = source[p];
                    changed = true;
                } else if (target.hasOwnProperty(p)) {
                    //if (source[p] !== target[p]) {
                        target[p] = source[p];
                        changed = true;
                    //}
                }
            }
        }
        return changed;
    }

    static dedupe(list: any[], comparer?: (v1: any, v2: any) => number): any[] {
        list = list.sort(comparer || ((n1, n2) => n1 > n2 ? 1 : n1 < n2 ? -1 : 0));
        for (let i = list.length - 1; i > 0; i--) {
            if (list[i] === list[i - 1]) {
                list.splice(i, 1);
            }
        }
        return list;
    }

    static isUnique(list: any[], comparer?: (v1: any, v2: any) => number): boolean {
        list = list.sort(comparer || ((n1, n2) => n1 > n2 ? 1 : n1 < n2 ? -1 : 0));
        for (let i = list.length - 1; i > 0; i--) {
            if (list[i] === list[i - 1]) {
                return false;
            }
        }
        return true;
    }

    static sortNum(list: number[]): number[] {
        return list.sort((n1, n2) => n1 - n2);
    }

    static logElapsed(message: string, runner: () => void ): void {
        const t = +new Date();
        runner();
        console.log(message, (+new Date() - t) + 'ms');
    }

    static clamp(v: number, min: number, max: number): number {
        if (!isNaN(max)) v = Math.min(v, max);
        if (!isNaN(min)) v = Math.max(v, min);
        return v;
    }

    static splice(array: any[], start: number, deleteCount: number, items: any[]): void {
        const args = [start, deleteCount].concat(items);
        Array.prototype.splice.apply(array, args);
    }

    static makeIntArray(from: number, to: number): number[] {
        const arr = new Array<number>(Math.max(0, to - from));

        for (let i = from; i < to; i++) {
            arr[i - from] = i;
        }
        return arr;
    }

    static setInterval(handler: () => void, interval: number): any {
        return setInterval(handler, interval);
    }

    static clearInterval(handle: any): void {
        clearInterval(handle);
    }

    static isStringArray(value: any): boolean {
        return isArray(value) && value.every(v => typeof v === 'string');
    }

    static isNumberArray(value: any): boolean {
        return isArray(value) && value.every(v => typeof v === 'number');
    }

    static makeLineSeparator(pattern: string | string[]): RegExp {
        if (isArray(pattern)) {
            if (pattern.length > 0) {
                let s = pattern[0];
                for (let i = 1, n = pattern.length; i < n; i++) {
                    s += '|' + pattern[i];
                }
                return new RegExp(s, 'g')
            }
        } else if (pattern) {
            return new RegExp(pattern, 'g')
        }
    }

    static stripQuotes(s: string): string {
        const c = s.charCodeAt(0);

        if (c === DBL_QUOTE) {
            s = s.replace(DBL_QUOTE_REP, "$1");
        } else if (c === QUOTE) {
            s = s.replace(QUOTE_REP, "$1");
        }
        return s;
    }

    static isDate(v: any): boolean {
        // return v instanceof Date;
        return Object.prototype.toString.call(v) === '[object Date]'
    }

    static isValidDate(d: Date): boolean {
        return d.getTime() === d.getTime();
    }

    static asFunction(fn: any): any {
        return typeof fn === 'function' ? fn : void 0;
    }

    static getFieldProp(field: string): { field: string, props: string[] } {
        const p = field.indexOf('.');
        if (p >= 0) {
            return {field: field.substring(0, p), props: field.substring(p + 1).split('.') };
        }
    }

    static watch(): Stopwatch {
        return new Stopwatch();
    }

    static uniqueKey = (function () {
        let hash = Math.random().toString(36).substring(2, 9) + '-';
        let id = 0;
        return function () {
            return 'rr-chart-' + hash + id++;
        }
    }());

    static startsWith(str: string, search: string): boolean {
        if (str && search) {
            return str.indexOf(search) === 0;
        }
    }

    static endsWith(str: string, search: string): boolean {
        if (str && search) {
            return str.indexOf(search, -str.length) === (str.length - search.length);
        }
    }

    static scaleNumber(value: number, symbols: string[], force: boolean): { value: number, symbol: string } {
        const abs = Math.abs(value);
        
        if (abs >= 1000) {
            let i = symbols.length - 1;
            while (i) {
                const m = Math.pow(1000, i--);
                const v = Math.pow(10, Math.log(abs) * Math.LOG10E);
                if (m <= v && (force || (abs * 10) % m === 0)) {
                    return { value: value / m, symbol: symbols[i] };
                }
            }
        }
    }
}

export class Stopwatch {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _started: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor() {
        this._started = +new Date();
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    elapsed(reset = false): number {
        const e =  +new Date() - this._started;
        reset && (this._started = +new Date());
        return e;
    }

    elapsedText(reset = false, suffix = 'ms.'): string {
        return this.elapsed(reset) + suffix;
    }
}