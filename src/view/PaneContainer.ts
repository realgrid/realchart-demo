////////////////////////////////////////////////////////////////////////////////
// PaneContainer.ts
// 2023. 11. 07. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { LayerElement } from "../common/RcControl";
import { RectElement } from "../common/impl/RectElement";
import { TextElement } from "../common/impl/TextElement";
import { Split } from "../model/Split";
import { IPlottingOwner } from "./BodyView";

export class PaneContainer extends LayerElement {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly STYLE_NAME = 'rct-panes';

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _debugger: TextElement;
    private _back: RectElement;

    private _owner: IPlottingOwner;
    private _model: Split;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, owner: IPlottingOwner) {
        super(doc, PaneContainer.STYLE_NAME);

        this._owner = owner;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    measure(doc: Document, model: Split, width: number, height: number, phase: number): void {
        this.$_init(doc);
        this._model = model;
    }

    layout(): void {
        const model = this._model;

        this._debugger.text = model.colCount() + ', ' + model.rowCount();
        this._debugger.translate(this.width / 2, this.height / 2);
    }

    //-------------------------------------------------------------------------
    // internal
    //-------------------------------------------------------------------------
    private $_init(doc: Document): void {
        if (this._back) return;

        if (!this._debugger) {
            this.insertFirst(this._debugger = TextElement.createCenter(doc));
        }
    }
}