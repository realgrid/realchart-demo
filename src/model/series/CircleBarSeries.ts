////////////////////////////////////////////////////////////////////////////////
// CircleBarSeries.ts
// 2023. 11. 23. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { IClusterable, PointItemPosition, Series } from "../Series";
import { BarSeriesBase, BarSeriesGroupBase } from "./BarSeries";

/**
 * @config chart.series[type=circlebar]
 */
export class CircleBarSeries extends BarSeriesBase {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructor
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
    _type(): string {
        return 'circlebar';
    }

    protected _initProps(): void {
        super._initProps();

        this.pointLabel.position = PointItemPosition.INSIDE;
    }
}

/**
 * @config chart.series[type=circlebargroup]
 */
export class CircleBarSeriesGroup extends BarSeriesGroupBase<CircleBarSeries> implements IClusterable {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'circlebargroup';
    }

    _seriesType(): string {
        return 'circlebar';
    }

    protected _canContain(ser: Series): boolean {
        return ser instanceof CircleBarSeries;
    }
}
