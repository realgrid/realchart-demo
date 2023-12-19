////////////////////////////////////////////////////////////////////////////////
// AreaLegendMarkerView.ts
// 2023. 12. 18. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { PathElement } from "../../../common/RcControl";
import { SvgShapes } from "../../../common/impl/SvgShape";
import { ShapeLegendMarkerView } from "./ShapeLegendMarkerView";

export class AreaLegendMarkerView extends ShapeLegendMarkerView {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    _line: PathElement;
    _area: PathElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, size: number) {
        super(doc, size);

        this.insertFirst(this._line = new PathElement(doc));
        this.insertFirst(this._area = new PathElement(doc));
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _renderShape(size: number): void {
        super._renderShape(size);

        const line = [
            'M', 0, size * 0.5, 
            'L', size * 2, 0,
        ];
        const area = [
            'M', 0, size * 0.5, 
            'L', size * 2, 0,
            'L', size * 2, size, 
            'L', 0, size,
            'Z'
        ]

        this._marker.setStyle('visibility', this._shape ? 'visible' : 'hidden');
        if (this._line) {
            this._line.setPath(line.join(' '));
            this._area.setPath(area.join(' '));
        }
    }

    protected _markerOffset(size: number): number {
        return size / 2;
    }
}
