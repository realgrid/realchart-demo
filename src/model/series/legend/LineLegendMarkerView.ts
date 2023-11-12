////////////////////////////////////////////////////////////////////////////////
// LineLegendMarkerView.ts
// 2023. 10. 11. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { LineElement } from "../../../common/impl/PathElement";
import { ShapeLegendMarkerView } from "./ShapeLegendMarkerView";

export class LineLegendMarkerView extends ShapeLegendMarkerView {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    private _line: LineElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, size: number) {
        super(doc, size);

        this.insertFirst(this._line = new LineElement(doc));
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _renderShape(size: number): void {
        super._renderShape(size);

        this._line?.setHLine(size / 2, 0, size * 2);
    }

    protected _markerOffset(size: number): number {
        return size / 2;
    }
}
