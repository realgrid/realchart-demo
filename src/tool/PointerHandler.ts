////////////////////////////////////////////////////////////////////////////////
// PointerHandler.ts
// 2023. 08. 12. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ChartControl } from "../ChartControl";
import { ButtonElement } from "../common/ButtonElement";
import { IPoint } from "../common/Point";
import { DragTracker, IPointerHandler } from "../common/RcControl";
import { DataPoint } from "../model/DataPoint";
import { LegendItem } from "../model/Legend";
import { Series } from "../model/Series";
import { CreditView } from "../view/ChartView";
import { SeriesView, WidgetSeriesView } from "../view/SeriesView";

export abstract class ChartDragTracker extends DragTracker {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(public chart: ChartControl) {
        super();
    }
}

export class ChartPointerHandler implements IPointerHandler {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _chart: ChartControl;
    private _clickElement: Element;
    private _dragTracker: DragTracker;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: ChartControl) {
        this._chart = chart;
    }

    //-------------------------------------------------------------------------
    // IPointerHandler
    //-------------------------------------------------------------------------
    handleDown(ev: PointerEvent): void {
        if (!ev.isPrimary) return;

        const chart = this._chart.chartView();
        const elt = this._clickElement = ev.target as Element;

        if (!elt) return;
        
        const p = this.$_pointerToPoint(ev);
        console.log('POINT DOWN', p.x, p.y);

        if (this._dragTracker) {
            this.$_stopDragTracker(elt, p.x, p.y);
        }
    }

    handleUp(ev: PointerEvent): void {
    }

    handleMove(ev: PointerEvent): void {
        const chart = this._chart.chartView();

        if (!chart.getButton(ev.target as Element)) {
            this._chart.chartView().pointerMoved((ev as any).pointX, (ev as any).pointY, ev.target);
        }
    }

    handleClick(ev: PointerEvent): void {
        const chart = this._chart.chartView();
        const elt = ev.target as Element;
        const button = chart.getButton(elt);
        let credit: CreditView;
        let legend: LegendItem;
        let series: SeriesView<Series>;

        if (button) {
            if (button.click() !== true) {
                chart.buttonClicked(button);
            }
        } else if (legend = chart.legendByDom(elt)) {
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
    dragging(): boolean {
        return this._dragTracker && this._dragTracker.dragging;
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_pointerToPoint(event: PointerEvent): IPoint {
        const r = this._chart.svg().getBoundingClientRect();
        const x = event.pageX - r.left;
        const y = event.pageY - r.top;
        return {x, y};
    }

    protected _getDragTracker(ev: PointerEvent): any {
    }

    private $_stopDragTracker(dom: Element, x: number, y: number, canceled = false): void {
        if (this.dragging) {
            if (canceled) {
                this._dragTracker.cancel();
            } else {
                this._dragTracker.drop(null, x, y);
            }
            this._dragTracker = null;
        }
    }
}