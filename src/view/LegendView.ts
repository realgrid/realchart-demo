////////////////////////////////////////////////////////////////////////////////
// LegendView.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ISize, Size } from "../common/Size";
import { RectElement } from "../common/impl/RectElement";
import { TextAnchor, TextElement } from "../common/impl/TextElement";
import { Legend, LegendItem, LegendLayout, LegendPosition } from "../model/Legend";
import { ChartElement } from "./ChartElement";

export class LegendItemView extends ChartElement<LegendItem> {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    private _enabled = true;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _marker: RectElement;
    _label: TextElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-legend-item');

        this.add(this._marker = RectElement.create(doc, 0, 0, 12, 12, 6, 'rct-legend-item-marker'));
        this.add(this._label = new TextElement(doc, 'rct-legend-item-label'));
        this._label.anchor = TextAnchor.START;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doMeasure(doc: Document, model: LegendItem, intWidth: number, hintHeight: number, phase: number): ISize {
        let w = 70;
        let h = 30;

        this._label.text = model.text();

        return Size.create(w, h);
    }

    protected _doLayout(): void {
        this._marker.translate(0, (this.height - this._marker.height) / 2);
        this._label.translate(16, (this.height - this._label.getBBounds().height) / 2);
    }
}

export class LegendView extends ChartElement<Legend> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _background: RectElement;
    private _itemViews: LegendItemView[] = [];
    vertical: boolean;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-legend');

        this.add(this._background = new RectElement(doc));
    }

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
            v._marker.setStyle('fill', items[i].source.legendColor());

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
        const gap = this.model.itemGap;
        let x = 0;
        let y = 0;

        this._background.setBounds(0, 0, this.width, this.height);
        this._itemViews.forEach(v => {
            v.resizeByMeasured().layout();
            v.translate(x, y);
            x += v.width + gap;
        });
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