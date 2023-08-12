////////////////////////////////////////////////////////////////////////////////
// SeriesView.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum } from "../common/Common";
import { ElementPool } from "../common/ElementPool";
import { PathBuilder } from "../common/PathBuilder";
import { RcAnimation } from "../common/RcAnimation";
import { LayerElement, PathElement, RcElement } from "../common/RcControl";
import { ISize, Size } from "../common/Size";
import { GroupElement } from "../common/impl/GroupElement";
import { LabelElement } from "../common/impl/LabelElement";
import { SvgShapes } from "../common/impl/SvgShape";
import { DataPoint } from "../model/DataPoint";
import { DataPointLabel, Series } from "../model/Series";
import { ChartElement } from "./ChartElement";

export interface IPointView {
    point: DataPoint;
}

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
        const points = model.getLabeledPoints();
        const pointLabel = model.pointLabel;
        // const svgFormat = pointLabel.svgFormat;

        if (pointLabel.visible) {
            const maps = this._maps;
            // const styles = pointLabel.styles;

            // TODO: scroll 시에는 reprepare 필요?
            labels[0].prepare(points.length);
            labels[1].prepare(points.length);
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
    // consts
    //-------------------------------------------------------------------------
    static readonly POINT_STYLE = 'rct-data-point';
    static readonly DATA_FOUCS = 'focus'

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    protected _pointContainer: LayerElement;
    private _labelContainer: PointLabelContainer;
    private _trendLineView: PathElement;

    protected _inverted = false;
    private _viewRate = NaN;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string) {
        super(doc, 'rct-series ' + styleName);

        this.add(this._pointContainer = new LayerElement(doc, 'rct-series-points'));
        this.add(this._labelContainer = new PointLabelContainer(doc));
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    setViewRate(rate: number): void {
        if ((!isNaN(rate) || !isNaN(this._viewRate)) && rate !== this._viewRate) {
            this._viewRate = rate;
            if (isNaN(rate)) {
                this.control.invalidateLayout();
            } else {
                this._doViewRateChanged(rate);
            }
        }
    }

    protected _doViewRateChanged(rate: number): void {
    }

    _setInverted(value: boolean): void {
        this._inverted = value;
    }

    _animationStarted(ani: Animation): void {
        if (this._labelContainer && this._labelContainer.visible) {
            this._labelContainer.setVisible(false);
        }
    }

    _animationFinished(ani: Animation): void {
        this._invalidate();
    }

    protected abstract _getPointPool(): ElementPool<RcElement>;

    pointByDom(elt: SVGElement): IPointView {
        return this._getPointPool().elementOf(elt) as any;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doMeasure(doc: Document, model: T, hintWidth: number, hintHeight: number, phase: number): ISize {
        this._viewRate = NaN;
        this._prepareSeries(doc, model);
        !this._lazyPrepareLabels() && this._labelContainer.prepare(doc, model);

        if (model.trendline.visible) {
            if (!this._trendLineView) {
                this.add(this._trendLineView = new PathElement(doc, 'rct-series-trendline'));
            }
            this._trendLineView.setVisible(true);
        } else if (this._trendLineView) {
            this._trendLineView.setVisible(false);
        }
        
        return Size.create(hintWidth, hintHeight);
    }

    protected _doLayout(): void {
        this._labelViews();
        this._renderSeries(this.width, this.height);
        if (this._trendLineView && this._trendLineView.visible) {
            this.$_renderTrendline();       
        }
        this._afterRender();
        this._runShowEffect(!this.control.loaded);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected abstract _prepareSeries(doc: Document, model: T): void;
    protected abstract _renderSeries(width: number, height: number): void;

    protected _labelViews(): PointLabelContainer {
        this._labelContainer.setVisible(this.model.pointLabel.visible && !this._animating());
        return this._labelContainer.visible && this._labelContainer;
    }

    protected _getViewRate(): number {
        return pickNum(this._viewRate, 1);
    }

    protected _animating(): boolean {
        return !isNaN(this._viewRate);
    }

    protected _lazyPrepareLabels(): boolean { return false; }
    protected _afterRender(): void {}
    protected _getShowAnimation(): RcAnimation { return }
    protected _runShowEffect(firstTime: boolean): void {
        //this._getShowAnimation()?.run(this);
    }

    private $_renderTrendline(): void {
        const m = this.model;
        const xAxis = m._xAxisObj;
        const yAxis = m._yAxisObj;
        const pts = m.trendline._points.map(pt => ({x: xAxis.getPosition(xAxis._length, pt.x), y: yAxis._length - yAxis.getPosition(yAxis._length, pt.y)}));
        const sb = new PathBuilder();

        sb.move(pts[0].x, pts[0].y);
        sb.lines(...pts);
        this._trendLineView.setPath(sb.end(false));
    }
}

export class BoxPointElement extends PathElement implements IPointView {

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
        super(doc, SeriesView.POINT_STYLE + ' rct-series-bar');
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
