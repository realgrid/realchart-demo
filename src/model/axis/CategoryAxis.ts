////////////////////////////////////////////////////////////////////////////////
// CategoryAxis.ts
// 2023. 06. 21. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray } from "../../common/Common";
import { Utils } from "../../common/Utils";
import { Axis, IAxisTick } from "../Axis";
import { ISeries } from "../ChartItem";

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
    private _categories: string[];

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    categoryField = 'name';
    categories: any[];
    unit = 1;
    interval = 1;
    showLast = false;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    calcluateRange(field: string | number, series: ISeries[]): { min: number; max: number; } {
        this._collectCategories(field, series);

        return;
    }

    collectTicks(min: number, max: number, length: number): IAxisTick[] {
        return;
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private _collectCategories(field: string | number, series: ISeries[]): void {
        const cats = this.categories;

        if (isArray(cats) && cats.length > 0) {
            this._categories = cats.filter(c => c != null && c != '').map(c => c.toString());
        } else {
            this._categories = [];

            if (isArray(series)) {
            }
        }
    }
}