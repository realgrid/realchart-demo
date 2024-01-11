////////////////////////////////////////////////////////////////////////////////
// Tooltip.ts
// 2023. 08. 12. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isString } from "../common/Common";
import { DatetimeFormatter } from "../common/DatetimeFormatter";
import { NumberFormatter } from "../common/NumberFormatter";
import { IRichTextDomain } from "../common/RichText";
import { _undef } from "../common/Types";
import { IChart } from "./Chart";
import { ChartItem } from "./ChartItem";
import { DataPoint } from "./DataPoint";
import { ISeries } from "./Series";

export enum TooltipLevel {
    AUTO = 'auto',
    SERIES = 'series',
    GROUP = 'group',
    AXIS = 'axis'
}

export interface ITooltipContext {
    getTooltipText(series: ISeries, point: DataPoint): string;
    getTooltipParam(series: ISeries, point: DataPoint, param: string): string;
}

export interface ITooltipOwner {
    chart: IChart;
    getTooltipContext(level: TooltipLevel, series: ISeries, point: DataPoint): ITooltipContext;
}

/**
 * Tooltip 설정 모델.
 * 
 * @config chart.tooltip
 */
export class Tooltip extends ChartItem {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly HIDE_DELAY = 700;

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    private _numberFormat: string;
    private _timeFormat: string;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _ctx: ITooltipContext;
    private _series: ISeries;
    private _point: DataPoint;
    private _domain: IRichTextDomain = {
        callback: (target: any, param: string): string => {
            return this._ctx.getTooltipParam(this._series, this._point, param);
        },
    }

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(public owner: ITooltipOwner) {
        super(owner.chart, true);

        this.numberFormat = ',#.##';
        this.timeFormat = 'yyyy-MM-dd';
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    level = TooltipLevel.AUTO;
    html: string;
    /**
     * 툴팁에 표시할 텍스트 형식.<br/>
     * 시리즈에 {@link config.base.series#tooltiptext tooltipText}가 시리즈 별 tooltip을 제공하지만,
     * 이 속성이 지정된 경우 우선 사용된다.<br/>
     * 
     * `${param;default;format}` 형식으로 아래과 같은 변수로 데이터 포인트 및 시리즈 값을 지정할 수 있다.
     * |변수|설명|
     * |---|---|
     * |series|시리즈 이름|
     * |name|포인트 이름. 포인트가 속한 카테고리 이름이거나, 'x' 속성으로 지정한 값|
     * |x|'x' 속성으로 지정한 값|
     * |y|'y' 속성으로 지정한 값|
     * |xValue|계산된 x값|
     * |yValue|계산된 y값|
     * 
     * @config
     */
    text: string;
    /**
     * 목표 지점과 tooltip 사이의 간격.
     * 
     * @config
     */
    offset = 8;
    /**
     * 툴팁이 점진적으로 닫히는 시간을 밀리초 단위로 지정한다.
     * 
     * @config
     */
    hideDelay = Tooltip.HIDE_DELAY;
    // TODO: 구현할 것!
    minWidth = 100;
    // TODO: 구현할 것!
    minHeight = 40;
    /**
     * true이면 툴팁 상자가 마우스 포인터를 따라 다닌다.
     * <br>
     * false, true를 명시적으로 지정하지 않으면 시리즈 종류에 따라 자동 설정된다.
     * ex) pie 시리즈는 true, bar 시리즈는 false가 된다.
     * 
     * @config
     */
    followPointer: boolean;
    /**
     * 툴팁에 표시될 숫자값의 기본 형식.\
     * {@link text}예 표시 문자열을 지정할 때 `${yValue;;#,###.0}`와 같은 식으로 숫자 형식을 지정할 수 있다.
     * 
     * @config
     */
    get numberFormat(): string {
        return this._numberFormat;
    }
    set numberFormat(value: string) {
        if (value !== this._numberFormat) {
            this._numberFormat = value;
            this._domain.numberFormatter = value ? NumberFormatter.getFormatter(value) : _undef;
        }
    }
    /**
     * 툴팁에 표시될 날짜(시간)값의 기본 형식.\
     * {@link text}예 표시 문자열을 지정할 때 `${x;;yyyy.MM}`와 같은 식으로 날짜(시간) 형식을 지정할 수 있다.
     * 
     * @config
     */
    get timeFormat(): string {
        return this._timeFormat;
    }
    set timeFormat(value: string) {
        if (value !== this._timeFormat) {
            this._timeFormat = value;
            this._domain.timeFormatter = value ? DatetimeFormatter.getFormatter(value) : _undef;
        }
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    setTarget(series: ISeries, point: DataPoint): ITooltipContext {
        return this._ctx = this.visible && this.owner.getTooltipContext(this.level, this._series = series, this._point = point);
    }

    getTextDomain(): IRichTextDomain {
        return this._domain;
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

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}