////////////////////////////////////////////////////////////////////////////////
// LegendView.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum } from "../common/Common";
import { toSize } from "../common/Rectangle";
import { ISize, Size } from "../common/Size";
import { RectElement } from "../common/impl/RectElement";
import { TextAnchor, TextElement } from "../common/impl/TextElement";
import { Legend, LegendItem, LegendLayout } from "../model/Legend";
import { BoundableElement, ChartElement } from "./ChartElement";

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
    _gap: number;

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
        this._label.text = model.text();

        const sz = toSize(this._label.getBBounds());
        this._gap = pickNum(model.legend.markerGap, 0);

        return Size.create(this._marker.width + this._gap + sz.width, Math.max(this._marker.height, sz.height));
    }

    protected _doLayout(): void {
        this._marker.translate(0, (this.height - this._marker.height) / 2);
        this._label.translate(this._marker.width + this._gap, (this.height - this._label.getBBounds().height) / 2);
    }
}

export class LegendView extends BoundableElement<Legend> {

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

        this.add(this._background = new RectElement(doc, null, 'rct-legend-background'));
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
        const margin = this._margins;
        let x = margin.left;
        const y = margin.top;
        const w = this.width - margin.left - margin.right;
        const h = this.height - margin.top - margin.bottom;

        this._background.setBounds(x, y, w, h);
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