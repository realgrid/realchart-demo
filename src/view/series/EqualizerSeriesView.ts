////////////////////////////////////////////////////////////////////////////////
// EqualizerSeriesView.ts
// 2023. 08. 01. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { PathElement, RcElement } from "../../common/RcControl";
import { GroupElement } from "../../common/impl/GroupElement";
import { SvgShapes } from "../../common/impl/SvgShape";
import { DataPoint } from "../../model/DataPoint";
import { EqualizerSeries } from "../../model/series/EqualizerSeries";
import { BoxedSeriesView, IPointView, SeriesView } from "../SeriesView";

class BarElement extends GroupElement implements IPointView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: DataPoint;

    private _backs = new ElementPool<PathElement>(this, PathElement);
    private _segments = new ElementPool<PathElement>(this, PathElement);
    private _decimal = 0;

    wPoint: number;
    hPoint: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, SeriesView.POINT_CLASS);
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    prepareSegments(backs: boolean, total: number, count: number, decimal: number, backStyle: string): void {
        this._decimal = decimal;
        this._backs
            .prepare(backs ? total : 0)
            .forEach((v, i) => {
                v.setClass(backStyle);
            });
        this._segments
            .prepare(Math.round(count))
            .forEach((v, i) => {
                //v.className = stepStyle;
            });
    }

    layout(pts: number[], x: number, y: number): void {
        const w = this.wPoint;
        const h = this.hPoint;
        const m = h < 0 ? Math.max : Math.min;
        
        x -= w / 2;
        if (h < 0) {
            pts = pts.map(p => -p);
        }

        // back steps
        this._backs.forEach((step, i) => {
            step.setPath(SvgShapes.rectangle(0, y - pts[i * 2], w, m(-1, (pts[i * 2] - pts[i * 2 + 1]))));
        })

        // steps
        this._segments.forEach((step, i, count) => {
            // Math.min(-1, ): 0에 가까운 값이면 svg가 line을 표시하지 않는다.(TODO: 다르 방법?)
            if (i === count - 1 && this._decimal > 0) {
                step.setPath(SvgShapes.rectangle(x, y - pts[i * 2], w, h < 0 ? m(1, this._decimal) : m(-1, -this._decimal)));
            } else {
                step.setPath(SvgShapes.rectangle(x, y - pts[i * 2], w, m(-1, (pts[i * 2] - pts[i * 2 + 1]))));
            }
        })
    }
}

export class EqualizerSeriesView extends BoxedSeriesView<EqualizerSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _bars: ElementPool<BarElement>;
    private _pts: number[];

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-equalizer-series')

        this._bars = new ElementPool(this._pointContainer, BarElement);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _getPointPool(): ElementPool<RcElement> {
        return this._bars;
    }

    protected _preparePointViews(doc: Document, model: EqualizerSeries, points: DataPoint[]): void {
        this.$_parepareBars(points);
    }        

    protected _layoutPointViews(width: number, height: number): void {
        const len = (this._inverted ? width : height) * this._getViewRate();

        this.$_buildSegments(this.model, len);

        super._layoutPointViews(width, height);
    }

    protected _layoutPointView(view: BarElement, i: number, x: number, y: number, wPoint: number, hPoint: number): void {
        view.wPoint = wPoint;
        view.hPoint = hPoint;
        view.layout(this._pts, x, y);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_parepareBars(points: DataPoint[]): void {
        this._bars.prepare(points.length, (v, i) => {
            const p = v.point = points[i];

            this._setPointStyle(v, p);
        })
    }

    private $_buildSegments(series: EqualizerSeries, len: number): void {
        const backs = series.backSegments;
        const max = series._yAxisObj.axisMax();
        const segmented = series.segmented;
        const gap = series.segmentGap || 0;
        const pts = this._pts = [];
        let y = 0;
        let sz: number;
        let cnt: number;

        if (series.maxCount > 0) {
            cnt = series.maxCount;
        } else {
            cnt = Math.round(len / (series.getSegmentSize(len) + gap / 2));
        }
        sz = (len - gap * (cnt - 1)) / cnt;

        while (pts.length < cnt * 2) {
            pts.push(y, y + sz);
            y += sz + gap;
        }
        pts[pts.length - 1] = len;

        const total = pts.length / 2;

        this._bars.forEach(bar => {
            const p = bar.point;

            if (bar.setVisible(!p.isNull)) {
                const v = p.yValue / max;
                let n = -1;
                let decimal = 0;
    
                for (let i = 0; i < total - 1; i++) {
                    if (v >= pts[i * 2] / len && v < pts[(i + 1) * 2] / len) {
                        n = i + 1;
                        if (!segmented && v < pts[i * 2 + 1] / len) {
                            decimal = v * len - pts[i * 2];
                        } else {
                            decimal = sz;
                        }
                        break;
                    }
                }
                if (n < 0) {
                    n = total;
                    decimal = sz;
                }
                // bar.getStyle = model.getPointStyle(i);
                bar.prepareSegments(backs, total, n, decimal, series.backStyle as string);
            }
        });
    }
}