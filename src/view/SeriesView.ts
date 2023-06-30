////////////////////////////////////////////////////////////////////////////////
// SeriesView.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ISize, Size } from "../common/Size";
import { Series } from "../model/Series";
import { ChartElement } from "./ChartElement";

export abstract class SeriesView<T extends Series> extends ChartElement<T> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-series');
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doMeasure(doc: Document, model: T, hintWidth: number, hintHeight: number, phase: number): ISize {
        return Size.create(hintWidth, hintHeight);
    }

    protected _doLayout(): void {
        this._renderSeries(this.width, this.height);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected abstract _renderSeries(width: number, height: number): void;
}