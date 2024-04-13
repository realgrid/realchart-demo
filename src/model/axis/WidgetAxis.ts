////////////////////////////////////////////////////////////////////////////////
// WidgetAxis.ts
// 2024. 04. 13. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023-2024 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { Axis, AxisGrid, AxisLabel, AxisTick, IAxisTick } from "../Axis";
import { IChart } from "../Chart";

/**
 * 축이 필요없는 시리즈들(pie, treemap, funnel)을 위한 축. #634
 */
export class WidgetAxis extends Axis {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart, isX: boolean) {
        super(chart, isX);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string { return 'widget'; }
    override continuous(): boolean { return false; }
    override valueAt(length: number, pos: number): number { return; }
    protected override _createTickModel(): AxisTick { return; }
    protected override _createLabel(): AxisLabel { return; }
    protected override _doPrepareRender(): void {}
    protected override _doBuildTicks(min: number, max: number, length: number): IAxisTick[] { return; }
    override getPos(length: number, value: number): number { return; }
    override getUnitLen(length: number, value: number): number { return; }
    override xValueAt(pos: number): number { return; }
    protected override _createGrid(): AxisGrid { return; }
}