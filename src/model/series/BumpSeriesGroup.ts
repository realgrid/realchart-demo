////////////////////////////////////////////////////////////////////////////////
// BumpSeriesGroup.ts
// 2023. 07. 31. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { Utils } from "../../common/Utils";
import { IAxis } from "../Axis";
import { DataPoint } from "../DataPoint";
import { ConstraintSeriesGroup, Series, SeriesGroup } from "../Series";
import { LineSeries } from "./LineSeries";

/**
 * 포함된 시리즈들의 y값들을 비교해서 순위로 시리즈를 표시한다.
 * <br>
 * 포함된 시리즈들의 x값이 동일한 data point y값들을 비교해서 순위를 yValue로 재설정한다.
 */
export class BumpSeriesGroup extends ConstraintSeriesGroup<LineSeries> {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    type(): string {
        return 'bump';
    }

    protected _seriesType(): string {
        return 'line';
    }

    protected _canContain(ser: Series): boolean {
        return ser instanceof LineSeries;
    }

    protected _doConstraintYValues(series: Series[]): number[] {
        const map: {[key: number]: DataPoint[]} = {};

        series.forEach(ser => {
            ser._visPoints.forEach(p => {
                const x = p.xValue;
                let pts = map[x];

                if (pts) {
                    pts.push(p);
                } else {
                    map[x] = [p];
                }
            });
        });

        for (const x in map) {
            const pts = map[x].sort((p1, p2) => p1.yValue - p2.yValue);

            for (let i = pts.length - 1; i >= 0; i--) {
                pts[i].yValue = pts[i].yGroup = i;
            }
        }
        return Utils.makeIntArray(0, series.length);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}