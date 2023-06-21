////////////////////////////////////////////////////////////////////////////////
// CategoryAxis.ts
// 2023. 06. 21. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray } from "../../common/Common";
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
    private _cats: string[];

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 카테고리로 사용되는 dataPoint 속성.
     * {@link categories}가 지정되면 이 속성은 무시된다.
     */
    categoryField: string | number;
    /**
     * 명시적으로 지정하는 카테고리 목록.
     * 첫 번째 값이 0에 해당한다.
     */
    categories: any[];
    unit = 1;
    interval = 1;
    showLast = false;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doPrepareRender(): void {
        this._collectCategories(this._series);
    }

    protected _doCalcluateRange(): { min: number; max: number; } {
        return;
    }

    protected _doPrepareTicks(min: number, max: number, length: number): IAxisTick[] {
        return;
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private _collectCategories(series: ISeries[]): void {
        const categories = this.categories;

        if (isArray(categories) && categories.length > 0) {
            this._cats = categories.filter(c => c != null).map(c => c.toString());
        } else {
            const cats = this._cats = [];

            if (isArray(series)) {
                for (const ser of series) {
                    const cats2 = ser.collectCategories(this);

                    for (const c of cats2) {
                        if (!cats.includes(c)) {
                            cats.push(c);
                        }
                    }
                }
            }
        }
    }
}