////////////////////////////////////////////////////////////////////////////////
// Title.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isString } from "../common/Common";
import { Align, SVGStyleOrClass, VerticalAlign, isNull } from "../common/Types";
import { ChartItem } from "./ChartItem";

export class Title extends ChartItem {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    text = 'Title';
    align = Align.CENTER;
    backgroundStyle: SVGStyleOrClass;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    isVisible(): boolean {
        return this.visible && !isNull(this.text);
    }
    
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doLoadSimple(source: any): boolean {
        if (isString(source)) {
            this.text = source;
            return true;
        }
    }
}

export enum SubtitlePosition {
    BOTTOM = 'bottom',
    RIGHT = 'right',
    LEFT = 'left',
    TOP = 'top'
}

export class Subtitle extends Title {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    position = SubtitlePosition.BOTTOM;
    valign = VerticalAlign.BOTTOM;
    text = '';
}