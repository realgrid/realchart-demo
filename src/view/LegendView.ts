////////////////////////////////////////////////////////////////////////////////
// LegendView.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum } from "../common/Common";
import { Dom } from "../common/Dom";
import { ElementPool } from "../common/ElementPool";
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

        this.add(this._marker = RectElement.create(doc, 'rct-legend-item-marker', 0, 0, 12, 12, 6));
        this.add(this._label = new TextElement(doc, 'rct-legend-item-label'));
        this._label.anchor = TextAnchor.START;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doMeasure(doc: Document, model: LegendItem, intWidth: number, hintHeight: number, phase: number): ISize {
        Dom.setData(this._label.dom, 'hidden', model.source.visible ? '' : 1);
        Dom.setData(this._marker.dom, 'hidden', model.source.visible ? '' : 1);

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
    // consts
    //-------------------------------------------------------------------------
    static readonly LEGEND_CLASS = 'rct-legend';

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _itemViews = new ElementPool(this, LegendItemView);
    private _vertical: boolean;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, LegendView.LEGEND_CLASS, 'rct-legend-background');
    }

    legendByDom(dom: Element): LegendItem {
        const v = this._itemViews.elementOf(dom);
        return v && v.model;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _setBackgroundStyle(back: RectElement): void {
        back.setStyleOrClass(this.model.backgroundStyles);
    }

    protected _doMeasure(doc: Document, model: Legend, hintWidth: number, hintHeight: number, phase: number): ISize {
        const items = model.items();
        const vertical = this._vertical = model.getLayout() === LegendLayout.VERTICAL;
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
            h += (views.count - 1) * gap;
        } else {
            w += (views.count - 1) * gap;
        }
        return Size.create(w, h);
    }
    
    protected _doLayout(): void {
        const vertical = this._vertical;
        const gap = this.model.itemGap;
        const margin = this._margins;
        const pad = this._paddings;
        let x = margin.left;
        let y = margin.top;

        x += pad.left;
        y += pad.top;

        this._itemViews.forEach(v => {
            v.resizeByMeasured().layout();
            v.translate(x, y);

            if (vertical) {
                y += v.height + gap;
            } else {
                x += v.width + gap;
            }
        });
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_prepareItems(doc: Document, items: LegendItem[]): void {
        this._itemViews.prepare(items.length);
    }
}