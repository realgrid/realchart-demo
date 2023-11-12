////////////////////////////////////////////////////////////////////////////////
// ShapeLegendMarkerView.ts
// 2023. 10. 31. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { PathElement, RcElement } from "../../../common/RcControl";
import { Shape, SvgShapes } from "../../../common/impl/SvgShape";
import { Series } from "../../Series";

export class ShapeLegendMarkerView extends RcElement {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    private _size: number;
    private _shape: string;
    private _marker: PathElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, size: number) {
        super(doc, Series.LEGEND_MARKER);

        this._size = size;
        this.add(this._marker = new PathElement(doc));
        this.setShape(Shape.CIRCLE, 12);
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    setShape(value: string, size: number): void {
        if (value !== this._shape || size !== this._size) {
            this._shape = value;
            this._size = size;
            this._renderShape(size);
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected _renderShape(size: number): void {
        SvgShapes.setShape(this._marker, this._shape as any, size / 2);   
        this._marker.translate(this._markerOffset(size), 0);
    }

    protected _markerOffset(size: number): number {
        return 0;
    }
}
