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
import { ClusterableSeries, DataPointLabel, PointItemPosition, Series } from "../model/Series";
import { CategoryAxis } from "../model/axis/CategoryAxis";
import { LinearAxis } from "../model/axis/LinearAxis";
import { ChartElement } from "./ChartElement";
import { SeriesAnimation } from "./animation/SeriesAnimation";

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

        this.setStyle('pointerEvents', 'none');
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

                if (view ._outline) {
                    model.buildSvg(view._outline, model, p.getValueOf);
                }

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

export class PointContainer extends LayerElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    inverted = false;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    invert(v: boolean, height: number): boolean {
        if (v !== this.inverted) {
            if (this.inverted = v) {
                this.dom.style.transform = `translate(0px, ${height}px) rotate(90deg) scale(-1, 1)`;
            } else {
                this.dom.style.transform = ``;
            }
        }
        return this.inverted;
    }
}

export type LabelLayoutInfo = {
    inverted: boolean
    // point 위치, 크기
    pointView: RcElement,
    x: number,  
    y: number,
    hPoint: number,
    wPoint: number,
    // label 설정
    labelView: PointLabelView,
    labelPos: PointItemPosition,
    labelOff: number
};

export abstract class SeriesView<T extends Series> extends ChartElement<T> {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly POINT_CLASS = 'rct-data-point';
    static readonly DATA_FOUCS = 'focus'

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    protected _pointContainer: PointContainer;
    private _labelContainer: PointLabelContainer;
    private _trendLineView: PathElement;

