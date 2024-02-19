////////////////////////////////////////////////////////////////////////////////
// AreaRangeLegendMarkerView.ts
// 2024. 01. 19. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023-2024 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { PathElement } from "../../../common/RcControl";
import { ShapeLegendMarkerView } from "./ShapeLegendMarkerView";

export class AreaRangeLegendMarkerView extends ShapeLegendMarkerView {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    _line: PathElement;
    _line2: PathElement;
    _area: PathElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, size: number) {
        super(doc, size);

        this.insertFirst(this._line = new PathElement(doc));
        this._line.setFill('none');
        this.insertFirst(this._line2 = new PathElement(doc));
        this._line2.setFill('none');
        this.insertFirst(this._area = new PathElement(doc));
        this._area.setBoolData('fill', true);
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected override _renderShape(size: number): void {
        super._renderShape(size);

        const line = [
            'M', 0, size * 0.3,
            'L', size * 0.7, 0, 
            'L', size * 2, size * 0.4,
        ];
        const line2 = [
            'M', 0, size,
            'L', size, size * 0.7, 
            'L', size * 2, size,
        ];
        const area = [
            'M', 0, size * 0.3, 
            'L', size * 0.7, 0, 
            'L', size * 2, size * 0.4,
            'L', size * 2, size,
            'L', size, size * 0.7, 
            'L', 0, size,
            'Z'
        ]

        this._marker.setStyle('visibility', this._shape ? 'visible' : 'hidden');

        if (this._line) {
            this._line.setPath(line.join(' '));
            this._line2.setPath(line2.join(' '));
            this._area.setPath(area.join(' '));
        }
    }

    protected override _markerOffset(size: number): number {
        return size / 2;
    }
}
