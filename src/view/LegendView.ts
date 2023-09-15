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
import { IRect, toSize } from "../common/Rectangle";
import { ISize, Size } from "../common/Size";
import { RectElement } from "../common/impl/RectElement";
import { TextAnchor, TextElement } from "../common/impl/TextElement";
import { Legend, LegendItem, LegendLayout, LegendPosition } from "../model/Legend";
import { BoundableElement, ChartElement } from "./ChartElement";

/**
 * @internal
 */
export class LegendItemView extends ChartElement<LegendItem> {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
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

/**
 * @internal
 */
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
    _gap: number;

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

    protected _getDebugRect(): IRect {
        const r = super._getDebugRect();
        const gap = this._gap;
        
        if (gap !== 0) {
            switch (this.model.getPosition()) {
                case LegendPosition.BOTTOM:
                    r.y += gap;
                    r.height -= gap;
                    break;
                case LegendPosition.TOP:
                    break;
                case LegendPosition.LEFT:
                    break;
                case LegendPosition.RIGHT:
                    break;
            }
        }
        return r;
    }

    protected _doMeasure(doc: Document, model: Legend, hintWidth: number, hintHeight: number, phase: number): ISize {
        const items = model.items();
        const vertical = this._vertical = model.getLayout() === LegendLayout.VERTICAL;
        const gap = this._gap = pickNum(this.model.gap, 0);
        const itemGap = model.itemGap;
        const views = this._itemViews;
        let w = 0;
        let h = 0;

        if (vertical) {
            hintHeight = model.getMaxHeight(hintHeight);
        } else {
            hintWidth = model.getMaxWidth(hintWidth);
        }

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
            h += (views.count - 1) * itemGap;
            w += pickNum(gap, 0);
        } else {
            w += (views.count - 1) * itemGap;
            h += pickNum(gap, 0);

            if (w > hintWidth) {
            }
        }
        return Size.create(w, h);
    }
    
    protected _doLayout(): void {
        const model = this.model;
        const pos = model.getPosition();
        const gap = model.itemGap;
        const margin = this._margins;
        const pad = this._paddings;
        const vertical = this._vertical;
        let x = margin.left + pad.left;
        let y = margin.top + pad.top;

        if (pos === LegendPosition.BOTTOM) {
            y += pickNum(this._gap, 0);
        } else if (pos === LegendPosition.RIGHT) {
            x += pickNum(this._gap, 0);
        }

        this._itemViews.forEach(v => {
            v._marker.setStyle('fill', v.model.source.legendColor());
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