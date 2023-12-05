////////////////////////////////////////////////////////////////////////////////
// Types.ts
// 2021. 11. 26. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isObject, isString, pickNum } from "./Common";
import { locale } from "./RcLocale";

export const _undefined = void 0; // 불필요
export const ONE_CHAR = '①'.charCodeAt(0);
const ASTERISK = '*'.charCodeAt(0);
const PERCENT = '%'.charCodeAt(0);
export const ZWSP = '&#8203;';
export const ELLIPSIS = '\u2026';
export const PI_2 = Math.PI * 2;
export const ORG_ANGLE = -Math.PI / 2;
export const DEG_RAD = Math.PI * 2 / 360;
export const RAD_DEG = 360 / Math.PI / 2;
export function fixAngle(a: number): number {
    return a > PI_2 ? a % PI_2 : a;
}

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
// export function deg2rad(degree: number): number {
//     return degree * Math.PI * 2 / 360;
// }
export function pixel(v: number): string {
    return v + 'px';
}
export function isNull(v: any): boolean {
    return v == null || Number.isNaN(v) || v === '';
}
export function pad2(v: number): string {
	return (v < 10) ? ("0" + v) : String(v);
}
export function pad3(v: number): string {
	return (v < 10) ? ("00" + v) : (v < 100) ? ("0" + v) : String(v);
}
export function newObject(prop: string, value: any): {} {
    const obj = {};
    obj[prop] = value;
    return obj;
}
export function utc(year: number, monthIndex = 0, day = 1, hour = 0, minute = 0, second = 0, millisecond = 0): Date {
    return new Date(Date.UTC(year, monthIndex, day, hour, minute, second, millisecond));
}

