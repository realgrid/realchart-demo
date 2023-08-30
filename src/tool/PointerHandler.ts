////////////////////////////////////////////////////////////////////////////////
// PointerHandler.ts
// 2023. 08. 12. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { IPointerHandler } from "../common/RcControl";
import { ChartControl } from "../main";

const DRAG_THRESHOLD = 3;

export class ChartPointerHandler implements IPointerHandler {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _chart: ChartControl;

    //-------------------------------------------------------------------------
    // constructors
    //-------------------------------------------------------------------------
    constructor(chart: ChartControl) {
        this._chart = chart;
    }

    //-------------------------------------------------------------------------
    // IPointerHandler
    //-------------------------------------------------------------------------
    handleMove(ev: PointerEvent): void {
        const x = (ev as any).pointX;
        const y = (ev as any).pointY;
        const body = this._chart.chartView().bodyView();

        body.pointerMoved(body.controlToElement(x, y), ev.target);
    }

    handleClick(ev: PointerEvent): void {
        const chart = this._chart.chartView();
        const elt = ev.target as Element;
        const legend = chart.legendByDom(elt);

        if (legend) {
            legend.source.visible = !legend.source.visible;
        } else {
            const series = chart.seriesByDom(elt);

            if (series) {
                series.clicked(elt)
            }
        }
    }

    handleDblClick(ev: PointerEvent): void {
    }

    handleWheel(ev: WheelEvent): void {
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}