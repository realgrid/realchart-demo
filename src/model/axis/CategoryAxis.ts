////////////////////////////////////////////////////////////////////////////////
// CategoryAxis.ts
// 2023. 06. 21. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { Axis, IAxisTick } from "../Axis";

/**
 * data point들의 이 축의 값들 중 문자열인 값들, 혹은 categoryField에 해당하는 값들을 수집하거나,
 * categories로 지정한 것들로 중복을 제거하고 tick 목록으로 구성한다.
 * 수집된 category들은 0부터 시작해서 unit 속성에 지정된 값(기본값 1)씩 차례대로 증가한 값을 갖게된다.
 * 
 * interval로 표시할 tick 개수를 조정할 수 있다.
 * showLast가 true이면 interval과 상관없이 마지막 tick은 항상 표시된다.
 */
export class CategoryAxis extends Axis {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _categoryField = 'name';
    private _categories: any[];
    private _unit = 1;
    private _interval = 1;
    private _showLast = false;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    collectTicks(min: number, max: number, length: number): IAxisTick[] {
        throw new Error("Method not implemented.");
    }
}