////////////////////////////////////////////////////////////////////////////////
// Axis.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isNumber, isObject, isString, maxv, minv, pickNum, pickProp } from "../common/Common";
import { RcAnimation } from "../common/RcAnimation";
import { IRichTextDomain } from "../common/RichText";
import { Align, DEG_RAD, ORG_ANGLE, SVGStyleOrClass, VerticalAlign, _undef, fixnum, isNull } from "../common/Types";
import { Utils } from "../common/Utils";
import { IChart } from "./Chart";
import { ChartItem, ChartTextOverflow, FormattableText, IconedText, LabelIconPostion } from "./ChartItem";
import { Crosshair } from "./Crosshair";
import { IClusterable, IPlottingItem, ISeries } from "./Series";

/**
 * @internal
 */
export interface IAxis {
    _type(): string;
    chart: IChart;
    row: number;
    col: number;
    _isX: boolean;
    _isHorz: boolean;
    _isOpposite: boolean;
    _isBetween: boolean;

    reversed: boolean;
    _vlen: number;
    _zoom: IAxisZoom;

    continuous(): boolean;
    getBaseValue(): number;
    axisMax(): number;
    axisMin(): number;
    length(): number;

    zoom(start: number, end: number): boolean;

    /**
     * data point의 값을 축 상의 값으로 리턴한다.
     */
    getValue(value: any): number;
    getXValue(value: number): any;
    contains(value: number): boolean;
    incStep(value: number, step: any): number;
    /**
     * 값(축 상 위치)에 해당하는 픽셀 위치.
     */
    getPos(length: number, value: number): number;
    valueAt(length: number, pos: number): number;
    axisValueAt(length: number, pos: number): any;
    xValueAt(pos: number): number;
    /**
     * 값(축 상 위치)에 해당하는 축 단위 픽셀 크기. 
     * <br>
     * 값에 따라 크기가 다를 수도 있다.
     */
    getUnitLen(length: number, value: number): number;

    value2Tooltip(value: number): any;

    hasBreak(): boolean;
    isBreak(pos: number): boolean;
}

/**
 * @internal
 */
export abstract class AxisItem extends ChartItem {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    readonly axis: Axis;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(axis: Axis, visible = true) {
        super(axis?.chart, visible);

        this.axis = axis;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
}

/**
 * 축 선(line) 설정 모델.<br/>
 * @config
 */
export class AxisLine extends AxisItem {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(axis: Axis, visible: boolean) {
        super(axis, visible && axis._isX);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doLoadSimple(source: any): boolean {
        return this._loadStroke(source) || super._doLoadSimple(source);
    }
}

export enum AxisTitleAlign {
    START = 'start',
    MIDDLE = 'middle',
    END = 'end'
}

/**
 * 축 타이틀 설정 모델.
 */
export class AxisTitle extends AxisItem {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _rotation: number;

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 타이틀 텍스트.\
     * 지정하지 않으면 타이틀 영역 자체가 없어진다.
     * 
     * @config
     */
    text: string;
    /**
     * 텍스트 회전 각도.\
     * 수직 축일 때는 0, 90, 270, -90, -270 중 하나로 지정할 수 있다.
     * 수평 축일 때는 무조건 0이다.
     * 
     * @default undefined 수직 축일 때 왼쪽에 표시되면 90, 오른쪽에 표시되면 270, 수평 축일 때는 0
     * @config
     */
    get rotation(): 0 | 90 | 270 | -90 | -270 {
        return this._rotation as any;
    }
    set rotation(value: 0 | 90 | 270 | -90 | -270) {
        let v = +value;

        if (!Number.isNaN(v) && !(v === 90 || v === 270 || v === -90 || v === -270)) {
            v = 0;
        }
        this._rotation = v;
    }
    /**
     * 축 내에서 타이틀의 위치.\
     * {@link offset}으로 경계 지점과의 간격을 지정할 수 있다.
     * 
     * @config
     */
    align = AxisTitleAlign.MIDDLE;
    /**
     * {@link align} 기준으로 배치할 때 경계 지점과의 간격.\
     * plus 값을 지정하면 차트 안쪽으로 들어온다.
     * align이 'middle'일 때는 음수일 때 축 시작값 쪽으로 밀린다.
     * 
     * @config
     */
    offset = 0;
    /**
     * 타이틀과 틱 label들, 혹은 축 선 사이의 간격을 픽셀 단위로 지정한다.
     * 
     * @default 5 pixels
     * @config
     */
    gap = 5;
    /**
     * 타이틀 배경 스타일.
     * 
     * @config
     */
    backgroundStyle: SVGStyleOrClass;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    isVisible(): boolean {
        return this.visible && !isNull(this.text);
    }

