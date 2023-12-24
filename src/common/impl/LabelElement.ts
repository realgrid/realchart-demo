////////////////////////////////////////////////////////////////////////////////
// LabelElement.ts
// 2023. 07. 12. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ChartText, ChartTextEffect } from "../../model/ChartItem";
import { Color } from "../Color";
import { Align, _undef } from "../Types";
import { GroupElement } from "./GroupElement";
import { RectElement } from "./RectElement";
import { TextAnchor, TextElement } from "./TextElement";

/**
 * ChartText를 표시하는 텍스트 view.
 */
export class LabelElement extends GroupElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _back: RectElement;
    _outline: TextElement;
    _text: TextElement;
    private _model: ChartText;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string = _undef) {
        super(doc);

        this.add(this._text = new TextElement(doc, styleName));
        this._text.anchor = TextAnchor.START;
    }

	//-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /** text */
    get text(): string {
        return this._text.text;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    setText(s: string): LabelElement {
        this._outline && (this._outline.text = s);
        this._text.text = s;
        return this;
    }

    setModel(doc: Document, model: ChartText, contrastTarget: Element): LabelElement {
        const e = model.effect;

        this._model = model;
        this._text.setStyleOrClass(model.style);

        if (e === ChartTextEffect.BACKGROUND) {
            this._outline && this._outline.remove();
            if (!this._back) {
                this._back = new RectElement(doc, 'rct-label-background');
            }
            this.insertFirst(this._back);
            this._back.setStyleOrClass(model.backgroundStyle);

        } else if (e === ChartTextEffect.OUTLINE) {
            this._back && this._back.remove();
            if (!this._outline) {
                this._outline = new TextElement(doc);
            }
            this.insertFirst(this._outline);

            this._outline.anchor = this._text.anchor;
            this._outline.setStyleOrClass(model.style);

        } else {
            this._back && this._back.remove();
            this._outline && this._outline.remove();
        }
        return this;
    }

    setContrast(target: Element): LabelElement {
        // contrast
        if (target && this._model.autoContrast) {
            this._text.setContrast(target, this._model.darkStyle || 'rct-label-dark', this._model.lightStyle || 'rct-label-light');
        }
        // outline
        if (this._outline && this._outline.parent) {
            const color = Color.getContrast(getComputedStyle(this._text.dom).fill)
            this._outline.setStyles({
                fill: color,
                stroke: color,
                strokeWidth: this._model._outlineWidth
            });
        }
        return this;
    }

    layout(align: Align): LabelElement {
        const r = this._text.getBBox();
        // TODO: 높이 너비를 지정할 수 있다.
        const w = r.width;
        const h = r.height;
        let x = 0;
        let y = 0;

        // background
        if (this._back && this._back.parent) {
            const cs = getComputedStyle(this._back.dom);

            x = parseFloat(cs.paddingLeft) || 0;
            y = parseFloat(cs.paddingTop) || 0;

            this._back.setBounds(
                0,//-left,//-r.width / 2, 
                0,//-top,//-r.height / 2,
                w + x + (parseFloat(cs.paddingRight) || 0),
                h + y + (parseFloat(cs.paddingBottom) || 0),
                cs['rx']
            )
        }

        // [주의] 멀티라인을 위해 anchor를 지정해야 한다.
        switch (align) {
            case Align.CENTER:
                x += w / 2;
                this._text.anchor = TextAnchor.MIDDLE;
                break;
            case Align.RIGHT:
                x += w;
                this._text.anchor = TextAnchor.END;
                break;
            default:
                this._text.anchor = TextAnchor.START;
        }

        this._text.translate(x, y);
        if (this._outline) {
            this._outline.anchor = this._text.anchor;
            this._outline.setAttr('y', this._text.getAttr('y'));
            this._outline.translate(x, y);
        }
        return this;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}
