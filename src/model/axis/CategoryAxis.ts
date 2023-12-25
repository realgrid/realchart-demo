////////////////////////////////////////////////////////////////////////////////
// CategoryAxis.ts
// 2023. 06. 21. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isNumber, isObject, pickNum, pickNum3, pickProp } from "../../common/Common";
import { DEG_RAD, PI_2 } from "../../common/Types";
import { Utils } from "../../common/Utils";
import { Axis, AxisGrid, AxisTick, AxisLabel, IAxisTick } from "../Axis";
import { IChart } from "../Chart";
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
    position: CategoryTickPosition;
    step = 1;

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
 * //TODO: y축으로 사용되면 edge 위치에 표시한다.
 */
class CategoryAxisLabel extends AxisLabel {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    getTick(index: number, v: any): string {
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
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    getPoints(): number[] {
        const apts = (this.axis as CategoryAxis)._pts;
        const n = (this.axis as CategoryAxis)._ticks.length;
        const pts: number[] = [];

        if (n > 0) {
            for (let i = 0; i <= n; i++) {
                pts.push(apts[i + 1]);
            }
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
 * 4. tick mark나 label은 기본적으로 카테고리 값 위치(카테고리 중앙)에 표시된다.
 *    tick mark는 카테고리 양끝에 표시될 수 있다.
 * 
 * @config chart.xAxis[type=category]
 * @config chart.yAxis[type=category]
 */
export class CategoryAxis extends Axis {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _categories: {c: string, t: string, w: number}[];
    _cats: string[];
    _weights: number[];  // 한 카테고리의 상대 너비. 한 카테고리의 기본 크기는 1
    _len: number;
    // private _step = 1;
    private _map: {[key: string]: number} = {}; // data point의 축 위치를 찾기 위해 사용한다.
    private _catPad = 0;
    private _catMin: number;
    private _catMax: number;
    _pts: number[];

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart, isX: boolean, name?: string) {
        super(chart, isX, name);
    }

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
     * Category 목록을 수집하는 시리즈.\
     * 지정하지 않으면 모든 시리즈에서 카테고리를 수집한다.
     * 
     * @config
     */
    categorySeries: string;
    /**
     * 카테고리로 사용되는 dataPoint 속성.\
     * {@link categories}가 지정되면 이 속성은 무시된다.
     * 
     * @config
     */
    categoryField: string | number;
    /**
     * 명시적으로 지정하는 카테고리 목록.\
     * 카테고리 항목을 object로 지정할 때에는 name(혹은 label) 속성에 카테고리 이름을,
     * width 속성에 상대 너비(1이 기본 너비)를 지정한다.
     * 첫 번째 값이 {@link startValue}에 해당하고 {@link valueStep}씩 증가한다.
     * 각 카테고리의 상대적 너비를 지정할 수 있다.
     * 
     * @config
     */
    categories: any[];
    /**
     * weigth 필드를 제공하는 시리즈.
     * // TODO: 구현할 것!
     */
    weightSeries: string;
    /**
     * weightSeries data에서 weight를 제공하는 필드.
     * // TODO: 구현할 것! (시리즈가 아니라 여기서 지정한 게 맞나?)
     */
    wieghtField: number | string;
    // /** 
    //  * 카테고리 하나의 값 크기.
    //  */
    // categoryStep = 1;
    /**
     * 축의 양 끝 카테고리 위치 전후에 여백으로 추가되는 크기.\
     * 각각 시작/끝 카테고리에 대한 상대적 크기로 지정한다.
     * {@link minPadding}, {@link maxPadding}으로 별도 지정할 수 있다.
     * 
     * @config
     */
    padding = 0;
    /**
     * 축의 시작 카테고리 위치 이 전에 여백으로 추가되는 크기.\
     * 카테고리 기본 너비(1)에 대한 상대적 크기로 지정한다.
     * {@link padding} 속성으로 양끝 padding을 한꺼번에 지정할 수 있다.
     * 
     * @config
     */
    minPadding: number;
    /**
     * 축의 끝 카테고리 위치 이 후에 여백으로 추가되는 크기.\
     * 카테고리 기본 너비(1)에 대한 상대적 크기로 지정한다.
     * {@link padding} 속성으로 양끝 padding을 한꺼번에 지정할 수 있다.
     * 
     * @config
     */
    maxPadding: number;
    /**
     * 각 카테고리의 양 끝에 추가되는 여백의 카테고리에 너비에 대한 상대적 크기.
     * 
     * @config
     */
    categoryPadding = 0.1;
    /**
     * polar 축일 때 시작 위치 간격.\
     * 첫번째 카테고리 너비(각도)에 대한 상대값으로 0~1 사이의 값을 지정한다.
     * ex) 0.5로 지정하면 bar 시리즈의 첫 째 bar가 12시 위치에 표시된다.
     * 
     * @config
     */
    startOffset = 0;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getCategories(): string[] {
        return this._cats;
    }

    getCategory(index: number): string {
        return this._cats[index];
    }

    xValueAt(pos: number): number {
        for (let i = 2; i < this._pts.length - 1; i++) {
            if (pos >= this._pts[i - 1] && pos < this._pts[i]) {
                return (this._zoom ? this._zoom.start : this._catMin) + i - 2;
            }
        }
        return -1;
    }

    getWdith(length: number, category: number): number {
        return 0;
    }

    categoryPad(): number {
        return this._catPad;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'category';
    }

    isContinuous(): boolean {
        return false;
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
        // [주의] collectValues()에서 category에 해당하는 값을 가져올 수 있다면 순서를 바꿔야 한다.
        this.$_collectCategories(this._series);

        if (this._series.length > 0) {
            super.collectValues();
        } else {
            // 시리즈가 연결되지 않은 category 축을 categories 설정만으로 표시할 수 있다.
            this._values = Utils.makeIntArray(0, this._categories.length);
        }
    }

    getStartAngle(): number {
        let start = super.getStartAngle();
        let a = +this.startOffset;

        if (a > 0) {
            start -= Math.min(a, 1) * this._categories[0].w * PI_2 / this._len;
        }
        return start;
    }

    protected _doPrepareRender(): void {
        this._cats = [];
        this._weights = [];

        if (this._isPolar || this._zoom) {
            this._minPad = this._maxPad = this._catPad = 0;
        } else {
            this._minPad = pickNum3(this.minPadding, this.padding, 0);
            this._maxPad = pickNum3(this.maxPadding, this.padding, 0);
            // category padding
            this._catPad = pickNum(this.categoryPadding, 0);
        }
    }

    protected _doBuildTicks(min: number, max: number, length: number): IAxisTick[] {
        const label = this.label as CategoryAxisLabel;
        let cats = this._categories.map(cat => cat.c);
        let weights = this._weights = this._categories.map(cat => cat.w);
        const steps = (this.tick as CategoryAxisTick).step || 1;
        const ticks: IAxisTick[] = [];
        const minSave = min;
        const maxSave = max;

        min = this._catMin = Math.floor(min + 0.5);
        max = this._catMax = Math.ceil(max - 0.5);

        let len = max - min + 1;

        for (let i = -1; i >= min; i--) {
            cats.unshift(String(i));
            weights.unshift(1);
        }
        while (cats.length < len) {
            cats.push(String(cats.length + min));
            weights.push(1);
        }

        cats = this._cats = cats.slice(0, len);
        weights = weights.slice(0, len);

        len = this._len = this._minPad + this._maxPad + weights.reduce((a, c) => a + c, 0);

        if (len > 0) {
            // const step = this._step = this.categoryStep || 1;
            const pts = this._pts = [0];
            let p = this._minPad;

            for (let i = min; i <= max; i++) {// += step) {
                pts.push(p / len);
                p += weights[i - min];// step
            }
            pts.push(p / len);
            pts.push((p + this._maxPad) / len);

            for (let i = 1; i < pts.length - 2; i += steps) {
                const v = min + i - 1;
                const c = this._categories[min + i - 1];

                ticks.push({
                    index: i - 1,
                    pos: NaN,
                    value: v,
                    label: label.getTick(i - 1, c ? c.t : cats[i - 1]),
                });
            }
        } else {
            this._pts = [];
        }

        this._setMinMax(minSave, maxSave);
        return ticks;
    }

    calcPoints(length: number, phase: number): void {
        super.calcPoints(length, phase);

        const pts = this._pts;

        if (phase > 0) {
            for (let i = 0; i < pts.length; i++) {
                pts[i] /= this._vlen;
            }
        }
        
        for (let i = 0; i < pts.length; i++) {
            pts[i] *= length;
        }

        if (this._isPolar) {
            if (phase > 0) {
                // getPosition()에서 바로 각도를 리턴할 수 있도록...
                const total = this.totalAngle * DEG_RAD;
                this._pts = pts.map(t => t / length * total);
            }
        } else {
            const tick = this.tick as CategoryAxisTick;
            let markPoints: number[];

            if (tick.getPosition() === CategoryTickPosition.EDGE) {
                markPoints = pts.slice(1, pts.length - 1);
            } else {
                markPoints = this._ticks.map(t => t.pos);
            }
            this._markPoints = markPoints;
        }
    }

    getPos(length: number, value: number): number {
        const pts = this._pts;
        const v = Math.floor(value - this._catMin + 0.5);
        const p = pts[v + 1] + (pts[v + 2] - pts[v + 1]) * (value - Math.floor(value + 0.5) + 0.5);

        // if (this._isPolar) {
        //     // length는 원주, 각도를 리턴한다.
        //     return p * length / PI_2;
        // } else {
            return this.reversed ? length - p : p;
        // }
    }

    valueAt(length: number, pos: number): number {
        if (this.reversed) {
            pos = length - pos;
        }
        for (let i = 1; i < this._pts.length - 1; i++) {
            if (pos >= this._pts[i] && pos < this._pts[i + 1]) {
                return this._catMin + i - 0.5;
            }
        }
    }

    getUnitLen(length: number, value: number): number {
        const v = Math.floor(value - this._catMin + 0.5);

        return (this._pts[v + 2] - this._pts[v + 1]);
    }

    getValue(value: any): number {
        if (isNumber(value)) {
            return value;
        } else {
            return this._map[value];
        }
    }

    value2Tooltip(value: number): any {
        return this._cats[value] || value;
    }

    getXValue(value: number) {
        return this.getCategory(value - this._catMin);
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
                let t: string;

                if (cat == null) {
                    t = c = null;
                } else if (isObject(cat)) {
                    c = pickProp(cat.name, cat.label);
                    t = pickProp(cat.label, cat.name);
                } else {
                    t = c = String(cat);
                }

                this._len += w;
                cats.push({c, t, w});
            })
        } else {
            if (isArray(series)) {
                for (const ser of series) {
                    const cats2 = ser.collectCategories(this);

                    for (const c of cats2) {
                        if (!cats.find(cat => cat.c === c)) {
                            cats.push({c, w: 1, t: c});
                        }
                    }
                }
            }
        }

        this._map = {};
        cats.forEach((cat, i) => {
            if (cat.c != null) this._map[cat.c] = i}
        );
    }
}