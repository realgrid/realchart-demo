////////////////////////////////////////////////////////////////////////////////
// Body.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { SizeValue } from "../common/Types";
import { ChartItem } from "./ChartItem";

/**
 * 시리즈들이 그려지는 plot 영역 모델.
 */
export class Body extends ChartItem {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    // polar props
    startAngle = 0;
    endAngle = 360;
    centerX: SizeValue = '50%';
    centerY: SizeValue = '50%';
    size: SizeValue = '80%';
}