    protected _inverted = false;
    protected _animatable = true;
    private _viewRate = NaN;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string) {
        super(doc, 'rct-series ' + styleName);

        this.add(this._pointContainer = new PointContainer(doc, 'rct-series-points'));
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

    _setChartOptions(inverted: boolean, animatable: boolean): void {
        this._inverted = inverted;
        this._animatable = animatable;
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
        this.setClip(void 0);
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
        this._animatable && this._runShowEffect(!this.control.loaded);
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

    protected _layoutLabel(info: LabelLayoutInfo): void {
        // below이면 hPoint가 음수이다.
        let {inverted, x, y, hPoint, labelView, labelOff} = info;
        const below = hPoint < 0;
        const r = labelView.getBBounds();
        let inner = true;

        if (inverted) {
            y -= r.height / 2;
        } else {
            x -= r.width / 2;
        }

        switch (info.labelPos) {
            case PointItemPosition.INSIDE:
                if (inverted) {
                    x -= hPoint / 2 + labelOff;
                } else {
                    y += (hPoint - r.height) / 2 + labelOff;
                }
                break;

            case PointItemPosition.HEAD:
                if (inverted) {
                    if (below) {
                        x += r.width - labelOff;
                    } else {
                        x -= r.width + labelOff;
                    }
                } else {
                    if (below) {
                        y -= r.height + labelOff;
                    } else {
                        y += labelOff;
                    }
                }
                break;

            case PointItemPosition.FOOT:
                if (inverted) {
                    if (below) {
                        x -= hPoint + r.width + labelOff;
                    } else {
                        x -= hPoint - labelOff;
                    }
                } else {
                    if (below) {
                        y += hPoint + labelOff;
                    } else {
                        y += hPoint - r.height - labelOff;
                    }
                }
                break;

            case PointItemPosition.OUTSIDE:
            default:
                if (inverted) {
                    if (below) {
                        x -= r.width + labelOff;
                    } else {
                        x += labelOff;
                    }
                } else {
                    if (below) {
                        y += labelOff;
                    } else {
                        y -= r.height + labelOff;
                    }
                }
                inner = false;
                break;
        }

        labelView.setContrast(inner && info.pointView.dom);
        labelView.layout().translate(x, y);
    }
}

export abstract class BoxPointElement extends PathElement implements IPointView {

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
        super(doc, SeriesView.POINT_CLASS + ' rct-box-point');
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    public abstract layout(x: number, y: number): void;
}

export class BarElement extends BoxPointElement {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    layout(x: number, y: number): void {
        this.setPath(SvgShapes.rect({
            x: x - this.wPoint / 2,
            y,
            width: this.wPoint,
            height: -this.hPoint
        }));
    }
}

export abstract class ClusterableSeriesView<T extends Series> extends SeriesView<T> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    protected _labelInfo: LabelLayoutInfo = {} as any;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _prepareSeries(doc: Document, model: T): void {
        this._preparePointViews(doc, model, model._visPoints);
    }

    protected _renderSeries(width: number, height: number): void {
        this._pointContainer.invert(this._inverted, height);
        this._layoutPointViews(width, height);
    }

    protected _runShowEffect(firstTime: boolean): void {
        firstTime && SeriesAnimation.grow(this);
    }

    protected _doViewRateChanged(rate: number): void {
        this._layoutPointViews(this.width, this.height);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected abstract _preparePointViews(doc: Document, model: T, points: DataPoint[]): void;
    protected abstract _layoutPointViews(width: number, height: number): void;
    protected abstract _layoutPointView(view: RcElement, index: number, x: number, y: number, wPoint: number, hPoint: number): void;
}

export abstract class BoxedSeriesView<T extends ClusterableSeries> extends ClusterableSeriesView<T> {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _layoutPointViews(width: number, height: number): void {
        const series = this.model;
        const inverted = this._inverted;
        const vr = this._getViewRate();
        const labels = series.pointLabel;
        const labelViews = this._labelViews();
        const xAxis = series._xAxisObj;
        const yAxis = series._yAxisObj;
        const wPad = xAxis instanceof CategoryAxis ? xAxis.categoryPad() * 2 : 0;
        const yLen = (inverted ? width : height);
        const xLen = inverted ? height : width;
        const org = inverted ? 0 : height;;
        const yMin = yAxis.getPosition(yLen, yAxis.axisMin());
        const base = series.getBaseValue(yAxis);
        const yBase = pickNum(yAxis.getPosition(yLen, base), yMin);
        const based = !isNaN(base);
        const info: LabelLayoutInfo = labelViews && Object.assign(this._labelInfo, {
            inverted,
            labelPos: series.getLabelPosition(labels.position),
            labelOff: series.getLabelOff(labels.offset)
        });

        this._getPointPool().forEach((pointView: RcElement, i) => {
            const p = (pointView as any as IPointView).point;
            const wUnit = xAxis.getUnitLength(xLen, i) * (1 - wPad);
            const wPoint = series.getPointWidth(wUnit);
            const yVal = yAxis.getPosition(yLen, p.yValue);
            const hPoint = (yVal - yBase) * vr;
            let x: number;
            let y: number;

            x = xAxis.getPosition(xLen, i) - wUnit / 2;
            y = org;

            p.xPos = x += series.getPointPos(wUnit) + wPoint / 2;
            if (based) { // TODO: 합칠 수 있나?
                p.yPos = y -= yAxis.getPosition(yLen, p.yGroup * vr); // stack/fill일 때 org와 다르다.
            } else {
                p.yPos = y -= yAxis.getPosition(yLen, p.yGroup) * vr; 
            }

            // 아래에서 위로 올라가는 animation을 위해 바닥 지점을 전달한다.
            this._layoutPointView(pointView, i, x, y + hPoint, wPoint, hPoint);

            // label
            if (info && (info.labelView = labelViews.get(p, 0))) {
                if (inverted) {
                    // y = xLen - xAxis.getPosition(xLen, i) - wUnit / 2; // 위에서 아래로 내려갈 때
                    y = xLen - xAxis.getPosition(xLen, i) + wUnit / 2;
                    x = org;
                    p.yPos = y -= series.getPointPos(wUnit) + wPoint / 2;
                    // p.yPos = y += series.getPointPos(wUnit) + wPoint / 2;
                    if (based) {
                        p.xPos = x += yAxis.getPosition(yLen, p.yGroup) * vr; // stack/fill일 때 org와 다르다.
                    } else {
                        p.xPos = x += yAxis.getPosition(yLen, p.yGroup * vr);
                    }
                }

                info.pointView = pointView;
                info.x = x;
                info.y = y;
                info.wPoint = wPoint;
                info.hPoint = hPoint;
                this._layoutLabel(info);
            }
        })
    }
}

export abstract class RangedSeriesView<T extends ClusterableSeries> extends ClusterableSeriesView<T> {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected abstract _getLowValue(p: DataPoint): number;

    protected _layoutPointViews(width: number, height: number): void {
        const series = this.model;
        const inverted = series.chart.isInverted();
        const vr = this._getViewRate();
        const labels = series.pointLabel;
        const labelViews = this._labelViews();
        const xAxis = series._xAxisObj;
        const yAxis = series._yAxisObj;
        const wPad = xAxis instanceof CategoryAxis ? xAxis.categoryPad() * 2 : 0;
        const yLen = inverted ? width : height;
        const xLen = inverted ? height : width;
        const org = inverted ? 0 : height;;
        const info: LabelLayoutInfo = labelViews && Object.assign(this._labelInfo, {
            inverted,
            labelPos: series.getLabelPosition(labels.position),
            labelOff: series.getLabelOff(labels.offset)
        });

        this._getPointPool().forEach((pointView, i) => {
            const p = (pointView as any as IPointView).point;
            const wUnit = xAxis.getUnitLength(xLen, i) * (1 - wPad);
            const wPoint = series.getPointWidth(wUnit);
            const yVal = yAxis.getPosition(yLen, p.yValue);
            const hPoint = (yVal - yAxis.getPosition(yLen, this._getLowValue(p))) * vr;
            let x = xAxis.getPosition(xLen, i) - wUnit / 2;
            let y = org;

            p.xPos = x += series.getPointPos(wUnit) + wPoint / 2;
            p.yPos = y -= yAxis.getPosition(yLen, p.yGroup) * vr;

            this._layoutPointView(pointView, i, x, y, wPoint, hPoint);

            // labels
            if (labelViews) {
                if (inverted) {
                    // y = xLen - xAxis.getPosition(xLen, i) - wUnit / 2; // 위에서 아래로 내려갈 때
                    y = xLen - xAxis.getPosition(xLen, i) + wUnit / 2;
                    x = org;
                    // p.yPos = y += series.getPointPos(wUnit) + wPoint / 2;
                    p.yPos = y -= series.getPointPos(wUnit) + wPoint / 2;
                    p.xPos = x += yAxis.getPosition(yLen, p.yGroup) * vr;
                }
                info.pointView = pointView;
                info.hPoint = hPoint;
                info.x = x;
                info.y = y;

                // top
                if (info.labelView = labelViews.get(p, 0)) {
                    info.hPoint = hPoint;
                    this._layoutLabel(info);
                }
                // bottom
                if (info.labelView = labelViews.get(p, 1)) {
                    if (inverted) info.x -= hPoint;
                    else info.y += hPoint;
                    info.hPoint = -hPoint;
                    this._layoutLabel(info);
                }
            }
        })
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}
