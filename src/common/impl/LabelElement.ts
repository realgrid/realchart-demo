////////////////////////////////////////////////////////////////////////////////
// LabelElement.ts
// 2023. 07. 12. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ChartText, ChartTextEffect } from "../../model/ChartItem";
import { Color } from "../Color";
import { _undefined } from "../Types";
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
    constructor(doc: Document, styleName: string = _undefined) {
        super(doc);

        // this.add(this._back = new RectElement(doc));

        // this.add(this._outline = new TextElement(doc));
        // this._outline.anchor = TextAnchor.START;

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

    /** anchor */
    get anchor(): TextAnchor {
        return this._text.anchor;
    }
    set anchor(value: TextAnchor) {
        this._text.anchor = value;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    setText(s: string): LabelElement {
        this._outline && (this._outline.text = s);
        this._text.text = s;
        return this;
    }

    setSvg(s: string): LabelElement {
        this._text.svg = s;
        return this;
    }

    setModel(doc: Document, model: ChartText, contrastTarget: Element): LabelElement {
        const e = model.effect;

        this._model = model;
        this._text.setStyleOrClass(model.style);

        if (e === ChartTextEffect.BACKGROUND) {
            this._outline?.remove();
            if (!this._back) {
                this._back = new RectElement(doc, 'rct-label-background');
            }
            this.insertFirst(this._back);
            this._back.setStyleOrClass(model.backgroundStyle);

        } else if (e === ChartTextEffect.OUTLINE) {
            this._back?.remove();
            if (!this._outline) {
                this._outline = new TextElement(doc);
            }
            this.insertFirst(this._outline);

            this._outline.anchor = this._text.anchor;
            this._outline.setStyleOrClass(model.style);

        } else {
            this._back?.remove();
            this._outline?.remove();
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

    layout(): LabelElement {
        if (this._outline) {
            this._outline.anchor = this._text.anchor;
            this._outline.setAttr('y', this._text.getAttr('y'));
        }
        // background
        if (this._back && this._back.parent) {
            const cs = getComputedStyle(this._back.dom);
            const r = this._text.getBBounds();
            const left = parseFloat(cs.paddingLeft) || 0;
            const top = parseFloat(cs.paddingTop) || 0;

            this._back.setBounds(
                -left,//-r.width / 2, 
                -top,//-r.height / 2,
                r.width + left + (parseFloat(cs.paddingRight) || 0),
                r.height + top + (parseFloat(cs.paddingBottom) || 0),
                cs['rx']
            )
            // this._text.translate(left, top);
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
