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

class BarElement extends GroupElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _backs = new ElementPool<PathElement>(this, PathElement);
    private _segments = new ElementPool<PathElement>(this, PathElement);
    private _decimal = 0;

    point: DataPoint;

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

    layout(pts: number[], inverted: boolean): void {
        const y = 0;//this.point.yPos;
        const w = this.width;
        const h = this.height;

        // back steps
        this._backs.forEach((step, i) => {
            step.setPath(SvgShapes.rectangle(0, pts[i * 2 + 1] - y, w, pts[i * 2] - pts[i * 2 + 1]));
        })

        // steps
        this._segments.forEach((step, i, count) => {
            if (i === count - 1 && this._decimal > 0) {
                step.setPath(SvgShapes.rectangle(0, pts[i * 2] - y - this._decimal, w, this._decimal));
            } else {
                step.setPath(SvgShapes.rectangle(0, pts[i * 2 + 1] - y, w, pts[i * 2] - pts[i * 2 + 1]));
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

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_parepareBars(points: DataPoint[]): void {
        this._bars.prepare(points.length, (v, i) => {
            const p = v.point = points[i];
            p.color && v.setStyle('fill', p.color);
        })
    }

    private $_parepareSegments(series: EqualizerSeries, width: number, height: number): void {
        const backs = series.backSegments;
        const max = series._yAxisObj.axisMax();
        const segmented = series.segmented;
        const gap = series.segmentGap;
        let sz: number;
        let cnt: number;
        const pts = this._pts = [];
        let y = height;

        if (series.maxCount > 0) {
            cnt = series.maxCount;
        } else {
            cnt = Math.round(height / (series.getSegmentSize(height) + gap / 2));
        }
        sz = (height - gap * (cnt - 1)) / cnt;

        while (pts.length < cnt * 2) {
            pts.push(y, y - sz);
            y -= sz + gap;
        }
        pts[pts.length - 1] = 0;

        this._bars.forEach((bar, i) => {
            const total = pts.length / 2;
            const v = 1 - bar.point.yValue / max;
            let n = -1;
            let decimal = 0;

            for (let i = 0; i < total - 1; i++) {
                if (v <= pts[i * 2] / height && v > pts[(i + 1) * 2] / height) {
                    n = i + 1;
                    if (!segmented && v > pts[i * 2 + 1] / height) {
                        decimal = pts[i * 2] - v * height;
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
        const labels = series.pointLabel;
        const labelViews = this._labelContainer;
        const xAxis = series._xAxisObj;
        const yAxis = series._yAxisObj;
        const wPad = xAxis instanceof CategoryAxis ? xAxis.categoryPadding * 2 : 0;
        const yLen = inverted ? width : height;
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

        this.$_parepareSegments(series, width, height);

        this._bars.forEach((bar, i) => {
            const p = bar.point;
            const wUnit = xAxis.getUnitLength(xLen, i) * (1 - wPad);
            const wPoint = series.getPointWidth(wUnit);
            const yVal = yAxis.getPosition(yLen, p.yValue);
            let labelView: PointLabelView;
            let x: number;
            let y: number;

            if (inverted) {
                y = xLen - xAxis.getPosition(xLen, i) - wUnit / 2;
                x = org;
            } else {
                x = xAxis.getPosition(xLen, i) - wUnit / 2;
                y = org;
            }

            // bar.wPoint = wPoint;
            // bar.hPoint = yVal - yBase;

            if (inverted) {
                y += series.getPointPos(wUnit);// + wPoint / 2;
                x += yAxis.getPosition(yLen, p.yGroup) - bar.height;
            } else {
                x += series.getPointPos(wUnit);// + wPoint / 2;
                y -= yAxis.getPosition(yLen, p.yGroup) - bar.height;
            }

            bar.setBounds(x, y, wPoint, yVal - yBase);
            bar.layout(this._pts, inverted);

            if (inverted) {
                y += wPoint / 2;
            } else {
                x += wPoint / 2;
            }

            // label
            if (labelInfo && (labelView = labelViews.get(p, 0))) {
                labelInfo.labelView = labelView;
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
                    x += bar.height / 2 + labelOff;
                } else {
                    y -= (bar.height + r.height) / 2 + labelOff;
                }
                break;

            case PointItemPosition.HEAD:
                if (info.inverted) {
                    x += bar.height - r.width - labelOff;
                } else {
                    y -= bar.height - labelOff;
                }
                break;

            case PointItemPosition.FOOT:
                break;

            case PointItemPosition.OUTSIDE:
            default:
                if (info.inverted) {
                    x += bar.height + labelOff;
                } else {
                    y -= bar.height + r.height + labelOff;
                }
                inner = false;
                break;
        }

        info.labelView.setContrast(inner && info.bar.dom);
        info.labelView.layout().translate(x, y);
    }
}