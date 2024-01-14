////////////////////////////////////////////////////////////////////////////////
// LegendView.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { maxv, pickNum } from "../common/Common";
import { ElementPool } from "../common/ElementPool";
import { RcElement } from "../common/RcControl";
import { IRect, RECT_Z, rectToSize } from "../common/Rectangle";
import { ISize, Size } from "../common/Size";
import { RectElement } from "../common/impl/RectElement";
import { TextAnchor, TextElement } from "../common/impl/TextElement";
import { Legend, LegendItem, LegendItemsAlign, LegendLayout, LegendLocation } from "../model/Legend";
import { Series } from "../model/Series";
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
    _back: RectElement;
    _marker: RcElement;
    _label: TextElement;
    _gap: number;
    _rMarker: IRect;
    _col: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-legend-item');

        this.add(this._back = new RectElement(doc));
        this._back.setFill('transparent');
        this._back.setStroke('none');
        // this.add(this._marker = RectElement.create(doc, 'rct-legend-item-marker', 0, 0, 12, 12, 6));
        this.add(this._label = new TextElement(doc, 'rct-legend-item-label'));
        this._label.anchor = TextAnchor.START;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    setMarker(elt: RcElement): RcElement {
        if (elt !== this._marker) {
            this._marker && this._marker.remove();
            this.insertFirst(this._marker = elt);
        }
        return;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doMeasure(doc: Document, model: LegendItem, hintWidth: number, hintHeight: number, phase: number): ISize {
        this._label.setBoolData('hidden', !model.source.visible);
        this._marker.setBoolData('hidden', !model.source.visible);

        this._label.text = model.text();

        const rMarker = this._rMarker = this._marker.setVis(model.legend.markerVisible) ? this._marker.getBBox() : RECT_Z;
        const sz = rectToSize(this._label.getBBox());
        this._gap = pickNum(model.legend.markerGap, 0);

        return Size.create(rMarker.width + this._gap + sz.width, maxv(rMarker.height, sz.height));
    }

    protected _doLayout(wMarker: number): void {
        const rMarker = this._rMarker;// this._marker.visible ? this._marker.getBBox() : RECT_Z;
        const w = pickNum(wMarker, rMarker.width);

        this._back.setBounds(0, 0, this.width, this.height);
        this._marker.visible && this._marker.trans((w - rMarker.width) / 2, (this.height - rMarker.height) / 2);
        this._label.trans(w + this._gap, (this.height - this._label.getBBox().height) / 2);
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
    private _rowViews: LegendItemView[][];
    private _sizes: number[];
    private _wMarkers: number[];
    _gap: number;
    _ipr: number;

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

    legendOfSeries(series: Series): LegendItemView {
        return this._itemViews.find(v => v.model.source === series);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _setBackgroundStyle(back: RectElement): void {
        back.setStyleOrClass(this.model.backgroundStyle);
    }

    protected _doMeasure(doc: Document, model: Legend, hintWidth: number, hintHeight: number, phase: number): ISize {
        const items = model.items();
        const vertical = this._vertical = model.getLayout() === LegendLayout.VERTICAL;
        
        this._ipr = pickNum(model.itemsPerLine, Number.MAX_SAFE_INTEGER);
        this._gap = model.location !== LegendLocation.BODY ? pickNum(model.gap, 0) : 0;

        if (vertical) {
            hintHeight = model.getMaxHeight(hintHeight);
        } else {
            hintWidth = model.getMaxWidth(hintWidth);
        }

        this.$_prepareItems(doc, items);

        return this.$_measure(doc, model, vertical, this._ipr, hintWidth, hintHeight);
    }
    
    protected _doLayout(): void {
        const model = this.model;
        const rowViews = this._rowViews;
        const textColor = model.useTextColor;
        const sizes = this._sizes;
        const align = model.itemsAlign;
        const lineGap = model.lineGap || 0;
        const itemGap = model.itemGap || 0;
        const margin = this._margins;
        const pad = this._paddings;
        const vertical = this._vertical;
        const x1 = margin.left + pad.left;
        const y1 = margin.top + pad.top;
        let x = x1;
        let y = y1;
        let sum: number;

        this._itemViews.forEach(v => {
            const src = v.model.source;
            const color = src.legendColor();

            // [주의] source가 getComputedStyle()로 색상을 가져온다. measure 시점에는 안된다.
            v._marker.setColor(color);
            src.styleLegendMarker(v._marker);
            if (textColor && src.visible) {
                v._label.setFill(color);
            } else {
                v._label.setFill('');
            }
            // v.resizeByMeasured().layout();
        });

        rowViews.forEach((views, i) => {
            if (vertical) {
                views.forEach(v => {
                    v.mw = sizes[i];
                    v.resizeByMeasured().layout(this._wMarkers[i]);
                })
                y = y1;
                if (align === LegendItemsAlign.CENTER || align === LegendItemsAlign.END) {
                    sum = views.map(v => v.height).reduce((a, c) => a + c) + itemGap * (views.length - 1) + margin.top + margin.bottom + pad.top + pad.bottom;
                    if (align === LegendItemsAlign.CENTER) y += (this.height - sum) / 2;
                    else y += this.height - sum; 
                }
                views.forEach(v => {
                    v.trans(x, y);
                    y += v.height + itemGap;
                })
                x += sizes[i] + lineGap;
            } else {
                views.forEach(v => {
                    v.resizeByMeasured().layout(NaN);
                })
                x = x1;
                if (align === LegendItemsAlign.CENTER || align === LegendItemsAlign.END) {
                    sum = views.map(v => v.width).reduce((a, c) => a + c) + itemGap * (views.length - 1) + margin.left + margin.right + pad.left + pad.right;
                    if (align === LegendItemsAlign.CENTER) x += (this.width - sum) / 2;
                    else x += this.width - sum; 
                }
                views.forEach(v => {
                    v.trans(x, y);
                    x += v.width + itemGap;
                })
                y += sizes[i] + lineGap;
            }
        });
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_prepareItems(doc: Document, items: LegendItem[]): void {
        this._itemViews.prepare(items.length);
    }

    private $_measure(doc: Document, model: Legend, vertical: boolean, ipr: number, hintWidth: number, hintHeight: number): ISize {
        const items = model.items();
        const views = this._itemViews;
        const itemGap = model.itemGap || 0;
        const lineGap = model.lineGap || 0;
        const n = views.count;
        const rowViews: LegendItemView[][] = this._rowViews = [];
        const sizes: number[] = this._sizes = [];
        let w: number;
        let h: number;
        let vRow: LegendItemView[];
        let view: LegendItemView;

        views.forEach((v, i) => {
            v.setMarker(items[i].source.legendMarker(doc, model.markerSize));
            v.measure(doc, items[i], hintWidth, hintHeight, 1);
        });

        let i = 0;
        let r = 0;

        if (vertical) { // item들 수직 배치
            while (i < n) {
                view = views.get(i);
                if (r % ipr === 0) {
                    rowViews.push(vRow = [view]);
                    h = view.mh;
                    r++;
                    i++;
                } else {
                    h += itemGap + view.mh;
                    if (h <= hintHeight) {
                        vRow.push(view);
                        r++;
                        i++;
                    } else {
                        r = 0;
                    }
                }
            }

            this._wMarkers = [];
            w = h = 0;

            rowViews.forEach((views, i) => {
                let wRow = 0;
                let hRow = 0;
                let wMarker = 0;

                views.forEach(v => {
                    hRow += v.mh;
                    wRow = maxv(wRow, v.mw);
                    wMarker = maxv(wMarker, v._rMarker.width);
                    v._col = i;
                })
                hRow += itemGap * (views.length - 1);
                h = maxv(h, hRow);
                w += wRow;
                sizes.push(wRow);
                this._wMarkers.push(wMarker);
            });
            w += lineGap * (rowViews.length - 1);

        } else {
            while (i < n) {
                view = views.get(i);
                if (r % ipr === 0) {
                    rowViews.push(vRow = [view]);
                    w = view.mw;
                    r++;
                    i++;
                } else {
                    w += itemGap + view.mw;
                    if (w <= hintWidth) {
                        vRow.push(view);
                        r++;
                        i++;
                    } else {
                        r = 0;
                    }
                }
            }

            w = h = 0;
            rowViews.forEach(views => {
                let wRow = 0;
                let hRow = 0;
                views.forEach(v => {
                    wRow += v.mw;
                    hRow = maxv(hRow, v.mh);
                })
                wRow += itemGap * (views.length - 1);
                w = maxv(w, wRow);
                h += hRow;
                sizes.push(hRow);
            });
            h += lineGap * (rowViews.length - 1);
        }
        return Size.create(w, h);
    }
}