    getRotation(axis: Axis): number {
        if (axis._isHorz) {
            return 0;
        } else if (isNaN(this._rotation)) {
            return axis.position === AxisPosition.OPPOSITE ? 90 : 270;
        } else {
            return this._rotation;
        }
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doLoadSimple(source: any): boolean {
        if (isString(source)) {
            this.text = source;
            return true;
        }
        return super._doLoadSimple(source);
    }
}

export interface IAxisGridRow {
    axis: Axis;
    from: number;
    to: number;
    color: string;
}

/**
 * 축 그리드 사이에 생성된 영역 표시 설정 모델.
 */
export class AxisGridRows extends AxisItem {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    /**
     * 각 row를 칠(fill)하는 데 사용되는 색상 스타일들을 지정한다.\
     * 칠하지 않는 영역은 null로 지정하면 되고, 개수가 모자라면 반복된다.
     * 
     * @config
     */
    colors: string[];
    /**
     * axis의 baseValue 이전 영역을 칠(fill)하는 데 사용되는 색상.\
     * {@link colors} 설정에 따른 칠 이 전에 칠해진다.
     * 
     * @config
     */
    belowColor: string;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getRows(): IAxisGridRow[] {
        const axis = this.axis;
        const colors = this.colors;
        const n = colors ? colors.length : 0;
        const rows: IAxisGridRow[] = [];

        if (this.belowColor) {
            if (axis.isBaseVisible()) {
                rows.push({
                    axis,
                    from: axis.axisMin(),
                    to: axis.getBaseValue(),
                    color: this.belowColor
                });
            }
        }

        if (n > 0) {
            const ticks = axis._ticks;
            let c = 0;

            if (ticks[0].value > axis.axisMin()) {
                if (colors[c % n]) {
                    rows.push({
                        axis,
                        from: axis.axisMin(),
                        to: ticks[0].value,
                        color: colors[c % n]
                    })
                }
                c++;
            }
            for (let i = 1; i < ticks.length; i++, c++) {
                if (colors[c % n]) {
                    rows.push({
                        axis,
                        from: ticks[i - 1].value,
                        to: ticks[i].value,
                        color: colors[c % n]
                    })
                }
            }
            if (ticks[ticks.length - 1].value < axis.axisMax()) {
                if (colors[c % n]) {
                    rows.push({
                        axis,
                        from: ticks[ticks.length - 1].value,
                        to: axis.axisMax(),
                        color: colors[c % n]
                    })
                }
            }
        }
        return rows;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doLoadSimple(source: any): boolean {
        if (isString(source)) {
            this.colors = [source, null];
            return true;
        } else if (isArray(source)) {
            this.colors = source;
            return true;
        }
        return super._doLoadSimple(source);
    }
}

/**
 * Axis tick의 위치에 수평 혹은 수직선으로 plot 영역을 구분 표시한다.\
 * {@link visible} 기본값이 undefined인데,
 * visible이 undefined나 null로 지정되면, 축 위치에 따라 visible 여부가 결정된다.
 */
export abstract class AxisGrid extends AxisItem {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(axis: Axis) {
        super(axis, null);

        this.rows = new AxisGridRows(this.axis);
        this.lastVisible = !axis._isX;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * @config
     */
    rows: AxisGridRows;
    /**
     * 시작 값에 표시되는 그리드 선을 표시할 지 여부.
     * 
     * @config
     */
    firstVisible = false;
    /**
     * 끝 값에 표시되는 그리드 선을 표시할 지 여부.
     * 
     * @default x축이면 false, y축이면 true.
     * @config
     */
    lastVisible: boolean;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    isVisible(polar: boolean): boolean {
        if (polar) return this.visible !== false;
        else return this.visible == null ? !this.axis._isX : this.visible;
    }

    abstract getPoints(length: number): number[];
            
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
}

/**
 * 축 가이드 label 설정 모델.
 * 
 * @config
 */
export class AxisGuideLabel extends IconedText {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart) {
        super(chart, true);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 수평 정렬.
     * 
     * @config
     */
    align = Align.LEFT;

    /**
     * 수직 정렬.
     * 
     * @config
     */
    verticalAlign = VerticalAlign.TOP;
    /**
     * label과 가이드 사이의 수평 간격.
     * 
     * @config
     */
    offsetX = 3;
    /**
     * label과 가이드 사이의 수직 간격.
     * 
     * @config
     */
    offsetY = 3;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    getDefaultIconPos(): LabelIconPostion {
        return LabelIconPostion.LEFT;
    }
}

export enum AxisGuideType {
    /**
     * 축 위의 특정한 값에 선분을 표시한다.
     * 
     * @config
     */
    LINE = 'line',
    /**
     * 축 위 특정한 두 값 사이의 영역을 구분 표시한다.
     * 
     * @config
     */
    RANGE = 'range',
    /**
     * Plot 영역에 (x, y)로 지정하는 값 좌표의 배열로 설정되는 다각형을 표시한다.
     * 
     * @config
     */
    AREA = 'area'
}

/**
 * 기본적으로 이 축에 연결된 모든 body에 모두 표시된다.
 * col, row를 지정해서 특정 body에만 표시되도록 할 수 있다.
 */
export abstract class AxisGuide extends AxisItem {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(axis: Axis) {
        super(axis);

