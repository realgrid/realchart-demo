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
import { ClipElement, LayerElement, PathElement, RcElement } from "../common/RcControl";
import { ISize, Size } from "../common/Size";
import { IValueRange } from "../common/Types";
import { GroupElement } from "../common/impl/GroupElement";
import { LabelElement } from "../common/impl/LabelElement";
import { RectElement } from "../common/impl/RectElement";
import { SvgShapes } from "../common/impl/SvgShape";
import { DataPoint } from "../model/DataPoint";
import { LegendItem } from "../model/Legend";
import { ClusterableSeries, DataPointLabel, MarkerSeries, PointItemPosition, Series, WidgetSeries, WidgetSeriesPoint } from "../model/Series";
import { CategoryAxis } from "../model/axis/CategoryAxis";
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
    // moving = false;

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

export class PointLabelContainer extends LayerElement {

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
        super(doc, 'rct-point-labels');

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

    prepareLabel(doc: Document, view: PointLabelView, index: number, p: DataPoint, series: Series, model: DataPointLabel): void {
        const richFormat = model.text;
        const styles = model.style;

        view.point = p;
        view.setModel(doc, model, null);

        view.internalClearStyleAndClass();
        view.internalSetStyleOrClass(styles);
        view.internalSetStyleOrClass(series.getPointLabelStyle(p));

        if (richFormat) {
            model.buildSvg(view._text, NaN, NaN, model, p.getValueOf);
            // view.setStyles(styles);

            if (view._outline) {
                model.buildSvg(view._outline, NaN, NaN, model, p.getValueOf);
            }

            // label.setStyles(styles);
            // label.setSvg(pointLabel.getSvg(p.getValueOf))
            //      .setStyles(styles);
        } else {
            //label.setValueEx(p.value, true, 1)
            view.setText(model.getText(p.getLabel(index)));
                // .setStyles(styles);
        }
    }

    prepare(doc: Document, owner: SeriesView<Series>): void {
        const model = owner.model;
        const pointLabel = model.pointLabel;

        if (model.isPointLabelsVisible()) {
            const n = model.pointLabelCount();
            const labels = this._labels;
            const points = model.getLabeledPoints();
            const maps = this._maps;
            const style = pointLabel.style;

            // TODO: scroll 시에는 reprepare 필요?
            labels[0].prepare(points.length);
            maps[0] = {};
            labels[1].prepare(n > 1 ? points.length : 0);
            maps[1] = {};

            points.forEach((p, i) => {
                for (let j = 0; j < p.labelCount(); j++) {
                    const label = labels[j].get(i);

                    if (label.setVisible(owner.isPointVisible(p))) {
                        this.prepareLabel(doc, label, j, p, model, pointLabel);
                        maps[j][p.pid] = label;
                    }
                }
            })

            this.setStyleOrClass(style);

        } else {
            this.clear();
        }
    }

    get(point: DataPoint, index: number): PointLabelView {
        const map = this._maps[index]
        return map && map[point.pid];
    }

    removePoint(p: DataPoint, delay: number): void {
        for (let i = 0; i < 2; i++) {
            const v = this.get(p, i);
            if (v) {
                this._labels[i].removeLater(v, delay);
                return;
            }
        }
    }

    // borrow(index: number): PointLabelView { 
    //     return this._labels[index].borrow();
    // }

    // free(index: number, view: PointLabelView, removeDelay = 0): void {
    //     if (view) {
    //         this._labels[index].free(view, removeDelay);
    //     }
    // }
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
        const map = this._map = {};

        if (pointLabel.visible) {
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
                this.setAttr('transform', `translate(0,${height}) rotate(90) scale(-1,1)`);
            } else {
                this.setAttr('transform', '');
            }
        }
        return this.inverted;
    }
}

