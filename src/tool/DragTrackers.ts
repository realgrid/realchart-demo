////////////////////////////////////////////////////////////////////////////////
// DragTrackers.ts
// 2023. 10. 21. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ChartControl } from "../ChartControl";
import { DragTracker, RcElement } from "../common/RcControl";
import { RectElement } from "../common/impl/RectElement";
import { Axis } from "../model/Axis";
import { AxisScrollView } from "../view/AxisView";
import { BodyView } from "../view/BodyView";
import { NavigatorHandleView, NavigatorView } from "../view/NavigatorView";

export abstract class ChartDragTracker extends DragTracker {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(public chart: ChartControl) {
        super();
    }
}

export class ZoomTracker extends ChartDragTracker {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _body: BodyView;
    private _feedback: RectElement;
    private _xStart: number;
    private _yStart: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(control: ChartControl, body: BodyView) {
        super(control);

        this._body = body;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doStart(eventTarget: Element, xStart: number, yStart: number, x: number, y: number): boolean {
        this._xStart = xStart - this._body.tx;
        this._yStart = yStart - this._body.ty;
        this._body.addFeedback(this._feedback = new RectElement(this.chart.doc(), 'rct-zoom-tracker'));
        return true;
    }

    protected _doEnded(x: number, y: number): void {
        x -= this._body.tx;
        this._body.setZoom(Math.min(this._xStart, x), 0, Math.max(this._xStart, x), this._body.height);
        this._feedback.remove();
    }

    protected _doDrag(target: Element, xPrev: number, yPrev: number, x: number, y: number): boolean {
        x -= this._body.tx;
        this._feedback.setBounds(Math.min(this._xStart, x), 0, Math.abs(this._xStart - x), this._body.height);
        return true;
    }
}

export class ScrollTracker extends ChartDragTracker {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _view: AxisScrollView;
    private _startOff: number;
    private _zoomLen: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(control: ChartControl, view: AxisScrollView) {
        super(control);

        this._view = view;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doStart(eventTarget: Element, xStart: number, yStart: number, x: number, y: number): boolean {
        const v = this._view;

        const p = v._thumbView.elementToSvg(0, 0);

        this._startOff = v._vertical ? (yStart - p.y) : (xStart - p.x);
        this._zoomLen = v.model.axis._zoom.length;

        return true;
    }

    protected _doEnded(x: number, y: number): void {
    }

    protected _doDrag(target: Element, xPrev: number, yPrev: number, x: number, y: number): boolean {
        if (this._view._vertical) {
        } else {
            let p = this._view.svgToElement(x, y).x - this._startOff;
            
            p = this._view.getZoomPos(p);
            this._view.model.axis.zoom(p, p + this._zoomLen);
        }
        return true;
    }
}

export class NavigatorHandleTracker extends ChartDragTracker {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _view: NavigatorView;
    private _handleView: NavigatorHandleView;
    private _isStart: boolean;
    private _startOff: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(control: ChartControl, view: NavigatorView, elt: Element) {
        super(control);

        this._view = view;
        if (this._isStart = view._startHandle.contains(elt)) {
            this._handleView = view._startHandle;
        } else {
            this._handleView = view._endHandle;
        }
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doStart(eventTarget: Element, xStart: number, yStart: number, x: number, y: number): boolean {
        const axis = this._view.model.axis();
        const v = this._handleView;

        const p = v.elementToSvg(0, 0);

        this._startOff = v._vertical ? (yStart - p.y) : (xStart - p.x);

        return true;
    }

    protected _doEnded(x: number, y: number): void {
    }

    protected _doDrag(target: Element, xPrev: number, yPrev: number, x: number, y: number): boolean {
        const view = this._view;
        const axis = view.model.axis();
        const len = view.model.axisLen();
        let p = view.svgToElement(x, y).x - this._startOff;

        if (this._handleView._vertical) {
            if (this._isStart) {
            } else {
            }
        } else {
            if (this._isStart) {
                if (p > 0) {
                    axis.zoom(p * len / view.width, NaN);
                }
            } else {
                if (p > 0 && p < view.width) {
                    axis.zoom(NaN, p * len / view.width);
                }
            }
        }
        return true;
    }
}

export class NavigatorMaskTracker extends ChartDragTracker {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _view: NavigatorView;
    private _maskView: RcElement;
    private _startOff: number;
    private _zoomLen: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(control: ChartControl, view: NavigatorView, elt: Element) {
        super(control);

        this._view = view;
        this._maskView = view._mask;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doStart(eventTarget: Element, xStart: number, yStart: number, x: number, y: number): boolean {
        const axis = this._view.model.axis();
        const v = this._maskView;

        const p = v.elementToSvg(0, 0);

        this._startOff = this._view.model._vertical ? (yStart - p.y) : (xStart - p.x);
        this._zoomLen = axis._zoom.length;

        return true;
    }

    protected _doEnded(x: number, y: number): void {
    }

    protected _doDrag(target: Element, xPrev: number, yPrev: number, x: number, y: number): boolean {
        const view = this._view;
        const len = view.model.axisLen();
        const p = view.svgToElement(x, y).x - this._startOff;

        if (view.model._vertical) {
            this.$_moveZoom(p * len / view.height);
        } else {
            this.$_moveZoom(p * len / view.width);
        }
        return true;
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_moveZoom(p: number): void {
        p = Math.max(0, Math.min(p, this._view.model._naviChart.xAxis.length() - this._zoomLen));
        this._view.model.axis().zoom(p, p + this._zoomLen);
    }
}