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
import { Align } from "../common/Types";
import { TextAnchor, TextElement } from "../common/impl/TextElement";
import { DataPoint } from "../model/DataPoint";
import { Series } from "../model/Series";
import { Tooltip } from "../model/Tooltip";

export class TooltipView extends RcElement {
    
    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly CLASS_NAME = 'rct-tooltip';

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _back: PathElement;
    private _textView: TextElement;
    private _richText: SvgRichText;

    private _model: Tooltip;
    private _series: Series;
    private _textCallback = (point: DataPoint, param: string, format: string): string => {
        return this._model.getValue(this._series, point, param, format);
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
        super(doc, TooltipView.CLASS_NAME);

        this.add(this._back = new PathElement(doc, 'rct-tooltip-back'));
        this.add(this._textView = new TextElement(doc, 'rct-tooltip-text'));

        this._back.setAttr('filter', 'url(#' + RcControl.SHADOW_FILTER + ')');
        this._textView.anchor = TextAnchor.START;

        this._richText = new SvgRichText();

        this.close(true, false);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    show(series: Series, point: DataPoint, x: number, y: number, animate: boolean): void {
        const model = this._model = series.tooltip;
        const tv = this._textView;

        this._series = series;

        // text
        this._richText.setFormat(model.text);
        this._richText.build(tv, NaN, NaN, point, this._textCallback);

        // background
        const r = tv.getBBounds();
        const w = Math.max(model.minWidth || 0, r.width + 8 * 2);
        const h = Math.max(model.minHeight || 0, r.height + 6 * 2);
        const pb = new PathBuilder();

        pb.rect(0, 0, w , h);
        this._back.setPath(pb.end(true));

        tv.translate((w - r.width) / 2, (h - r.height) / 2);

        // view
        const dur = this.getStyle('visibility') === 'visible' ? 300 : 0;

        if (model.series.chart.isInverted()) {
            this.translateEx(x + model.offset, y - h / 2, dur, false);
        } else {
            this.translateEx(x - w / 2, y - h - model.offset, dur, false);
        }
        if (dur === 0) {
            this.setStyle('visibility', 'visible');
        }

        if (this._hideTimer) {
            clearTimeout(this._hideTimer);
            this._hideTimer = void 0;
        }
    }

    close(force: boolean, animate: boolean): void {
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
        createAnimation(this.dom, 'opacity', void 0, 0, 200, () => {
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