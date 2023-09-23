////////////////////////////////////////////////////////////////////////////////
// HistoryView.ts
// 2023. 09. 23. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { SVGNS } from "../common/Common";
import { LayerElement } from "../common/RcControl";
import { TextAnchor, TextElement } from "../common/impl/TextElement";

export interface IHistoryItem {
    name: string;
    click: (item: IHistoryItem) => void;
}

/**
 * @internal
 */
export class HistoryView extends LayerElement {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly TITLE_CLASS = 'rct-history';

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _itemViews: TextElement[] = [];
    private _separators: TextElement[] = [];

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, HistoryView.TITLE_CLASS);

        this.setVisible(false);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    itemGap = 8;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    setHistory(doc: Document, items: IHistoryItem[]): void {
        if (this.setVisible(items && items.length > 0)) {
            const views = this._itemViews;
            const seps = this._separators;
    
            while (views.length < items.length) {
                const t = new TextElement(doc, 'rct-history-item');
    
                t.anchor = TextAnchor.START;
                views.push(t);
            }
            while (views.length > items.length) {
                views.pop().remove();
            }
    
            while (seps.length < items.length - 1) {
                const t = new TextElement(doc);
    
                t.anchor = TextAnchor.START;
                t.text = '>';
                seps.push(t);
            }
            while (seps.length > items.length - 1) {
                seps.pop().remove();
            }
    
            this.$_layout(items);
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_layout(items: IHistoryItem[]): void {
        const views = this._itemViews;
        const seps = this._separators;
        const gap = this.itemGap;
        const cnt = items.length;
        let x = 0;

        for (let i = 0; i < cnt; i++) {
            views[i].text = items[i].name;
            views[i].translateX(x);

            if (i < cnt - 1) {
                x += views[i].width + gap;
                seps[i].translateX(x);
                x += seps[i].width + gap;
            }
        }
    }
}