export type LabelLayoutInfo = {
    inverted: boolean;
    reversed: boolean;
    // point 위치, 크기
    pointView: RcElement;
    x: number;
    y: number;
    hPoint: number;
    wPoint: number;
    // label 설정
    labelView: PointLabelView;
    labelPos: PointItemPosition;
    labelOff: number;
};

const PALETTE_LEN = 12;

export abstract class SeriesView<T extends Series> extends ChartElement<T> {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly POINT_CLASS = 'rct-point';
    static readonly DATA_FOUCS = 'focus';
    static readonly LEGEND_MARKER = 'rct-legend-item-marker';

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _simpleMode = false;
    protected _pointContainer: PointContainer;
    _labelContainer: PointLabelContainer;
    private _trendLineView: PathElement;

    protected _legendMarker: RcElement;
    protected _visPoints: DataPoint[];
    protected _inverted = false;
    protected _animatable = true;
    private _viewRate = NaN;
    _animations: Animation[] = [];

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string) {
        super(doc, 'rct-series ' + styleName);

        this.add(this._pointContainer = new PointContainer(doc, 'rct-series-points'));
        this._labelContainer = new PointLabelContainer(doc);
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    invertable(): boolean {
        return true;
    }

    getClipContainer(): RcElement {
        return this._pointContainer;
    }

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

    setPositionRate(rate: number): void {
    }

    isPointVisible(p: DataPoint): boolean {
        return p.visible && !p.isNull && this.model.isPointLabelVisible(p);
    }

    protected _doViewRateChanged(rate: number): void {
    }

    _setChartOptions(inverted: boolean, animatable: boolean): void {
        this._inverted = inverted;
        this._animatable = animatable;
    }

    _animationStarted(ani: Animation): void {
        this._animations.push(ani);
        if (this._labelContainer && this._labelContainer.visible) {
            this._labelContainer.setVisible(false);
        }
    }

    _animationFinished(ani: Animation): void {
        const i = this._animations.indexOf(ani);
        i >= 0 && this._animations.splice(i, 1);

        this._invalidate();
    }

    protected abstract _getPointPool(): ElementPool<RcElement>;

    pointByDom(elt: Element): IPointView {
        return this._getPointPool().elementOf(elt) as any;
    }

    findPointView(p: DataPoint): RcElement {
        return this._getPointPool().find(v => (v as any).point === p);
    }

    clicked(elt: Element): void {
        const view = this.pointByDom(elt);

        if (view) {
            if (this.model.pointClicked(view.point) !== true) {
                this._doPointClicked(view);
            }
        }
    }

    protected _doPointClicked(view: IPointView): void {
        // console.log('CLICKED: ' + view.point.yValue);
    }

    protected _getColor(): string {
        return this.model._calcedColor;
    }

    prepareSeries(doc: Document, model: T): void {
        // this._viewRate = NaN; // animating 중 다른 시리즈 등의 요청에 의해 여기로 진입할 수 있다.
        this.setData('index', (model.index % PALETTE_LEN) as any);
        this.setBoolData('pointcolors', model._colorByPoint());

        this.internalClearStyleAndClass();
        this.internalSetStyleOrClass(model.style);
        if (model.color) {
            this.internalSetStyle('fill', model.color);
            this.internalSetStyle('stroke', model.color);
        }
        model._calcedColor = getComputedStyle(this.dom).fill;

        this._visPoints = this._collectVisPoints(model);
        this._prepareSeries(doc, model);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _prepareStyleOrClass(model: T): void {
        // legend marker 색상이 필요하므로 prepareSeries()에서 먼저 처리한다.
    }

    protected _doMeasure(doc: Document, model: T, hintWidth: number, hintHeight: number, phase: number): ISize {
        this.setClip(void 0);

        !this._lazyPrepareLabels() && this._labelContainer.prepare(doc, this);

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
        this._animatable && !this._simpleMode && this._runShowEffect(!this.control.loaded);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected abstract _prepareSeries(doc: Document, model: T): void;
    protected abstract _renderSeries(width: number, height: number): void;

    protected _collectVisPoints(model: T): DataPoint[] {
        return model.collectVisibles();
    }

    private $_setColorIndex(v: RcElement, p: DataPoint): void {
        v.setData('index', (p.index % PALETTE_LEN) as any);
    }

    protected _setPointColor(v: RcElement, color: string): void {
        v.internalSetStyle('fill', color);
        v.internalSetStyle('stroke', color);
    }

    protected _setPointStyle(v: RcElement, model: T,  p: DataPoint, styles?: any[]): void {
        v.setAttr('aria-label', p.ariaHint());
        this.$_setColorIndex(v, p);
        v.internalClearStyleAndClass();

        // 정적 point style (ex, line marker)
        if (styles) {
            styles.forEach(st => st && v.internalSetStyleOrClass(st));
        }
       
        // config에서 지정한 point color
        p.color && this._setPointColor(v, p.color);
        if (p.range) { 
            p.range.color && this._setPointColor(v, p.range.color);
            p.range.style && v.internalSetStyleOrClass(p.range.style);
        }
       
        // 동적 스타일
        const st = model.getPointStyle(p);
        st && v.internalSetStyleOrClass(st);
    }

    protected _labelViews(): PointLabelContainer {
        this._labelContainer.setVisible(this.model.isPointLabelsVisible() && !this._animating());
        return this._labelContainer.visible && this._labelContainer;
    }

    protected _getViewRate(): number {
        return pickNum(this._viewRate, 1);
    }

    protected _animating(): boolean {
        return !isNaN(this._viewRate) || this._animations.length > 0;
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
        const pts = m.trendline._points.map(pt => ({x: xAxis.getPosition(xAxis._vlen, pt.x), y: yAxis._vlen - yAxis.getPosition(yAxis._vlen, pt.y)}));
        const sb = new PathBuilder();

        sb.move(pts[0].x, pts[0].y);
        sb.lines(...pts);
        this._trendLineView.setPath(sb.end(false));
    }

    protected _layoutLabel(info: LabelLayoutInfo): void {
        // below이면 hPoint가 음수이다.
        let {inverted, x, y, hPoint, labelView, labelOff} = info;
        const below = info.reversed ? hPoint <= 0 : hPoint < 0;
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

    protected _clipRange(w: number, h: number, rangeAxis: 'x' | 'y' | 'z', range: IValueRange, clip: ClipElement, inverted: boolean): void {
        if (inverted) {
            const t = w;
            w = h;
            h = t;
        }

        const isX = rangeAxis === 'x';
        const axis = isX ? this.model._xAxisObj : this.model._yAxisObj;
        const reversed = axis.reversed;
        const p1 = axis.getPosition(isX ? w : h, range.fromValue);
        const p2 = axis.getPosition(isX ? w : h, range.toValue);

        if (inverted) {
            if (isX) {
                if (reversed) {
                    clip.setBounds(p2, w - h, Math.abs(p2 - p1), h);
                } else {
                    clip.setBounds(p1, w - h, Math.abs(p2 - p1), h);
                }
            } else {
                clip.setBounds(0, w - Math.max(p1, p2), w, Math.abs(p2 - p1));
            }
        } else {
            if (isX) {
                if (reversed) {
                    clip.setBounds(p2, 0, Math.abs(p2 - p1), h);
                } else {
                    clip.setBounds(p1, 0, Math.abs(p2 - p1), h);
                }
            } else {
                clip.setBounds(0, h - Math.max(p1, p2), w, Math.abs(p2 - p1));
            }
        }
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
        super(doc, SeriesView.POINT_CLASS);
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
        this._preparePointViews(doc, model, this._visPoints);
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
        const reversed = yAxis.reversed;
        const wPad = xAxis instanceof CategoryAxis ? xAxis.categoryPad() * 2 : 0;
        const yLen = inverted ? width : height;
        const xLen = inverted ? height : width;
        const yOrg = inverted ? 0 : height;
        const min = yAxis.axisMin();
        const yMin = yAxis.getPosition(yLen, min);
        const base = series.getBaseValue(yAxis);
        const yBase = pickNum(yAxis.getPosition(yLen, Math.max(min, base)), yMin);
        const based = !isNaN(base);
        const info: LabelLayoutInfo = labelViews && Object.assign(this._labelInfo, {
            inverted,
            reversed: yAxis.reversed,
            labelPos: series.getLabelPosition(labels.position),
            labelOff: series.getLabelOff(labels.offset)
        });

        this._getPointPool().forEach((pv: RcElement, i) => {
            const p = (pv as any as IPointView).point;

            if (pv.setVisible(!p.isNull)) {
                const wUnit = xAxis.getUnitLength(xLen, p.xValue) * (1 - wPad);
                const wPoint = series.getPointWidth(wUnit);
                const yVal = yAxis.getPosition(yLen, p.yValue) - yBase;
                const yGroup = (yAxis.getPosition(yLen, p.yGroup) - yBase - yVal) * vr;
                const hPoint = yVal * vr;
                let x: number;
                let y: number;

                x = xAxis.getPosition(xLen, p.xValue) - wUnit / 2;
                p.xPos = x += series.getPointPos(wUnit) + wPoint / 2;
                p.yPos = y = yOrg - yAxis.getPosition(yLen, p.yGroup) * vr;

                // 아래에서 위로 올라가는 animation을 위해 기준 지점을 전달한다.
                this._layoutPointView(pv, i, x, yOrg - yBase - yGroup, wPoint, hPoint);

                // label
                if (info && (info.labelView = labelViews.get(p, 0))) {
                    if (inverted) {
                        // y = xLen - xAxis.getPosition(xLen, p.xValue) - wUnit / 2; // 위에서 아래로 내려갈 때
                        y = xLen - xAxis.getPosition(xLen, p.xValue) + wUnit / 2;
                        x = yOrg;
                        p.yPos = y -= series.getPointPos(wUnit) + wPoint / 2;
                        // p.yPos = y += series.getPointPos(wUnit) + wPoint / 2;
                        if (based) {
                            p.xPos = x += yAxis.getPosition(yLen, p.yGroup) * vr; // stack/fill일 때 org와 다르다.
                        } else {
                            p.xPos = x += yAxis.getPosition(yLen, p.yGroup * vr);
                        }
                    }

                    info.pointView = pv;
                    info.x = x;
                    info.y = y;
                    info.wPoint = wPoint;
                    info.hPoint = hPoint;
                    this._layoutLabel(info);
                }
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

        this._getPointPool().forEach((pv, i) => {
            const p = (pv as any as IPointView).point;

            if (pv.setVisible(!p.isNull)) {
                const wUnit = xAxis.getUnitLength(xLen, p.xValue) * (1 - wPad);
                const wPoint = series.getPointWidth(wUnit);
                const yVal = yAxis.getPosition(yLen, p.yValue);
                const hPoint = (yVal - yAxis.getPosition(yLen, this._getLowValue(p))) * vr;
                let x = xAxis.getPosition(xLen, p.xValue) - wUnit / 2;
                let y = org;

                p.xPos = x += series.getPointPos(wUnit) + wPoint / 2;
                p.yPos = y -= yAxis.getPosition(yLen, p.yGroup) * vr;

                this._layoutPointView(pv, i, x, y, wPoint, hPoint);

                // labels
                if (labelViews) {
                    if (inverted) {
                        // y = xLen - xAxis.getPosition(xLen, p.xVAlue) - wUnit / 2; // 위에서 아래로 내려갈 때
                        y = xLen - xAxis.getPosition(xLen, p.xValue) + wUnit / 2;
                        x = org;
                        // p.yPos = y += series.getPointPos(wUnit) + wPoint / 2;
                        p.yPos = y -= series.getPointPos(wUnit) + wPoint / 2;
                        p.xPos = x += yAxis.getPosition(yLen, p.yGroup) * vr;
                    }
                    info.pointView = pv;
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
            }
        })
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}

export class MarkerSeriesPointView<T extends DataPoint> extends PathElement implements IPointView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: T;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, SeriesView.POINT_CLASS);
    }
}

export abstract class MarkerSeriesView<T extends MarkerSeries> extends SeriesView<T> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    protected _markers: ElementPool<MarkerSeriesPointView<DataPoint>>;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string) {
        super(doc, styleName)

        this._markers = new ElementPool(this._pointContainer, MarkerSeriesPointView);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _getPointPool(): ElementPool<RcElement> {
        return this._markers;
    }

    invertable(): boolean {
        return false;
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected abstract _getAutoPos(overflowed: boolean): PointItemPosition;

    protected _layoutLabelView(labelView: PointLabelView, pos: PointItemPosition, off: number, radius: number, x: number, y: number): void {
        let r = labelView.getBBounds();

        if (pos === PointItemPosition.AUTO) {
            pos = this._getAutoPos(r.width >= radius * 2 * 0.9);
        }
        if (labelView.setVisible(pos != null)) {
            if (pos === PointItemPosition.INSIDE) {
                labelView.translate(x - r.width / 2, y - r.height / 2);
            } else if (pos) {
                labelView.translate(x - r.width / 2, y - radius - r.height - off);
            }
        }
    }
}

class ZombiAnimation extends RcAnimation {

    constructor(public series: WidgetSeriesView<WidgetSeries>) {
        super();

        this.duration = 300;
    }

    protected _doUpdate(rate: number): boolean {
        if (this.series) {
            this.series._zombieRate = this.series._zombie.visible ? rate : 1 - rate;
            this.series._resizeZombie();
            return true;
        }
        return false;
    }

    protected _doStop(): void {
        if (this.series) {
            this.series._zombie = null;
            this.series._zombieAni = null;
            this.series.control.invalidateLayout();
            this.series = null;
        }
    }
}

export abstract class WidgetSeriesView<T extends WidgetSeries> extends SeriesView<T> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _willZombie: DataPoint;
    _zombie: DataPoint;
    _zombieRate: number;
    _zombieAni: ZombiAnimation;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    togglePointVisible(p: DataPoint): void {    
        this._willZombie = p;
        if (!p.visible) {
            // this._labelContainer.removePoint(p, 300);
            this._labelContainer.get(p, 0)?.hide(200);
        }
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    isPointVisible(p: DataPoint): boolean {
        return p === this._zombie || super.isPointVisible(p);
    }

    protected _collectVisPoints(model: T): DataPoint[] {
        let pts = super._collectVisPoints(model);

        if (this._willZombie && !this._willZombie.visible) {
            pts.push(this._willZombie);
            pts = pts.sort((p1, p2) => p1.index - p2.index);
        }
        return pts;
    }

    protected _prepareSeries(doc: Document, model: T): void {
        if (this._zombie) {
            this._zombie = null;
            this._zombieAni?.stop();
            this._zombieAni = null;
        }
        if (this._willZombie) {
            this._zombie = this._willZombie;
            this._willZombie = null;
            this._zombieAni = new ZombiAnimation(this);
            this._zombieAni.start();
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    abstract _resizeZombie(): void;

    protected _createPointLegendMarker(doc: Document, p: DataPoint, size: number): RcElement {
        return RectElement.create(doc, 'rct-legend-item-marker', 0, 0, size, size, size / 2);
    }

    protected _preparePoint(doc: Document, model: T, p: WidgetSeriesPoint, pv: RcElement): void {
        if (!p._legendMarker) {
            p.setLegendMarker(this._createPointLegendMarker(doc, p, LegendItem.MARKER_SIZE));
        }
        this._setPointStyle(pv, model, p);
        p._calcedColor = getComputedStyle(pv.dom).fill;
    }
}