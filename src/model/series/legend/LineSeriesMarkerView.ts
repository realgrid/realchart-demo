////////////////////////////////////////////////////////////////////////////////
// LineSeriesMarkerView.ts
// 2023. 10. 11. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { PathElement, RcElement } from "../../../common/RcControl";
import { LineElement } from "../../../common/impl/PathElement";
import { Shape, SvgShapes } from "../../../common/impl/SvgShape";
import { Series } from "../../Series";

export class LineSeriesMarkerView extends RcElement {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    private _size: number;
    private _shape: string;
    private _line: LineElement;
    private _marker: PathElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, size: number) {
        super(doc, Series.LEGEND_MARKER);

        this._size = size;
        this.add(this._line = new LineElement(doc));
        this._line.setHLine(size / 2, 0, size * 2);
        this.add(this._marker = new PathElement(doc));
        this._marker.translate(size / 2, 0);
        this.setShape(Shape.CIRCLE, 12);
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    setShape(value: string, size: number): void {
        if (value !== this._shape || size !== this._size) {
            this._shape = value;
            SvgShapes.setShape(this._marker, value as any, (this._size = size) / 2);   
            this._marker.translate(size / 2, 0);
            this._line.setHLine(size / 2, 0, size * 2);
        }
    }
}
