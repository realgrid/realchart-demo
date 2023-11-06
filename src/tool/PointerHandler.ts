////////////////////////////////////////////////////////////////////////////////
// PointerHandler.ts
// 2023. 08. 12. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ChartControl } from "../ChartControl";
import { IPoint } from "../common/Point";
import { DragTracker, IPointerHandler } from "../common/RcControl";
import { DataPoint } from "../model/DataPoint";
import { LegendItem } from "../model/Legend";
import { Series } from "../model/Series";
import { AxisScrollView } from "../view/AxisView";
import { CreditView } from "../view/ChartView";
import { NavigatorView } from "../view/NavigatorView";
import { SeriesView, WidgetSeriesView } from "../view/SeriesView";
import { NavigatorHandleTracker, NavigatorMaskTracker, ScrollTracker, ZoomTracker } from "./DragTrackers";

const DRAG_THRESHOLD = 3;

export class ChartPointerHandler implements IPointerHandler {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _chart: ChartControl;
    private _clickElement: Element;
    private _dragTracker: DragTracker;

    private _clickX: number;
    private _clickY: number;
    private _prevX: number;
    private _prevY: number;
    
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

        const elt = this._clickElement = ev.target as Element;

        if (!elt) return;
        
        const p = this.$_pointerToPoint(ev);
        // console.log('POINT DOWN', p.x, p.y);

        if (this._dragTracker) {
            this.$_stopDragTracker(elt, p.x, p.y);
        }

        this._prevX = this._clickX = p.x;
        this._prevY = this._clickY = p.y;
    }

    handleUp(ev: PointerEvent): void {
        if (this.isDragging()) {
            this.$_stopDragTracker(ev.target as Element, this._prevX, this._prevY);
        }
    }

    handleMove(ev: PointerEvent): void {
        const chart = this._chart.chartView();
        const {x, y} = this.$_pointerToPoint(ev);

        if (ev.buttons >= 1 || (ev.buttons === 0 && ev.button === 0)) {// && ev.pointerId === this._primaryId)) {
            const dragging = this.isDragging();
            const dom = this._clickElement;

            if (x < 0 || x >= chart.control.dom().offsetWidth || y < 0 || y >= chart.control.dom().offsetHeight) {
                // dragging && this.$_stopDragTracker(dom, x, y, true);
            } else if (dragging) {
                this.$_doDrag(ev, dom, x, y);
            } else if (!this._dragTracker && (Math.abs(this._clickX - x) > DRAG_THRESHOLD || Math.abs(this._clickY - y) > DRAG_THRESHOLD)) {
                this.$_startMove(ev, dom, x, y);
            } else if (this._dragTracker && !dragging) {
                this.$_startMove(ev, dom, x, y);
            }
        }

        this._prevX = x;
        this._prevY = y;

        if (this.isDragging()) {
            chart.pointerMoved(-1, -1, null);
            this._stopEvent(ev);
        } else if (!chart.getButton(ev.target as Element)) {
            chart.pointerMoved((ev as any).pointX, (ev as any).pointY, ev.target);
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
    // properties
    //-------------------------------------------------------------------------
    get dragTracker(): DragTracker {
        return this._dragTracker;
    }
    setDragTracker(value: DragTracker) {
        if (value != this._dragTracker) {
            if (this._dragTracker) {
                this._dragTracker.cancel();
            }
            this._dragTracker = value;
        }
    }

    isDragging(): boolean {
        return this._dragTracker && this._dragTracker.dragging;
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected _stopEvent(ev: Event): void {
        ev.cancelable && ev.preventDefault();
        ev.stopImmediatePropagation();
    }

    private $_pointerToPoint(event: PointerEvent): IPoint {
        const r = this._chart.svg().getBoundingClientRect();
        const x = event.pageX - r.left;
        const y = event.pageY - r.top;
        return {x, y};
    }

    protected _getDragTracker(elt: Element, dx: number, dy: number): any {
        const chartView = this._chart.chartView();
        const body = chartView.bodyView();

        if (AxisScrollView.isThumb(elt)) {
            return new ScrollTracker(this._chart, chartView.getScrollView(elt));
        } else if (body.model.canZoom() && body.contains(elt)) {
            return new ZoomTracker(this._chart, body, chartView._inverted);
        } else if (NavigatorView.isHandle(elt)) {
            return new NavigatorHandleTracker(this._chart, chartView._navigatorView, elt);
        } else if (NavigatorView.isMask(elt) && this._chart.model.body.isZoomed()) {
            return new NavigatorMaskTracker(this._chart, chartView._navigatorView, elt);            
        }
    }

    private $_doDrag(ev: PointerEvent, dom: Element, x: number, y: number): boolean {
        if (!this.$_drag(dom, this._prevX, this._prevY, x, y)) {
            this.$_stopDragTracker(dom, x, y, true);
            this._stopEvent(ev);
            return true;
        }
    }

    private $_startMove(ev: PointerEvent, dom: Element, x: number, y: number): void {
        // clearTimeout(this._longTimer);
        // this._tapped = 0;

        if (this.$_startDrag(dom, this._prevX, this._prevY, x, y)) {
            if (x !== this._prevX || y !== this._prevY) {
                this.$_doDrag(ev, dom, x, y);
            } else {
                this._stopEvent(ev);
            }
        }
    }

    private $_startDrag(dom: Element, xStart: number, yStart: number, x: number, y: number): boolean {
        if (!this._dragTracker) {
            this.setDragTracker(this._getDragTracker(dom, x - xStart, y - yStart));
        }
        if (this._dragTracker) {
            return this._dragTracker.start(dom, xStart, yStart, x, y);
        }
        return false;
    }

    private $_drag(dom: Element, xPrev: number, yPrev: number,  x: number, y: number): boolean {
        return this._dragTracker.drag(dom, xPrev, yPrev, x, y);
    }

    private $_stopDragTracker(dom: Element, x: number, y: number, canceled = false): void {
        if (this.isDragging()) {
            if (canceled) {
                this._dragTracker.cancel();
            } else {
                this._dragTracker.drop(null, x, y);
            }
            this._dragTracker = null;
        }
    }
}