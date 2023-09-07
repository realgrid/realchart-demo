////////////////////////////////////////////////////////////////////////////////
// CategoryAxis.ts
// 2023. 06. 21. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isNumber, isString, pickNum, pickNum3 } from "../../common/Common";
import { Axis, AxisGrid, AxisTick, AxisLabel, AxisTickMark, IAxisTick } from "../Axis";
import { IPlottingItem } from "../Series";

export enum CategoryTickPosition {
    /**
     * x축이면 {@link POINT}, y축이면 {@link EDGE}이다.
     */
    DEFAULT = 'default',
    /**
     * 카테고리 중심에 표시한다.
     */
    POINT = 'point',
    /**
     * 축 양끝과 카테고리들 사이에 표시한다.
     */
    EDGE = 'edge'
}

export class CategoryAxisTick extends AxisTick {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    position = CategoryTickPosition.POINT;
    steps = 1;
    /**
     * true이면 steps 상관없이 마지막 tick은 항상 표시된다.
     */
    showLast = false;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getPosition(): CategoryTickPosition {
        if (this.position === CategoryTickPosition.POINT || this.position === CategoryTickPosition.EDGE) {
            return this.position;
        } else {
            return this.axis._isX ? CategoryTickPosition.POINT : CategoryTickPosition.EDGE;
        }
    }
}

/**
 * TODO: y축으로 사용되면 edge 위치에 표시한다.
 */
class CategoryAxisLabel extends AxisLabel {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    getTick(v: any): string {
        if (v != null) {
            return this._getText(v, v, false);
        } else {
            return '';
        }
    }
}

class CategoryAxisGrid extends AxisGrid {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    getPoints(): number[] {
        const apts = (this.axis as CategoryAxis)._pts;
        const n = (this.axis as CategoryAxis)._ticks.length;
        const pts: number[] = [];

