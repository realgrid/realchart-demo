////////////////////////////////////////////////////////////////////////////////
// TextElement.ts
// 2023. 06. 03. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021-2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ELLIPSIS, SVGStyleOrClass, _undefined } from '../Types';
import { RcElement } from '../RcControl';
import { IRect } from '../Rectangle';
import { Color } from '../Color';

export enum TextAnchor {
    START = 'start',
    MIDDLE = 'middle',
    END = 'end'
}

export enum TextLayout {
    TOP = 'top',
    MIDDLE = 'middle',
    BOTTOM = 'bottom'
}

/**
 * Background, padding 등을 이용하려면 HtmlTextElement를 사용한다.
 */
export class TextElement extends RcElement {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // static members
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    private _layout = TextLayout.TOP;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _dirty = true;
    private _text = '';
    private _bounds: IRect;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string = _undefined) {
        super(doc, styleName, 'text');

        this.setAttr('text-anchor', 'middle');
    }

	//-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /** text */
    get text(): string {
        return this._text;
    }
    set text(value: string) {
        value = value || '';
        if (value !== this._text) {
            this._dirty = true;
            this.dom.textContent = this._text = value;
            this.layoutText();
        }
    }    

    /** anchor */
    get anchor(): TextAnchor {
        return this.getAttr('text-anchor');
    }
    set anchor(value: TextAnchor) {
        if (value !== this.anchor) {
            this.setAttr('text-anchor', value);
        }
    }

    /** layout */
    get layout(): TextLayout {
        return this._layout;
    }
    set layout(value: TextLayout) {
        if (value !== this._layout) {
            this._layout = value;
            this.layoutText();
        }
    }

    /** svg */
    get svg(): string {
        return this.dom.innerHTML;
    }
    set svg(value: string) {
        value = value || '';
        this.dom.innerHTML = value;
    }
    
    get opacity(): number {
        return this.getAttr('fill-opacity');
    }
    set opacity(value: number) {
        this.setAttr('fill-opacity', value);
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getAscent(height: number): number {
        //return (height >= 20 ? 0.72 : 0.75) * height;
        return 0.75 * height;
    }

    layoutText(lineHeight?: number): void {
        const r = this.getBBounds();
        const ascent = this.getAscent(isNaN(lineHeight) ? r.height : lineHeight);
        let y: number;

        switch (this._layout) {
            case TextLayout.MIDDLE:
                y = Math.floor(ascent / 2);
                break;
            
            case TextLayout.BOTTOM:
                y = ascent - r.height;
                break;

            default:
                y = Math.ceil(ascent);
                break;
        }
        this.setAttr('y', y);
    }

    isFitIn(bounds: number): boolean {
        return this.calcWidth() >= bounds;
    }

    calcWidth(): number {
        const len = this._text.length;
        return len && (this.dom as SVGTextElement).getSubStringLength(0, len);
    }

    calcRangeWidth(start = 0, end = Number.MAX_SAFE_INTEGER): number {
        start = Math.max(0, start);
        end = Math.min(this._text.length, end);
        return end > start ? (this.dom as SVGTextElement).getSubStringLength(start, end - start) : 0;
    }

    truncate(bounds: number, ellipsis: boolean): void {
        let s = this._text;
        if (!s) return;

        const span = this.dom as SVGTextElement;
        let x1 = 0;
        let x2 = s.length;
        let x: number;

        do {
            x = Math.ceil((x1 + x2) / 2);
            const w = span.getSubStringLength(0, x);

            if (w > bounds) {
                x2 = x - 1;
            } else {
                x1 = x;
            }
        } while (x1 < x2);

        this.text = s.substring(0, x1) + ELLIPSIS;
        while (x1 > 0 && this.calcWidth() > bounds) {
            this.text = s.substring(0, --x1) + ELLIPSIS;
        }
    }

    // setContrast(target: Element, darkColor = 'black', brightColor = 'white'): TextElement {
    //     this.setStyle('fill', Color.getContrast(getComputedStyle(target).fill, darkColor, brightColor));
    //     return this;
    // }

    setContrast(target: Element, darkStyle: SVGStyleOrClass, brightStyle: SVGStyleOrClass): TextElement {
        this.setStyleOrClass(Color.isBright(getComputedStyle(target).fill) ? darkStyle : brightStyle);
        return this;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    clearDom(): void {
        super.clearDom();
        this._dirty = true;
    }
            
    setStyles(styles: any): boolean {
        //if (this._text === '미국') debugger;
        let changed = super.setStyles(styles);
        if (changed) {
            this.layoutText();
        }
        return changed;
    }

    setStyle(prop: string, value: string): boolean {
        let changed = super.setStyle(prop, value);
        if (changed) {
            this.layoutText();
        }
        return changed;
    }

    getBBounds(): IRect {
        if (this._dirty || this._styleDirty) {
            this._bounds = (this.dom as SVGGraphicsElement).getBBox();
            this._dirty = this._styleDirty = false;
        }
        return this._bounds;
    }

    getBBoundsTest(): IRect {
        if (this._dirty || this._styleDirty) {
            this._bounds = {
                x: this.x,
                y: this.y,
                width: 100,
                height: 30
            };
            this._dirty = this._styleDirty = false;
        }
        return this._bounds;
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}
