////////////////////////////////////////////////////////////////////////////////
// Legend.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { Sides } from "../common/Sides";
import { Align, SVGStyleOrClass, VerticalAlign } from "../common/Types";
import { ChartItem } from "./ChartItem";

export interface ILegendSource {
    legendColor(): string;
    legendLabel(): string;
    legendVisible(): boolean;
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

export enum LegendAlignBase {
    CHART = 'chart',
    PLOT = 'plot'
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

export class Legend extends ChartItem {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _items: LegendItem[];

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * legned 표시 위치.
     */
    position = LegendPosition.BOTTOM;
    /**
     * item 배치 방향.
     * 
     * @default LegendLayout.DEFAULT
     */
    layout = LegendLayout.AUTO;
    /**
     * legend 정렬 기준.
     */
    alignBase = LegendAlignBase.PLOT;
    /**
     * {@link position}이 {@link LegendPosition.PLOT plot}일 때, plot 영역의 좌측 모서리와 legend의 간격.
     */
    left: number;
    /**
     * {@link position}이 {@link LegendPosition.PLOT plot}일 때, plot 영역의 우측 모서리와 legend의 간격.
     * <br>
     * {@link left}가 지정되면 이 속성은 무시된다.
     */
    right: number;
    /**
     * {@link position}이 {@link LegendPosition.PLOT plot}일 때, plot 영역의 상단 모서리와 legend의 간격.
     */
    top: number;
    /**
     * {@link position}이 {@link LegendPosition.PLOT plot}일 때, plot 영역의 하단 모서리와 legend의 간격.
     * <br>
     * {@link top}이 지정되면 이 속성은 무시된다.
     */
    bottom: number;
    /**
     * legend 아이템들 사이의 간격.
     */
    itemGap = 8;
    /**
     * marker와 text사이의 간격.
     */
    markerGap = 4;
    backgroundStyles: SVGStyleOrClass;

    items(): LegendItem[] {
        return this._items.slice(0);
    }

    isEmpty(): boolean {
        return !this._items || this._items.length < 1;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getLayout(): LegendLayout {
        if (this.layout === LegendLayout.AUTO && this.position !== LegendPosition.PLOT) {
            switch (this.position) {
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

    prepareRender(): void {
        this._items = this.$_collectItems();
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_collectItems(): LegendItem[] {
        return this.chart._getLegendSources().map(src => {
            return new LegendItem(this, src);
        });
    }
}