////////////////////////////////////////////////////////////////////////////////
// CategoryAxis.ts
// 2023. 06. 21. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isNumber, isString, pickNum } from "../../common/Common";
import { isNull } from "../../common/Types";
import { Axis, AxisGrid, AxisTick, AxisTickMark, IAxisTick } from "../Axis";
import { IPlottingItem, ISeries, SeriesGroup } from "../Series";

export enum CategoryTickMarkPosition {
    TICK = 'tick',
    EDGE = 'edge'
}

export class CategoryAxisTickMark extends AxisTickMark {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    position = CategoryTickMarkPosition.TICK;
}

export class CategoryAxisTick extends AxisTick {

    //-------------------------------------------------------------------------
    // properties
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

class CategoryAxisGrid extends AxisGrid {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    getPoints(): number[] {
        const axis = this.axis as CategoryAxis;
        const interval = axis._interval;
        const n = axis._ticks.length;
        const pts: number[] = [];
        let p = axis._minPad;

        for (let i = 0; i <= n; i++) {
            pts.push(p);
            p += interval;
        }
        return pts;
    }
}

/**
 * 지정된 카테고리 수로 축을 분할해서 각 카테고리에 연결된 데이터포인트들이 표시되게 한다.
 * <br>
 * 1. categories 속성으로 카테고리 목록을 구성한다.
 * 2. 이 축에 연결된 시리즈들에 포함된 data point들의 문자열인 값들, 혹은 categoryField에 해당하는 값들을 수집한다.
 *    수집된 category들 중 숫자가 아닌 것들은 {@link startValue}부터 시작해서 {@link valueStep} 속성에 지정된 값씩 차례대로 증가한 값을 갖게된다.
 * 3. 각 카테고리 영역의 크기는 {@link categoryStep} 설정값에 따라 기본적으로 동일하게 배분되고, 
 *    카테고리 영역 중간점이 카테고리 값의 위치가 된다.
 *    {@link categories} 속성으로 카테고리를 지정할 때, 상대적 크기를 width로 지정해서 각 카테고리의 값을 다르게 표시할 수 있다.
 * 4. tick mark나 label은 기본적으로 카테고리 값 위치에 표시된다.
 *    tick mark는 카테고리 양끝에 표시될 수 있다.
 */
export class CategoryAxis extends Axis {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _cats: string[];
    _widths: number[];  // ? 한 카테고리의 너비. 한 카테고리의 값 크기는 1 ?
    _widthSum: number;  // ?
    private _map = new Map<string, number>(); // data point의 축 위치를 찾기 위해 사용한다.
    private _min: number;
    private _max: number;
    private _len: number;
    _interval: number;
    private _catPad = 0;

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 카테고리가 지정되지 않은 데이터포인트들의 이 축에 해당하는 값을 지정할 때 최초 값.
     */
    startValue = 0;
    /**
     * 카테고리가 지정되지 않은 데이터포인트들의 이 축에 해당하는 값을 지정할 때 값 사이의 간격.
     */
    valueStep = 1;
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
     * <br>
     * 카테고리 항목을 object로 지정할 때에는 label 속성에 카테고리 이름을 width에 상대 너비를 지정한다.
     * 첫 번째 값이 {@link startValue}에 해당하고 {@link valueStep}씩 증가한다.
     * 각 카테고리의 상대적 너비를 지정할 수 있다.
     */
    categories: any[];
    /** 
     * 카테고리 하나의 값 크기.
     */
    categoryStep = 1;
    /**
     * 축의 양 끝 카테고리 값 위치에 여백으로 추가되는 크기.
     */
    padding = 0.5;
    /**
     * 각 카테고리의 양 끝에 추가되는 여백의 카테고리에 너비에 대한 상대적 크기.
     * <br>
     * @default 0.1.
     */
    categoryPadding = 0.1;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getCategories(): string[] {
        return this._cats;
    }

    getWdith(length: number, category: number): number {
        return 0;
    }

    axisMin(): number {
        return this._min;
    }

    axisMax(): number {
        return this._max;
    }

    categoryPad(): number {
        return this._catPad;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    type(): string {
        return 'category';
    }

    protected _createGrid(): AxisGrid {
        return new CategoryAxisGrid(this);
    }

    protected _createTick(): AxisTick {
        return new CategoryAxisTick(this);
    }

    protected _doPrepareRender(): void {
        this._collectCategories(this._series);

        // category padding
        this._catPad = pickNum(this.categoryPadding, 0);
    }

    protected _doBuildTicks(min: number, max: number, length: number): IAxisTick[] {
        const cats = this._cats;
        const nCat = cats.length;
        const ticks: IAxisTick[] = [];

        this._minPad = pickNum(this.minPadding, 0);
        this._maxPad = pickNum(this.maxPadding, 0);
        min = this._min = Math.floor(min);
        max = this._max = Math.ceil(max);

        const interval = this.categoryStep || 1;
        const len = this._len = max - min + 1;
        this._interval = length / (len + this._minPad + this._maxPad);

        for (let i = min; i <= max; i += interval) {
            ticks.push({
                pos: this.getPosition(length, i),
                value: i,
                label: this.tick.getTick(i < nCat ? cats[i] : i)
            });
        }
        return ticks;
    }

    getPosition(length: number, value: number): number {
        const v = this._minPad * this._interval + (value - this._min) * this._interval + this._interval / 2;
        return this.reversed ? length - v : v;
    }

    getUnitLength(length: number, value: number): number {
        return length / this._len;
    }

    getValue(value: any): number {
        if (isNumber(value)) {
            return value;
        } else {
            return this._map.get(value);
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private _collectCategories(series: IPlottingItem[]): void {
        const categories = this.categories;

        if (isArray(categories) && categories.length > 0) {
            this._cats = categories.map(c => {
                if (c == null) return null;
                if (isString(c)) return c;
                return c.label;
            });
            this._widthSum = 0;
            this._widths = categories.map(c => {
                const w = c == null ? 1 : pickNum(c.width, 1);
                this._widthSum += w;
                return w;
            });
        } else {
            const cats = this._cats = [];
            const widths = this._widths = [];

            if (isArray(series)) {
                for (const ser of series) {
                    const cats2 = ser.collectCategories(this);

                    for (const c of cats2) {
                        if (!cats.includes(c)) {
                            cats.push(c);
                            widths.push(1);
                        }
                    }
                }
            }
            this._widthSum = widths.length;
        }

        const start = pickNum(this.startValue, 0);
        const step = this.valueStep || 1;

        this._map.clear();
        this._cats.forEach((c, i) => this._map.set(c, start + i * step));
    }
}