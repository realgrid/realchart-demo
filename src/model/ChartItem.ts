////////////////////////////////////////////////////////////////////////////////
// ChartItem.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isBoolean, isObject, isString, pickNum } from "../common/Common";
import { NumberFormatter } from "../common/NumberFormatter";
import { RcObject } from "../common/RcObject";
import { SvgRichText, RichTextParamCallback } from "../common/RichText";
import { NUMBER_FORMAT, NUMBER_SYMBOLS, SVGStyleOrClass, _undefined } from "../common/Types";
import { Utils } from "../common/Utils";
import { TextElement } from "../common/impl/TextElement";
import { IChart } from "./Chart";

export let n_char_item = 0;

export class ChartItem extends RcObject {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    readonly chart: IChart;
    private _visible: boolean;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart, visible: boolean) {
        super();

        this.chart = chart;
        this._visible = visible;
        n_char_item++;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /** 
     * 표시 여부.
     *  
     * @default true
     * @config
     */
    get visible(): boolean {
        return this._visible;
    }
    set visible(value: boolean) {
        if (value !== this._visible) {
            this._visible = value;
            this.chart?._visibleChanged(this);
        }
    }
    /**
     * 스타일셋 혹은 class selector.
     * 
     * @config
     */
    style: SVGStyleOrClass;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    load(source: any): ChartItem {
        if (source !== void 0 && !this._doLoadSimple(source)) {
            if (source !== null && source.template != null) {
                const assign = this.chart && this.chart.assignTemplates;
                assign && (source = assign(source));
            }
            this._doLoad(source);
        }
        return this;
    }

    save(): any {
        const obj = {
            visible: this.visible
        };

        this._doSave(obj);
        return obj;
    }

    private INVALID = {};

    private $_parseProp(path: string): { obj: ChartItem, prop: string } | any {
        if (path.indexOf('.') >= 0) {
            const arr = path.split('.');
            const len = arr.length - 1;
            let obj: any = this;

            for (let i = 0; i < len; i++) {
                obj = obj[arr[i]];
                if (!(obj instanceof RcObject)) {
                    return this.INVALID;
                }
            }
            return { obj, prop: arr[len] };
        }
    }

    getProp(prop: string): any {
        if (isString(prop)) {
            const path = this.$_parseProp(prop);

            if (path) {
                return path === this.INVALID ? _undefined : path.obj[path.prop];
            } else {
                return this[prop];
            }
        }
    }

    setProp(prop: string, value: any, redraw: boolean): boolean {
        if (isString(prop)) {
            const path = this.$_parseProp(prop);

            if (path) {
                if (path.obj instanceof ChartItem) {
                    path.obj.setProp(path.prop, value, redraw);
                } else if (path.obj instanceof RcObject) {
                    if (value !== path.obj[path.prop]) {
                        path.obj[path.prop] = value;
                        redraw && this._changed();
                    }
                }
            } else if (prop in this) {
                const v = this[prop];

                if (v instanceof ChartItem) {
                    return v.setProps(value, redraw);
                } else if (value !== v) {
                    this[prop] = value;
                    redraw && this._changed();
                    return true;
                }
            }
        }
    }

    setProps(props: object, redraw: boolean): boolean {
        let changed = false;

        if (isObject(props)) {
            for (const p in props) {
                if (this.setProp(p, props[p], false)) {
                    changed = true;
                }
            }
        } else if (this._doLoadSimple(props)) {
            changed = true;
        }
        changed && redraw && this._changed();
        return changed;
    }

    prepareRender(): void {
        this._doPrepareRender(this.chart);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _changed(tag?: any): void {
        this.chart?._modelChanged(this, tag);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected _doLoadSimple(source: any): boolean {
        if (isBoolean(source)) {
            this.visible = source;
            return true;
        }
    }

    protected _doLoad(source: any): void {
        for (const p in source) {
            //if (this.hasOwnProperty(p)) {
                let v = source[p];

                if (this._doLoadProp(p, v)) {
                } else if (this[p] instanceof ChartItem) {
                    this[p].load(v);
                } else if (isArray(v)) {
                    this[p] = v.slice(0);
                } else if (v instanceof Date) {
                    this[p] = new Date(v);
                } else if (isObject(v)) {
                    this[p] = Object.assign({}, v);
                } else {
                    this[p] = v;
                }
            //}
        }
    }

    protected _doLoadProp(prop: string, value: any): boolean {
        return false;
    }

    protected _doSave(target: object): void {
    }

    protected _doPrepareRender(chart: IChart): void {
    }

    protected _loadStroke(source: any): boolean {
        if (isString(source)) {
            this.visible = true;
            this.style = { stroke: source };
            return true;
        }
    }
}

export const BRIGHT_COLOR = 'white';
export const DARK_COLOR = 'black';

export enum ChartTextEffect {
    NONE = 'none',
    /**
     * 텍스트 색상과 대조되는 색상으로 텍스트 외곽을 구분 표시한다.
     */
    OUTLINE = 'outline',
    /**
     * 텍스트 배경 상자를 표시한다.
     * <br>
     * 배경 상자에 {@link backgroundStyle}이 적용된다.
     * 스타일이 적용되지 않으면 기본 'rct-text-background'이 적용된다.
     */
    BACKGROUND = 'background'
}

export abstract class ChartText extends ChartItem {
    
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _outlineThickness = 2;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _outlineWidth = '2px';

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * @config
     */
    effect = ChartTextEffect.NONE;
    /**
     * @config
     */
    lightStyle: SVGStyleOrClass;
    /**
     * @config
     */
    darkStyle: SVGStyleOrClass;
    /**
     * @config
     */
    backgroundStyle: SVGStyleOrClass;
    /**
     * 텍스트가 data point 내부에 표시되는 경우 포인트 색상과 대조되도록 표시한다.
     * <br>
     * 밝게 표시할 때는 {@link lightStyle}을 적용하고,
     * 어둡게 표시할 때는 {@link darkStyle}이 적용된다.
     * brightStyle이 지정되지 않으면 'rct-text-light'이,
     * darkStyle이 지정되지 않으면 'rct-text-dark'가 기본 적용된다.
     * 
     * @config
     */
    autoContrast = true;// true;
    
    get outlineThickness(): number {
        return this._outlineThickness;
    }
    set outlineThickness(value: number) {
        if (value !== this._outlineThickness) {
            this._outlineThickness = value;
            this._outlineWidth = pickNum(value, 2) + 'px';
        }
    }
}

export abstract class FormattableText extends ChartText {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    private _numberSymbols: string;
    private _numberFormat: string;
    private _text: string;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _numSymbols: string[];
    private _numberFormatter: NumberFormatter;
    protected _richTextImpl: SvgRichText;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart, visible: boolean) {
        super(chart, visible);

        this.numberSymbols = NUMBER_SYMBOLS;
        this.numberFormat = NUMBER_FORMAT;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * label 문자열 앞에 추가되는 문자열.
     * 
     * @config
     */
    prefix: string;

    /**
     * label 문자열 끝에 추가되는 문자열.
     * 
     * @config
     */
    suffix: string;

    /**
     * 축의 tick 간격이 1000 이상인 큰 수를 표시할 때 
     * 이 속성에 지정한 symbol을 이용해서 축약형으로 표시한다.
     * 
     * @config
     */
    get numberSymbols(): string {
        return this._numberSymbols;
    }
    set numberSymbols(value: string) {
        if (value !== this._numberSymbols) {
            this._numberSymbols = value;
            this._numSymbols = value && value.split(',');
        }
    }

    /**
     * label이 숫자일 때 표시 형식.
     * 
     * @config
     */
    get numberFormat(): string {
        return this._numberFormat;
    }
    set numberFormat(value: string) {
        if (value !== this._numberFormat) {
            this._numberFormat = value;
            this._numberFormatter = value ? NumberFormatter.getFormatter(value) : null;
        }
    }

    // /**
    //  * point label:
    //  * position으로 지정된 위치로 부터 떨어진 간격.
    //  * center나 middle일 때는 무시.
    //  * 파이 시리즈 처럼 label 연결선이 있을 때는 연결선과의 간격.
    //  * 
    //  * axis label:
    //  * 축 line과의 간격.
    //  * 
    //  * @config
    //  */
    // offset = 2;

    lineHeight: number;

    /**
     * rich text format을 지정할 수 있다.
     * 
     * @config
     */
    get text(): string {
        return this._text;
    }
    set text(value: string) {
        this.setText(value);
    }
    setText(value: string): FormattableText {
        if (value !== this._text) {
            this._text = value;
            if (value) {
                if (!this._richTextImpl) {
                    this._richTextImpl = new SvgRichText();
                }
                this._richTextImpl.setFormat(value);
            } else {
                this._richTextImpl = null;
            }
        }
        !isNaN(this.lineHeight) && this._richTextImpl && (this._richTextImpl.lineHeight = this.lineHeight);
        return this;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    isVisible(): boolean {
        return this.visible && !!this._text;
    }

    // getSvg(target: any, callback: RichTextParamCallback): string {
    //     if (this._richText) {
    //         return this._richText.getSvg(target, callback);
    //     }
    // }

    buildSvg(view: TextElement, maxWidth: number, maxHeight: number, target: any, callback: RichTextParamCallback): void {
        this._richTextImpl.build(view, maxWidth, maxHeight, target, callback);
    }

    // setLineHeight(v: number): void {
    //     this._richTextImpl.lineHeight = v;
    // }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doLoadSimple(source: any): boolean {
        if (isString(source)) {
            this.text = source;
            return true;
        }
        return super._doLoadSimple(source);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_getNumberText(value: any, useSymbols: boolean, forceSymbols: boolean): string {
        if (Utils.isValidNumber(value)) {
            const sv = this._numSymbols && useSymbols && Utils.scaleNumber(value, this._numSymbols, forceSymbols);

            if (this._numberFormatter) {
                if (sv) {
                    return this._numberFormatter.toStr(sv.value) + sv.symbol;
                } else {
                    return this._numberFormatter.toStr(value);
                }
            } else if (sv) {
                return sv.value + sv.symbol;
            } else {
                return String(value);
            }
        }
        return 'NaN';
    }
    
    protected _getText(text: string, value: any, useSymbols: boolean, forceSymbols = false): string {
        let s = text || this.$_getNumberText(value, useSymbols, forceSymbols) || value;
        
        if (this.prefix) s = this.prefix + s;
        if (this.suffix) s += this.suffix;
        return s;
    }
}

export class BackgroundImage extends ChartItem {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    url: string;
    style: SVGStyleOrClass;
}
