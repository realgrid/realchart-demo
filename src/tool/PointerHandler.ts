////////////////////////////////////////////////////////////////////////////////
// PointerHandler.ts
// 2023. 08. 12. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { IPointerHandler } from "../common/RcControl";
import { ChartControl } from "../main";
import { LegendItem } from "../model/Legend";
import { Series } from "../model/Series";
import { CreditView } from "../view/ChartView";
import { SeriesView } from "../view/SeriesView";

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
        let credit: CreditView;
        let legend: LegendItem;
        let series: SeriesView<Series>;

        if (legend = chart.legendByDom(elt)) {
            legend.source.visible = !legend.source.visible;
        } else if (series = chart.seriesByDom(elt)) {
            series.clicked(elt)
        } else if (credit = chart.creditByDom(elt)) {
            credit.clicked(elt);
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