////////////////////////////////////////////////////////////////////////////////
// GuageView.ts
// 2023. 09. 26. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { IPoint } from "../common/Point";
import { ISize } from "../common/Size";
import { RectElement } from "../common/impl/RectElement";
import { Gauge } from "../model/Gauge";
import { ChartElement } from "./ChartElement";

export abstract class GaugeView<T extends Gauge> extends ChartElement<T> {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly BACKGROUND_CLASS = 'rct-gauge-background';

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _backElement: RectElement;

    protected _inverted = false;
    protected _animatable = true;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string) {
        super(doc, styleName);

        this.add(this._backElement = new RectElement(doc, GaugeView.BACKGROUND_CLASS));
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    _setChartOptions(inverted: boolean, animatable: boolean): void {
        this._inverted = inverted;
        this._animatable = animatable;
    }

    clicked(elt: Element): void {
    }

    prepareGauge(doc: Document, model: T): void {
        // this.internalClearStyleAndClass();
        // this.internalSetStyleOrClass(model.style);
        // if (model.color) {
        //     this.internalSetStyle('fill', model.color);
        //     this.internalSetStyle('stroke', model.color);
        // }
        // model._calcedColor = getComputedStyle(this.dom).fill;

        this._prepareGauge(doc, model);
    }

    getPosition(width: number, height: number): IPoint {
        const m = this.model;
        let x = m.getLeft(width);
        let y = m.getTop(height);

        if (isNaN(x)) {
            x = m.getRight(width) - this.width;
            if (isNaN(x)) {
                x = (width - this.width) / 2;
            }
        }
        if (isNaN(y)) {
            y = m.getBottom(height) - this.height;
            if (isNaN(y)) {
                y = (height - this.height) / 2;
            }
        }

        return { x, y };
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doMeasure(doc: Document, model: T, hintWidth: number, hintHeight: number, phase: number): ISize {
        return model.getSize(hintWidth, hintHeight);
    }

    protected _doLayout(): void {
        // back
        this._backElement.resize(this.width, this.height);
        // gauge
        this._renderGauge(this.width, this.height);
        
        this._animatable && this._runShowEffect(!this.control.loaded);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected abstract _prepareGauge(doc: Document, model: T): void;
    protected abstract _renderGauge(width: number, height: number): void;
    protected _runShowEffect(firstTime: boolean): void {}
}