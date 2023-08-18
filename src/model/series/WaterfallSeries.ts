////////////////////////////////////////////////////////////////////////////////
// WaterfallSeries.ts
// 2023. 07. 29. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { IAxis } from "../Axis";
import { IChart } from "../Chart";
import { DataPoint } from "../DataPoint";
import { ClusterableSeries } from "../Series";

export class WaterfallSeriesPoint extends DataPoint {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _isSum: boolean;
    _intermediate: boolean;
    save: number;
    low = 0;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    parse(series: WaterfallSeries): void {
        super.parse(series);

        this._isSum = this.source.isSum === true;
        this._intermediate = this.source.intermediate;
        // series에서 this.y를 변경하므로 원본을 저장하고 나중에 복원한다.
        this.save = this.y;
    }
}

export class WaterfallSeries extends ClusterableSeries {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart, name?: string) {
        super(chart, name);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    type(): string {
        return 'waterfall';
    }

    canCategorized(): boolean {
        return true;
    }

    protected _createPoint(source: any): DataPoint {
        return new WaterfallSeriesPoint(source);
    }

    collectValues(axis: IAxis): number[] {
        const vals = super.collectValues(axis);

        if (axis === this._yAxisObj) {
            this._visPoints.forEach((p: WaterfallSeriesPoint) => p.y = p.save);
        }
        return vals;
    }

    protected _doPrepareRender(): void {
        super._doPrepareRender();

        const pts = this._visPoints as WaterfallSeriesPoint[];
        if (pts.length < 1) return;

        let p = pts[0];
        let yPrev = p.y = p._isSum ? 0 : p.y;
        let prev = yPrev;
        let total = yPrev;  // 전체 total
        let sum = yPrev;    // 중간 total
        let v: number;
        let y: number;
        let low: number;

        for (let i = 1, cnt = pts.length; i < cnt; i++) {
            p = pts[i];

            if (p._isSum) {
                const pPrev = pts[i - 1];
                const inter = p._intermediate === true || i < cnt - 1 && p._intermediate !== false;
                const v = p.save = p.y = inter ? sum : total;

                if (inter) {
                    if (sum < 0) {
                        low = pPrev.low;
                        y = low - v;
                    } else {
                        y = pPrev.y;
                        low = y - v;
                    }
                } else {
                    low = pts[0].low;
                    y = low + v;
                }
                sum = 0;
                
            } else {
                v = p.y;

                if (v < 0) {
                    if (prev < 0) {
                        y = yPrev + prev;
                        low = y + v;
                    } else {
                        y = yPrev;
                        low = y + v;
                    }
                } else {
                    if (prev < 0) {
                        low = yPrev;
                        y = low + v;
                    } else {
                        low = yPrev;
                        y = low + v;
                    }
                }

                sum += v;
                total += v;
            }

            prev = p.y;
            p.y = yPrev = y;
            p.low = low;
        }
    }
}