        for (let i = 0; i < n; i++) {
            pts.push(apts[i + 2]);
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
    _categories: {c: string, w: number}[];
    _cats: string[];
    _weights: number[];  // 한 카테고리의 상대 너비. 한 카테고리의 기본 크기는 1
    _len: number;
    // private _step = 1;
    private _map: {[key: string]: number} = {}; // data point의 축 위치를 찾기 위해 사용한다.
    private _min: number;
    private _max: number;
    private _catPad = 0;
    _pts: number[];
    _length: number;

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    // /**
    //  * 카테고리가 지정되지 않은 데이터포인트들의 이 축에 해당하는 값을 지정할 때 최초 값.
    //  */
    // startValue = 0;
    // /**
    //  * 카테고리가 지정되지 않은 데이터포인트들의 이 축에 해당하는 값을 지정할 때 값 사이의 간격.
    //  */
    // valueStep = 1;
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
     * 카테고리 항목을 object로 지정할 때에는 name(혹은 label) 속성에 카테고리 이름을,
     * width 속성에 상대 너비(1이 기본 너비)를 지정한다.
     * 첫 번째 값이 {@link startValue}에 해당하고 {@link valueStep}씩 증가한다.
     * 각 카테고리의 상대적 너비를 지정할 수 있다.
     */
    categories: any[];
    // /** 
    //  * 카테고리 하나의 값 크기.
    //  */
    // categoryStep = 1;
    /**
     * 축의 양 끝 카테고리 위치 전후에 여백으로 추가되는 크기.
     * <br>
     * 각각 시작/끝 카테고리에 대한 상대적 크기로 지정한다.
     * {@link minPadding}, {@link maxPadding}으로 별도 지정할 수 있다.
     * 
     * @default 0
     */
    padding = 0;
    /**
     * 축의 시작 카테고리 위치 이 전에 여백으로 추가되는 크기.
     * <br>
     * 카테고리 기본 너비(1)에 대한 상대적 크기로 지정한다.
     * {@link padding} 속성으로 양끝 padding을 한꺼번에 지정할 수 있다.
     * 
     * @default undefined
     */
    minPadding: number;
    /**
     * 축의 끝 카테고리 위치 이 후에 여백으로 추가되는 크기.
     * <br>
     * 카테고리 기본 너비(1)에 대한 상대적 크기로 지정한다.
     * {@link padding} 속성으로 양끝 padding을 한꺼번에 지정할 수 있다.
     * 
     * @default undefined
     */
    maxPadding: number;
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

    protected _createTickModel(): AxisTick {
        return new CategoryAxisTick(this);
    }

    protected _createLabelModel(): AxisLabel {
        return new CategoryAxisLabel(this);
    }

    collectValues(): void {
        this.$_collectCategories(this._series);

        super.collectValues();
    }

    protected _doPrepareRender(): void {
        this._cats = [];
        this._weights = [];

        this._minPad = pickNum3(this.minPadding, this.padding, 0);
        this._maxPad = pickNum3(this.maxPadding, this.padding, 0);

        // category padding
        this._catPad = pickNum(this.categoryPadding, 0);
    }

    protected _doBuildTicks(min: number, max: number, length: number): IAxisTick[] {
        const label = this.label as CategoryAxisLabel;
        let cats = this._cats = this._categories.map(cat => cat.c);
        let weights = this._weights = this._categories.map(cat => cat.w);
        const ticks: IAxisTick[] = [];

        min = this._min = Math.floor(min);
        max = this._max = Math.ceil(max);

        while (cats.length <= max) {
            cats.push(String(cats.length));
            weights.push(1);
        }

        cats = this._cats = cats.slice(min, max + 1);
        weights = weights.slice(min, max + 1);

        const len = this._len = this._minPad + this._maxPad + weights.reduce((a, c) => a + c, 0);
        // const step = this._step = this.categoryStep || 1;
        const pts = this._pts = [0];
        let p = this._minPad;

        for (let i = min; i <= max; i++) {// += step) {
            const w = weights[i - min];

            pts.push(p / len);
            p += weights[i - min];// step
        }
        pts.push(p / len);
        pts.push((p + this._maxPad) / len);

        for (let i = 1; i < pts.length - 2; i++) {
            const v = min + i - 1;

            ticks.push({
                pos: NaN,//this.getPosition(length, v),
                value: v,
                label: label.getTick(cats[i - 1]),
            });
        }
        return ticks;
    }

    calcPoints(length: number, phase: number): void {
        super.calcPoints(length, phase);

        const pts = this._pts;

        if (phase > 0) {
            for (let i = 0; i < pts.length; i++) {
                pts[i] /= this._length;
            }
        }

        this._length = length;
        
        for (let i = 0; i < pts.length; i++) {
            pts[i] *= length;
        }

        const tick = this.tick as CategoryAxisTick;
        let markPoints: number[];

        if (tick.getPosition() === CategoryTickPosition.EDGE) {
            markPoints = pts.slice(1, pts.length - 1);
        } else {
            markPoints = this._ticks.map(t => t.pos);
        }
        this._markPoints = markPoints;
    }

    getPosition(length: number, value: number, point = true): number {
        value -= this._min;
        // data point view는 카테고리 중앙을 기준으로 표시한다.
        if (point) value += 0.5;//this._step / 2;
        const v = Math.floor(value);
        const p = this._pts[v + 1] + (this._pts[v + 2] - this._pts[v + 1]) * (value - v);
        return this.reversed ? length - p : p;
    }

    getUnitLength(length: number, value: number): number {
        const v = Math.floor(value - this._min);
        return (this._pts[v + 2] - this._pts[v + 1]);
    }

    getValue(value: any): number {
        if (isNumber(value)) {
            return value;
        } else {
            return this._map[value];
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_collectCategories(series: IPlottingItem[]): void {
        const categories = this.categories;
        const cats = this._categories = [];

        if (isArray(categories) && categories.length > 0) {
            this._len = 0;

            categories.forEach(cat => {
                let w = cat == null ? 1 : pickNum(cat.weight, 1);
                let c: string;

                if (cat == null) c = null;
                else if (isString(cat)) c = cat;
                else c = cat.name || cat.label;

                this._len += w;
                cats.push({c, w});
            })
        } else {
            if (isArray(series)) {
                for (const ser of series) {
                    const cats2 = ser.collectCategories(this);

                    for (const c of cats2) {
                        if (!cats.find(cat => cat.c === c)) {
                            cats.push({c, w: 1});
                        }
                    }
                }
            }
        }

        this._map = {};
        cats.forEach((cat, i) => this._map[cat.c] = i);

        // console.log(cats);

        // const start = pickNum(this.startValue, 0);
        // const step = this.valueStep || 1;

        // this._map.clear();
        // this._cats.forEach((c, i) => this._map.set(c, i));//start + i * step));
    }
}