export type PathValue = string | number;
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
    let fixed = false;
    let size: number;

    if (sv == null) {
        if (enableNull) {
            return null;
        } else {
            size = def || 0;
            fixed = true;
        }
    } else if (typeof sv === 'string') {
        const s = sv.trim();

        if (s.length === 0) {
            size = NaN;            
        } else {
            if (s.charCodeAt(s.length - 1) === PERCENT) {
                size = s.length === 1 ? NaN : parseFloat(s);
            } else {
                size = parseFloat(s);
                fixed = true;
            }
        }
        if (isNaN(size)) {
            if (enableNull) {
                return null;
            }
            throwFormat(locale.invalidSizeValue, sv);
        }
    } else {
        size = +sv;
        if (isNaN(size)) {
            if (enableNull) {
                return null;
            } else {
                size = def || 0;
                fixed = true;
            } 
        } else {
            fixed = true;
        }
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

export interface SVGStyles {
    fill?: string;
    fillOpacity?: string;
    stroke?: string;
    strokeWidth?: string;
    strokeDasharray?: string;
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    fontStyle?: string;
    rx?: string;
    /**
     * Svg에 적용되는 정식 css style이 아니다.
     * 즉, realchart-style.css 등의 외부 css 파일에서 사용할 수 없고,
     * RealChart 내부에서 title, data point label 등의 inline 스타일로 적용할 수 있다.
     */
    textAlign?: 'left' | 'center' | 'right';
}

export type SVGStyleOrClass = SVGStyles | string;

export const CAMEL2KEBAB = {
    fill: 'fill',
    stroke: 'stroke',
    strokeWidth: 'stroke-width',
    fontFamily: 'font-family',
    fontSize: 'font-size',
    fontWeight: 'font-weight',
    fontStyle: 'font-style',
    padding: 'padding',
    margin: 'margin',
}
export const getCssProp = function (prop: string): string {
    const s = CAMEL2KEBAB[prop];
    if (!s) {
        let s2 = prop.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
        CAMEL2KEBAB[prop] = s2;
        return s2;
    }
    return s;
}

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

export interface IMinMax {
    min: number;
    max: number;
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
    /** @config */
    LEFT = 'left',
    /** @config */
    CENTER = 'center',
    /** @config */
    RIGHT = 'right'
}

export enum VerticalAlign {
    /** @config */
    TOP = 'top',
    /** @config */
    MIDDLE = 'middle',
    /** @config */
    BOTTOM = 'bottom'
}

export enum SectionDir {
    LEFT = 'left',
    TOP = 'top',
    BOTTOM = 'bottom',
    RIGHT = 'right',
    CENTER = 'center',
    MIDDLE = 'middle'
}

export interface ISides {
    left: number;
    right: number;
    top: number;
    bottom: number;
    horz?: number;
    vert?: number;
}

export enum AlignBase {
    /**
     * @config
     */
    CHART = 'chart',
    /**
     * @config
     */
    PLOT = 'plot',
    /**
     * 상위 모델이 존재하는 경우 상위 모델 영역 기준.\
     * 상위가 없으면 기본값(대부분 'plot')과 동일.
     * ex) subtitle인 경우 title 기준.
     * 
     * @config
     */
    PARENT = 'parent'
}

export interface IValueRange {
    fromValue?: number;
    toValue?: number;
    color: string;
    label?: string;
    style?: SVGStyleOrClass;
}

export interface IValueRanges {
    fromValue?: number;
    toValue?: number;
    steps?: number[];
    colors: string[];
    labels?: string[];
    styles?: SVGStyleOrClass[];
}

/**
 * endValue는 포함되지 않는다. 즉, startValue <= v < endValue.
 * startValue를 지정하면 이전 range의 endValue를 startValue로 설정한다.
 * 이전 범위가 없으면 min으로 지정된다.
 * endValue가 지정되지 않으면 max로 지정된다.
 * color가 설정되지 않거나, startValue와 endValue가 같은 범위는 포힘시키지 않는다.
 * startValue를 기준으로 정렬한다.
 */
export const buildValueRanges = function (source: IValueRange[] | IValueRanges, min: number, max: number, inclusive = true, strict = true, fill = false, color?: string): IValueRange[] {
    let ranges: IValueRange[];
    let prev: IValueRange;

    if (isArray(source)) {
        if (inclusive) {
            min = Number.MIN_VALUE;
            max = Number.MAX_VALUE;
        }

        ranges = [];
        source.forEach(src => {
            if (isObject(src) && isString(src.color)) {
                const range: IValueRange = {
                    fromValue: pickNum(src.fromValue, prev ? prev.toValue : min),
                    toValue: pickNum(src.toValue, max),
                    color: src.color,
                    style: src.style ? Object.assign({}, src.style) : _undefined
                };
                if (range.fromValue < range.toValue) {
                    ranges.push(range);
                    prev = range;
                }
            }
        });
        ranges = ranges.sort((r1, r2) => r1.fromValue - r2.fromValue)
                       .filter(r => r.toValue >= min && r.fromValue < max);
        if (strict) {
            ranges.forEach(r => {
                r.fromValue = Math.max(r.fromValue, min);
                r.toValue = Math.min(r.toValue, max);
            })
        }
    } else if (isObject(source) && isArray(source.colors) && source.colors.length > 0) {
        const colors = source.colors;
        const styles = isArray(source.styles) ? source.styles : null;

        ranges = [];

        if (isArray(source.steps) && source.steps.length > 0) {
            const steps = isArray(source.steps) ? source.steps : null;

            if (min < steps[0]) steps.unshift(min);
            if (max > steps[steps.length - 1]) steps.push(max);

            for (let i = 0; i < steps.length - 1; i++) {
                ranges.push({
                    fromValue: steps[i],
                    toValue: steps[i + 1],
                    color: colors[Math.min(i, colors.length - 1)],
                    style: styles ? styles[Math.min(i, styles.length - 1)] : _undefined
                });
            }

        } else {
            let from = pickNum(source.fromValue, min);
            const to = pickNum(source.toValue, max);
            const step = (to - from) / colors.length;
            let i = 0;

            while (from < to) {
                ranges.push({
                    fromValue: from,
                    toValue: from += step,
                    color: colors[Math.min(i, colors.length - 1)],
                    style: styles ? styles[Math.min(i, styles.length - 1)] : _undefined
                });
                i++;
            }
        }
    }

    // 빈 간격을 메꾼다.
    if (fill && ranges && ranges.length > 0) {
        let i = 0;
        let prev = min;

        while (i < ranges.length) {
            if (ranges[i].fromValue < prev) {
                ranges.splice(i, 0, {
                    fromValue: prev,
                    toValue: ranges[i].fromValue,
                    color: color
                });
            }
            prev = ranges[i].toValue;
            i++;
        }
        if (ranges[i - 1].toValue < max) {
            ranges.push({
                fromValue: ranges[i - 1].toValue,
                toValue: max,
                color: color
            });
        }
    }
    return ranges;
}
