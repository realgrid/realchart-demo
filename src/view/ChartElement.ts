////////////////////////////////////////////////////////////////////////////////
// ChartElement.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { RcElement } from "../common/RcControl";
import { IRect } from "../common/Rectangle";
import { Sides } from "../common/Sides";
import { ISize } from "../common/Size";
import { _undef } from "../common/Types";
import { GroupElement } from "../common/impl/GroupElement";
import { RectElement } from "../common/impl/RectElement";
import { Chart, IChart } from "../model/Chart";
import { ChartItem } from "../model/ChartItem";

export abstract class ChartElement<T extends ChartItem> extends RcElement {
 
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    model: T;
    mw: number;
    mh: number;
    _debugRect: RectElement;
    
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName = _undef) {
        super(doc, styleName, 'g');

        if (RcElement.DEBUGGING) {
            this.add(this._debugRect = new RectElement(doc, 'rct-debug'));
            this._debugRect.setAttr('pointerEvents', 'none');
        }
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    chart(): IChart {
        return this.model.chart;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    protected _prepareStyleOrClass(model: T): void {
        this.setStyleOrClass(model.style);
    }

    // visible이 false인 경우 measure가 호출되지 않아서 model이 재설정되지 않을 수 있다.
    setModel(model: T): void {
        if (model !== this.model) {
            this.model = model;
            this._doModelChanged();
        }
    }

    measure(doc: Document, model: T, hintWidth: number, hintHeight: number, phase: number): ISize {
        this._prepareStyleOrClass(model);
        this.setModel(model);

        const sz = this._doMeasure(doc, this.model, hintWidth, hintHeight, phase);

        this.mw = sz.width;
        this.mh = sz.height;
        return sz;
    }

    layout(param?: any): ChartElement<ChartItem> {
        this._doLayout(param);

        if (RcElement.DEBUGGING) {
            if (!this._debugRect) {
                this.insertFirst(this._debugRect = new RectElement(this.doc, 'rct-debug'));
                //this._debugRect.setAttr('pointerEvents', 'none');
            }
            if (this.width > 1 && this.height > 1) {
                this._debugRect.setRect(this._getDebugRect());
            }
        } else if (this._debugRect) {
            this._debugRect.remove();
            this._debugRect = null;
        }
        return this;
    }

    resizeByMeasured(): ChartElement<ChartItem> {
        this.resize(this.mw, this.mh);
        return this;
    }

    //-------------------------------------------------------------------------
    // internal methods
    //-------------------------------------------------------------------------
    protected _getDebugRect(): IRect {
        return {
            x: 0,
            y: 0,
            width: this.width,
            height: this.height
        }
    }

    protected _doMeasure(doc: Document, model: T, hintWidth: number, hintHeight: number, phase: number): ISize {
        return { width: hintWidth, height: hintHeight };
    }

    protected _doLayout(param: any): void {
    }

    protected _invalidate(): void {
        this.control?.invalidateLayout();
    }

    protected _doModelChanged(): void {
    }
}

export abstract class BoundableElement<T extends ChartItem> extends ChartElement<T> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    protected _background: RectElement;
    protected _margins = new Sides();
    protected _paddings = new Sides();

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string, backStyle: string) {
        super(doc, styleName);

        this.add(this._background = new RectElement(doc, backStyle));
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _getDebugRect(): IRect {
        return this._margins.shrink(super._getDebugRect());
    }

    measure(doc: Document, model: T, hintWidth: number, hintHeight: number, phase: number): ISize {
        this._prepareStyleOrClass(model);
        this.setModel(model);

        // this._background.internalClearStyleAndClass();
        this._setBackgroundStyle(this._background);

        // TODO: 캐쉬!
        let cs = getComputedStyle(this._background.dom);
        const padding = this._paddings;
        padding.applyPadding(cs);

        const sz = this._doMeasure(doc, model, hintWidth, hintHeight, phase);

        // // TODO: 캐쉬!
        // let cs = getComputedStyle(this._background.dom);
        // const padding = this._paddings;
        // padding.applyPadding(cs);

        sz.width += padding.left + padding.right;
        sz.height += padding.top + padding.bottom;

        if (this._marginable()) {
            const margin = this._margins;

            cs = getComputedStyle(this.dom);
            margin.applyMargin(cs);
            this.mw = sz.width += margin.left + margin.right;
            this.mh = sz.height += margin.top + margin.bottom;
        
        }
        this.mw = sz.width;
        this.mh = sz.height;
        return sz;
    }

    layout(param?: any): ChartElement<ChartItem> {
        super.layout(param);

        // background
        if (this._marginable()) {
            const margin = this._margins;

            this._background.setBounds(
                margin.left + this._getBackOffset(), 
                margin.top, 
                this.width - margin.left - margin.right,
                this.height - margin.top - margin.bottom
            );
        } else if (this._resetBackBounds()) {
            this._background.setBounds(0, 0, this.width, this.height);
        }
        return this;
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected abstract _setBackgroundStyle(back: RectElement): void;
    
    protected _marginable(): boolean {
        return true;
    }

    protected _resetBackBounds(): boolean {
        return true;
    }

    protected _getBackOffset(): number {
        return 0;
    }

    protected _deflatePaddings(size: ISize): void {
        const pad = this._paddings;

        size.width -= pad.left + pad.right;
        size.height -= pad.top + pad.bottom;
    }
}

/**
 * @internal
 */
export abstract class SectionView extends GroupElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    protected _inverted: boolean;
    mw: number;
    mh: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    measure(doc: Document, chart: Chart, hintWidth: number, hintHeight: number, phase: number): ISize {
        this._setInverted(chart.isInverted());
        
        const sz = this._doMeasure(doc, chart, hintWidth, hintHeight, phase);

        this.mw = sz.width;
        this.mh = sz.height;
        return sz;
    }

    resizeByMeasured(): SectionView {
        this.resize(this.mw, this.mh);
        return this;
    }

    layout(param?: any): SectionView {
        this._doLayout(param);
        return this;
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected abstract _doMeasure(doc: Document, chart: Chart, hintWidth: number, hintHeight: number, phase: number): ISize;
    protected abstract _doLayout(param?: any): void;

    protected _setInverted(inverted: boolean): void {
        this._inverted = inverted;
    }
}

export abstract class ContentView<T extends ChartItem> extends ChartElement<T> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    protected _inverted = false;
    protected _animatable = true;
    protected _loadAnimatable = true;

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    _setChartOptions(inverted: boolean, animatable: boolean, loadAnimatable: boolean): void {
        this._inverted = inverted;
        this._animatable = animatable;
        this._loadAnimatable = loadAnimatable;
    }
}