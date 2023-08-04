////////////////////////////////////////////////////////////////////////////////
// SeriesView.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../common/ElementPool";
import { LayerElement, PathElement, RcElement } from "../common/RcControl";
import { ISize, Size } from "../common/Size";
import { GroupElement } from "../common/impl/GroupElement";
import { LabelElement } from "../common/impl/LabelElement";
import { SvgShapes } from "../common/impl/SvgShape";
import { DataPoint } from "../model/DataPoint";
import { DataPointLabel, Series } from "../model/Series";
import { ChartElement } from "./ChartElement";

export class PointLabelView extends LabelElement {

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

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-point-label');
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
	//-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
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
        super(doc, 'rct-series-labels');
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

    prepareLabel(doc: Document, view: PointLabelView, index: number, p: DataPoint, model: DataPointLabel): void {
        if (view.visible = p.visible) {
        // if (label.visible = !p.isNull && p.visible) {
            const richFormat = model.text;
            const styles = model.style;

            view.point = p;
            view.setModel(doc, model, null);

            if (richFormat) {
                model.buildSvg(view._text, model, p.getValueOf);
                view.setStyles(styles);
                // label.setStyles(styles);
                // label.setSvg(pointLabel.getSvg(p.getValueOf))
                //      .setStyles(styles);
            } else {
                //label.setValueEx(p.value, true, 1)
                view.setText(model.getText(p.getYLabel(index)))
                    .setStyles(styles);
            }
        }
    }

    prepare(doc: Document, model: Series): void {
        const labels = this._labels;
        const points = model.getPoints();
        const pointLabel = model.pointLabel;
        // const svgFormat = pointLabel.svgFormat;

        if (pointLabel.visible) {
            const maps = this._maps;
            // const styles = pointLabel.styles;

            // TODO: scroll 시에는 reprepare 필요?
            labels[0].prepare(points.count);
            labels[1].prepare(points.count);
            maps[0] = {};
            maps[1] = {};

            points.forEach((p, i) => {
                for (let j = 0; j < p.labelCount(); j++) {
                    const label = labels[j].get(i);

                    this.prepareLabel(doc, label, j, p, pointLabel);
                    maps[j][p.pid] = label;
                }
            })

            this.setStyleOrClass(pointLabel.style);

        } else {
            this.clear();
        }
    }

    get(point: DataPoint, index: number): PointLabelView {
        const map = this._maps[index]
        return map && map[point.pid];
    }

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
        super(doc, 'rct-point-label-lines');
    }

	//-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
	//-------------------------------------------------------------------------
    // metehods
    //-------------------------------------------------------------------------
    prepare(model: Series): void {
        const lines = this._lines;
        const points = model.getPoints();
        const pointLabel = model.pointLabel;

        if (pointLabel.visible) {
            const map = this._map = {};

            lines.prepare(points.count).forEach((line, i) => {
                const p = points.get(i);

                if (line.visible = p.visible) {
                }
                map[p.pid] = line;
            })
        } else {
            lines.prepare(0);
        }
    }

    get(point: DataPoint): PointLabelLine {
        return this._map[point.pid];
    }
}

export abstract class SeriesView<T extends Series> extends ChartElement<T> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    protected _pointContainer: LayerElement;
    protected _labelContainer: PointLabelContainer;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string) {
        super(doc, 'rct-series ' + styleName);

        this.add(this._pointContainer = new LayerElement(doc, 'rct-series-points'));
        this.add(this._labelContainer = new PointLabelContainer(doc));
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doMeasure(doc: Document, model: T, hintWidth: number, hintHeight: number, phase: number): ISize {
        this._prepareSeries(doc, model);
        this._labelContainer.prepare(doc, model);
        
        return Size.create(hintWidth, hintHeight);
    }

    protected _doLayout(): void {
        this._renderSeries(this.width, this.height);
        this._afterRender();
        this._runShowEffect(true);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected abstract _prepareSeries(doc: Document, model: T): void;
    protected abstract _renderSeries(width: number, height: number): void;

    protected _afterRender(): void {}
    protected _runShowEffect(firstTime: boolean): void {}
}

export class BoxPointElement extends PathElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: DataPoint;
    labelViews: PointLabelView[] = [];
    wPoint: number;
    hPoint: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-series-bar');
    }
}

export class BarElement extends BoxPointElement {

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    render(x: number, y: number, inverted: boolean): void {
        this.setPath(SvgShapes.rect(inverted ? {
            x: x,
            y: y - this.wPoint / 2,
            width: this.hPoint,
            height: this.wPoint
        } : {
            x: x - this.wPoint / 2,
            y: y,
            width: this.wPoint,
            height: -this.hPoint
        }));
    }
}
