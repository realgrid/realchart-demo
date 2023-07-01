////////////////////////////////////////////////////////////////////////////////
// SeriesView.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { Color } from "../common/Color";
import { ElementPool } from "../common/ElementPool";
import { PathElement } from "../common/RcControl";
import { ISize, Size } from "../common/Size";
import { GroupElement } from "../common/impl/GroupElement";
import { TextAnchor, TextElement } from "../common/impl/TextElement";
import { DataPoint } from "../model/DataPoint";
import { DataPointLabel, Series } from "../model/Series";
import { ChartElement } from "./ChartElement";

export class PointLabelView extends GroupElement {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // static members
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: DataPoint;
    moving = false;
    private _outline: TextElement;
    private _text: TextElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'dlchart-point-label');

        this.add(this._outline = new TextElement(doc));
        this._outline.anchor = TextAnchor.START;

        this.add(this._text = new TextElement(doc));
        this._text.anchor = TextAnchor.START;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /** text */
    get text(): string {
        return this._text.text;
    }

	//-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    setText(s: string): PointLabelView {
        this._outline.text = s;
        this._text.text = s;
        return this;
    }

    setSvg(s: string): PointLabelView {
        this._text.svg = s;
        return this;
    }

    setOutline(value: boolean): PointLabelView {
        this._outline.visible = value;
        return this;
    }

    setContrast(target: Element, darkColor: string, brightColor: string): PointLabelView {
        this._outline.visible = false;
        this._text.setContrast(target, darkColor, brightColor);
        return this;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    setStyles(styles: any): boolean {
        let changed = this._text.setStyles(styles);

        if (this._outline) {
            if (this._outline.setStyles(styles)) {
                changed = true;
                this.$_setOutline(Color.getContrast(getComputedStyle(this._text.dom).fill));
            }
        }
        return changed;
    }

    setStyle(prop: string, value: string): boolean {
        let changed = this._text.setStyle(prop, value);

        if (this._outline) {
            if (this._outline.setStyle(prop, value)) {
                changed = true;
                this.$_setOutline(Color.getContrast(getComputedStyle(this._text.dom).fill));
            }
        }
        return changed;
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_setOutline(color: string): void {
        this._outline.setStyles({
            fill: color,
            stroke: color,
            strokeWidth: '2px'
        });
    }
}

export class PointLabelContainer extends GroupElement {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // static members
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _labels = [new ElementPool(this, PointLabelView), new ElementPool(this, PointLabelView)];
    private _maps: {[key: string]: PointLabelView}[] = [];

    //-------------------------------------------------------------------------
    // constructors
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'dlchart-series-labels');
    }

    protected _doDestory(): void {
        super._doDestory();
    }

	//-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
	//-------------------------------------------------------------------------
    // metehods
    //-------------------------------------------------------------------------
    clear(): void {
        this._labels[0].prepare(0);
        this._labels[1].prepare(0);
    }

    public prepareLabel(label: PointLabelView, index: number, p: DataPoint, model: DataPointLabel): void {
        if (label.visible = p.visible) {
        // if (label.visible = !p.isNull && p.visible) {
            // const svgFormat = model.svgFormat;
            // const styles = model.styles;

            label.point = p;
            !model.autoContrast && label.setStyle('fill', '');

            // if (svgFormat) {
            //     model.buildSvg(label['_text'], model, p.getValueOf);
            //     label.setStyles(styles);
                // label.setSvg(pointLabel.getSvg(p.getValueOf))
                //      .setStyles(styles);
            // } else {
                //label.setValueEx(p.value, true, 1)
                label.setText(model.getText(p.value))//getYLabel(index)))
                    .setOutline(model.outlined)
            //         .setStyles(styles);
            // }
        }
    }

    prepare(model: Series): void {
        // const labels = this._labels;
        // const points = model.getViewPoints();
        // const pointLabel = model.series.pointLabel;
        // const svgFormat = pointLabel.svgFormat;

        // if (pointLabel.visible) {
        //     const maps = this._maps;
        //     const styles = pointLabel.styles;

        //     // TODO: scroll 시에는 reprepare 필요?
        //     labels[0].prepare(points.length);
        //     labels[1].prepare(points.length);
        //     maps[0] = {};
        //     maps[1] = {};

        //     points.forEach((p, i) => {
        //         for (let j = 0; j < p.yLabelCount; j++) {
        //             const label = labels[j].get(i);

        //             this.prepareLabel(label, j, p, pointLabel);
        //             maps[j][p.id] = label;
        //         }
        //     })
        // } else {
        //     this.clear();
        // }
    }

    // get(point: DataPoint, index: number): PointLabelView {
    //     const map = this._maps[index]
    //     return map && map[point.id];
    // }

    borrow(index: number): PointLabelView { 
        return this._labels[index].borrow();
    }

    free(index: number, view: PointLabelView, removeDelay = 0): void {
        if (view) {
            this._labels[index].free(view, removeDelay);
        }
    }
}

export class PointLabelLine extends GroupElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: DataPoint;
    private _line: PathElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc);

        this.add(this._line = new PathElement(doc));
    }

	//-------------------------------------------------------------------------
    // metehods
    //-------------------------------------------------------------------------
    setLine(line: string | any[]): void {
        this._line.setPath(line);
    }
}


export class PointLabelLineContainer extends GroupElement {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // static members
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _lines = new ElementPool(this, PointLabelLine);
    private _map: {[key: string]: PointLabelLine};

    //-------------------------------------------------------------------------
    // constructors
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'dlchart-point-label-line');
    }

	//-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
	//-------------------------------------------------------------------------
    // metehods
    //-------------------------------------------------------------------------
    // prepare(model: PieSeriesViewModel): void {
    //     const lines = this._lines;
    //     const points = model.getViewPoints();
    //     const pointLabel = model.series.pointLabel;

    //     if (pointLabel.visible) {
    //         const map = this._map = {};

    //         lines.prepare(points.length).forEach((line, i) => {
    //             const p = points[i];

    //             if (line.visible = p.visible) {
    //             }
    //             map[p.id] = line;
    //         })
    //     } else {
    //         lines.prepare(0);
    //     }
    // }

    // get(point: DataPoint): PointLabelLine {
    //     return this._map[point.id];
    // }
}

export abstract class SeriesView<T extends Series> extends ChartElement<T> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _pointContainer: GroupElement;
    private _labelContainer: any;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-series');
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doMeasure(doc: Document, model: T, hintWidth: number, hintHeight: number, phase: number): ISize {
        return Size.create(hintWidth, hintHeight);
    }

    protected _doLayout(): void {
        this._renderSeries(this.width, this.height);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected abstract _renderSeries(width: number, height: number): void;
}