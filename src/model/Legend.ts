////////////////////////////////////////////////////////////////////////////////
// Legend.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { RcElement } from "../common/RcControl";
import { Align, AlignBase, IPercentSize, RtPercentSize, SVGStyleOrClass, VerticalAlign, _undefined, calcPercent, parsePercentSize } from "../common/Types";
import { Utils } from "../common/Utils";
import { IChart } from "./Chart";
import { ChartItem } from "./ChartItem";
import { Widget } from "./Widget";

/**
 * @internal
 */
export interface ILegendSource {
    visible: boolean;

    legendMarker(doc: Document): RcElement;
    legendColor(): string;
    legendLabel(): string;
}

/**
 * @internal
 */
export class LegendItem extends ChartItem {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly MARKER_SIZE = 10;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(public legend: Legend, public source: ILegendSource) {
        super(legend.chart, true)
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    text(): string {
        return this.source.legendLabel();
    }
}

export enum LegendLocation {
    /**
     * 차트 본체 아래 표시한다.
     * 
     * @config
     */
    BOTTOM = 'bottom',
    /**
     * 차트 타이틀 아래 표시한다.
     * 
     * @config
     */
    TOP = 'top',
    /**
     * 차트 본체 오른쪽에 표시한다.
     * 
     * @config
     */
    RIGHT = 'right',
    /**
     * 차트 본체 왼쪽에 표시한다.
     * 
     * @config
     */
    LEFT = 'left',
    /**
     * 차트 본체 영역 내부에 표시한다.
     * 
     * @config
     */
    PLOT = 'plot',
    SUBPLOT = 'subplot'
}

export enum LegendLayout {
    /**
     * legend가 차트 좌우에 배치되면 item들을 수직으로 배치.
     * legend가 차트 상하에 배치되면 item들을 수평으로 배치.
     * 
     * @config
     */
    AUTO = 'auto',
    /**
     * item들을 수평으로 배치
     * 
     * @config
     */
    HORIZONTAL = 'horizontal',
    /**
     * item들을 수직으로 배치
     * 
     * @config
     */
    VERTICAL = 'vertical'
}

export enum LegendItemsAlign {
    /**
     * 수평일 때 왼쪽, 수직일 때는 위쪽으로 몰아서 배치한다.
     * 
     * @config
     */
    START = 'start',
    /**
     * 수평 혹은 수직의 중앙으로 몰아서 배치한다.
     * 
     * @config
     */
    CENTER = 'center',
    /**
     * 수평일 때 오른쪽, 수직일 때는 아래쪽으로 몰아서 배치한다.
     * 
     * @config
     */
    END = 'end'
}

/**
 * 차트 범례 설정 모델.
 * visible 기본값이 undefined이고,
 * 따로 지정하지 않으면 시리즈가 둘 이상 포함돼야 legend를 표시한다.
 * 
 * @config chart.legend
 */
export class Legend extends Widget {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _items: LegendItem[];
    private _maxWidthDim: IPercentSize;
    private _maxHeightDim: IPercentSize;
    private _location: LegendLocation;

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
     * 명시적으로 true로 설정되거나, 명시적 false가 아니면서 표시 항목 수가 1보다 클 때 표시된다..\
     * 
     * @fiddle common/legend-visible Legend Visible
     * 
     * @default undefined
     */
    '@config visible': boolean;
    /**
     * 표시 위치.
     * 
     * @config
     */
    location = LegendLocation.BOTTOM;
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
     * {@link location}이 'plot'이 아닐 때,
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
    backgroundStyle: SVGStyleOrClass;
    /**
     * 한 줄 당 표시할 최대 legend 항목 수.
     * 
     * @config
     */
    itemsPerLine: number;
    /**
     * 라인 사이의 간격.
     * 
     * @config
     */
    lineGap = 4;
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
    /**
     * 수평 배치.
     * 값을 지정하지 않으면, 기본값이 {@link location}이 'plot'일 때는 'left',
     * 'left', 'right'일 때는 'center'이다.
     */
    align: Align;
    /**
     * 수직 배치.
     * 값을 지정하지 않으면, 기본값이 {@link location}이 'plot'일 때는 'top',
     * 'top', 'bottom'일 때는 'middle'이다.
     */
    verticalAlign: VerticalAlign;
    offsetX = 0;
    offsetY = 0;
    /**
     * 한 라인의 item들이 배치되는 위치.
     * 
     * @config
     */
    itemsAlign = LegendItemsAlign.CENTER;

    items(): LegendItem[] {
        return this._items.slice(0);
    }

    isEmpty(): boolean {
        return !this._items || this._items.length < 1;
    }

    isVisible(): boolean {
        return (this.visible === true && this._items.length > 0) || (this.visible !== false && this._items.length > 1);
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getLocatiion(): LegendLocation {
        return this._location;
    }

    getLayout(): LegendLayout {
        if (this.layout === LegendLayout.AUTO && this._location !== LegendLocation.PLOT) {
            switch (this._location) {
                case LegendLocation.BOTTOM:
                case LegendLocation.TOP:
                    return LegendLayout.HORIZONTAL;
                default:
                    return LegendLayout.VERTICAL;
            }
        } else {
            return this.layout;
        }
    }

    getMaxWidth(domain: number): number {
        return calcPercent(this._maxWidthDim, domain, domain);
    }

    getMaxHeight(domain: number): number {
        return calcPercent(this._maxHeightDim, domain, domain);
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
        super._doPrepareRender(chart);

        this._location = Utils.checkEnumValue(LegendLocation, this.location, LegendLocation.BOTTOM);
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