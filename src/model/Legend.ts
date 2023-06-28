////////////////////////////////////////////////////////////////////////////////
// Legend.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray } from "../common/Common";
import { Align, VerticalAlign } from "../common/Types";
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
    constructor(legend: Legend, public source: ILegendSource) {
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
    PLOT = 'plot'
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
     * 수평 정렬
     */
    align = Align.CENTER;
    /**
     * 수직 정렬
     */
    verticalAlign = VerticalAlign.MIDDLE;
    /**
     * align 기준 경계와의 간격.
     */
    offsetX = 0;
    /**
     * verticalAlign 기준 경계와의 간격.
     */
    offsetY = 0;
    /**
     * 축과의 간격.
     */
    margin = 10;
    /**
     * legend 경계와 아이템들 사이의 간격.
     */
    padding = 5;
    /**
     * legend 아이템들 사이의 간격.
     */
    itemGap = 12;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _items: LegendItem[];

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
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
    protected _doLoad(source: any): void {
        super._doLoad(source);
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