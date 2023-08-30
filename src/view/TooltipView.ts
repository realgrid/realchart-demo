////////////////////////////////////////////////////////////////////////////////
// ChartElement.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { PathBuilder } from "../common/PathBuilder";
import { createAnimation } from "../common/RcAnimation";
import { PathElement, RcControl, RcElement } from "../common/RcControl";
import { SvgRichText } from "../common/RichText";
import { TextAnchor, TextElement } from "../common/impl/TextElement";
import { DataPoint } from "../model/DataPoint";
import { Tooltip } from "../model/Tooltip";

export class TooltipView extends RcElement {
 
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _back: PathElement;
    private _textView: TextElement;
    private _richText: SvgRichText;

    private _model: Tooltip;
    private _textCallback = (point: DataPoint, param: string): string => {
        return this._model.getValue(point, param);
    }
    private _hideTimer: any;
    private _hideHandler = () => {
        this.$_hide();
        this._hideTimer = void 0;
    }

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-tooltip');

        this.add(this._back = new PathElement(doc, 'rct-tooltip-back'));
        this.add(this._textView = new TextElement(doc, 'rct-tooltip-text'));

        this._back.setAttr('filter', 'url(#' + RcControl.SHADOW_FILTER + ')');
        this._textView.anchor = TextAnchor.START;

        this._richText = new SvgRichText();
        this._richText.lineHeight = 1.2;

        this.hide(true, false);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    show(model: Tooltip, point: DataPoint, x: number, y: number, animate: boolean): void {
        this._model = model;

        // text
        const tv = this._textView;
        
        this._richText.format = model.text;
        this._richText.build(this._textView, point, this._textCallback);

        // background
        const r = this._textView.getBBounds();
        const w = Math.max(model.minWidth || 0, r.width + 8 * 2);
        const h = Math.max(model.minHeight || 0, r.height + 6 * 2);
        const pb = new PathBuilder();

        pb.rect(0, 0, w , h);
        this._back.setPath(pb.end(true));

        this._textView.translate((w - r.width) / 2, (h - r.height) / 2);

        // view
        const tx = this.tx;
        const ty = this.ty;

        if (model.series.chart.isInverted()) {
            this.translate(x + model.offset, y - h / 2);
        } else {
            this.translate(x - w / 2, y - h - model.offset);
        }

        if (this._hideTimer) {
            clearTimeout(this._hideTimer);
            this._hideTimer = void 0;
        }
        if (this.getStyle('visibility') === 'visible') {
            this.dom.animate([
                { transform: `translate(${tx}px,${ty}px)` },
                { transform: `translate(${this.tx}px,${this.ty}px)` }
            ], {
                duration: 300,
                fill: 'none'
            });
        } else {
            this.setStyle('visibility', 'visible');
        }
    }

    hide(force: boolean, animate: boolean): void {
        if (force) {
            if (this._hideTimer) {
                clearTimeout(this._hideTimer);
                this._hideTimer = void 0;
            }
            this.$_hide();
        } else if (!this._hideTimer) {
            this._hideTimer = setTimeout(this._hideHandler, this._model ? this._model.hideDelay : Tooltip.HIDE_DELAY)
        }
    }

    //-------------------------------------------------------------------------
    // overrien members
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // internal methods
    //-------------------------------------------------------------------------
    private $_hide(): void {
        createAnimation(this.dom, 'opacity', 0, 200, () => {
            this.setStyle('visibility', 'hidden');
        })
    }

    // M402.5,134.5
    // A1,1,0,0,1,401.5,133.5
    // L401.5,85.5
    // A1,1,0,0,1,402.5,84.5
    // L513.5,84.5
    // A1,1,0,0,1,514.5,85.5
    // L514.5,133.5
    // A1,1,0,0,1,513.5,134.5
    // L471.5,134.5
    // L443.5,148.5
    // L457.5,134.5
    // Z
}