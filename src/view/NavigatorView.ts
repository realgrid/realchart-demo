////////////////////////////////////////////////////////////////////////////////
// NavigatorView.ts
// 2023. 10. 18. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { PathBuilder } from "../common/PathBuilder";
import { PathElement, RcElement } from "../common/RcControl";
import { ISize } from "../common/Size";
import { RectElement } from "../common/impl/RectElement";
import { SeriesNavigator } from "../model/SeriesNavigator";
import { ChartElement } from "./ChartElement";

export class NavigatorHandleView extends RcElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _back: RectElement;
    private _shape: PathElement;

    _vertical: boolean;
    private _w: number;
    private _h: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, NavigatorView.HANDLE_STYLE);

        this.add(this._back = new RectElement(doc));
        this.add(this._shape = new PathElement(doc));
        this._shape.setStyle('fill', 'white');
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    layout(width: number, height: number, vertical: boolean): void {
        if (width !== this._w || height !== this._h || vertical !== this._vertical) {
            let sz = Math.min(width, height);
            const pb = new PathBuilder();
    
            this._back.rect = {
                x: -sz / 2,
                y: -sz / 2,
                width: sz,
                height: sz,
                rx: sz / 2
            };

            sz /= 3;
            pb.polygon(-sz - 1, 0, -1, -sz, -1, sz);
            pb.polygon(sz + 1, 0, 1, -sz, 1, sz);
            this._shape.setPath(pb.end());

            this._w = width;
            this._h = height;
            this._vertical = vertical;
        }
    }
}

/**
 * @internal
 */
export class NavigatorView extends ChartElement<SeriesNavigator> {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly CLASS_NAME = 'rct-navigator';
    static readonly BACK_STYLE = 'rct-navigator-back';
    static readonly MASK_STYLE = 'rct-navigator-mask';
    static readonly HANDLE_STYLE = 'rct-navigator-handle';
    static readonly HANDLE_BACK_STYLE = 'rct-navigator-handle-back';

    //-------------------------------------------------------------------------
    // static members
    //-------------------------------------------------------------------------
    static isHandle(dom: Element): boolean {
        return dom.parentElement.classList.contains(NavigatorView.HANDLE_STYLE);
    }

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _back: RectElement;
    private _mask: RectElement;
    _startHandle: NavigatorHandleView;
    _endHandle: NavigatorHandleView;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, NavigatorView.CLASS_NAME);

        this.add(this._back = new RectElement(doc, NavigatorView.BACK_STYLE))
        this.add(this._mask = new RectElement(doc, NavigatorView.MASK_STYLE))
        this.add(this._startHandle = new NavigatorHandleView(doc));
        this.add(this._endHandle = new NavigatorHandleView(doc));
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doMeasure(doc: Document, model: SeriesNavigator, hintWidth: number, hintHeight: number, phase: number): ISize {
        let width = hintWidth;
        let height = hintHeight;

        if (model._vertical) {
            width = model.thickness + model.gap + model.gapFar;
        } else {
            height = model.thickness + model.gap + model.gapFar;
        }

        return { width, height };
    }

    protected _doLayout(param: any): void {
        const axis = this.model.axis();
        const zoom = axis._zoom;
        const w = this.width;
        const h = this.height;

        this._back.resize(this.width, this.height);

        if (this.model._vertical) {
        } else {
            const x1 = zoom ? zoom.start * w / axis.length() : 0;
            const x2 = zoom ? zoom.end * w / axis.length() : w;
            console.log('end', zoom ? zoom.end : w, x2);

            this._mask.setBounds(x1, 0, x2 - x1, h);

            this._startHandle.layout(h / 3, h / 3, false)
            this._startHandle.translate(x1, h / 2);
            this._endHandle.layout(h / 3, h / 3, false);
            this._endHandle.translate(x2, h / 2);
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}