        this.label = new AxisGuideLabel(axis.chart);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * label 모델.
     * 
     * @config
     */
    readonly label: AxisGuideLabel;
    /**
     * true면 시리즈들보다 위에 표시된다.
     * 
     * @config
     */
    front = false;
    /**
     * 모든 guide들 중에서 값이 클수록 나중에 그려진다.
     * 
     * @config
     */
    zindex = 0;
    col: number | number[];
    row: number | number[];

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    canConstainedTo(row: number, col: number): boolean {
        if (isArray(this.col)) {
            for (const c of this.col) {
                if (col == c) return true;
            }
            return false;
        } else if (!isNaN(this.col)) {
            if (col != this.col) return false;
        }
        if (isArray(this.row)) {
            for (const r of this.row) {
                if (row == r) return true;
            }
            return false;
        } else if (!isNaN(this.row)) {
            if (row != this.row) return false;
        }
        return true;
    }
}

export class AxisLineGuide extends AxisGuide {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 가이드 선이 표시될 축 상의 위치에 해당하는 값.
     * 
     * @config
     */
    value: number; // TODO: RtPercentSize
}

/**
 * [주의] realchart-style.css에 fill-opacity가 0.2로 설정되어 있다.
 */
export class AxisRangeGuide extends AxisGuide {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 가이드 영역의 시작 값.
     * 
     * @config
     */
    startValue: number;  // TODO: RtPercentSize
    /**
     * 가이드 영역의 끝 값.
     * 
     * @config
     */
    endValue: number;
}

// /**
//  * 기본적으로 tick 위치에 선으로 표시된다.
//  */
// export class AxisTickMark extends AxisItem {

//     //-------------------------------------------------------------------------
//     // property fields
//     //-------------------------------------------------------------------------
//     /**
//      * 선의 길이.
//      * 
//      * @link
//      */
//     length = 7;

//     //-------------------------------------------------------------------------
//     // fields
//     //-------------------------------------------------------------------------
// }

/**
 * 축에 표시되는 tick 위치와 표시 마크에 관한 설정 모델.
 */
export abstract class AxisTick extends AxisItem {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    /**
     * axis tick line length.
     * 
     * @config
     */
    length = 7;
    /**
     * tick 라인과 다른 요소(label이나 title) 사이의 간격.
     * 
     * @config
     */
    gap = 3;
    // /**
    //  * true면 다른 설정과 상관없이 첫번째 tick은 항상 표시된다.
    //  */
    // showFirst: boolean;
    // /**
    //  * true면 다른 설정과 상관없이 마지막 tick은 항상 표시된다.
    //  */
    // showLast: boolean;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(axis: Axis) {
        super(axis, false);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    canUseNumSymbols(): boolean {
        return true;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doLoadSimple(source: any): boolean {
        if (Utils.canNumber(source)) {
            this.length = +source;
            return true;
        }
        return super._doLoadSimple(source);
    }
    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}

export enum AxisLabelArrange {
    /**
     * label들이 겹치도록 놔둔다.
     * // TODO: @{link overflow} 설정이 적용된다.
     * 
     * @config
     */
    NONE = 'none',
    /**
     * -45도 회전시킨다.
     * 
     * @config
     */
    ROTATE = 'rotate',
    /**
     * label들이 겹치지 않도록 건너 뛰면서 배치한다.
     * <br>
     * {@link startStep}으로 지정된 step부터 배치된다.
     * 
     * @config
     */
    STEP = 'step',
    /**
     * label들이 겹치지 않도록 여러 줄로 나누어 배치한다.
     * <br>
     * 
     * @config
     */
    ROWS = 'rows'
}

export interface IAxisLabelArgs {
    axis: object;
    count: number;
    index: number;
    value: number;
}

/**
 * 축 label 설정 모델.<br/>
 * 
 * //[겹치는 경우가 발생할 때]
 * //1. step이 0보다 큰 값으로 설정되면 반영한다.
 * //2. rows가 0보다 큰 값으로 설정되면 반영한다.
 * //3. rotation이 0이 아닌 명시적 값으로 설정되면 반영한다.
 * //4. 1~3 모두 설정되지 않은 경우 autoArrange 설정에 따라 자동 배치한다.
 * //5. 배치 후 공간을 초과하는 label은 wrap 속성에 따라 줄나누기를 하거나, 
 * //  ellipsis('...')로 처리해서 표시한다.
 */
export abstract class AxisLabel extends IconedText {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _paramTick: IAxisTick;
    _domain: IRichTextDomain = {
        callback: (target: any, param: string): any => {
            return this._getParamValue(this._paramTick, param);
        },
    };

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(public axis: Axis) {
        super(axis && axis.chart, true);

        // 기본은 ','이 포함된다. axis label에 ','를 포함시키지 않도록 한다.
        this.numberFormat = null;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * label 표시 간격.\
     * 1이면 모든 tick 표시. 2이면 하나씩 건너 띄어서 표시.
     * 2 이상일 때 {@link startStep}으로 지정된 step부터 배치된다.
     * 
     * @config
     */
    step = 0;
    /**
     * step이 2 이상이 될 때, 표시가 시작되는 label 위치.
     * 
     * @config
     */
    startStep = 0;
    /**
     * 수평 축일 때 tick label 배치 행 수.\
     * 1은 한 줄, 2면 두 줄 등으로 여러 줄로 나눠서 표시한다.
     * 
     * @config
     */
    rows = 0;
    /**
     * {@link autoArrange} {@link AxisLabelArrange.ROWS}로 자동 정렬되는 경우 최대 행 수.
     * 이 행 수 이상이 필요한 경우 label 간격을 두어 표시한다.
     * // TODO: 구현할 것!
     */
    maxRows = 3;
    /**
     * 수평 축일 때, tick label 표시 회전 각도.
     * -90 ~ 90 사이의 각도로 지정할 수 있다.
     * 
     * @config
     */
    rotation: number;
    /**
     * 기본 설정이나 {@link step}, {@link rows}, {@link rotation} 속성들을 명시적으로 설정한 경우에도
     * label들이 본래 차지하는 공간을 초과할 때,
     * label들을 재배치하는 방식을 지정한다.
     * 
     * @config
     */
    autoArrange = AxisLabelArrange.ROTATE;
    /**
     * // TODO:
     * label 배치 후 텍스트가 차지하는 공간을 넘치는 경우 처리 방식.
     */
    overflow = ChartTextOverflow.CLIP;
    /**
     * 첫번째 tick 라벨에 표시될 텍스트.
     * 
     * @config
     */
    firstText: string;
    /**
     * 마지막 tick 라벨에 표시될 텍스트.
     * 
     * @config
     */
    lastText: string;
    /**
     * 첫번째 tick 라벨에 추가로 적용되는 스타일.
     * 
     * @config
     */
    firstStyle: SVGStyleOrClass;
    /**
     * 마지막 tick 라벨에 추가로 적용되는 스타일.
     * 
     * @config
     */
    lastStyle: SVGStyleOrClass;
    /**
     * 축 tick 라벨에 표시될 텍스트를 리턴한다.\
     * undefined나 null을 리턴하면 {@link text} 속성 등에 설정된 값으로 표시하거나,
     * 값에 따라 자동 생성되는 텍스트를 사용한다.
     * 빈 문자열 등 정상적인 문자열을 리턴하면 그 문자열대로 표시된다. 
     * {@link prefix}나 포맷 속성 등은 적용되지 않는다.
     * 
     * @config
     */    
    textCallback: (args: IAxisLabelArgs) => string;
    /**
     * 라벨 별로 추가 적용되는 스타일을 리턴한다.\
     * 기본 설정을 따르게 하고 싶으면 undefined나 null을 리턴한다.
     * 
     * @config
     */
    styleCallback: (args: IAxisLabelArgs) => SVGStyleOrClass;
    /**
     * 축 label과 함께 표시될 icon url을 리턴한다.
     */
    iconCallback: (args: IAxisLabelArgs) => string;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    abstract getTick(index: number, value: any): string;

    protected _getParamValue(tick: IAxisTick, param: string): any {
        if (param.startsWith('axis.')) {
            return this.axis[param.substring(5)];
        } else {
            return tick[param];
        }
    }

    getLabelText(tick: IAxisTick, count: number): string {
        const idx = tick.index;

        if (this.textCallback) {
            const s = this.textCallback(this.axis.getTickLabelArgs(idx, tick.value));
            if (s != null) return s;
        }

        // [주의] 빈 문자열을 지정할 수 있다.
        if (idx === 0) return pickProp(this.firstText, this.text);
        if (idx === count - 1) return pickProp(this.lastText, this.text);
        return this.text;
    }

    getLabelStyle(tick: IAxisTick, count: number): any {
        const idx = tick.index;

        if (this.styleCallback) {
            const st = this.styleCallback(this.axis.getTickLabelArgs(idx, tick.value));
            if (isObject(st)) return st;
        }
        if (idx === 0) return this.firstStyle;
        if (idx === count - 1) return this.lastStyle;
    }

    getIcon(tick: IAxisTick): string {
        return;
    }

    getDefaultIconPos(): LabelIconPostion {
        return this.axis._isHorz ? LabelIconPostion.TOP : LabelIconPostion.RIGHT;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doPrepareRender(chart: IChart): void {
        super._doPrepareRender(chart);

        this._domain.numberFormatter = this._numberFormatter;
    }
}

export interface IAxisTick {
    index: number;
    value: number;
    pos: number;
    label: string;
}

export enum AxisPosition {
    /**
     * 상대 축에 따라 위치를 조정한다.
     * x축이 reversed이면 y축이 반대 쪽에 표시되고,
     * y축이 reversed이면 x축이 반대 쪽에 표시된다.
     */
    AUTO = 'auto',
    /**
     * X축은 아래쪽에 수평으로, Y축은 왼쪽에 수직으로 표시된다.
     * <br>
     * {@link Chart.inverted}이면 Y축이 아래쪽에 수평으로, X축은 왼쪽에 수직으로 표시된다.
     * 
     * @config
     */
    NORMAL = 'normal',
    /**
     * X축은 위쪽에 수평으로, Y축은 오른쪽에 수직으로 표시된다.
     * <br>
     * {@link Chart.inverted}이면 Y축이 위쪽에 수평으로, X축은 오른쪽에 수직으로 표시된다.
     * 
     * @config
     */
    OPPOSITE = 'opposite',
    /**
     * 상대 축의 baseValue 지점에 표시된다.
     * <br>
     * [주의] 
     * 1. 축에 연결된 시리즈들이 BarSeries 계열일 때만 가능하다.
     * 2. 차트의 X축 하나에만 적용할 수 있다. 두번째로 지정된 축의 속성은 {@link NORMAL}로 적용된다.
     * 3. 상대 축이 **linear** 가 아니거나 {@link LinearAxis.baseValue}가 min 보다 작거나 max보다 크면 이 값은 무시되고,
     *    {@link NORMAL}로 적용된다.
     * 
     * @config
     */
    BASE = 'base',
    /**
     * Y축이고, 축이 연결되는 body가 분할 상태일 때, 중간 분할 위치에 표시한다.
     */
    BETWEEN = 'between'
}

/**
 * 축 스크롤바 모델.<br/>
 * 축 스크롤 상태를 표시하고, 사용자가 스크롤 범위나 위치를 변경할 수 있다.
 */
export class AxisScrollBar extends AxisItem {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    private _thickness = 10;
    private _minThumbSize = 32;
    private _gap = 3;
    private _gapFar = 3;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(axis: Axis) {
        super(axis, false);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 스크롤바 두께.
     * 
     * @default 10 픽셀
     * @config
     */
    get thickness(): number {
        return this._thickness;
    }
    set thickness(value: number) {
        this._thickness = +value || this._thickness;
    }
    /**
     * 최소 thumb 길이.
     * 
     * @default 32 픽셀
     * @config
     */
    get minThumbSize(): number {
        return this._minThumbSize;
    }
    set minThumbSize(value: number) {
        this._minThumbSize = +value || this._minThumbSize;
    }
    /**
     * 스크롤바와 차트 본체 방향 사이의 간격.
     * 
     * @default 3 픽셀
     * @config
     */
    get gap(): number {
        return this._gap;
    }
    set gap(value: number) {
        this._gap = +value || this._gap;
    }
    /**
     * 스크롤바와 차트 본체 반대 방향 사이의 간격.
     * 
     * @default 3 픽셀
     * @config
     */
    get gapFar(): number {
        return this._gapFar;
    }
    set gapFar(value: number) {
        this._gapFar = +value || this._gapFar;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
}

export interface IAxisZoom {
    start: number;
    end: number;
}

export class AxisZoom {

    min: number;
    max: number;
    start: number;
    end: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(public axis: Axis) {
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    total(): number {
        return this.max - this.min;
    }

    length(): number {
        return this.end - this.start;
    }

    isFull(): boolean {
        return this.start === this.min && this.end === this.max;
    }
    
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    resize(start: number, end: number, minSize: number): boolean {
        start = isNaN(start) ? this.start : maxv(this.min, minv(this.max, start));
        end = isNaN(end) ? this.end : maxv(start, minv(this.max, end));

        if (start > end) {
            const t = start;
            start = end;
            end = t;
        }

        // 최소 크기를 갖게 한다. #244 #245
        const len = this.max - this.min;

        if ((start !== this.start || end !== this.end) && end > start && (isNaN(minSize) || (end - start) / len >= minSize) && (len / (end - start) > 1)) {
            this.start = start;
            this.end = end;
            return true;
        }
    }
}

/**
 * 부채꼴 polar 좌표계의 X 축일 때 원호의 양 끝과 중심에 연결되는 선분들의 설정모델.<br/>
 * {@link config.xAxis.category#startAngle startAngle}, {@link config.xAxis.category#totalAngle totalAngle}을 참조한다.
 * 
 * @config
 */
export class AxisSectorLine extends AxisLine {
}

/**
 * 축 모델.\
 * 차트에서 축을 명식적으로 지정하지 않으면, 첫번째 시리즈에 합당한 축이 기본 생성된다.\
 * {@link guide.axes 축 개요} 페이지를 참조한다.
 * @config chart.axis[base]
 */
export abstract class Axis extends ChartItem implements IAxis {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _index: number;
    _row: number;
    _col: number;
    _isX: boolean;
    _isHorz: boolean;
    _isOpposite: boolean;
    _isBetween: boolean;
    _isPolar: boolean;
    protected _series: IPlottingItem[] = [];
    _range: { min: number, max: number };
    _ticks: IAxisTick[];
    _markPoints: number[];
    _vlen: number;
    _zoom: AxisZoom;
    _minPad = 0;
    _maxPad = 0;
    _values: number[] = [];
    protected _min: number;
    protected _max: number;
    protected _single: boolean;
    _runPos: AxisPosition;
    _labelArgs: IAxisLabelArgs = {} as any;
    _prevSeries: IPlottingItem[];
    _seriesChanged = false;
    _prevRate: number;
    _zooming: boolean;

    _animating(): boolean {
        return !isNaN(this._prevRate);
    }

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart, isX: boolean, name?: string) {
        super(chart, true);

        this._isX = isX;
        this.name = name;
        this.title = new AxisTitle(this);
        this.line = new AxisLine(this, true);
        this.sectorLine = new AxisSectorLine(this, true);
        this.tick = this._createTickModel();
        this.label = this._createLabel();
        this.grid = this._createGrid();
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    abstract _type(): string;

    /**
     * @config
     */
    readonly name: string;
    /**
     * @config
     */
    readonly title: AxisTitle;
    /**
     * @config
     */
    readonly line: AxisLine;
    /**
     * 부채꼴 polar 좌표계의 X 축일 때 원호의 양 끝과 중심에 연결되는 선분들의 설정모델.<br/>
     * {@link config.xAxis.category#startAngle startAngle}, {@link config.xAxis.category#totalAngle totalAngle}을 참조한다.
     * 
     * @config
     */
    readonly sectorLine: AxisSectorLine;
    /**
     * @config
     */
    readonly tick: AxisTick;
    /**
     * @config
     */
    readonly label: AxisLabel;
    /**
     * visible 기본값이 undefined이다.
     * visible이 undefined나 null로 지정되면, 축 위치에 따라 visible 여부가 결정된다.
     * @config
     */
    readonly grid: AxisGrid;
    /**
     * @config
     */
    readonly guides: AxisGuide[] = [];
    /**
     * @config
     */
    readonly crosshair = new Crosshair(this);
    /**
     * @config
     */
    readonly scrollBar = new AxisScrollBar(this);

    /**
     * 분할 모드일 때 축이 표시될 pane의 수직 위치.
     * @config
     */
    row = 0;
    /**
     * 분할 모드일 때 축이 표시될 pane의 수평 위치.
     * @config
     */
    col = 0;
    /**
     * Polar 차트에서 사용될 때 시작 각도.
     * 
     * @config
     */
    startAngle = 0;
    /**
     * Polar 차트에서 사용될 때 원호 전체 각도.
     * 0 ~ 360 사이의 값으로 지정해야 한다.
     * 범위를 벗어난 값은 범위 안으로 조정된다.
     * 지정하지 않거나 잘못된 값이면 360으로 계산된다.
     * 
     * @config
     */
    totalAngle = 360
    /**
     * 표시 위치.
     * 기본적으로 상대 축의 원점 쪽에 표시된다.
     * 
     * @config
     */
    position = AxisPosition.NORMAL;
    /**
     * true면 반대 방향으로 point 위치들이 지정된다.
     * 
     * @config
     */
    reversed = false;
    /**
     * 명시적으로 지정하는 최소값.
     * 
     * @config
     */
    minValue: number;
    /**
     * 명시적으로 지정하는 최대값.
     * 
     * @config
     */
    maxValue: number;
    /**
     * plot 영역이나 먼저 표시되는 축 사이의 여백 크기.
     * 
     * @config
     */
    marginNear = 0;
    /**
     * 차트 경계나 뒤쪽 축 사이의 여백 크기.
     * 
     * @config
     */
    marginFar = 0;
    /**
     * label 등에 표시할 수 있는 단위 정보 문자열.
     * 
     * @config
     */
    unit: string;
    /**
     * 축에 포함된 시리즈들 툴팁의 위쪽에 표시되는 텍스트.
     * 
     * tooltipHeader
     * tooltipRow,
     * tooltipRow,
     * ...
     * tooltipFooter
     * 형태로 툴팁이 표시된다.
     * 
     * @config
     */
    tooltipHeader = '<b>${name}</b>';
    /**
     * 축에 포함된 각 시리즈별 표시되는 포인트 툴팁 텍스트.
     * 
     * @config
     */
    tooltipRow = '${series}:<b> ${yValue}</b>';
    /**
     * 축에 포함된 시리즈들 툴팁의 아래쪽에 표시되는 텍스트.
     * 
     * @config
     */
    tooltipFooter: string;
    animatable = true;
    /**
     * true로 지정하면 새로 계산된 너비나 높이가 이전 계산된 크기보다 작으면 이전 크기를 유지한다.
     * 
     * @config
     */
    fixedSize = false;
    /**
     * 최소 너비나 높이.
     */
    //minSize: number;

    isEmpty(): boolean {
        return this._series.length < 1;
    }

    getBaseValue(): number {
        return NaN;
    }

    length(): number {
        return this._max - this._min;
    }
    
    axisMin(): number {
        return this._min;
    }

    axisMax(): number {
        return this._max;
    }

    abstract continuous(): boolean;
    abstract valueAt(length: number, pos: number): number;

    axisValueAt(length: number, pos: number): any {
        return this.valueAt(length, pos);
    }

    getStartAngle(): number {
        return ORG_ANGLE + DEG_RAD * this.startAngle;
    }

    getTotalAngle(): number {
        return DEG_RAD * maxv(0, minv(360, pickNum(this.totalAngle, 360)));
    }

    isArced(): boolean {
        return this.totalAngle > 0 && this.totalAngle < 360;
    }

    getVisibleSeries(): ISeries[] {
        const series: ISeries[] = [];

        this._series.forEach(ser => {
            ser.visible && series.push(...ser.getVisibleSeries());
        })
        return series;
    }

    unitPad(): number {
        return 0;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    protected abstract _createTickModel(): AxisTick;
    protected abstract _createLabel(): AxisLabel;
    protected abstract _doPrepareRender(): void;
    protected abstract _doBuildTicks(min: number, max: number, length: number): IAxisTick[];

    value2Tooltip(value: number): any {
        return value;
    }

    isBased(): boolean {
        return false;
    }

    isBaseVisible(): boolean {
        return this.axisMin() < this.getBaseValue();
    }

    disconnect(): void {
        this._series = [];
        // this._values = [];
    }

    collectValues(): void {
        this._values = [];
        this._series.forEach(item => {
            item.collectValues(this, this._values);
        })
    }

    collectRanges(): void {
        this._series.forEach(item => {
            item.collectRanges(this._values);
        })
    }

    collectReferentsValues(): void {
        this._series.forEach(item => {
            item.pointValuesPrepared(this);
        })
    }

    prepareRender(): void {
        this._isHorz = this.chart.isInverted() ? !this._isX : this._isX;
        this._isBetween = this.chart.isSplitted() && this.position === AxisPosition.BETWEEN && this._isX;
        this._isOpposite = this.position === AxisPosition.OPPOSITE;
        this._runPos = this.position;
        this.crosshair._args.axis = this._labelArgs.axis = this.chart._proxy?.getChartObject(this);

        this._doPrepareRender();

        this.label.prepareRender();

        // range
        const series = this._series;
        const vals = this._values;

        if (this._isX && this._prevSeries) {
            if (!(this._seriesChanged = !Utils.equalArrays(series, this._prevSeries))) {
                for (const s of series) {
                    if (s.seriesChanged()) {
                        this._seriesChanged = true;
                        break;
                    }
                }
            }
        } else {
            this._seriesChanged = false;
        }

        if (this._zoom) {
            this._range = { min: this._zoom.start, max: this._zoom.end };
        } else {
            this._range = this._doCalculateRange(vals);
        }

        // clustering (x축에서만 가능)
        if (this._isX && series.length > 0) {
            if (this.chart.isSplitted()) {
                const rows: number[] = [series[0]._row];

                for (let i = 1; i < series.length; i++) {
                    if (rows.indexOf(series[i]._row) < 0) {
                        rows.push(series[i]._row);
                    }
                }
                rows.forEach(row => {
                    let sum = 0;
                    let p = 0;
            
                    series.forEach(item => {
                        if (item._row == row && item.isClusterable()) {
                            sum += pickNum((item as any as IClusterable).groupWidth, 1);
                        }
                    });
                    series.forEach(item => {
                        if (item._row == row && item.isClusterable()) {
                            const w = pickNum((item as any as IClusterable).groupWidth, 1) / sum;
            
                            (item as any as IClusterable).setCluster(w, p);
                            p += w;
                        }
                    });
                });

            } else {
                let sum = 0;
                let p = 0;
        
                series.forEach(item => {
                    if (item.isClusterable()) {
                        sum += pickNum((item as any as IClusterable).groupWidth, 1);
                    }
                });
                series.forEach(item => {
                    if (item.isClusterable()) {
                        const w = pickNum((item as any as IClusterable).groupWidth, 1) / sum;
        
                        (item as any as IClusterable).setCluster(w, p);
                        p += w;
                    }
                });
            }
        }
    }

    afterRender(): void {
        this._seriesChanged = false;
        this._prevSeries = this._series;
        this._zooming = false;
    }

    buildTicks(length: number): void {
        this._ticks = this._doBuildTicks(this._range.min, this._range.max, this._vlen = length);

        this._labelArgs.count = this._ticks.length;
    }

    calcPoints(length: number, phase: number): void {
        this._ticks.forEach(t => t.pos = this.getPos(length, t.value));
    }

    /**
     * @internal
     * 
     * value에 해당하는 축상의 위치.
     * 
     * @param length axis view length
     * @param value 값
     */
    abstract getPos(length: number, value: number): number;
    abstract getUnitLen(length: number, value: number): number;

    getLabelLength(length: number, value: number): number {
        return this.getUnitLen(length, value);
    }

    getValue(value: any): number {
        return value == null ? NaN : parseFloat(value);
    }

    incStep(value: number, step: any): number {
        return value += step;
    }

    contains(value: number): boolean {
        return value >= this._range.min && value <= this._range.max;
    }

    resetZoom(): void {
        if (this._zoom) {
            this._zoom = null;
            this._zooming = true;
            this._changed();
        }
    }

    _prepareZoom(): AxisZoom {
        if (!this._zoom) {
            // padding 없는 _min, _max를 계산하기 위해
            this._zoom = new AxisZoom(this);
            this.buildTicks(this._vlen);// this._zoomlen);
            this._zoom.start = this._zoom.min = this._min;
            this._zoom.end = this._zoom.max = this._max;
        }
        return this._zoom;
    }
    
    zoom(start: number, end: number, minSize = NaN): boolean {
        const zoom = this._prepareZoom();
        const ret = zoom.resize(start, end, minSize);

        if (zoom.isFull()) {
            this._zoom = null;
        }
        this._zooming = true;
        this._changed();
        return ret;
    }

    isZoomed(): boolean {
        return !!this._zoom
    }

    hasBreak(): boolean {
        return false;
    }

    isBreak(pos: number): boolean {
        return false;
    }

    getTickLabelArgs(index: number, value: any): IAxisLabelArgs {
        this._labelArgs.index = index;
        this._labelArgs.value = value;
        return this._labelArgs;
    }

    getXValue(value: number): any {
        return value;
    }

    setPrevRate(rate: number): void {
        this._prevRate = rate;
    }

    prev(pos: number): number {
        if (isNaN(this._prevRate)) {
            return pos;
        } else if (this.reversed) {
            return pos + (this._vlen - pos) * (this._prevRate - 1);
        } else {
            return pos * this._prevRate;
        }
    }

    abstract xValueAt(pos: number): number;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doLoadProp(prop: string, value: any): boolean {
        if (prop === 'guide' || prop === 'guides') {
            this.guides.length = 0;
            if (isArray(value)) this.$_loadGuides(value);
            else if (isObject(value)) this.$_loadGuides([value]);
            return true;
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected _setMinMax(min: number, max: number): void {
        this._min = min;
        this._max = max;
        this._single = min === max;
    }

    protected abstract _createGrid(): AxisGrid;

    private $_loadGuides(source: any[]): void {
        for (let i = 0; i < source.length; i++) {
            const g: any = source[i]
            let guide: AxisGuide;

            if (g.type === 'range') {
                guide = new AxisRangeGuide(this);
            } else if (g.type === 'line') {
                guide = new AxisLineGuide(this);
            } else if (!isNaN(g.startValue) && !isNaN(g.endValue)) {
                guide = new AxisRangeGuide(this);
            } else {
                guide = new AxisLineGuide(this);
            }

            guide.load(g);
            this.guides.push(guide);
        }
    }

    _connect(series: IPlottingItem): void {
        if (series && !this._series.includes(series)) {
            this._series.push(series);
        }
    }

    protected _doCalculateRange(values: number[]): { min: number, max: number } {
        return {
            min: values.length > 0 ? fixnum(minv(...values) || 0) : NaN,
            max: values.length > 0 ?  fixnum(maxv(...values) || 0) : NaN
        };
    }
}

export class AxisCollection {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    readonly chart: IChart;
    readonly isX: boolean;
    protected _items: Axis[] = [];
    private _map = new Map<string, Axis>();

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart, isX: boolean) {
        this.chart = chart;
        this.isX = isX;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    get count(): number {
        return this._items.length;
    }

    get first(): Axis {
        return this._items[0];
    }

    get items(): Axis[] {
        return this._items.slice(0);
    }

    internalItems(): Axis[] {
        return this._items;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    load(src: any): void {
        const chart = this.chart;

        if (isArray(src)) {
            src.forEach((s, i) => this._items.push(this.$_loadAxis(chart, s, i)));
        } else {
            this._items.push(this.$_loadAxis(chart, src, 0));
        }
    }

    contains(axis: Axis): boolean {
        return this._items.indexOf(axis) >= 0;
    }

    get(name: string | number): Axis {
        if (isString(name)) {
            return this._map.get(name);
        } else {
            return this._items[name];
        }
    }

    disconnect(): void {
        this._items.forEach(axis => axis.disconnect());
    }

    collectValues(): void {
        this._items.forEach(axis => axis.collectValues());
    }

    collectRanges(): void {
        this._items.forEach(axis => axis.collectRanges());
    }

    collectReferentsValues(): void {
        this._items.forEach(axis => axis.collectReferentsValues());
    }

    prepareRender(): void {
        this._items.forEach(axis => axis.prepareRender());
    }

    afterRender(): void {
        this._items.forEach(axis => axis.afterRender());
    }

    // Chart.layoutAxes 에서만 호출
    $_buildTicks(length: number): void {
        // 다른 축을 참조하는 axis를 나중에 계산한다.
        this._items.sort((a1, a2) => a1.isBased() ? 1 : a2.isBased() ? -1 : 0)
                   .forEach(axis => axis.buildTicks(length));
    }

    connect(series: IPlottingItem): Axis {
        const items = this._items;
        const a = this.isX ? series.xAxis : series.yAxis;
        let axis: Axis;

        if (isNumber(a) && a >= 0 && a < items.length) {
            axis = items[a];
        } else if (isString(a)) {
            axis = items.find(item => item.name === a);
        }
        if (!axis) {
            axis = items[0];
        }

        if (axis) {
            axis._connect(series);
            if (this.isX) {
                series.setCol(pickNum(series.col, axis.col));
            } else {
                series.setRow(pickNum(series.row, axis.row));
            }
        }
        return axis;
    }

    forEach(callback: (p: Axis, i?: number) => any): void {
        for (let i = 0, n = this._items.length; i < n; i++) {
            if (callback(this._items[i], i) === true) break;
        }
    }

    isZoomed(): boolean {
        for (const axis of this._items) {
            if (axis.isZoomed()) return true;
        }
    }

    resetZoom(): void {
        this._items.forEach(axis => axis.resetZoom());
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_loadAxis(chart: IChart, src: any, index: number): Axis {
        let cls = chart._getAxisType(src.type);

        if (!cls) {
            let t: string;

            if (isArray(src.categories)) {
                t = 'category';
            } else if (this.isX) {
                const series = chart._getSeries().internalItems();

                if (series.length > 0) {
                    t = 'category';

                    for (const ser of series) {
                        if (!ser.canCategorized()) {
                            if (src.name && ser.xAxis === src.name) {
                                t = _undef;
                                break;
                            } else if (ser.xAxis === index) {
                                t = _undef;
                                break;
                            } else if (isNull(ser.xAxis) && index === 0) {
                                t = _undef;
                                break;
                            }
                        }   
                    }
                }
            } else {
                t = chart._getSeries().first?.defaultYAxisType();
            }

            if (t) {
                cls = chart._getAxisType(t);
            }
        }
        if (!cls) {
            cls = chart._getAxisType('linear');
        }

        const axis = new cls(chart, this.isX, src.name);

        axis.load(src);
        axis._index = index;
        axis._isPolar = chart.isPolar();
        return axis;
    }
}

export class PaneAxes {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _axes: Axis[] = [];

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    isEmpty(): boolean {
        return this._axes.length < 1;
    }
}

export abstract class PaneAxisMatrix {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    protected _matrix: PaneAxes[][];

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(public chart: IChart, public isX: boolean) {
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    rows(): number {
        return this._matrix.length;
    }

    cols(): number {
        return this._matrix[0].length;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    abstract prepare(axes: AxisCollection, rows: number, cols: number): void;

    get(row: number, col: number): PaneAxes {
        return this._matrix[row][col];
    }

    getRow(row: number): PaneAxes[] {
        return this._matrix[row];
    }

    getColumn(col: number): PaneAxes[] {
        return this._matrix.map(m => m[col]);
    }

    buildTicks(lens: number[]): void {
        const isX = this.isX;

        // 다른 축을 참조하는 axis를 나중에 계산한다.
        this._matrix.forEach((mat, i) => {
            mat.forEach((m, j) => {
                m._axes.forEach(axis => {
                    if (!axis.isBased()) {
                        // if (!lens[axis._runPos === AxisPosition.OPPOSITE ? i - 1 : i]) debugger;
                        // axis.buildTicks(lens[axis._runPos === AxisPosition.OPPOSITE ? i - 1 : i]);
                        // axis.buildTicks(lens[i]);
                        axis.buildTicks(lens[isX ? axis.col : axis.row]);
                    }
                });
            });
        })
        this._matrix.forEach((mat, i) => {
            mat.forEach((m, j) => {
                m._axes.forEach(axis => {
                    if (axis.isBased()) {
                        // axis.buildTicks(lens[axis._runPos === AxisPosition.OPPOSITE ? i - 1 : i]);
                        // axis.buildTicks(lens[i]);
                        axis.buildTicks(lens[isX ? axis.col : axis.row]);
                    }
                });
            });
        })
    }

    calcPoints(lens: number[], phase: number): void {
        const isX = this.isX;

        this._matrix.forEach(mat => {
            mat.forEach((m, i) => {
                m._axes.forEach(axis => {
                    const a = isX ? axis.col : axis.row; 

                    // axis.calcPoints(lens[axis._runPos === AxisPosition.OPPOSITE ? i - 1 : i], phase);
                    axis.calcPoints(lens[a], phase);
                });
            });
        })
    }
}

/**
 * (r + 1) * c
 */
export class PaneXAxisMatrix extends PaneAxisMatrix {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart) {
        super(chart, true);
    }

    //-------------------------------------------------------------------------
    // overriden
    //-------------------------------------------------------------------------
    prepare(axes: AxisCollection, rows: number, cols: number): void {
        const mat = this._matrix = new Array<PaneAxes[]>(rows + 1);

        for (let r = 0; r < mat.length; r++) {
            mat[r] = [];
            for (let c = 0; c < cols; c++) {
                mat[r].push(new PaneAxes());
            }
        }
        axes.forEach(axis => {
            const pos = axis.position;
            let row = axis._row;

            if (pos === AxisPosition.OPPOSITE) {
                row++;
                axis._runPos = pos;
            } else if ((row < rows - 1) && pos === AxisPosition.BETWEEN) {
                row++;
                axis._runPos = AxisPosition.NORMAL;
            } else {
                axis._runPos = pos
            }
            mat[row][axis._col]._axes.push(axis);
        });
    }
}

/**
 * r * (c + 1)
 */
export class PaneYAxisMatrix extends PaneAxisMatrix {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart) {
        super(chart, false);
    }

    //-------------------------------------------------------------------------
    // overriden
    //-------------------------------------------------------------------------
    prepare(axes: AxisCollection, rows: number, cols: number): void {
        const mat = this._matrix = new Array<PaneAxes[]>(rows);

        for (let r = 0; r < mat.length; r++) {
            mat[r] = [];
            for (let c = 0; c <= cols; c++) {
                mat[r].push(new PaneAxes());
            }
        }
        axes.forEach(axis => {
            const pos = axis.position;
            let col = axis._col;

            if (pos === AxisPosition.OPPOSITE) {
                col++;
                axis._runPos = pos;
            } else if ((axis._col < cols - 1) && pos === AxisPosition.BETWEEN) {
                col++;
                axis._runPos = AxisPosition.NORMAL;
            } else {
                axis._runPos = pos;
            }
            mat[axis._row][col]._axes.push(axis);
        });
    }
}