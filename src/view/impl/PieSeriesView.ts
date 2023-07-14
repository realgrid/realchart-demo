////////////////////////////////////////////////////////////////////////////////
// PieSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { PathBuilder } from "../../common/PathBuilder";
import { ORG_ANGLE, deg2rad } from "../../common/Types";
import { Utils } from "../../common/Utils";
import { CircleElement } from "../../common/impl/CircleElement";
import { ISectorShape, SectorElement } from "../../common/impl/SectorElement";
import { PieSeries, PieSeriesPoint } from "../../model/series/PieSeries";
import { PointLabelContainer, PointLabelLine, PointLabelLineContainer, PointLabelView, SeriesView } from "../SeriesView";

class SectorView extends SectorElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: PieSeriesPoint;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    setSectorEx(labels: PointLabelContainer, lines: PointLabelLineContainer, newSector: ISectorShape, animate = false): boolean {//, duration = Animation.SHORT_DURATION): boolean {
        let animated = false;

        // if (!this.equals(newSector)) {
            if (animate) {
                // this.animate({
                //     duration: duration,
                //     onStart: (element, anim) => {
                //         anim.tag = this._getShape();
                //     },
                //     onFinish: (element, anim) => {
                //         (element as SectorElement).setSector(newSector);
                //         labels.get((element as PieSector).point, 0).moving = false;
                //     },
                //     onUpdate: (element, anim, rate): number => {
                //         const org = anim.tag as ISectorShape;
                //         const sector = {...org};

                //         sector.start = org.start + (newSector.start - org.start) * rate;
                //         sector.angle = org.angle + (newSector.angle - org.angle) * rate;

                //         (element as SectorElement).setSector(sector);

                //         // label & line
                //         const point = (element as PieSector).point;
                //         const off = point.series.series.pointLabel.offset;
                //         const distance = point.series.series.labelDistance;;
                //         const slicedOff = (point.series as PieSeriesViewModel).getSlicedOffset(sector.rx);
                //         const label = labels.get(point, 0);
                //         const r = label.getBBounds();
                //         const line = lines.get(point);
                //         const a = sector.start + sector.angle / 2;

                //         const isLeft = Utils.isLeft(a);
                //         let cx = sector.cx;
                //         let cy = sector.cy;
                //         let rx = sector.rx + distance * 0.8;
                //         let dx = 0;
                //         let dy = 0;

                //         label.moving = true;                        

                //         if (point.sliced) {
                //             dx = Math.cos(a) * slicedOff;
                //             dy = Math.sin(a) * slicedOff;
                //         }
                        
                //         let x1 = cx + Math.cos(a) * sector.rx;
                //         let y1 = cy + Math.sin(a) * sector.ry;
                //         let x2 = cx + Math.cos(a) * rx;
                //         let y2 = cy + Math.sin(a) * rx;
                //         let x3: number;
        
                //         if (isLeft) {
                //             x3 = x2 - distance * 0.2;
                //         } else {
                //             x3 = x2 + distance * 0.2;
                //         }
        
                //         line.move(x1, y1);
                //         line.translate(x1 + dx, y1 + dy);
        
                //         if (isLeft) {
                //             x3 -= r.width + off;
                //             y2 -= r.height / 2;
                //         } else {
                //             x3 += off;
                //             y2 -= r.height / 2;
                //         }
                //         label.move(x3, y2); // 위치 정보만 저장하는 것.
                //         label.translate(x3 + dx, y2 + dy);
                //         return;
                //     }
                // })
                animated = true;
            } else {
                this._assignShape(newSector);
            }
        // }
        return animated;
    }

    // slice(labels: PointLabelContainer, lines: PointLabelLineContainer, sliced: boolean, cx: number, cy: number, offset: number, duration: number): boolean {
    //     const point = this.point;
        
    //     if (sliced !== this.point.sliced) {
    //         point.sliced = sliced;

    //         const label = labels.get(point, 0);
    //         const line = lines.get(point);
    //         const a = point.startAngle + point.angle / 2;
    //         const tx2 = sliced ? Math.cos(a) * offset : 0;
    //         const ty2 = sliced ? Math.sin(a) * offset : 0;
    
    //         // this.translateEx(tx2, ty2, true, duration);
    //         // line.translateEx(line.x + tx2, line.y + ty2, true, duration);
    //         // label.translateEx(label.x + tx2, label.y + ty2, true, duration);
    //         this.translate(tx2, ty2);
    //         line.translate(line.x + tx2, line.y + ty2);
    //         label.translate(label.x + tx2, label.y + ty2);
    //         return true;
    //     }
    // }
}

