////////////////////////////////////////////////////////////////////////////////
// Title.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { VerticalAlign } from "../common/Types";
import { ChartItem } from "./ChartItem";

export class Title extends ChartItem {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    text = 'Title';
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