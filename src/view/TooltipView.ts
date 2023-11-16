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
import { Series } from "../model/Series";
import { Tooltip } from "../model/Tooltip";
import { PALETTE_LEN } from "./SeriesView";

export enum TooltipPosition {
    TOP = 'top',
    BOTTOM = 'bottom',
    LEFT = 'left',
    RIGHT = 'right',
}

export class TooltipView extends RcElement {
 
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _top: PathElement;
    private _topHeight = 10;
    private _tail: PathElement;
    private _tailSize = 10;
    private _radius = 5;
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
        super(doc, 'rct-tooltip');

        this.add(this._back = new PathElement(doc, 'rct-tooltip-back'));
        this.add(this._top = new PathElement(doc, 'rct-tooltip-top'));
        this.add(this._tail = new PathElement(doc, 'rct-tooltip-tail'));
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
        const isInverted = model.series.chart.isInverted();

        this._series = series;

        // text
        this._richText.setFormat(model.text);
        this._richText.build(tv, NaN, NaN, point, this._textCallback);

        const r = tv.getBBounds();
        const w = Math.max(model.minWidth || 0, r.width + 8 * 2);
        const h = Math.max(model.minHeight || 0, r.height + 6 * 2);

        this._top.setData('index', (series.index % PALETTE_LEN) as any);

        const dur = this.getStyle('visibility') === 'visible' ? 300 : 0;

        if (isInverted) {
            this.draw(0, -this._topHeight / 2, w, h + this._topHeight, TooltipPosition.RIGHT);
            this.translateEx(x + model.offset, y - h / 2, dur, false);
        } else {
            this.draw(0, -this._topHeight, w, h + this._topHeight, TooltipPosition.TOP);
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

    private draw(x, y, w, h, position: string): void {
        const tail = this._tailSize;
        const radius = this._radius;
        const topHeight = this._topHeight;
        let backPath, topPath;
        switch (position) {
            case TooltipPosition.LEFT:
                x -= tail
                backPath = [
                    'M', x, y,
                    'L', x + w, y,
                    'L', x + w, y + (h / 2) - (tail / 2),
                    'L', x + w + tail, y + h / 2,
                    'L', x + w, y + (h / 2) + (tail / 2),
                    'L', x + w, y + h,
                    'L', x, y + h,
                    'Z'
                ];
                break;
            case TooltipPosition.RIGHT:
                x += tail
                backPath = [
                    'M', x, y,
                    'L', x + w, y,
                    'L', x + w, y + h,
                    'L', x, y + h,
                    'L', x, y + (h / 2) + (tail / 2),
                    'L', x - tail, y + (h / 2),
                    'L', x, y + (h / 2) - (tail / 2),
                    'Z'
                ];
                break;
            case TooltipPosition.BOTTOM:
                y += tail;
                backPath = [
                    'M', x, y,
                    'L', x + (w / 2) - (tail / 2), y,
                    'L', x + (w / 2), y - tail,
                    'L', x + (w / 2) + (tail / 2), y,
                    'L', x + w, y,
                    'L', x + w, y + h,
                    'L', x, y + h,
                    'Z'
                ];
                break;
            case TooltipPosition.TOP:
            default:
            y -= tail;
            backPath = [
                'M', x + radius, y,
                'l', w - (radius * 2), 0,
                'q', radius, 0, radius, radius,
                'l', 0, h - (radius * 2),
                'q', 0, radius, -radius, radius,
                'l', radius - (w / 2) + (tail / 2), 0,
                'l', -(tail / 2), tail,
                'l', -(tail / 2), - tail,
                'l', radius - (w / 2) + (tail / 2), 0,
                'q', -radius, 0, -radius, -radius,
                'l', 0, (radius * 2) - h,
                'q', 0, -radius, radius, -radius,
                'Z'
            ];
            topPath = [
                'M', x + radius, y,
                'l', w - (radius * 2), 0,
                'q', radius, 0, radius, radius,
                'l', 0, topHeight - radius,
                'l', -w, 0,
                'l', 0, radius - topHeight,
                'q', 0, -radius, radius, -radius,
                'Z'
            ]
        }
        // text
        const tv = this._textView;
        const r = tv.getBBounds();
        tv.translate(x + (w - r.width) / 2, y + (h - r.height + this._topHeight) / 2);
        // top
        // pb = new PathBuilder();
        // pb.rect(x + border / 2, y + border / 2, w - border, this._topHeight);
        // this._top.setPath(pb.end(true));
        
        this._top.setPath(topPath);
        this._back.setPath(backPath);
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