////////////////////////////////////////////////////////////////////////////////
// DragTrackers.ts
// 2023. 10. 21. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ChartControl } from "../ChartControl";
import { absv, maxv, minv } from "../common/Common";
import { DragTracker, RcElement } from "../common/RcControl";
import { RectElement } from "../common/impl/RectElement";
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
    private _vertical: boolean;
    private _feedback: RectElement;
    private _xStart: number;
    private _yStart: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(control: ChartControl, body: BodyView, vertical: boolean) {
        super(control);

        this._body = body;
        this._vertical = vertical;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doStart(eventTarget: Element, xStart: number, yStart: number, x: number, y: number): boolean {
        const cr = this.chart.getBounds();
        const br = this._body.getBounds();

        this._xStart = xStart - (br.x - cr.x);
        this._yStart = yStart - (br.y - cr.y);
        this._body.addFeedback(this._feedback = new RectElement(this.chart.doc(), 'rct-zoom-tracker'));
        return true;
    }

    protected _doEnded(x: number, y: number): void {
        const cr = this.chart.getBounds();
        const br = this._body.getBounds();

        if (this._vertical) {
            y -= br.y - cr.y;
            this._body.setZoom(0, minv(this._yStart, y), this._body.width, maxv(this._yStart, y));
        } else {
            x -= br.x - cr.x;
            this._body.setZoom(minv(this._xStart, x), 0, maxv(this._xStart, x), this._body.height);
        }
        this._feedback.remove();
    }

    protected _doDrag(target: Element, xPrev: number, yPrev: number, x: number, y: number): boolean {
        const cr = this.chart.getBounds();
        const br = this._body.getBounds();

        if (this._vertical) {
            y -= br.y - cr.y;
            this._feedback.setBounds(0, minv(this._yStart, y), this._body.width, absv(this._yStart - y));
        } else {
            x -= br.x - cr.x;
            this._feedback.setBounds(minv(this._xStart, x), 0, absv(this._xStart - x), this._body.height);
        }
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
        this._zoomLen = v.model.axis._zoom.length();
        return true;
    }

    protected _doDrag(target: Element, xPrev: number, yPrev: number, x: number, y: number): boolean {
        const v = this._view;
        let p: number;

        if (v._vertical) {
            p = v.svgToElement(x, y).y - this._startOff;
            p = v.getZoomPos(v.height - p - v._thumbView.height);
            v.model.axis.zoom(p, p + this._zoomLen);
        } else {
            p = v.svgToElement(x, y).x - this._startOff;
            p = v.getZoomPos(p);
            v.model.axis.zoom(p, p + this._zoomLen);
            console.log(p);
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
        const v = this._handleView;
        const p = v.elementToSvg(0, 0);

        this._startOff = v._vertical ? (yStart - p.y - (v.height / 2)) : (xStart - p.x - (v.width / 2));
        this._handleView.setBoolData('select', true);
        return true;
    }

    protected _doEnded(x: number, y: number): void {
        this._handleView.setBoolData('select', false);
    }

    protected _doDrag(target: Element, xPrev: number, yPrev: number, x: number, y: number): boolean {
        const view = this._view;
        const axis = view.model.axis();

        axis._prepareZoom();

        let p = view.svgToElement(x, y).x - this._startOff;
        const len = axis._zoom.total();// view.model.axisLen();
        const min = axis._zoom.min;//axisMin();
        const minSize = view.model.minSize;

        if (this._handleView._vertical) {
            if (this._isStart) {
            } else {
            }
        } else {
            
            if (this._isStart) {
                if (p > 0) {
                    axis.zoom(p * len / view.width + min, NaN, minSize);
                } else {
                    axis.zoom(min, NaN, minSize);
                }
            } else {
                if (p > 0 && p < view.width) {
                    axis.zoom(NaN, p * len / view.width + min, minSize);
                } else if (p >= view.width) {
                    axis.zoom(NaN, axis._zoom.max, minSize);
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
    private _totalLen: number;
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
        this._totalLen = axis._zoom.total();
        this._zoomLen = axis._zoom.length();

        return true;
    }

    protected _doEnded(x: number, y: number): void {
    }

    protected _doDrag(target: Element, xPrev: number, yPrev: number, x: number, y: number): boolean {
        const view = this._view;
        const p = view.svgToElement(x, y).x - this._startOff;

        if (view.model._vertical) {
            this.$_moveZoom(p * this._totalLen / view.height);
        } else {
            this.$_moveZoom(p * this._totalLen / view.width);
        }
        return true;
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_moveZoom(p: number): void {
        const model = this._view.model;

        p = maxv(0, minv(p, this._totalLen - this._zoomLen)) + model.axis()._zoom.min;
        model.axis().zoom(p, p + this._zoomLen);
        // console.log(p, this._totalLen, this._zoomLen);
    }
}   