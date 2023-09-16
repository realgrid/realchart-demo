////////////////////////////////////////////////////////////////////////////////
// Legend.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { AlignBase, IPercentSize, RtPercentSize, SVGStyleOrClass, calcPercent, parsePercentSize } from "../common/Types";
import { Utils } from "../common/Utils";
import { IChart } from "./Chart";
import { ChartItem } from "./ChartItem";

export interface ILegendRenderer {
}

export interface ILegendSource {
    visible: boolean;

    legendColor(): string;
    legendLabel(): string;
}

export class LegendItem extends ChartItem {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(public legend: Legend, public source: ILegendSource) {
        super(legend.chart)
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    text(): string {
        return this.source.legendLabel();
    }
}

export enum LegendPosition {
    BOTTOM = 'bottom',
    TOP = 'top',
    RIGHT = 'right',
    LEFT = 'left',
    PLOT = 'plot',
    SUBPLOT = 'subplot'
}

export enum LegendLayout {
    /**
     * legend가 차트 좌우에 배치되면 item들을 수직으로 배치.
     * legend가 차트 상하에 배치되면 item들을 수평으로 배치.
     */
    AUTO = 'auto',
    /**
     * item들을 수평으로 배치
     */
    HORIZONTAL = 'horizontal',
    /**
     * item들을 수직으로 배치
     */
    VERTICAL = 'vertical'
}

/**
 * 차트 범례 설정 모델.
 * visible 기본값이 undefined이고,
 * 따로 지정하지 않으면 시리즈가 둘 이상 포함돼야 legend를 표시한다.
 * 
 * @config chart.legend
 */
export class Legend extends ChartItem {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _items: LegendItem[];
    private _maxWidthDim: IPercentSize;
    private _maxHeightDim: IPercentSize;
    private _position: LegendPosition;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart) {
        super(chart, void 0)

        this.visible = void 0;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * legned 표시 위치.
     * 
     * @config
     */
    position = LegendPosition.BOTTOM;
    /**
     * item 배치 방향.
     * 
     * @config
     */
    layout = LegendLayout.AUTO;
    /**
     * legend 정렬 기준.
     * 
     * @config
     */
    alignBase = AlignBase.PLOT;
    /**
     * {@link position}이 {@link LegendPosition.PLOT plot}일 때, plot 영역의 좌측 모서리와 legend의 간격.
     * 
     * @config
     */
    left = 10;
    /**
     * {@link position}이 {@link LegendPosition.PLOT plot}일 때, plot 영역의 우측 모서리와 legend의 간격.
     * {@link left}가 지정되면 이 속성은 무시된다.
     * 
     * @config
     */
    right: number;
    /**
     * {@link position}이 {@link LegendPosition.PLOT plot}일 때, plot 영역의 상단 모서리와 legend의 간격.
     * 
     * @config
     */
    top = 10;
    /**
     * {@link position}이 {@link LegendPosition.PLOT plot}일 때, plot 영역의 하단 모서리와 legend의 간격.
     * {@link top}이 지정되면 이 속성은 무시된다.
     * 
     * @config
     */
    bottom: number;
    /**
     * legend view와 나머지 chart 영역 사이의 gap.
     * 
     * @config
     */
    gap = 6;
    /**
     * legend 아이템들 사이의 간격.
     * 
     * @config
     */
    itemGap = 8;
    /**
     * marker와 text사이의 간격.
     * 
     * @config
     */
    markerGap = 4;
    /**
     * 배경 스타일 셋.
     * 배경 색상 및 경계선 스타일을 지정할 수 있다.
     * 
     * @config
     */
    backgroundStyles: SVGStyleOrClass;
    /**
     * 한 행(수직일 때 열)당 표시할 최대 legend 항목 수.
     * 
     * @config
     */
    itemsPerRow: number;
    /**
     * 수평 {@link layout 배치}일 때,
     * 최대 너비를 픽셀 단위의 크기 혹은 plot 너비에 대한 상대 길이를 '%'로 지정한다.
     * 
     * @config
     */
    maxWidth: RtPercentSize;
    /**
     * 수직 {@link layout 배치}일 때,
     * 최대 높이를 픽셀 단위의 크기 혹은 plot 높이에 대한 상대 길이를 '%'로 지정한다.
     * 
     * @config
     */
    maxHeight: RtPercentSize;

    items(): LegendItem[] {
        return this._items.slice(0);
    }

    isEmpty(): boolean {
        return !this._items || this._items.length < 1;
    }

    isVisible(): boolean {
        return this.visible || (this.visible !== false && this._items.length > 1);
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getPosition(): LegendPosition {
        return this._position;
    }

    getLayout(): LegendLayout {
        if (this.layout === LegendLayout.AUTO && this._position !== LegendPosition.PLOT) {
            switch (this._position) {
                case LegendPosition.BOTTOM:
                case LegendPosition.TOP:
                    return LegendLayout.HORIZONTAL;
                default:
                    return LegendLayout.VERTICAL;
            }
        } else {
            return this.layout;
        }
    }

    getMaxWidth(domain: number): number {
        return this._maxWidthDim ? calcPercent(this._maxWidthDim, domain) : domain;
    }

    getMaxHeight(domain: number): number {
        return this._maxHeightDim ? calcPercent(this._maxHeightDim, domain) : domain;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doLoad(src: any): void {
        super._doLoad(src);

        this._maxWidthDim = parsePercentSize(this.maxWidth, true);
        this._maxHeightDim = parsePercentSize(this.maxHeight, true);
    }

    protected _doPrepareRender(chart: IChart): void {
        this._position = Utils.checkEnumValue(LegendPosition, this.position, LegendPosition.BOTTOM);
        this._items = this.$_collectItems();
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_collectItems(): LegendItem[] {
        return this.chart._getLegendSources().map(src => {
            return new LegendItem(this, src);
        });
    }
}