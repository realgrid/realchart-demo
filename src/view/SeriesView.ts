////////////////////////////////////////////////////////////////////////////////
// SeriesView.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum, assign, isObject, isString, absv, maxv, minv } from "../common/Common";
import { ElementPool } from "../common/ElementPool";
import { PathBuilder } from "../common/PathBuilder";
import { IPoint, Point } from "../common/Point";
import { RcAnimation, createAnimation } from "../common/RcAnimation";
import { ClipRectElement, LayerElement, PathElement, RcElement } from "../common/RcControl";
import { ISize } from "../common/Size";
import { FILL, IValueRange, SVGStyleOrClass, _undef } from "../common/Types";
import { GroupElement } from "../common/impl/GroupElement";
import { LabelElement } from "../common/impl/LabelElement";
import { RectElement } from "../common/impl/RectElement";
import { SvgShapes } from "../common/impl/SvgShape";
import { Axis } from "../model/Axis";
import { DataPoint } from "../model/DataPoint";
import { LegendItem } from "../model/Legend";
import { ClusterableSeries, DataPointLabel, HoverEffect, MarkerSeries, PointItemPosition, Series, WidgetSeries, WidgetSeriesPoint } from "../model/Series";
import { ContentView } from "./ChartElement";
import { LegendItemView } from "./LegendView";
import { HoverAnimation } from "./animation/HoverAnimation";
import { PrevAnimation, SeriesAnimation } from "./animation/SeriesAnimation";

export interface IPointView {
    point: DataPoint;
    // saveVal: number;

    getTooltipPos?(): IPoint;
    saveStyles(): void;
    restoreStyles(): void;
}

export class PointLabelView extends LabelElement {

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

        this.ignorePointer();
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
        const richFormat = series.getPointText(p, model.text);
        const styles = model.style;

        view.point = p;
        view.setModel(doc, model, null, null);

        view._text.internalClearStyleAndClass();
        view._text.internalSetStyleOrClass(styles);
        view._text.internalSetStyleOrClass(series.getPointLabelStyle(p));