export class PieSeriesView extends SeriesView<PieSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _circle: CircleElement;
    private _sectors = new ElementPool(this._pointContainer, SectorView, null, 0.5);
    private _lineContainer: PointLabelLineContainer;

    private _cx = 0;
    private _cy = 0;
    private _rd = 0;
    private _rdInner = 0;
    private _slicedOff = 0;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-pie-series')

        this.add(this._circle = new CircleElement(doc));
        this._circle.setStyles({
            stroke: '#aaa',
            fill: 'none',
            strokeDasharray: '2'
        });

        this.add(this._lineContainer = new PointLabelLineContainer(doc));
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _prepareSeries(doc: Document, model: PieSeries): void {
        this.$_prepareSectors(model._visPoints as PieSeriesPoint[]);
    }

    protected _renderSeries(width: number, height: number): void {
        const sz = this.model.getSize(width, height);

        this._rd = Math.floor(sz / 2);
        this._rdInner = 0;//this.model.getInnerSize(this._rd);
        this._cx = Math.floor(width / 2);
        this._cy = Math.floor(height / 2);

        if (this._circle.visible = this._sectors.isEmpty) {
            this._circle.setCircle(this._cx, this._cy, this._rd);
        }

        this.$_layoutSectors(this._cx, this._cy, this._rd);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_prepareSectors(points: PieSeriesPoint[]): void {
        const count = points.length;
        const sum = points.map(p => p.yValue).reduce((a, c) => a + c, 0);
        let start = ORG_ANGLE + deg2rad(this.model.startAngle);

        points.forEach(p => {
            const angle = p.y * 2 * Math.PI / sum;

            p.startAngle = start;
            p.angle = angle;
            start += angle;
        });

        this._sectors.prepare(count, (sector, i) => {
            const a = i < count - 1 ? points[i + 1].startAngle : points[i].endAngle;

            sector.start = a;
            sector.angle = 0;
            sector.point = points[i];

            sector.setStyle('fill', points[i].color);
            sector.setStyle('stroke', 'white');
        })
    }

    private $_layoutSectors(cx: number, cy: number, rd: number): void {
        const series = this.model;
        const labels = series.pointLabel;
        const labelVis = labels.visible;
        const labelOff = labels.offset;
        const labelViews = this._labelContainer;
        const sliceOff = this._slicedOff = series.getSliceOffset(rd);
        const pb = new PathBuilder();
        let labelView: PointLabelView;

        this._sectors.forEach((sector) => {
            const p = sector.point;
            const start = p.startAngle;
            let dx = 0;
            let dy = 0;

            if (p.sliced) {
                const a = start + p.angle / 2;
                dx += Math.cos(a) * sliceOff;
                dy += Math.sin(a) * sliceOff;
            }

            sector.setSectorEx(labelViews, /*lines*/null, {
                cx: cx + dx,
                cy: cy + dy,
                rx: rd,
                ry: rd,
                innerRadius: this._rdInner,
                start: start,
                angle: p.angle,
                clockwise: true
            }, false);
            // sector.translate(dx, dy);

            // label
            if (labelVis && (labelView = labelViews.get(p, 0))) {
                // this.$_layoutLabel(p, labelView, line, off, dist, slicedOff, pb);
                this.$_layoutLabel(p, labelView, null, 0, 0, p.sliced ? sliceOff : 0, pb);

                // line.visible = false;
                // this.$_layoutLabelInner(p, label, off, dist, slicedOff);
                this.$_layoutLabelInner(p, labelView, 0, 0, p.sliced ? sliceOff : 0);
            }
        })
    }
    
    private $_layoutLabel(p: PieSeriesPoint, view: PointLabelView, line: PointLabelLine, off: number, dist: number, sliceOff: number, pb: PathBuilder): void {
        const r = view.getBBounds();
        const a = p.startAngle + p.angle / 2;
        const isLeft = Utils.isLeft(a);
        let cx = this._cx;
        let cy = this._cy;
        let rd = this._rd + dist * 0.8;
        let dx = Math.cos(a) * sliceOff;
        let dy = Math.sin(a) * sliceOff;

        let x1 = cx + Math.cos(a) * this._rd;
        let y1 = cy + Math.sin(a) * this._rd;
        let x2 = cx + Math.cos(a) * rd;
        let y2 = cy + Math.sin(a) * rd;
        let x3: number;

        if (isLeft) {
            x3 = x2 - dist * 0.2;
        } else {
            x3 = x2 + dist * 0.2;
        }

        if (line) {
            line.visible = true;
            line.move(x1, y1);
            //line.setPath(pb.move(x1, y1).lines(x2, y2, x3, y2).end())
            line.setLine(pb.move(0, 0).q(x2 - x1, y2 - y1, x3 - x1, y2 - y1).end())
            !view.moving && line.translate(x1 + dx, y1 + dy);
        }

        if (isLeft) {
            x3 -= r.width + off;
            y2 -= r.height / 2;
        } else {
            x3 += off;
            y2 -= r.height / 2;
        }
        view.move(x3, y2); // 위치 정보 저장.
        !view.moving && view.translate(x3 + dx, y2 + dy);
    }

    private $_layoutLabelInner(p: PieSeriesPoint, view: PointLabelView, off: number, dist: number, sliceOff: number): void {
        const r = view.getBBounds();
        const a = p.startAngle + p.angle / 2;
        let x = this._cx + Math.cos(a) * (sliceOff + this._rd * 0.7);
        let y = this._cy + Math.sin(a) * (sliceOff + this._rd * 0.7);

        view.translate(x - r.width / 2, y - r.height / 2);
    }
}