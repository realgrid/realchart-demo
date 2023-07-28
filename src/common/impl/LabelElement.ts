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
    private _outline: TextElement;
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

            this._outline.setStyleOrClass(model.style);
            const color = Color.getContrast(getComputedStyle(this._text.dom).fill)
            this._outline.setStyles({
                fill: color,
                stroke: color,
                strokeWidth: '2px'
            });

        } else {
            this._back?.remove();
            this._outline?.remove();
        }

        return this;
    }

    setContrast(target: Element): LabelElement {
        if (this._model.effect === ChartTextEffect.CONTRAST) {
            this._text.setContrast(target, this._model.darkStyle || 'rct-label-dark', this._model.brightStyle || 'rct-label-bright');
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