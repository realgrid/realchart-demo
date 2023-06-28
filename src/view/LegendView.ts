////////////////////////////////////////////////////////////////////////////////
// LegendView.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ISize, Size } from "../common/Size";
import { Legend, LegendItem, LegendLayout, LegendPosition } from "../model/Legend";
import { ChartElement } from "./ChartElement";

export class LegendItemView extends ChartElement<LegendItem> {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doMeasure(doc: Document, model: LegendItem, intWidth: number, hintHeight: number, phase: number): ISize {
        let w = 70;
        let h = 30;

        return Size.create(w, h);
    }

    protected _doLayout(): void {
    }
}

export class LegendView extends ChartElement<Legend> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _itemViews: LegendItemView[] = [];
    vertical: boolean;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doMeasure(doc: Document, model: Legend, hintWidth: number, hintHeight: number, phase: number): ISize {
        const items = model.items();
        const vertical = this.vertical = model.getLayout() === LegendLayout.VERTICAL;
        const gap = model.itemGap;
        const views = this._itemViews;
        let w = 0;
        let h = 0;

        this.$_prepareItems(doc, items);

        views.forEach((v, i) => {
            const sz = v.measure(doc, items[i], hintWidth, hintHeight, phase);

            if (vertical) {
                w = Math.max(w, sz.width);
                h += sz.height;
            } else {
                h = Math.max(h, sz.height);
                w += sz.width;
            }
        });

        if (vertical) {
            h += (views.length - 1) * gap;
        } else {
            w += (views.length - 1) * gap;
        }
        return Size.create(w, h);
    }
    
    protected _doLayout(): void {
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_prepareItems(doc: Document, items: LegendItem[]): void {
        const views = this._itemViews;

        while (views.length < items.length) {
            views.push(this.add(new LegendItemView(doc)) as LegendItemView);
        }
        while (views.length > items.length) {
            views.pop().remove();
        }
    }
}