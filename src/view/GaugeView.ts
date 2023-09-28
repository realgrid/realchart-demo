////////////////////////////////////////////////////////////////////////////////
// GuageView.ts
// 2023. 09. 26. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ISize } from "../common/Size";
import { Gauge } from "../model/Gauge";
import { ChartElement } from "./ChartElement";

export abstract class GaugeView<T extends Gauge> extends ChartElement<T> {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    protected _inverted = false;
    protected _animatable = true;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string) {
        super(doc, styleName);
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

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doMeasure(doc: Document, model: T, hintWidth: number, hintHeight: number, phase: number): ISize {
        return { width: hintWidth, height: hintHeight };
    }

    protected _doLayout(): void {
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