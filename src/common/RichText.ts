////////////////////////////////////////////////////////////////////////////////
// RichText.ts
// 2023. 07. 14. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { maxv, pickNum } from "./Common";
import { DatetimeFormatter } from "./DatetimeFormatter";
import { NumberFormatter } from "./NumberFormatter";
import { Sides } from "./Sides";
import { TextFormatter } from "./TextFormatter";
import { Align, ZWSP, _undef } from "./Types";
import { TextAnchor, TextElement } from "./impl/TextElement";

const HEIGHT = '$_TH';
const WIDTH = '$_TW';
// const PARAM_REG = /[\$\%]\{/;

export type RichTextParamCallback = (target: any, param: string) => any;

export interface IRichTextDomain {
    callback?: RichTextParamCallback;
    numberFormatter?: NumberFormatter;
    timeFormatter?: DatetimeFormatter;
    textFormatter?: TextFormatter;
    startOfWeek?: number;
}

/**
 * '${name;default;format}', 
 * [주의] default에는 format이 적용되지 않는다. 즉, format이 적용된 문자열을 설정해야 한다.
 */
class Word {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    text: string;
    private _literals: string[];

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    get type(): string {
        return '';
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    parse(str: string): Word {
        this.text = str;
        this._doParse(str);
        return this;
    }

    getText(target: any, domain: IRichTextDomain): string {
        const literals = this._literals;

        if (literals && domain.callback) {
            let s = this.text;

            for (let i = 0; i < literals.length; i += 4) {
                let v: any = domain.callback(target, literals[i + 1]);

                if (typeof v === 'number' && !isNaN(v) || typeof v === 'bigint') {
                    const f = literals[3] ? NumberFormatter.getFormatter(literals[3]) : domain.numberFormatter;
                    if (f) v = f.toStr(v);
                } else if (v instanceof Date) {
                    const f = literals[3] ? DatetimeFormatter.getFormatter(literals[3]) : domain.timeFormatter;
                    if (f) v = f.toStr(v, domain.startOfWeek || 0);
                } else if (v == null) {
                    v = literals[i + 2] || '';
                }
                s = s.replace(literals[i], v);
            }
            return s;
        }
        return this.text;
    }

    prepareSpan(span: SVGTSpanElement, target: any, domain: IRichTextDomain): SVGTSpanElement {
        const s = this.getText(target, domain);

        span.textContent = s;
        //Utils.log(span.textContent, span.getBBox().y, span.getBBox().height);
        return span;
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected _doParse(str: string): Word {
        this._literals = [];

        let x = 0;

        while (x < str.length) {
            let i = str.indexOf('${', x);
            
            if (i < 0) {
                i = str.indexOf('%{', x);
            }
            if (i < 0) {
                break;
            }

            const j = str.indexOf('}', i + 2);
            if (j < 0) break;
            
            const s = str.substring(i, j + 1);
            const s2 = s.substring(2, s.length - 1);
            const k = s2.indexOf(';');

            if (k > 0) {
                const k2 = s2.indexOf(';', k + 1);
                if (k2 >= k) {
                    this._literals.push(s, s2.substring(0, k), s2.substring(k + 1, k2), s2.substring(k2 + 1));
                } else {
                    this._literals.push(s, s2.substring(0, k), s2.substring(k + 1), _undef);
                }
                if (this._literals[2].length === 0) this._literals[2] = _undef;
            } else {
                this._literals.push(s, s2, _undef, _undef);
            }

            x = j + 1;
        }

        if (this._literals.length == 0) this._literals = null;
        return this;
    }
}

abstract class SpanWord extends Word {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    override prepareSpan(span: SVGTSpanElement, target: any, domain: IRichTextDomain): SVGTSpanElement {
        const s = this.getText(target, domain);
        const x1 = s.indexOf('>') + 1;
        const x2 = s.indexOf('<', x1);

        this._doPrepare(span, s, x1, x2);

        //Utils.log(span.textContent, span.getBBox().y, span.getBBox().height);
        return span;
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected _doPrepare(span: SVGTSpanElement, s: string, x1: number, x2: number): void {
        // span.textContent = s.substring(x1, x2);
        span.innerHTML = s.substring(x1, x2);

        const i = s.indexOf('style=');

        if (i > 0 && i < x1) {
            const c = s[i + 6];
            const j = s.indexOf(c, i + 7);
            
            if (j > 0 && j < x1) {
                span.setAttribute('style', s.substring(i + 7, j));
            }
        }
    }
}

class NormalWord extends SpanWord {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    override get type(): string {
        return 't';
    }
}

class BoldWord extends SpanWord {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    override get type(): string {
        return 'b';
    }

    protected override _doPrepare(span: SVGTSpanElement, s: string, x1: number, x2: number): void {
        super._doPrepare(span, s, x1, x2);
        span.setAttribute('class', 'rct-text-bold')
    }
}

class ItalicWord extends SpanWord {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    override get type(): string {
        return 'i';
    }

    protected override _doPrepare(span: SVGTSpanElement, s: string, x1: number, x2: number): void {
        super._doPrepare(span, s, x1, x2);
        span.setAttribute('class', 'rct-text-italic')
    }
}

class LinkWord extends SpanWord {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    override get type(): string {
        return 'a';
    }

    protected override _doPrepare(span: SVGTSpanElement, s: string, x1: number, x2: number): void {
        super._doPrepare(span, s, x1, x2);
        span.setAttribute('class', 'rct-text-link')
    }
}

const Words = {
    't': NormalWord,
    'b': BoldWord,
    'i': ItalicWord
}

class SvgLine {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _words: Word[];

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    get words(): Word[] {
        return this._words.slice();
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    parse(s: string): SvgLine {

        function addPlain(s: string): void {
            const cnt = words.length;

            if (cnt > 0 && words[cnt - 1].type === '') {
                words[cnt - 1].text += s;
            } else {
                words.push(new Word().parse(s));
            }
        }

        const words = this._words = [];
        let x = 0;

        while (x < s.length) {
            const c = s[x];
            const c2 = s[x + 1];

            if (c == '<') {
                let w: Word;

                if (c2 in Words) {
                    const i = s.indexOf('>', x + 2);
                    if (i >= 0) {
                        const s2 = '</' + c2 + '>';
                        const j = s.indexOf(s2, i + 1);
                        if (j >= 0) {
                            const s3 = s.substring(x, j + s2.length);
                            w = new Words[c2]().parse(s3);
                            x += s3.length;
                        }
                    }
                } else if (c2 === 'a') {
                    debugger;
                }

                if (w) {
                    this._words.push(w);
                } else {
                    addPlain(s.substring(x));
                    break;
                }
            } else {
                const i = s.indexOf('<', x + 1);

                if (i >= 0) {
                    addPlain(s.substring(x, i));
                    x = i;
                } else {
                    addPlain(s.substring(x));
                    break;
                }
            }
        }
        return this;
    }

    // getText(target: any, domain: RichTextParamCallback): string {
    //     let s = '';
        
    //     for (let w of this._words) {
    //         s += w.getText(target, domain);
    //     }
    //     return s;
    // }
}

const line_sep = /<br.*?>|\r\n|\n/;

/**
 * <t>, <b>, <i>, <br>,
 * <b>${label}</b><br><t style="fill:#c00;">${endValue}</t>
 * <a href='...'>...</a>
 */
export class SvgRichText {
	
    //-------------------------------------------------------------------------
    // static members
	//-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    _format: string;
    lineHeight: number;

    //-------------------------------------------------------------------------
    // fields
	//-------------------------------------------------------------------------
    private _lines: SvgLine[];

	//-------------------------------------------------------------------------
    // constructors
    //-------------------------------------------------------------------------
	constructor(format?: string) {
		this.setFormat(format);
	}

	//-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    setFormat(value: string) {
        if (value !== this._format) {
            this.$_parse(this._format = value != null ? String(value) : value);
        }
    }

    lines(): SvgLine[] {
        return this._lines.slice();
    }

	//-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    // getSvg(target: any, domain: RichTextParamCallback): string {
    //     let s = '';

    //     for (let line of this._lines) {
    //         s += line.getText(target, domain);
    //     }
    //     return s;
    // }

    /**
     * TODO: max width
     */
    build(view: TextElement, maxWidth: number, maxHeight: number, target: any, domain: IRichTextDomain): void {
        const doc = view.doc;
        const hLine = pickNum(this.lineHeight, 1);
        let hMax = 0;
        const lines = this._lines;
        const cnt = lines.length;
        const widths = [];
        let wMax = 0;
        const firsts: Element[] = [];
        let prev: number;

        view.clearDom();
        target = target || view;

        for (let i = 0; i < cnt; i++) {
            const line = lines[i];
            let w = 0;
            let h = 0;
            let first: Element = null;

            for (let word of line.words) {
                const span = word.prepareSpan(view.appendElement(doc, 'tspan') as SVGTSpanElement, target, domain);
                const r = span.getBBox();
                
                w += r.width;
                span[WIDTH] = r.width;
                h = maxv(h, span[HEIGHT] = r.height);

                if (!first) first = span;
            }

            firsts.push(first);
            widths.push(w);
            line[HEIGHT] = h * hLine;
            wMax = maxv(w, wMax);
            hMax = maxv(h, hMax);
        }
        
        if (cnt > 0) {
            // if (firsts[0]) {
            //     firsts[0].setAttribute('x', '0');
            // }
            prev = lines[0][HEIGHT];
            for (let i = 1; i < firsts.length; i++) {
                if (firsts[i]) { // 중복된 <br>은 무시한다.
                    const span = view.insertElement(doc, 'tspan', firsts[i]);
                    let h = Math.floor(prev - view.getAscent(prev)) + view.getAscent(lines[i][HEIGHT]);
                    // let h = lines[i][HEIGHT];

                    // [CHECK] 이전 line 높이가 지금행보다 많이 큰 경우, 두 line이 겹치는 경우가 많다.
                    //         아래행을 조금 더 민다.
                    // if (dy > 0 && lines[i - 1][HEIGHT] >= h * 1.8) {
                    //     h = Math.floor(h * 1.1);
                    // } else {
                    //     h = Math.ceil(h);
                    // }
                    span.setAttribute('x', '0');
                    span.setAttribute('dy', String(h));
                    span.innerHTML = ZWSP;
                    prev = lines[i][HEIGHT];
                }
            }

            view.layoutText(lines[0][HEIGHT]); // 첫 행의 높이를 전달한다.
            // view.layoutText(hMax); // 가장 큰 높이의 행 높이를 전달한다. 맞나?
        } 
    }

    layout(tv: TextElement, align: Align, width: number, height: number, pad: Sides): void {
        const r = tv.getBBox();
        let y = pad.top + (height - pad.top - pad.bottom - r.height) / 2;
        let x: number;

        switch (align) {
            case Align.CENTER:
                tv.anchor = TextAnchor.MIDDLE;
                x = pad.left + (width - pad.left - pad.right) / 2;
                break;
            case Align.RIGHT:
                tv.anchor = TextAnchor.END;
                x = r.width - pad.right;
                break;
            default:
                tv.anchor = TextAnchor.START;
                x = pad.left;
                break;
        }
        tv.trans(x, y);
    }

	//-------------------------------------------------------------------------
    // internal members
	//-------------------------------------------------------------------------
    $_parse(fmt: string): void {
        const lines = this._lines = [];

        if (fmt) {
            const strs = fmt.split(line_sep);

            for (let s of strs) {
                lines.push(new SvgLine().parse(s));
            }
        }
    }
}


export class HtmlText {

    //-------------------------------------------------------------------------
    // fields
	//-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // build
	//-------------------------------------------------------------------------
}