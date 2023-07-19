////////////////////////////////////////////////////////////////////////////////
// PlotItem.ts
// 2023. 07. 17. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ChartItem } from "./ChartItem";
import { ILegendSource } from "./Legend";

export abstract class PlotItem extends ChartItem implements ILegendSource {

    //-------------------------------------------------------------------------
    // ILegendSource
    //-------------------------------------------------------------------------
    legendColor(): string {
        return;
    }

    legendLabel(): string {
        return this.legend;
    }

    legendVisible(): boolean {
        return !!this.legend;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    left: number;
    right: number;
    top: number;
    bottom: number;
    front = true;
    /**
     * 문자열을 지정하면 legend 아이템으로 표시된다.
     */
    legend: string;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
}

export class TextItem extends PlotItem {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    text: string;
}

export class ImageItem extends PlotItem {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    url: string;
    width: number;
    height: number;
}

export abstract class ShapeItem extends PlotItem {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
}
