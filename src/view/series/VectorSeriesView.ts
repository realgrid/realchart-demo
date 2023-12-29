////////////////////////////////////////////////////////////////////////////////
// VectorSeriesView.ts
// 2023. 08. 02. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { PathElement, RcElement } from "../../common/RcControl";
import { ArrowHead, VectorSeries, VectorSeriesPoint } from "../../model/series/VectorSeries";
import { IPointView, PointElement, SeriesView } from "../SeriesView";
import { SeriesAnimation } from "../animation/SeriesAnimation";

class ArrowView extends PointElement implements IPointView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: VectorSeriesPoint;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    layout(headType: ArrowHead, rotation: number, inverted: boolean): void {
        const len = this.point._len;
        const off = this.point._off;
        const body = 1 / 2;
        let pts: any[];

        switch (headType) {
            case ArrowHead.NONE:
                pts = [
                    0, -body * len,
                    0, body * len
                ];
                break;
            case ArrowHead.OPEN:
                const w2 = 1.5 / 10;
                const h2 = 4.5 / 10;
                const h3 = 2 / 10;
                pts = [
                    0, -h2 * len,
                    -w2 * len, -h3 * len,
                    0, -body * len,
                    w2 * len, -h3 * len,
                    0, -h2 * len,
                    0, body * len
                ];
                break;
            default:
                const w = 1 / 10;
                const h = 3 / 10;
                pts = [
                    0, -h * len,
                    -w * len, -h * len,
                    0, -body * len,
                    w * len, -h * len,
                    0, -h * len,
                    0, body * len
                ];
                break;
        }

        const path = ['M', pts[0], pts[1] + off];
        for (let i = 2; i < pts.length; i += 2) {
            path.push('L', pts[i], pts[i + 1] + off);
        }

        this.rotation = rotation; // 0시 방향이 0도.
        this.setPath(path);
    }
}

export class VectorSeriesView extends SeriesView<VectorSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _arrows: ElementPool<ArrowView>;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-vector-series')

        this._arrows = new ElementPool(this._pointContainer, ArrowView);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _getPointPool(): ElementPool<RcElement> {
        return this._arrows;
    }

    protected _prepareSeries(doc: Document, model: VectorSeries): void {
        // const pts = model.getPoints().getPoints() as VectorSeriesPoint[];

        this.$_prepareArrows(model, this._visPoints as VectorSeriesPoint[]);
    }

    protected _renderSeries(width: number, height: number): void {
        const series = this.model;
        const start = series.startAngle;
        const head = series.arrowHead;
        const xAxis = series._xAxisObj;
        const yAxis = series._yAxisObj;
        const inverted = this._inverted;
        const yLen = inverted ? width : height;
        const xLen = inverted ? height : width;
        const gr = this._getGrowRate();
        const org = inverted ? 0 : height;

        this._pointContainer.invert(inverted, height);

        this._arrows.forEach(v => {
            const p = v.point;

            if (v.setVis(!p.isNull)) {
                const wUnit = xAxis.getUnitLen(xLen, p.xValue) * gr;
                const hUnit = yAxis.getUnitLen(yLen, p.yValue) * gr;
                let x = xAxis.getPos(xLen, p.xValue) - wUnit / 2;
                let y = org - yAxis.getPos(yLen, p.yValue) - hUnit / 2;
                p.xPos = inverted ? org + yAxis.getPos(yLen, p.yValue) : x + (wUnit / 2);
                p.yPos = inverted ? xLen - xAxis.getPos(xLen, p.xValue) + (wUnit / 2): y + (hUnit / 2);
    
                v.trans(x, y);
                v.layout(head, p.angleValue + start, false);
            };
        });
    }

    protected _runShowEffect(firstTime: boolean): void {
        firstTime && SeriesAnimation.fadeIn(this);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_prepareArrows(model: VectorSeries, pts: VectorSeriesPoint[]): void {
        this._arrows.prepare(pts.length, (v, i) => {
            const p = v.point = pts[i];

            this._setPointStyle(v, model, p);
        });
    }
}