        if (richFormat) {
            model.prepareRich(richFormat);
            model.buildSvg(view._text, view._outline, NaN, NaN, model, model.getTextDomain(p));
        } else {
            view.setText(model.getText(model.getValue(p, index)));
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

                    if (label.setVis(owner.isPointVisible(p))) {
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

export const PALETTE_LEN = 12;

export abstract class SeriesView<T extends Series> extends ContentView<T> {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly POINT_CLASS = 'rct-point';
    static readonly DATA_FOUCS = 'focus';
    static readonly LEGEND_MARKER = 'rct-legend-item-marker';

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _simpleMode = false; // navigator에 들어가면 true
    protected _pointContainer: PointContainer;
    _labelContainer: PointLabelContainer;
    private _trendLineView: PathElement;

    protected _legendMarker: RcElement;
    protected _visPoints: DataPoint[];
    private _growRate = NaN;
    private _posRate = NaN;
    protected _prevRate = NaN;
    _animations: Animation[] = [];
    _hoverAnis: HoverAnimation[] = [];
    _hoverPts: IPointView[] = [];

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
    clipInvertable(): boolean {
        return true;
    }

    getClipContainer(): RcElement {
        return this._pointContainer;
    }

    getClipContainer2(): RcElement {
        return null;
    }

    defaultAnimation(): string {
        return 'reveal';
    }

    setGrowRate(rate: number): void {
        if ((!isNaN(rate) || !isNaN(this._growRate)) && rate !== this._growRate) {
            this._growRate = rate;
            if (isNaN(rate) && isNaN(this._posRate) && isNaN(this._prevRate)) {
                this.invalidate();
            } else {
                this._doViewRateChanged(rate);
            }
        }
    }

    setPosRate(rate: number): void {
        if ((!isNaN(rate) || !isNaN(this._posRate)) && rate !== this._posRate) {
            this._posRate = rate;
            if (isNaN(rate) && isNaN(this._growRate) && isNaN(this._prevRate)) {
                this.invalidate();
            } else {
                this._doPosRateChanged(rate);
            }
        }
    }

    setPrevRate(rate: number): void {
        if ((!isNaN(rate) || !isNaN(this._prevRate)) && rate !== this._prevRate) {
            this._prevRate = rate;
            if (isNaN(rate) && isNaN(this._growRate) && isNaN(this._prevRate)) {
                this.invalidate();
            } else {
                this._doPrevRateChanged(rate);
            }
        }
    }

    isPointVisible(p: DataPoint): boolean {
        return p.visible && !p.isNull && this.model.isPointLabelVisible(p);
    }

    protected _doViewRateChanged(rate: number): void {
    }

    protected _doPosRateChanged(rate: number): void {
    }

    protected _doPrevRateChanged(rate: number): void {
    }

    // SeriesAnimation 시작
    _animationStarted(ani: Animation): void {
        this._animations.push(ani);
        this._labelContainer && this._labelContainer.setVis(false);
    }

    // SeriesAnimation 종료
    _animationFinished(ani: Animation): void {
        const i = this._animations.indexOf(ani);
        i >= 0 && this._animations.splice(i, 1);

        // label들을 표시하기 위해
        this._invalidate();
    }

    protected abstract _getPointPool(): ElementPool<RcElement>;

    pointByDom(elt: Element): IPointView {
        return this._getPointPool().elementOf(elt) as any;
    }

    getPointView(p: DataPoint): RcElement {
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
        // Utils.log('CLICKED: ' + view.point.yValue);
    }

    prepareSeries(doc: Document, model: T): void {
        // measuer()에서 설정하지만 prepare 단계에서 참조하는 곳이 많아 미리 설정한다.
        this.setModel(model);

        // this._viewRate = NaN; // animating 중 다른 시리즈 등의 요청에 의해 여기로 진입할 수 있다.
        this.setData('index', (model.index % PALETTE_LEN) as any);
        this.setData('pointcolors', model._colorByPoint() ? 'a' : _undef);

        this.internalClearStyleAndClass();
        this.internalSetStyleOrClass(model.style);
        model._runColor && this._setModelColor(model._runColor);
        model._calcedColor = getComputedStyle(this.dom)[this._legendColorProp()];

        this._visPoints = this._collectVisPoints(model);
        this._prepareSeries(doc, model);
    }

    protected _setModelColor(color: string): void {
        this.setColor(color);
    }

    protected _legendColorProp(): string {
        return 'fill';
    }

    needDecoreateLegend(): boolean {
        return false;
    }

    decoreateLegend(legendView: LegendItemView): void {
    }

    afterLayout(): void {
        this._doAfterLayout();
    }

    setHoverStyle(pv: RcElement): void {
        pv.internalImportantStylesOrClass(this.model.hoverStyle);
    }

    setFocusPoint(pv: IPointView, focused: boolean): void {
        let ani = this._hoverAnis[0];

        if (this.model.hoverEffect !== HoverEffect.NONE) {
            if (pv instanceof RcElement) {
                pv.setBoolData(SeriesView.DATA_FOUCS, focused);
    
                if (focused) {
                    pv.saveStyles();
                    this.setHoverStyle(pv);
                } else {
                    pv.restoreStyles();
                }
        
                if (this._needFocusOrder()) {
                    focused ? this._getPointPool().front(pv) : this._getPointPool().back(pv);
                }
            }
            if (pv instanceof MarkerSeriesPointView) {
                if (focused) {
                    if (ani && !ani._focused) {
                        ani.stop();
                        ani = null;
                        this._hoverAnis.length = 0;
                    }
                    if (!ani) {
                        this._hoverAnis.push(new HoverAnimation(this, pv, true, () => {
                            (pv as MarkerSeriesPointView).endHover(this, true);
                        }));
                    }
                } else {
                    if (ani && ani._focused) {
                        ani.stop();
                        ani = null;
                        this._hoverAnis.length = 0;
                    }
                    if (!ani) {
                        this._hoverAnis.push(new HoverAnimation(this, pv, false, () => {
                            (pv as MarkerSeriesPointView).endHover(this, false);
                            this._hoverAnis.length = 0;
                        }));
                    }
                }
            }
        }

        this.model.pointHovered(focused ? pv.point : null);
    }

    hoverPoints(pvs: IPointView[]): void {
        const animatable = this.model.hoverEffect !== HoverEffect.NONE;
        const oldAnis = this._hoverAnis;
        const oldPts = this._hoverPts;
        const anis: HoverAnimation[] = [];
        const pts: IPointView[] = [];

        if (animatable) {
            // 기존 포인트들 중 새 목록에 포함되지 않은 것들은 unhover 시킨다.
            oldPts.forEach((pv => {
                if (pv instanceof RcElement && (!pvs || pvs.indexOf(pv) < 0)) {
                    pv.setBoolData(SeriesView.DATA_FOUCS, false);
                    pv.restoreStyles();
                    if (pv instanceof MarkerSeriesPointView) {
                        anis.push(new HoverAnimation(this, pv, false, () => {
                            pv.endHover(this, false);
                        }));
                    }
                }
            }));
            // 새 포인트들 중 hovering 상태가 아닌 것들을 hover 시킨다.
            pvs && pvs.forEach(pv => {
                if (pv instanceof RcElement && !oldAnis.find(ani => ani._marker === pv)) {
                    pv.setBoolData(SeriesView.DATA_FOUCS, true);
                    pts.push(pv);

                    pv.saveStyles();
                    this.setHoverStyle(pv);
                    if (pv instanceof MarkerSeriesPointView) {
                        anis.push(new HoverAnimation(this, pv, true, () => {
                            pv.endHover(this, true);
                        }));
                    }
                }
            })
        }

        this._hoverAnis = anis;
        this._hoverPts = pts;
        this.model.pointHovered((pts && pts.length > 0) ? pts[0].point : null);
    }

    protected _needFocusOrder(): boolean {
        return true;
    }

    getPointsAt(axis: Axis, pos: number): IPointView[] {
        return;
    }

    getSiblings(pv: IPointView): IPointView[] {
        return [pv];
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doAttached(parent: RcElement): void {
        // 로딩 후에 새로 추가된 경우 효과.
        if (this.control.loaded) {
            createAnimation(this.dom, 'opacity', 0, 1, 500, null);
        }
    }

    protected _prepareStyleOrClass(model: T): void {
        // legend marker 색상이 필요하므로 prepareSeries()에서 먼저 처리한다.
    }

    protected _prepareViewRanges(model: T): void {
        // model.prepareViewRanges();
    }

    protected _doMeasure(doc: Document, model: T, hintWidth: number, hintHeight: number, phase: number): ISize {
        // 혹시 남아있는 animation용 clip을 제거한다. (pointer들의 clip은 pointContainer에서 지정한다.) #365
        if (!this._animating()) {
            this.setClip();
        }

        if ((this.model._xAxisObj as Axis)._seriesChanged) {
            this._savePrevs();
        }

        this._prepareViewRanges(model);
        !this._lazyPrepareLabels() && this._labelContainer.prepare(doc, this);

        if (model.trendline.visible) {
            if (!this._trendLineView) {
                this.add(this._trendLineView = new PathElement(doc, 'rct-series-trendline'));
            }
            this._trendLineView.setVis(true);
        } else if (this._trendLineView) {
            this._trendLineView.setVis(false);
        }
        
        return { width: hintWidth, height: hintHeight };
    }

    protected _doLayout(): void {
        this._labelViews();
        this._renderSeries(this.width, this.height);
        if (this._trendLineView && this._trendLineView.visible) {
            this.$_renderTrendline(this._inverted);       
        }
        this._animatable && !this._simpleMode && this._runShowEffect(!this.control.loaded && this.chart().loadAnimatable());
        // this._getPointPool().forEach((pv: any) => {
        //     pv.saveVal = pv.point ? pv.point.getValue() : NaN;
        // });
    }

    protected _doAfterLayout(): void {
        if ((this.model._xAxisObj as Axis)._seriesChanged) {
            new PrevAnimation(this, () => {
                this.invalidate();
            });
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected abstract _prepareSeries(doc: Document, model: T): void;
    protected abstract _renderSeries(width: number, height: number): void;

    protected _collectVisPoints(model: T): DataPoint[] {
        return model._visPoints;// collectVisibles();
    }

    private $_setColorIndex(v: RcElement, p: DataPoint): void {
        v.setData('index', (p.index % PALETTE_LEN) as any);
    }

    protected _setPointColor(v: RcElement, color: string): void {
        v.setColor(color);
    }

    protected _setPointStyle(v: RcElement, model: T,  p: DataPoint, styles?: any[]): void {
        v.setAttrEx('aria-label', p.ariaHint());
        this.$_setColorIndex(v, p);
        v.internalClearStyleAndClass();

        model.pointStyle && v.internalSetStyleOrClass(model.pointStyle);

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
        this._labelContainer.setVis(this.model.isPointLabelsVisible() && !this._animating());
        return this._labelContainer.visible ? this._labelContainer : _undef;
    }

    protected _getGrowRate(): number {
        return pickNum(this._growRate, 1);
    }

    _animating(): boolean {
        return !isNaN(this._growRate) || !isNaN(this._posRate) || !isNaN(this._prevRate) || this._animations.length > 0;
    }

    protected _lazyPrepareLabels(): boolean { return false; }
    protected _getShowAnimation(): RcAnimation { return }
    protected _runShowEffect(firstTime: boolean): void {
        //this._getShowAnimation()?.run(this);
    }

    protected _drawSpline(pts: {px: number, py: number}[], start: number, end: number, sb: PathBuilder): void {
        let p = start;

        if (end < 0) {
            end = pts.length - 1;
        }
        if (absv(end - start) === 1) {
            sb.line(pts[p + 1].px, pts[p + 1].py);
            return;
        }

        const tension = 0.23;
        const tLeft = { x: 0, y: 0 };
        const tRight = { x: 0, y: 0 };
        const v1 = { x: 0, y: 0 };
        const v2 = { x: pts[p + 1].px - pts[p].px, y: pts[p + 1].py - pts[p].py };
        const p1 = { x: 0, y: 0 };
        const p2 = { x: 0, y: 0 };
        const mp = { x: 0, y: 0 };
        let tan = { x: 0, y: 0 };
        let len = Math.sqrt(v2.x * v2.x + v2.y * v2.y);

        v2.x /= len;
        v2.y /= len;

        let tFactor = (pts[p + 1].px - pts[p].px)
        let prevX = pts[p].px;
        let prevY = pts[p].py;

        for (++p; p != end; p++) {
            v1.x = -v2.x;
            v1.y = -v2.y;

            v2.x = pts[p + 1].px - pts[p].px;
            v2.y = pts[p + 1].py - pts[p].py;

            len = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
            v2.x /= len;
            v2.y /= len;

            if (v2.x < v1.x) {
                tan.x = v1.x - v2.x;
                tan.y = v1.y - v2.y;
            } else {
                tan.x = v2.x - v1.x;
                tan.y = v2.y - v1.y;
            }

            const tlen = Math.sqrt(tan.x * tan.x + tan.y * tan.y);
            tan.x /= tlen;
            tan.y /= tlen;

            if (v1.y * v2.y >= 0) {
                tan = { x: 1, y: 0 };
            }

            tLeft.x = -tan.x * tFactor * tension;
            tLeft.y = -tan.y * tFactor * tension;

            if (p === start + 1) {
                sb.quad(pts[p].px + tLeft.x, pts[p].py + tLeft.y, pts[p].px, pts[p].py);
            } else {
                p1.x = prevX + tRight.x;
                p1.y = prevY + tRight.y;
                p2.x = pts[p].px + tLeft.x;
                p2.y = pts[p].py + tLeft.y;
                mp.x = (p1.x + p2.x) / 2;
                mp.y = (p1.y + p2.y) / 2;

                sb.quad(p1.x, p1.y, mp.x, mp.y);
                sb.quad(p2.x, p2.y, pts[p].px, pts[p].py);
            }

            tFactor = (pts[p + 1].px - pts[p].px);
            tRight.x = tan.x * tFactor * tension;
            tRight.y = tan.y * tFactor * tension;
            prevX = pts[p].px;
            prevY = pts[p].py;
        }

        sb.quad(prevX + tRight.x, prevY + tRight.y, pts[p].px, pts[p].py);
    }

    private $_renderTrendline(inverted: boolean): void {
        const m = this.model;
        const xAxis = m._xAxisObj;
        const yAxis = m._yAxisObj;
        const yLen = yAxis._vlen;
        const xLen = xAxis._vlen;
        const pts = m.trendline._points.map(pt => {
            let x: number;
            let y: number;

            if (inverted) {
                y = xLen - xAxis.getPos(xLen, pt.x);
                x = yAxis.getPos(yLen, pt.y);
            } else {
                x = xAxis.getPos(xLen, pt.x);
                y = yLen - yAxis.getPos(yLen, pt.y);
            }
            return {x, y};
        });

        if (this._trendLineView.setVis(pts.length > 1)) {
            const sb = new PathBuilder();

            sb.move(pts[0].x, pts[0].y);

            if (this.model.trendline.isCurved()) {
                this._drawSpline(pts.map(p => ({px: p.x, py: p.y })), 0, -1, sb);
            } else {
                sb.lines(...pts);
            }
            this._trendLineView.setPath(sb.end(false));
        }
    }

    protected _layoutLabel(info: LabelLayoutInfo, w: number, h: number): void {
        // below이면 hPoint가 음수이다.
        let {inverted, x, y, hPoint, labelView, labelOff} = info;

        if (!labelView.setVis(x >= 0 && x <= w && y >= 0 && y <= h)) {
            return;
        }

        const below = info.reversed ? hPoint <= 0 : hPoint < 0;
        const r = labelView.getBBox();
        let inner = true;

        if (inverted) {
            y -= r.height / 2;
            // x -= r.width / 2;
        } else {
            x -= r.width / 2;
        }

        switch (info.labelPos) {
            case PointItemPosition.INSIDE:
                if (inverted) {
                    x -= (hPoint + r.width) / 2  + (info.reversed ? labelOff : -labelOff);
                } else {
                    y += (hPoint - r.height) / 2 + (info.reversed ? labelOff : -labelOff);
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
        labelView.layout(labelView.textAlign()).trans(x, y);
    }

    // viewRangeValue가 'x', 'y'인 경우에만 호출된다.
    protected _clipRange(w: number, h: number, rangeAxis: 'x' | 'y' | 'z', range: IValueRange, clip: ClipRectElement, inverted: boolean): void {
        if (inverted) {
            const t = w;
            w = h;
            h = t;
        }

        const isX = rangeAxis === 'x';
        const axis = isX ? this.model._xAxisObj : this.model._yAxisObj;
        const reversed = axis.reversed;
        const p1 = axis.getPos(isX ? w : h, maxv(axis.axisMin(), range.fromValue));
        const p2 = axis.getPos(isX ? w : h, minv(axis.axisMax(), range.toValue));

        if (inverted) {
            if (isX) {
                if (reversed) {
                    clip.setBounds(p2, -h, absv(p2 - p1), h);
                } else {
                    clip.setBounds(p1, -h, absv(p2 - p1), h);
                }
            } else {
                clip.setBounds(0, -maxv(p1, p2), w, absv(p2 - p1));
            }
        } else {
            if (isX) {
                if (reversed) {
                    clip.setBounds(p2, 0, absv(p2 - p1), h);
                } else {
                    clip.setBounds(p1, 0, absv(p2 - p1), h);
                }
            } else {
                clip.setBounds(0, h - maxv(p1, p2), w, absv(p2 - p1));
            }
        }
    }

    protected _setFill(elt: RcElement, style: SVGStyleOrClass): void {
        if (isObject(style) && style[FILL]) {
            elt.internalSetStyle(FILL, style[FILL]);
        } else if (isString(style)) {
            elt.dom.classList.add(style);
        }
    }

    protected _savePrevs(): void {
    }
}

export abstract class PointElement extends PathElement implements IPointView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: DataPoint;
    // saveVal: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, SeriesView.POINT_CLASS);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    savePrevs(): void {
    }
}

export abstract class BoxPointElement extends PointElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    labelViews: PointLabelView[] = [];
    wPoint: number;
    hPoint: number;
    wSave: number;
    xSave: number;

    //-------------------------------------------------------------------------
    // IPointView
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    public abstract layout(x: number, y: number, rTop: number, rBottom: number): void;

    savePrevs(): void {
        super.savePrevs();

        this.wSave = this.wPoint;
        this.xSave = this.x;
    }
}

export class BarElement extends BoxPointElement {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    layout(x: number, y: number, rTop: number, rBottom: number): void {
        this.x = x;
        this.setPath(SvgShapes.bar(
            x - this.wPoint / 2,
            y,
            this.wPoint,
            -this.hPoint,
            rTop,
            rBottom
        ));
    }
}

export abstract class RangeElement extends GroupElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: DataPoint;
    // saveVal: number;
    wSave: number;
    xSave: number;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    savePrevs(): void {
        this.wSave = this.width;
        this.xSave = this.x;
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
        this._preparePoints(doc, model, this._visPoints);
    }

    protected _renderSeries(width: number, height: number): void {
        this._pointContainer.invert(this._inverted, height);
        this._layoutPoints(width, height);
    }

    protected _runShowEffect(firstTime: boolean): void {
        firstTime && SeriesAnimation.grow(this);
    }

    protected _doViewRateChanged(rate: number): void {
        this._layoutPoints(this.width, this.height);
    }

    protected _savePrevs(): void {
        this._getPointPool().forEach(v => v['savePrevs']());
    }

    getPointsAt(axis: Axis, pos: number): IPointView[] {
        return [];
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected abstract _preparePoints(doc: Document, model: T, points: DataPoint[]): void;
    protected abstract _layoutPoints(width: number, height: number): void;
    protected abstract _layoutPoint(view: RcElement, index: number, x: number, y: number, wPoint: number, hPoint: number): void;
}

export abstract class BoxedSeriesView<T extends ClusterableSeries> extends ClusterableSeriesView<T> {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doPrevRateChanged(rate: number): void {
        if (rate == 0) {
            this._layoutPoints(this.width, this.height);
        }
        this.invalidate();
    }

    protected _layoutPoints(width: number, height: number): void {
        const series = this.model;
        const inverted = this._inverted;
        const gr = this._getGrowRate();
        const pr = this._prevRate;
        const labels = series.pointLabel;
        const labelViews = this._labelViews();
        const xAxis = series._xAxisObj as Axis;
        const yAxis = series._yAxisObj as Axis;
        const reversed = yAxis.reversed;
        const wPad = xAxis.unitPad() * 2;
        const yLen = yAxis.prev(inverted ? width : height);
        const xLen = xAxis.prev(inverted ? height : width);
        const yOrg = inverted ? 0 : height;
        const min = yAxis.axisMin();
        const yMin = yAxis.getPos(yLen, min);
        const base = series.getBaseValue(yAxis);
        const yBase = pickNum(yAxis.getPos(yLen, maxv(min, base)), yMin);
        const based = !isNaN(base);
        const info: LabelLayoutInfo = labelViews && assign(this._labelInfo, {
            inverted,
            reversed: reversed,
            labelPos: series.getLabelPosition(labels.position),
            labelOff: series.getLabelOff(labels.getOffset())
        });

        this._getPointPool().forEach((pv: BoxPointElement, i) => {
            const p = (pv as any as IPointView).point;

            if (pv.setVis(!p.isNull)) {
                const wUnit = xAxis.getUnitLen(xLen, p.xValue) * (1 - wPad);
                let wPoint = series.getPointWidth(wUnit);
                const yVal = yAxis.getPos(yLen, p.yValue) - yBase;
                const yGroup = (yAxis.getPos(yLen, p.yGroup) - yBase - yVal) * gr;
                const hPoint = yVal * gr;
                let x = xAxis.getPos(xLen, p.xValue) - wUnit / 2;
                if (isNaN(x)) {
                    debugger;
                    const wUnit2 = xAxis.getUnitLen(xLen, p.xValue) * (1 - wPad);
                    x = xAxis.getPos(xLen, p.xValue) - wUnit2 / 2;
                }
                let y = yOrg - yAxis.getPos(yLen, p.yGroup) * gr;

                if (!isNaN(pr + pv.wSave)) {
                    wPoint = pv.wSave + (wPoint - pv.wSave) * pr;
                } 
                x += series.getPointPos(wUnit) + wPoint / 2;;                
                if (!isNaN(pr + pv.xSave)) {
                    x = pv.xSave + (x - pv.xSave) * pr;
                }

                p.xPos = x;
                p.yPos = y;

                // 아래에서 위로 올라가는 animation을 위해 기준 지점을 전달한다.
                this._layoutPoint(pv, i, x, yOrg - yBase - yGroup, wPoint, hPoint);

                // [주의] tooltip이 p.xPos, p.yPos를 사용한다. label이 미표시여도 계산한다.
                if (inverted) {
                    // y = xLen - xAxis.getPosition(xLen, p.xValue) - wUnit / 2; // 위에서 아래로 내려갈 때
                    y = xLen - xAxis.getPos(xLen, p.xValue) + wUnit / 2;
                    x = yOrg;
                    p.yPos = y -= series.getPointPos(wUnit) + wPoint / 2;
                    // p.yPos = y += series.getPointPos(wUnit) + wPoint / 2;
                    if (based) {
                        p.xPos = x += yAxis.getPos(yLen, p.yGroup) * gr; // stack/fill일 때 org와 다르다.
                    } else {
                        p.xPos = x += yAxis.getPos(yLen, p.yGroup * gr);
                    }
                }

                // label
                if (info && (info.labelView = labelViews.get(p, 0))) {
                    info.pointView = pv;
                    info.x = x;
                    info.y = y;
                    info.wPoint = wPoint;
                    info.hPoint = hPoint;
                    this._layoutLabel(info, width, height);
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

    protected _doPrevRateChanged(rate: number): void {
        if (rate == 0) {
            this._layoutPoints(this.width, this.height);
        }
        this.invalidate();
    }

    protected _layoutPoints(width: number, height: number): void {
        const series = this.model;
        const inverted = series.chart.isInverted();
        const gr = this._getGrowRate();
        const pr = this._prevRate;
        const labels = series.pointLabel;
        const labelViews = this._labelViews();
        const xAxis = series._xAxisObj as Axis;
        const yAxis = series._yAxisObj;
        const reversed = yAxis.reversed;
        const wPad = xAxis.unitPad() * 2;
        const yLen = inverted ? width : height;
        const xLen = inverted ? height : width;
        const org = inverted ? 0 : height;;
        const info: LabelLayoutInfo = labelViews && assign(this._labelInfo, {
            inverted,
            labelPos: series.getLabelPosition(labels.position),
            labelOff: series.getLabelOff(labels.getOffset())
        });

        this._getPointPool().forEach((pv: BoxPointElement, i) => {
            const p = (pv as any as IPointView).point;

            if (pv.setVis(!p.isNull)) {
                const wUnit = xAxis.getUnitLen(xLen, p.xValue) * (1 - wPad);
                let wPoint = series.getPointWidth(wUnit);
                const yVal = yAxis.getPos(yLen, p.yValue);
                const hPoint = (yVal - yAxis.getPos(yLen, this._getLowValue(p))) * gr;
                let x = xAxis.getPos(xLen, p.xValue) - wUnit / 2;
                let y = org - yAxis.getPos(yLen, p.yGroup) * gr;

                if (!isNaN(pr + pv.wSave)) {
                    wPoint = pv.wSave + (wPoint - pv.wSave) * pr;
                } 
                x += series.getPointPos(wUnit) + wPoint / 2;
                if (!isNaN(pr + pv.xSave)) {
                    x = pv.xSave + (x - pv.xSave) * pr;
                }

                p.xPos = x;
                p.yPos = y;

                this._layoutPoint(pv, i, x, y, wPoint, hPoint);

                // [주의] tooltip이 p.xPos, p.yPos를 사용한다. label이 미표시여도 계산한다.
                if (inverted) {
                    // y = xLen - xAxis.getPosition(xLen, p.xVAlue) - wUnit / 2; // 위에서 아래로 내려갈 때
                    y = xLen - xAxis.getPos(xLen, p.xValue) + wUnit / 2;
                    x = org;
                    // p.yPos = y += series.getPointPos(wUnit) + wPoint / 2;
                    p.yPos = y -= series.getPointPos(wUnit) + wPoint / 2;
                    p.xPos = x += yAxis.getPos(yLen, p.yGroup) * gr;
                }

                // labels
                if (labelViews) {
                    info.pointView = pv;
                    info.hPoint = hPoint;
                    info.x = x;
                    info.y = y;

                    // top
                    if (info.labelView = labelViews.get(p, 0)) {
                        info.hPoint = hPoint;
                        this._layoutLabel(info, width, height);
                    }
                    // bottom
                    if (info.labelView = labelViews.get(p, 1)) {
                        if (inverted) info.x -= hPoint;
                        else info.y += hPoint;
                        info.hPoint = -hPoint;
                        this._layoutLabel(info, width, height);
                    }
                }
            }
        })
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}

export abstract class MarkerSeriesPointView extends PointElement implements IPointView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    abstract beginHover(series: SeriesView<Series>, focused: boolean): void;
    abstract setHoverRate(series: SeriesView<Series>, focused: boolean, rate: number): void;
    abstract endHover(series: SeriesView<Series>, focused: boolean): void;
}

export abstract class MarkerSeriesView<T extends MarkerSeries, P extends DataPoint> extends SeriesView<T> {

    //-------------------------------------------------------------------------
    // static members
    //-------------------------------------------------------------------------
    private static _createDrawers(...shapes: string[]): {[shape: string]: (rd: number) => (string | number)[]} {
        const drawers = {};
        shapes.forEach(shape => {
            drawers[shape] = (rd: number) => SvgShapes[shape](0 - rd, 0 - rd, rd * 2, rd * 2);
        })
        return drawers;
    }
    private static _drawers: {[shape: string]: (rd: number) => (string | number)[] } = Object.assign({
        circle: (rd: number) => SvgShapes.circle(0, 0, rd),
    }, this._createDrawers('square', 'diamond', 'triangle', 'itriangle', 'star', 'rectangle'));

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    protected _markers: ElementPool<MarkerSeriesPointView>;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string) {
        super(doc, styleName)

        this._markers = this._createMarkers(this._pointContainer);
    }

    protected abstract _createMarkers(container: PointContainer): ElementPool<MarkerSeriesPointView>;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _getPointPool(): ElementPool<RcElement> {
        return this._markers;
    }

    clipInvertable(): boolean {
        return false; // TODO: true로 개선할 것!, bubble, scatter view 참조.
    }

    getPointsAt(axis: Axis, pos: number): IPointView[] {
        return [];
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected abstract _getAutoPos(overflowed: boolean): PointItemPosition;

    _getDrawer(shape: string): (rd: number) => (string | number)[] {
        return MarkerSeriesView._drawers[shape] || MarkerSeriesView._drawers['circle'];
    }

    protected _layoutLabelView(labelView: PointLabelView, pos: PointItemPosition, off: number, radius: number, x: number, y: number): void {
        let r = labelView.getBBox();

        if (pos === PointItemPosition.AUTO) {
            pos = this._getAutoPos(r.width >= radius * 2 * 0.9);
        }
        if (labelView.setVis(pos != null)) {
            x -= r.width / 2;
            if (pos === PointItemPosition.INSIDE) {
                labelView.trans(x, y - r.height / 2);
            } else if (pos) {
                labelView.trans(x, y - radius - r.height - off);
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
            this.series.invalidate();
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

        this.setData('pointcolors', 'f');
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