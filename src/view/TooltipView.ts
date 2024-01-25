////////////////////////////////////////////////////////////////////////////////
// ChartElement.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { maxv, minv } from "../common/Common";
import { createAnimation } from "../common/RcAnimation";
import { PathElement, RcControl, RcElement } from "../common/RcControl";
import { SvgRichText } from "../common/RichText";
import { TextAnchor, TextElement } from "../common/impl/TextElement";
import { DataPoint } from "../model/DataPoint";
import { Series, WidgetSeriesPoint } from "../model/Series";
import { Tooltip } from "../model/Tooltip";
import { PieSeries } from "../model/series/PieSeries";
import { BodyView } from "./BodyView";
import { PointElement } from "./SeriesView";

export enum TooltipPosition {
    TOP = 'top',
    BOTTOM = 'bottom',
    LEFT = 'left',
    RIGHT = 'right',
}

export class TooltipView extends RcElement {
    
    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly CLASS_NAME = 'rct-tooltip';

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _top: PathElement;
    private _topHeight = 7;
    private _tailSize = 10;
    private _radius = 5;
    private _back: PathElement;
    private _textView: TextElement;
    private _richText: SvgRichText;

    private _model: Tooltip;
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
        this.add(this._top = new PathElement(doc, 'rct-tooltip-top'));
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
    show(series: Series, point: DataPoint, x: number, y: number, body: BodyView, animate: boolean): void {
        const model = this._model = series.chart.tooltip;
        const ctx = model.setTarget(series, point);
        const control = this.control;

        if (!ctx) return;

        const cw = control.contentWidth();
        const ch = control.contentHeight();
        const tv = this._textView;
        const inverted = series.chart.isInverted();
        let reversed = series._yAxisObj.reversed;

        // text
        this._richText.setFormat(model.text || ctx.getTooltipText(series, point));
        this._richText.build(tv, NaN, NaN, null, model.getTextDomain());

        const r = tv.getBBox();
        let w = maxv(model.minWidth || 0, r.width + 8 * 2);
        let h = maxv(model.minHeight || 0, r.height + 6 * 2) + this._topHeight;

        // 시리즈 색은 동적일 수 있다.
        //this._top.setData('index', (series.index % PALETTE_LEN) as any);
        // TODO: point별로 색상이 다를 수 있다.
        if (series instanceof PieSeries && series.legendByPoint) {
            this._top.setFill((point as WidgetSeriesPoint)._calcedColor);
        } else {
            this._top.setFill(series._calcedColor);   
        };

        const dur = this.getStyle('visibility') === 'visible' ? 300 : 0;
        let translate: number;
        const gap = model.offset + this._tailSize;

        const focus = body.getFocusPointView() as PointElement;
        const fb = focus.getBounds();
        const cb = control.getBounds();
        if (inverted) {
            translate = (y - h / 2) - maxv(0, minv(y - h / 2, ch - h));
            // data point 범위를 벗어났을 경우 반대로 그려준다. issue #456
            let overed = fb.x - cb.x - gap > cw - w;
            if (overed) reversed = !reversed;
            const position = reversed ? TooltipPosition.LEFT : TooltipPosition.RIGHT;
            this.drawTooltip(0, 0, w, h, position, translate);
            reversed ? x -= w + gap : x += gap;
            y -= h / 2;
        } else {
            translate = (x - w / 2) - maxv(0, minv(x - w / 2, cw - w));
            // data point 범위를 벗어났을 경우 반대로 그려준다. issue #456
            let overed = cb.bottom - fb.bottom + gap > ch - h;
            if (overed) reversed = !reversed;
            const position = reversed ? TooltipPosition.BOTTOM : TooltipPosition.TOP;
            this.drawTooltip(0, 0, w, h, position, translate);
            x -= w / 2;
            reversed ? y += gap : y -= h + gap;
        }

        x = maxv(0, minv(x, cw - w));
        y = maxv(0, minv(y, ch - h));
        this.transEx(x, y, dur, false);

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
        });
    }
  
    private drawTooltip(x: number, y: number, w: number, h: number, position: TooltipPosition, translate: number): void {
        const tail = this._tailSize;
        const rd = this._radius;
        const topHeight = this._topHeight;

        let backPath = [
            'M', x + rd, y,
            'L', x + w - rd, y,
            'Q', x + w, y, x + w, y + rd,
            'L', x + w, y + h - rd,
            'Q', x + w, y + h, x + w - rd, y + h,
            'L', x + rd, y + h,
            'Q', x, y + h, x, y + h - rd,
            'L', x, y + rd,
            'Q', x, y, x + rd, y
        ];

        switch (position) {
            case TooltipPosition.TOP:
                backPath = backPath.concat([
                    'M', x + (w / 2) - (tail / 2) + translate, y + h,
                    'L', x + (w / 2) + translate, y + h + tail,
                    'L', x + (w / 2) + (tail / 2) + translate, y + h
                ]);
                break;
            case TooltipPosition.BOTTOM:
                backPath = backPath.concat([
                    'M', x + (w / 2) - (tail / 2) + translate, y,
                    'L', x + (w / 2) + translate, y - tail,
                    'L', x + (w / 2) + (tail / 2) + translate, y
                ]);
                break;
            case TooltipPosition.LEFT:
                backPath = backPath.concat([
                    'M', x + w, y + (h / 2) - (tail / 2) + translate,
                    'L', x + w + tail, y + (h / 2) + translate,
                    'L', x + w, y + (h / 2) + (tail / 2) + translate
                ]);
                break;
            case TooltipPosition.RIGHT:
                backPath = backPath.concat([
                    'M', x, y + (h / 2) - (tail / 2) + translate,
                    'L', x - tail, y + (h / 2) + translate,
                    'L', x, y + (h / 2) + (tail / 2) + translate
                ]);
                break;
        }
        
        const isBottom = position === TooltipPosition.BOTTOM;
        const topPath = isBottom ? [
            'M', x , y + h - topHeight,
            'l', w, 0,
            'l', 0, topHeight - rd,
            'q', 0, rd, -rd, rd,
            'l', (rd * 2) - w, 0,
            'q', -rd, 0, -rd, -rd,
        ] : [
            'M', x + rd, y,
            'l', w - (rd * 2), 0,
            'q', rd, 0, rd, rd,
            'l', 0, topHeight - rd,
            'l', -w, 0,
            'l', 0, rd - topHeight,
            'q', 0, -rd, rd, -rd,
        ];

        const tv = this._textView;
        const r = tv.getBBox();

        x += (w - r.width) / 2;
        y += (h - r.height + (isBottom ? -topHeight : topHeight)) / 2;
        tv.trans(x, y);
        this._top.setPath(topPath);
        this._back.setPath(backPath);
    }

    // M402.5,134.5
    // A1,1,0,0,1,401.5,133.5
    // L401.5,85.5s
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