////////////////////////////////////////////////////////////////////////////////
// EqualizerSeriesView.ts
// 2023. 08. 01. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { PathElement } from "../../common/RcControl";
import { GroupElement } from "../../common/impl/GroupElement";
import { SvgShapes } from "../../common/impl/SvgShape";
import { DataPoint } from "../../model/DataPoint";
import { PointItemPosition } from "../../model/Series";
import { CategoryAxis } from "../../model/axis/CategoryAxis";
import { ContinuousAxis } from "../../model/axis/LinearAxis";
import { EqualizerSeries } from "../../model/series/EqualizerSeries";
import { PointLabelView, SeriesView } from "../SeriesView";
import { SeriesAnimation } from "../animation/SeriesAnimation";

class BarElement extends GroupElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _backs = new ElementPool<PathElement>(this, PathElement);
    private _segments = new ElementPool<PathElement>(this, PathElement);
    private _decimal = 0;

    point: DataPoint;
    wPoint: number;
    hPoint: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc);
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    prepareSegments(backs: boolean, total: number, count: number, decimal: number, backStyle: string): void {
        this._decimal = decimal;
        this._backs
            .prepare(backs ? total : 0)
            .forEach((v, i) => {
                v.setStyleName(backStyle);
            });
        this._segments
            .prepare(Math.round(count))
            .forEach((v, i) => {
                //v.className = stepStyle;
            });
    }

    layout(pts: number[], x: number, y: number, inverted: boolean): void {
        const w = this.wPoint;
        const h = this.hPoint;
        
        x -= w / 2;

        // back steps
        this._backs.forEach((step, i) => {
            step.setPath(SvgShapes.rectangle(0, y - pts[i * 2], w, Math.min(-1, pts[i * 2] - pts[i * 2 + 1])));
        })

        // steps
        this._segments.forEach((step, i, count) => {
            // Math.min(-1, ): 0에 가까운 값이면 svg가 line을 표시하지 않는다.(TODO: 다르 방법?)
            if (i === count - 1 && this._decimal > 0) {
                step.setPath(SvgShapes.rectangle(x, y - pts[i * 2], w, Math.min(-1, -this._decimal)));
            } else {
                step.setPath(SvgShapes.rectangle(x, y - pts[i * 2], w, Math.min(-1, pts[i * 2] - pts[i * 2 + 1])));
            }
        })
    }
}

type LabelInfo = {
    inverted: boolean,
    labelPos: PointItemPosition,
    labelOff: number,
    width: number,
    height: number,
    labelView: PointLabelView,
    bar: BarElement,
    x: number,
    y: number
};

export class EqualizerSeriesView extends SeriesView<EqualizerSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _bars: ElementPool<BarElement>;
    private _pts: number[];
    private _labelInfo: LabelInfo = {} as any;

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
    protected _prepareSeries(doc: Document, model: EqualizerSeries): void {
        this.$_parepareBars(this.model._visPoints);
    }

    protected _renderSeries(width: number, height: number): void {
        this.$_layoutBars(width, height);
    }

    protected _runShowEffect(firstTime: boolean): void {
        firstTime && SeriesAnimation.grow(this);
    }

    protected _doViewRateChanged(rate: number): void {
        this.$_layoutBars(this.width, this.height);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_parepareBars(points: DataPoint[]): void {
        this._bars.prepare(points.length, (v, i) => {
            const p = v.point = points[i];
            p.color && v.setStyle('fill', p.color);
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
            const v = bar.point.yValue / max;
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
        });
    }

    protected $_layoutBars(width: number, height: number): void {
        const series = this.model;
        const inverted = series.chart.isInverted();
        const vr = this._getViewRate();
        const labels = series.pointLabel;
        const labelViews = this._labelContainer;
        const xAxis = series._xAxisObj;
        const yAxis = series._yAxisObj;
        const wPad = xAxis instanceof CategoryAxis ? xAxis.categoryPad() * 2 : 0;
        const yLen = (inverted ? width : height) * vr;
        const xLen = inverted ? height : width;
        //const xBase = xAxis instanceof LinearAxis ? xAxis.getPosition(xLen, xAxis.xBase) : 0;
        const yBase = yAxis.getPosition(yLen, yAxis instanceof ContinuousAxis ? yAxis.baseValue : 0);
        const org = inverted ? 0 : height;;
        const labelInfo: LabelInfo = labels.visible && Object.assign(this._labelInfo, {
            inverted,
            labelPos: series.getLabelPosition(),
            labelOff: labels.offset,
            width, height
        });

        this.$_buildSegments(series, yLen);

        this._bars.forEach((bar, i) => {
            const p = bar.point;
            const wUnit = xAxis.getUnitLength(xLen, i) * (1 - wPad);
            const wPoint = series.getPointWidth(wUnit);
            const yVal = yAxis.getPosition(yLen, p.yValue);
            let x: number;
            let y: number;

            if (inverted) {
                y = xLen - xAxis.getPosition(xLen, i) - wUnit / 2;
                x = org;
            } else {
                x = xAxis.getPosition(xLen, i) - wUnit / 2;
                y = org;
            }

            bar.wPoint = wPoint;
            bar.hPoint = yVal - yBase;

            if (inverted) {
                y += series.getPointPos(wUnit) + wPoint / 2;
            } else {
                x += series.getPointPos(wUnit) + wPoint / 2;
            }

            bar.layout(this._pts, x, y, inverted);

            // label
            if (labelInfo && (labelInfo.labelView = labelViews.get(p, 0))) {
                labelInfo.bar = bar;
                labelInfo.x = x;
                labelInfo.y = y;
                this.$_layoutLabel(labelInfo);
            }
        })
    }

    private $_layoutLabel(info: LabelInfo): void {
        const r = info.labelView.getBBounds();
        let inner = true;
        let {inverted, x, y, bar, labelOff} = info;

        if (inverted) {
            y -= r.height / 2;
        } else {
            x -= r.width / 2;
        }

        switch (info.labelPos) {
            case PointItemPosition.INSIDE:
                if (info.inverted) {
                    x += bar.hPoint / 2 + labelOff;
                } else {
                    y -= (bar.hPoint + r.height) / 2 + labelOff;
                }
                break;

            case PointItemPosition.HEAD:
                if (info.inverted) {
                    x += bar.hPoint - r.width - labelOff;
                } else {
                    y -= bar.hPoint - labelOff;
                }
                break;

            case PointItemPosition.FOOT:
                break;

            case PointItemPosition.OUTSIDE:
            default:
                if (info.inverted) {
                    x += bar.hPoint + labelOff;
                } else {
                    y -= bar.hPoint + r.height + labelOff;
                }
                inner = false;
                break;
        }

        info.labelView.setContrast(inner && info.bar.dom);
        info.labelView.layout().translate(x, y);
    }
}