////////////////////////////////////////////////////////////////////////////////
// Types.ts
// 2021. 11. 26. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { locale } from "./RcLocale";

export const _undefined = void 0; // 불필요
export const ONE_CHAR = '①'.charCodeAt(0);
const ASTERISK = '*'.charCodeAt(0);
const PERCENT = '%'.charCodeAt(0);
export const ZWSP = '&#8203;';
export const ELLIPSIS = '\u2026';
export const ORG_ANGLE = -Math.PI / 2;
export const DEG_RAD = Math.PI * 2 / 360;

export const NUMBER_SYMBOLS = 'k,M,G,T,P,E';
export const NUMBER_FORMAT = '#,##0.#';

export const floor = Math.floor;
export const ceil = Math.ceil;
export function fixnum(value: number): number {
    return parseFloat(value.toPrecision(12));
}
export function toStr(value: any): string {
    return value == null ? null : String(value);
}
export function deg2rad(degree: number): number {
    return degree * Math.PI * 2 / 360;
}
export function pixel(v: number): string {
    return v + 'px';
}
export function isNull(v: any): boolean {
    return v == null || Number.isNaN(v) || v === '';
}
export function pad2(v: number): string {
    return v < 10 ? `0${v}` : String(v);
}
export function newObject(prop: string, value: any): {} {
    const obj = {};
    obj[prop] = value;
    return obj;
}
export function utc(year: number, monthIndex = 0, day = 1, hour = 0, minute = 0, second = 0, millisecond = 0): Date {
    return new Date(Date.UTC(year, monthIndex, day, hour, minute, second, millisecond));
}

export type Path = string | any[];

/**
 * 123, '10%' 형식으로 크기를 지정한다.
 */
export type RtPercentSize = string | number; 
export function isValidPercentSize(v: any): boolean {
    if (!isNaN(v)) return true;
    if (typeof v === 'string' && v.trimEnd().endsWith('%') && !isNaN(parseFloat(v))) return true;
    return false;
}
export interface IPercentSize {
    size: number;
    fixed: boolean;
}
export const sizeToCss = function (size: IPercentSize): string {
    return size.fixed ? (size.size + 'px') : (size.size + '%'); 
}
export const sizeToCssEx = function (size: IPercentSize): string {
    return size ? (size.fixed ? (size.size + 'px') : (size.size + '%')) : '';
}

export function parsePercentSize(sv: RtPercentSize, enableNull: boolean, def?: number): IPercentSize {
    let fixed: boolean;
    let size: number;

    if (sv != null && !Number.isNaN(sv)) {
        if (!(fixed = !isNaN(size = +sv))) {
            const s = (sv as string).trim();
            const c = s.charCodeAt(s.length - 1);

            if (c === PERCENT) {
                size = s.length === 1 ? NaN : parseFloat(s);
            }
            if (isNaN(size)) {
                if (enableNull) {
                    return null;
                }
                throwFormat(locale.invalidSizeValue, sv);
            }
        }
    } else if (enableNull) {
        return null;
    } else {
        size = def || 0;
        fixed = true;
    }
    return { size, fixed }; 
}

export function parsePercentSize2(sv: RtPercentSize, def: RtPercentSize): IPercentSize {
    return parsePercentSize(sv, true) || parsePercentSize(def, false);
}

export function getPercent(size: IPercentSize): number {
    return size && !size.fixed ? size.size : NaN;
}
export function calcPercent(size: IPercentSize, domain: number, def = NaN): number {
    return size ? (size.fixed ? size.size : size.size * domain / 100) : def;
}
export function calcPercentF(size: IPercentSize, domain: number): number {
    return size.fixed ? size.size : size.size * domain / 100;
}

export type SizeValue = string | number; // 123, '10*', '50%'
export function isValidSizeValue(v: any): boolean {
    if (!isNaN(v)) return true;
    if (typeof v === 'string' && v.trimEnd().endsWith('*') && !isNaN(parseFloat(v))) return true;
    return false;
}
export interface ISizeValue {
    size: number;
    fixed: boolean;
    rated?: boolean; // '*'
}

/**
 * @internal
 * 
 * '*'은 '1*'와 동일하다.
 */
