////////////////////////////////////////////////////////////////////////////////
// CategoryAxis.ts
// 2023. 06. 21. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isNumber, pickNum } from "../../common/Common";
import { Axis, AxisTick, AxisTickMark, IAxisTick } from "../Axis";
import { ISeries } from "../Series";

export enum CategoryTickMarkPosition {
    TICK = 'tick',
    EDGE = 'edge'
}

export class CategoryAxisTickMark extends AxisTickMark {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    position = CategoryTickMarkPosition.TICK;
}

export class CategoryAxisTick extends AxisTick {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    steps = 1;
    /**
     * true이면 steps 상관없이 마지막 tick은 항상 표시된다.
     */
    showLast = false;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _createMark(): AxisTickMark {
        return new CategoryAxisTickMark(this.axis);
    }
}

/**
 * 카테고리는 data point의 축 상 위치를 찾을 때 비교되는 값이다. 
 * 또, 기본적인 tick 라벨로 쓰인다.
 * 
 * data point들의 이 축의 값들 중 문자열인 값들, 혹은 categoryField에 해당하는 값들을 수집하거나,
 * categories로 지정한 것들로 중복을 제거하고 tick 목록으로 구성한다.
 * 수집된 category들은 0부터 시작해서 unit 속성에 지정된 값(기본값 1)씩 차례대로 증가한 값을 갖게된다.
 * 
 * tick들은 축을 카테고리 수로 등분된(TODO: 혹은, 비율대로 - category axis의 특징) 영역(카테고리 크기가 된다)의 중앙에 생성된다.
 * tick mark는 tick 위치나, 양 옆에 표시될 수 있다.
 * tick label은 tick 위치에 표시된다.
 */
export class CategoryAxis extends Axis {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _cats: string[];
    private _map = new Map<string, number>(); // data point의 축 위치를 찾기 위해 사용한다.

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * Category 목록을 수집하는 시리즈.
     * 지정하지 않으면 모든 시리즈에서 카테고리를 수집한다.
     */
    categorySeries: string;
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

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getCategories(): string[] {
        return this._cats;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _createTick(): AxisTick {
        return new CategoryAxisTick(this);
    }

    getValue(value: any): number {
        if (isNumber(value)) {
            return value;
        } else {
            return this._map.get(value);
        }
    }

    protected _doPrepareRender(): void {
        this._collectCategories(this._series);
    }

    protected _doBuildTicks(min: number, max: number, length: number): IAxisTick[] {
        const cats = this._cats;
        const nCat = cats.length;
        const minPad = pickNum(this.minPadding, 0);
        const maxPad = pickNum(this.maxPadding, 0);
        const ticks: IAxisTick[] = [];

        min = Math.floor(min);
        max = Math.ceil(max);

        const len = max - min + 1;
        const interval = length / (len + minPad + maxPad);
        const pad = minPad * interval;

        for (let i = min; i <= max; i++) {
            ticks.push({
                pos: pad + i * interval + interval / 2,
                value: i,
                label: this.tick.getTick(i < nCat ? cats[i] : i)
            })
        }
        return ticks;
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private _collectCategories(series: ISeries[]): void {
        const categories = this.categories;

        if (isArray(categories) && categories.length > 0) {
            this._cats = categories.map(c => c == null ? null : c.toString());
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

        this._map.clear();
        this._cats.forEach((c, i) => this._map.set(c, i));
    }
}