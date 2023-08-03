////////////////////////////////////////////////////////////////////////////////
// HitstogramSeries.ts
// 2023. 08. 03. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { DataPoint } from "../DataPoint";
import { ISeries, Series } from "../Series";
import { LineSeriesBase, LineType } from "./LineSeries";

export class ParetoSeriesPoint extends DataPoint {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    parse(series: ISeries): void {
        super.parse(series);
    }
}

/**
 * 참조하는 원본 시리즈의 누적 비율을 표시한다.
 * <br>
 */
export class ParetoSeries extends LineSeriesBase {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    source: string | number;
    lineType = LineType.DEFAULT;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    type(): string {
        return 'pareto';
    }

    getLineType(): LineType {
        return this.lineType;
    }

    protected _createPoint(source: any): DataPoint {
        return new ParetoSeriesPoint(source);
    }

    _referOtherSeries(series: Series): boolean {
        if (series.name === this.source || series.index === this.source) {
            const src = this.$_loadPoints(series.getPoints().getPoints());
            this._doLoadPoints(src);
            return true;
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_loadPoints(pts: DataPoint[]): any[] {
        const list = [];
        const sum = pts.reduce((a, c) => a + c.yValue, 0);
        let acc = 0;

        pts.forEach(p => {
            const v = p.yValue * 100 / sum;

            list.push({
                x: p.x, 
                y: acc += v
            });
        })
        return list;
    }
}