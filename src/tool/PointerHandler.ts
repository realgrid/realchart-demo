////////////////////////////////////////////////////////////////////////////////
// PointerHandler.ts
// 2023. 08. 12. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ChartControl } from "../ChartControl";
import { IPointerHandler } from "../common/RcControl";
import { DataPoint } from "../model/DataPoint";
import { LegendItem } from "../model/Legend";
import { Series } from "../model/Series";
import { CreditView } from "../view/ChartView";
import { SeriesView, WidgetSeriesView } from "../view/SeriesView";

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
    handleDown(ev: PointerEvent): void {
    }

    handleUp(ev: PointerEvent): void {
    }

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
            if (legend.source instanceof DataPoint) {
                const p = legend.source;
                const ser = this._chart.model.seriesByPoint(p);

                if (ser) {
                    ser.setPointVisible(p, !p.visible);

                    const v = this._chart.chartView().findSeriesView(ser);
                    v instanceof WidgetSeriesView && v.togglePointVisible(p);
                }
            } else {
                legend.source.visible = !legend.source.visible;
            }
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