export function parseSize(sv: SizeValue, enableNull: boolean): ISizeValue {
    let fixed: boolean;
    let rated: boolean; // '*'
    let size: number;

    if (sv != null && !Number.isNaN(sv)) {
        if (!(fixed = !isNaN(size = +sv))) {
            const s = (sv as string).trim();
            const c = s.charCodeAt(s.length - 1);

            if (c === PERCENT) {
                size = s.length === 1 ? NaN : parseFloat(s);
            } else if (c === ASTERISK) {
                size = s.length === 1 ? 1 : parseFloat(s);
                rated = true;
            }
            if (isNaN(size)) {
                if (enableNull) {
                    return null;
                }
                throwFormat(locale.invalidSizeValue, sv);
            }
        }
    } else if (enableNull) {
        return null;
    } else {
        size = 0;
        fixed = true;
    }
    return { size, rated, fixed }; 
}

export function getFixedSize(dim: IPercentSize): number {
    return dim && dim.fixed ? dim.size : NaN;
}
export function getRelativeSize(dim: IPercentSize): number {
    return dim && !dim.fixed ? dim.size : NaN;
}

export interface SVGStyles {
    fill?: string;
    stroke?: string;
    strokeWidth?: string;
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    fontStyle?: string;
}

export type SVGStyleOrClass = SVGStyles | string;

export class RtAbortError extends Error {
    static check(err: any): boolean {
        if (err instanceof RtAbortError) return true;
        throw err;
    }
}

export class AssertionError extends Error {
}

export const assert = function (predict: boolean, message: string): void {
    if (!predict) {
        throw new AssertionError(message);
    }
}

export const checkNull = function (obj: any, message: string): void {
    if (!obj) {
        throw new Error(message || (obj + ' is null.'));
    }
}

/**
 * @internal
 * 
 * 경고성 에러.
 * 발생 시 프로그램을 중지하지 않고 경고를 표시한다.
 */
export class AlertError extends Error {
}

export interface ISides {
    left: number;
    right: number;
    top: number;
    bottom: number;
    horz?: number;
    vert?: number;
}

export const ZERO_SIDES = Object.freeze({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    horz: 0,
    vert: 0
});

export const enum MouseButton {
    LEFT = 0,
    MIDDLE = 1,
    RIGHT = 2
}

/**
 * 스와이프 제스처 등의 진행 방향.
 * <br>
 * 
 * @see {@link RtListControl.onRowSwipe}
 */
export enum RtDirection {
    /**
     * 위쪽으로 진행.
     */
    UP = 'up',
    /**
     * 아래쪽으로 진행.
     */
    DOWN = 'down',
    /**
     * 왼쪽으로 진행.
     */
    LEFT = 'left',
    /**
     * 오른쪽으로 진행.
     */
    RIGHT = 'right'
}

export const formatMessage = (str: string, value: any): string => {
    return str.replace('%1', value);
}
export const formatMessage2 = (str: string, value1: any, value2: any): string => {
    return str.replace('%1', value1).replace('%2', value2);
}

export const throwError = (message: string) => {
    throw new Error(message);
}
export const throwFormat = (format: string, value: any) => {
    throw new Error(formatMessage(format, value));
}

export interface StyleProps {
    fill?: string;
    stroke?: string;
    strokeWidth?: string;
    color?: string;
    minWidth?: string;
    maxWidth?: string;
    minHeight?: string;
    maxHeight?: string;
    strokeDasharray?: string;
}

export enum Align {
    LEFT = 'left',
    CENTER = 'center',
    RIGHT = 'right'
}

export enum VerticalAlign {
    TOP = 'top',
    MIDDLE = 'middle',
    BOTTOM = 'bottom'
}

export enum SectionDir {
    LEFT = 'left',
    TOP = 'top',
    BOTTOM = 'bottom',
    RIGHT = 'right'
}

export const HORZ_SECTIONS = [SectionDir.LEFT, SectionDir.RIGHT];
export const VERT_SECTIONS = [SectionDir.TOP, SectionDir.BOTTOM];

export enum AlignBase {
    /**
     * @config
     */
    CHART = 'chart',
    /**
     * @config
     */
    PLOT = 'plot'
}
