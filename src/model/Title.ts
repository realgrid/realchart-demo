////////////////////////////////////////////////////////////////////////////////
// Title.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isString } from "../common/Common";
import { Sides } from "../common/Sides";
import { VerticalAlign } from "../common/Types";
import { ChartItem } from "./ChartItem";

export class Title extends ChartItem {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    text = 'Title';

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
    titleGap = 4;
    position = SubtitlePosition.BOTTOM;
    verticalAlign = VerticalAlign.BOTTOM;
    text = 'Sub Title';
}