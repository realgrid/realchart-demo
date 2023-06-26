////////////////////////////////////////////////////////////////////////////////
// PieSeries.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { DataPoint } from "../DataPoint";
import { ILegendSource } from "../Legend";
import { Series } from "../Series";

class PiePoint extends DataPoint implements ILegendSource {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    visible = true;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    legendColor(): string {
        return 'red';
    }

    legendLabel(): string {
        return this.x;
    }

    legendVisible(): boolean {
        return this.visible;
    }
}

export class PieSeries extends Series {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    createPoint(source: any): DataPoint {
        return new PiePoint(source);
    }

    getLegendSources(list: ILegendSource[]): void {
        this._points.forEach(p => {
            list.push(p as PiePoint);
        })        
    }
}